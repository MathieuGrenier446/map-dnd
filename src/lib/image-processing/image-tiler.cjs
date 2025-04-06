"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageTiler = void 0;
var fs = require("fs");
var path = require("path");
var canvas_1 = require("canvas");
var ImageTiler = /** @class */ (function () {
    function ImageTiler(options) {
        this.image = null;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.options = __assign(__assign({}, options), { tileSize: 256, zoomLevels: [0, 5], aspectRatio: [16, 9] });
    }
    ImageTiler.prototype.loadImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, (0, canvas_1.loadImage)(this.options.inputImagePath)];
                    case 1:
                        _a.image = _b.sent();
                        this.imageWidth = this.image.width;
                        this.imageHeight = this.image.height;
                        console.log("Loaded image: ".concat(this.imageWidth, "x").concat(this.imageHeight));
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Failed to load image:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ImageTiler.prototype.ensureDirectoryExists = function (directory) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    };
    ImageTiler.prototype.createTiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, minZoom, maxZoom, zoom;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.image) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadImage()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        this.ensureDirectoryExists(this.options.outputFolder);
                        _a = this.options.zoomLevels, minZoom = _a[0], maxZoom = _a[1];
                        zoom = minZoom;
                        _b.label = 3;
                    case 3:
                        if (!(zoom <= maxZoom)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.createTilesForZoom(zoom, maxZoom)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        zoom++;
                        return [3 /*break*/, 3];
                    case 6:
                        this.createLeafletViewer();
                        console.log("Tiling complete. Tiles saved to ".concat(this.options.outputFolder));
                        return [2 /*return*/];
                }
            });
        });
    };
    ImageTiler.prototype.createTilesForZoom = function (zoom, maxZoom) {
        return __awaiter(this, void 0, void 0, function () {
            var zoomFolder, scaleFactor, levelWidth, levelHeight, levelCanvas, ctx, cols, rows, x, colFolder, y;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        zoomFolder = path.join(this.options.outputFolder, zoom.toString());
                        this.ensureDirectoryExists(zoomFolder);
                        scaleFactor = Math.pow(2, maxZoom - zoom);
                        levelWidth = Math.floor(this.imageWidth / scaleFactor);
                        levelHeight = Math.floor(this.imageHeight / scaleFactor);
                        levelCanvas = (0, canvas_1.createCanvas)(levelWidth, levelHeight);
                        ctx = levelCanvas.getContext('2d');
                        if (this.image) {
                            ctx.drawImage(this.image, 0, 0, levelWidth, levelHeight);
                        }
                        cols = Math.ceil(levelWidth / this.options.tileSize);
                        rows = Math.ceil(levelHeight / this.options.tileSize);
                        console.log("Zoom level ".concat(zoom, ": Creating ").concat(cols, "x").concat(rows, " tiles..."));
                        x = 0;
                        _a.label = 1;
                    case 1:
                        if (!(x < cols)) return [3 /*break*/, 6];
                        colFolder = path.join(zoomFolder, x.toString());
                        this.ensureDirectoryExists(colFolder);
                        y = 0;
                        _a.label = 2;
                    case 2:
                        if (!(y < rows)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.createTile(levelCanvas, x, y, colFolder, levelWidth, levelHeight)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        y++;
                        return [3 /*break*/, 2];
                    case 5:
                        x++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ImageTiler.prototype.createTile = function (sourceCanvas, x, y, colFolder, levelWidth, levelHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var left, upper, right, lower, width, height, tileCanvas, tileCtx, tilePath, buffer;
            return __generator(this, function (_a) {
                left = x * this.options.tileSize;
                upper = y * this.options.tileSize;
                right = Math.min((x + 1) * this.options.tileSize, levelWidth);
                lower = Math.min((y + 1) * this.options.tileSize, levelHeight);
                width = right - left;
                height = lower - upper;
                tileCanvas = (0, canvas_1.createCanvas)(this.options.tileSize, this.options.tileSize);
                tileCtx = tileCanvas.getContext('2d');
                // Set transparent background
                tileCtx.clearRect(0, 0, this.options.tileSize, this.options.tileSize);
                // Draw the image portion onto the tile
                tileCtx.drawImage(sourceCanvas, left, upper, width, height, // Source rectangle
                0, 0, width, height // Destination rectangle
                );
                tilePath = path.join(colFolder, "".concat(y, ".png"));
                buffer = tileCanvas.toBuffer('image/png');
                fs.writeFileSync(tilePath, buffer);
                return [2 /*return*/];
            });
        });
    };
    ImageTiler.prototype.createLeafletViewer = function () {
        var maxZoom = this.options.zoomLevels.slice(-1)[0];
        var _a = this.options.aspectRatio, widthRatio = _a[0], heightRatio = _a[1];
        // Calculate columns and rows at max zoom
        var cols = Math.ceil(this.imageWidth / this.options.tileSize);
        var rows = Math.ceil(this.imageHeight / this.options.tileSize);
        var htmlContent = "<!DOCTYPE html>\n<html>\n<head>\n    <title>Custom Tiled Map Viewer</title>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.7.1/dist/leaflet.css\" />\n    <script src=\"https://unpkg.com/leaflet@1.7.1/dist/leaflet.js\"></script>\n    <style>\n        html, body { height: 100%; margin: 0; }\n        #map { width: 100%; height: 100%; }\n    </style>\n</head>\n<body>\n    <div id=\"map\"></div>\n    <script>\n        const map = L.map('map', {\n            crs: L.CRS.Simple,\n            minZoom: ".concat(this.options.zoomLevels[0], ",\n            maxZoom: ").concat(maxZoom, "\n        });\n        \n        // Calculate bounds for ").concat(widthRatio, ":").concat(heightRatio, " aspect ratio\n        const mapWidth = ").concat(cols, " * ").concat(this.options.tileSize, ";\n        const mapHeight = ").concat(rows, " * ").concat(this.options.tileSize, ";\n        const bounds = [[0, 0], [mapHeight, mapWidth]];\n        \n        L.tileLayer('{z}/{x}/{y}.png', {\n            attribution: 'Custom Tiled Map',\n            noWrap: true,\n            bounds: bounds,\n            tileSize: ").concat(this.options.tileSize, "\n        }).addTo(map);\n        \n        map.fitBounds(bounds);\n        map.setMaxBounds(bounds);\n    </script>\n</body>\n</html>");
        fs.writeFileSync(path.join(this.options.outputFolder, 'index.html'), htmlContent);
        console.log("Leaflet viewer created: ".concat(path.join(this.options.outputFolder, 'index.html')));
    };
    return ImageTiler;
}());
exports.ImageTiler = ImageTiler;
// Example usage as a standalone script
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var inputImagePath, outputFolder, options, i, option, value, tiler;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
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
                    inputImagePath = process.argv[2];
                    outputFolder = process.argv[3];
                    options = {
                        inputImagePath: inputImagePath,
                        outputFolder: outputFolder,
                    };
                    for (i = 4; i < process.argv.length; i += 2) {
                        option = process.argv[i];
                        value = process.argv[i + 1];
                        switch (option) {
                            case '--min-zoom':
                                options.zoomLevels = [parseInt(value), (_b = (_a = options.zoomLevels) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 5];
                                break;
                            case '--max-zoom':
                                options.zoomLevels = [(_d = (_c = options.zoomLevels) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : 0, parseInt(value)];
                                break;
                            case '--tile-size':
                                options.tileSize = parseInt(value);
                                break;
                            case '--width-ratio':
                                options.aspectRatio = [parseInt(value), (_f = (_e = options.aspectRatio) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : 9];
                                break;
                            case '--height-ratio':
                                options.aspectRatio = [(_h = (_g = options.aspectRatio) === null || _g === void 0 ? void 0 : _g[0]) !== null && _h !== void 0 ? _h : 16, parseInt(value)];
                                break;
                        }
                    }
                    tiler = new ImageTiler(options);
                    return [4 /*yield*/, tiler.createTiles()];
                case 1:
                    _j.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Run the script if called directly
if (require.main === module) {
    main().catch(console.error);
}
