import os
import math
from PIL import Image
import argparse

def create_tiles(input_image_path, output_folder, zoom_levels=(0, 5), tile_size=256, aspect_ratio=(16, 9)):
    """
    Cut an image into tiles suitable for web mapping, respecting a specific aspect ratio.
    
    Args:
        input_image_path: Path to the input image
        output_folder: Directory to save tiles
        zoom_levels: Tuple of (min_zoom, max_zoom)
        tile_size: Size of each square tile in pixels
        aspect_ratio: Tuple of (width, height) ratio
    """
    # Open the image
    image = Image.open(input_image_path)
    img_width, img_height = image.size
    
    # Create output directory if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # Create tiles for each zoom level
    min_zoom, max_zoom = zoom_levels
    
    for zoom in range(min_zoom, max_zoom + 1):
        zoom_folder = os.path.join(output_folder, str(zoom))
        if not os.path.exists(zoom_folder):
            os.makedirs(zoom_folder)
            
        # Calculate dimensions at this zoom level
        scale_factor = 2 ** (max_zoom - zoom)
        level_width = img_width // scale_factor
        level_height = img_height // scale_factor
        
        # Resize image for this zoom level
        if zoom < max_zoom:
            level_image = image.resize((level_width, level_height), Image.Resampling.LANCZOS)
        else:
            # Use original image for max zoom
            level_image = image
        
        # Calculate number of tiles at this zoom level
        cols = math.ceil(level_width / tile_size)
        rows = math.ceil(level_height / tile_size)
        
        print(f"Zoom level {zoom}: Creating {cols}x{rows} tiles...")
        
        # Create tiles
        for x in range(cols):
            # Create column folder
            col_folder = os.path.join(zoom_folder, str(x))
            if not os.path.exists(col_folder):
                os.makedirs(col_folder)
                
            for y in range(rows):
                # Calculate tile boundaries
                left = x * tile_size
                upper = y * tile_size
                right = min((x + 1) * tile_size, level_width)
                lower = min((y + 1) * tile_size, level_height)
                
                # Extract tile
                tile = level_image.crop((left, upper, right, lower))
                
                # If tile is smaller than tile_size, create a new image with the right dimensions
                if right - left < tile_size or lower - upper < tile_size:
                    new_tile = Image.new('RGBA', (tile_size, tile_size), (0, 0, 0, 0))
                    new_tile.paste(tile, (0, 0))
                    tile = new_tile
                
                # Save tile
                tile_path = os.path.join(col_folder, f"{y}.png")
                tile.save(tile_path)
    
    print(f"Tiling complete. Tiles saved to {output_folder}")
    
    # Create a simple HTML viewer
    create_leaflet_viewer(output_folder, max_zoom, cols, rows, tile_size, aspect_ratio)

def create_leaflet_viewer(output_folder, max_zoom, cols, rows, tile_size, aspect_ratio):
    """Create a simple Leaflet viewer HTML file"""
    width_ratio, height_ratio = aspect_ratio
    
    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>Custom Tiled Map Viewer</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <style>
        html, body {{ height: 100%; margin: 0; }}
        #map {{ width: 100%; height: 100%; }}
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        const map = L.map('map', {{
            crs: L.CRS.Simple,
            minZoom: 0,
            maxZoom: {max_zoom}
        }});
        
        // Calculate bounds for {width_ratio}:{height_ratio} aspect ratio
        const mapWidth = {cols} * {tile_size};
        const mapHeight = {rows} * {tile_size};
        const bounds = [[0, 0], [mapHeight, mapWidth]];
        
        L.tileLayer('{{z}}/{{x}}/{{y}}.png', {{
            attribution: 'Custom Tiled Map',
            noWrap: true,
            bounds: bounds,
            tileSize: {tile_size}
        }}).addTo(map);
        
        map.fitBounds(bounds);
        map.setMaxBounds(bounds);
    </script>
</body>
</html>"""
    
    with open(os.path.join(output_folder, 'index.html'), 'w') as f:
        f.write(html_content)
    
    print(f"Leaflet viewer created: {os.path.join(output_folder, 'index.html')}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Create custom map tiles from an image.')
    parser.add_argument('input_image', help='Path to the input image')
    parser.add_argument('output_folder', help='Directory to save tiles')
    parser.add_argument('--min-zoom', type=int, default=0, help='Minimum zoom level')
    parser.add_argument('--max-zoom', type=int, default=5, help='Maximum zoom level')
    parser.add_argument('--tile-size', type=int, default=256, help='Tile size in pixels')
    parser.add_argument('--width-ratio', type=int, default=16, help='Width part of aspect ratio')
    parser.add_argument('--height-ratio', type=int, default=9, help='Height part of aspect ratio')
    
    args = parser.parse_args()
    
    create_tiles(
        args.input_image, 
        args.output_folder, 
        zoom_levels=(args.min_zoom, args.max_zoom),
        tile_size=args.tile_size,
        aspect_ratio=(args.width_ratio, args.height_ratio)
    )