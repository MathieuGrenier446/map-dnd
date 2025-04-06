import * as fs from 'fs';
import * as path from 'path';
import { Canvas, Image, createCanvas, loadImage } from 'canvas';

interface TilingOptions {
  inputImagePath: string;
  outputFolder: string;
  zoomLevels: [number, number]; // [minZoom, maxZoom]
  tileSize: number;
  aspectRatio: [number, number]; // [width, height]
}

class ImageTiler {
  private options: TilingOptions;
  private image: Image | null = null;
  private imageWidth: number = 0;
  private imageHeight: number = 0;

  constructor(options: TilingOptions) {
    this.options = {
      ...options,
      tileSize: 256,
      zoomLevels: [0, 5],
      aspectRatio: [16, 9],
    };
  }

  async loadImage(): Promise<void> {
    try {
      this.image = await loadImage(this.options.inputImagePath);
      this.imageWidth = this.image.width;
      this.imageHeight = this.image.height;
      console.log(`Loaded image: ${this.imageWidth}x${this.imageHeight}`);
    } catch (error) {
      console.error('Failed to load image:', error);
      throw error;
    }
  }

  ensureDirectoryExists(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  async createTiles(): Promise<void> {
    if (!this.image) {
      await this.loadImage();
    }

    this.ensureDirectoryExists(this.options.outputFolder);

    const [minZoom, maxZoom] = this.options.zoomLevels;

    for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
      await this.createTilesForZoom(zoom, maxZoom);
    }

    this.createLeafletViewer();
    console.log(`Tiling complete. Tiles saved to ${this.options.outputFolder}`);
  }

