import L from "leaflet";
import { ImageOverlay } from "react-leaflet";

export default function ImageLayer() {
      const padding = 40
      const bottomLeftCorner = L.latLng([-90 - padding, 0 - padding])
      const topRightCorner = L.latLng([0 + padding, 180 + 80])
    
      const mapBounds = new L.LatLngBounds(bottomLeftCorner, topRightCorner)
    return (
    <ImageOverlay
        url="/map-dnd/Ezrie.png"
        bounds={mapBounds}
    />) 
}