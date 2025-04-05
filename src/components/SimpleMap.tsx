import L, { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { MapContainer } from "react-leaflet";
import LoggingLayer from './LoggingLayer';

export default function SimpleMap() {
  const padding = 20
  const bottomLeftCorner = L.latLng([-90 - padding, 0 - padding])
  const topRightCorner = L.latLng([0 + padding, 180 + padding])

  const mapBounds = new L.LatLngBounds(bottomLeftCorner, topRightCorner)


  return (
      <MapContainer 
          style={{ width: "100%", height: "100vh" }} 
          center={[0, 0]} 
          zoom={0} 
          maxZoom={6} 
          crs={CRS.Simple}
          bounds={mapBounds}
          maxBounds={mapBounds}
        >
        <LoggingLayer/>
      </MapContainer>
    );
  };