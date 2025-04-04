import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from "react-leaflet";

export default function SimpleMap() {
  
    return (
      <MapContainer style={{ width: "100%", height: "100vh" }} center={[0, 0]} zoom={13} >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    );
  };