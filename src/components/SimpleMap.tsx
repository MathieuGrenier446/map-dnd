import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { MapContainer} from "react-leaflet";
import LoggingLayer from './LoggingLayer';
import MarkerLayer from './MarkerLayer';
import L from 'leaflet';


export default function SimpleMap() {

  L.Icon.Default.imagePath='leaflet-images/'

  return (
      <MapContainer 
          style={{ width: "100%", height: "100vh" }} 
          center={[-130, 130]} 
          zoom={3} 
          maxZoom={5} 
          crs={CRS.Simple}
        >
          <LoggingLayer/>
          <MarkerLayer/>
      </MapContainer>
    );
  };