  async createTilesForZoom(zoom: number, maxZoom: number): Promise<void> {
    const zoomFolder = path.join(this.options.outputFolder, zoom.toString());
    this.ensureDirectoryExists(zoomFolder);

    // Calculate dimensions at this zoom level
    const scaleFactor = Math.pow(2, maxZoom - zoom);
    const levelWidth = Math.floor(this.imageWidth / scaleFactor);
    const levelHeight = Math.floor(this.imageHeight / scaleFactor);

    // Create resized canvas for this zoom level
    const levelCanvas = createCanvas(levelWidth, levelHeight);
    const ctx = levelCanvas.getContext('2d');
    
    if (this.image) {
      ctx.drawImage(this.image, 0, 0, levelWidth, levelHeight);
    }

    // Calculate number of tiles at this zoom level
    const cols = Math.ceil(levelWidth / this.options.tileSize);
    const rows = Math.ceil(levelHeight / this.options.tileSize);

    console.log(`Zoom level ${zoom}: Creating ${cols}x${rows} tiles...`);

    // Create tiles
    for (let x = 0; x < cols; x++) {
      const colFolder = path.join(zoomFolder, x.toString());
      this.ensureDirectoryExists(colFolder);

      for (let y = 0; y < rows; y++) {
        await this.createTile(levelCanvas, x, y, colFolder, levelWidth, levelHeight);
      }
    }
  }

// Modify the createTile method in your ImageTiler class
async createTile(
  sourceCanvas: Canvas, 
  x: number, 
  y: number, 
  colFolder: string, 
  levelWidth: number, 
  levelHeight: number
): Promise<void> {
  // Calculate the tile width and height based on aspect ratio
  const [widthRatio, heightRatio] = this.options.aspectRatio;
  const tileWidth = this.options.tileSize; // Base tile size (e.g., 256)
  const tileHeight = Math.round(tileWidth * (heightRatio / widthRatio)); // For 16:9, this would be 144
  
  // Calculate tile boundaries
  const left = x * tileWidth;
  const upper = y * tileHeight;
  const right = Math.min((x + 1) * tileWidth, levelWidth);
  const lower = Math.min((y + 1) * tileHeight, levelHeight);
  const width = right - left;
  const height = lower - upper;

  // Create tile canvas with the rectangular dimensions
  const tileCanvas = createCanvas(tileWidth, tileHeight);
  const tileCtx = tileCanvas.getContext('2d');

  // Set transparent background
  tileCtx.clearRect(0, 0, tileWidth, tileHeight);

  // Draw the image portion onto the tile
  tileCtx.drawImage(
    sourceCanvas,
    left, upper, width, height, // Source rectangle
    0, 0, width, height         // Destination rectangle
  );

  // Save tile
  const tilePath = path.join(colFolder, `${y}.png`);
  const buffer = tileCanvas.toBuffer('image/png');
  fs.writeFileSync(tilePath, buffer);
}

createLeafletViewer(): void {
  const [maxZoom] = this.options.zoomLevels.slice(-1);
  const [widthRatio, heightRatio] = this.options.aspectRatio;
  
  // Calculate the width and height of tiles
  const tileWidth = this.options.tileSize;
  const tileHeight = Math.round(tileWidth * (heightRatio / widthRatio));
  
  // Calculate columns and rows at max zoom
  const cols = Math.ceil(this.imageWidth / tileWidth);
  const rows = Math.ceil(this.imageHeight / tileHeight);

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Custom Tiled Map Viewer</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <style>
        html, body { height: 100%; margin: 0; }
        #map { width: 100%; height: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // Create a custom CRS to handle rectangular tiles
        const CustomCRS = L.extend({}, L.CRS.Simple, {
            // Override the tile size method to return rectangular dimensions
            getTileSize: function() {
                return new L.Point(${tileWidth}, ${tileHeight});
            }
        });

        const map = L.map('map', {
            crs: CustomCRS,
            minZoom: ${this.options.zoomLevels[0]},
            maxZoom: ${maxZoom}
        });
        
        // Calculate bounds for ${widthRatio}:${heightRatio} aspect ratio
        const mapWidth = ${cols} * ${tileWidth};
        const mapHeight = ${rows} * ${tileHeight};
        const bounds = [[0, 0], [mapHeight, mapWidth]];
        
        L.tileLayer('{z}/{x}/{y}.png', {
            attribution: 'Custom Tiled Map',
            noWrap: true,
            bounds: bounds,
            tileSize: new L.Point(${tileWidth}, ${tileHeight})
        }).addTo(map);
        
        map.fitBounds(bounds);
        map.setMaxBounds(bounds);
    </script>
</body>
</html>`;

  fs.writeFileSync(path.join(this.options.outputFolder, 'index.html'), htmlContent);
  console.log(`Leaflet viewer created: ${path.join(this.options.outputFolder, 'index.html')}`);
}
}

// Example usage as a standalone script
async function main() {
  if (process.argv.length < 4) {
    console.log('Usage: ts-node image-tiler.ts <input-image> <output-folder> [options]');
    console.log('Options:');
    console.log('  --min-zoom <number>     Minimum zoom level (default: 0)');
    console.log('  --max-zoom <number>     Maximum zoom level (default: 5)');
    console.log('  --tile-size <number>    Tile size in pixels (default: 256)');
    console.log('  --width-ratio <number>  Width part of aspect ratio (default: 16)');
    console.log('  --height-ratio <number> Height part of aspect ratio (default: 9)');
    process.exit(1);
  }

  const inputImagePath = process.argv[2];
  const outputFolder = process.argv[3];
  
  // Parse options
  const options: Partial<TilingOptions> = {
    inputImagePath,
    outputFolder,
  };

  for (let i = 4; i < process.argv.length; i += 2) {
    const option = process.argv[i];
    const value = process.argv[i + 1];
    
    switch (option) {
      case '--min-zoom':
        options.zoomLevels = [parseInt(value), options.zoomLevels?.[1] ?? 5];
        break;
      case '--max-zoom':
        options.zoomLevels = [options.zoomLevels?.[0] ?? 0, parseInt(value)];
        break;
      case '--tile-size':
        options.tileSize = parseInt(value);
        break;
      case '--width-ratio':
        options.aspectRatio = [parseInt(value), options.aspectRatio?.[1] ?? 9];
        break;
      case '--height-ratio':
        options.aspectRatio = [options.aspectRatio?.[0] ?? 16, parseInt(value)];
        break;
    }
  }

  const tiler = new ImageTiler(options as TilingOptions);
  await tiler.createTiles();
}

// Run the script if called directly
if (require.main === module) {
  main().catch(console.error);
}

// Export the class for use as a module
export { ImageTiler, type TilingOptions };