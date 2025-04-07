import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { MapContainer} from "react-leaflet";
import LoggingLayer from './layers/LoggingLayer';
import MarkerLayer from './layers/MarkerLayer';
import L from 'leaflet';
import { MarkersProvider } from '../hooks/MarkersProvider';


export default function SimpleMap() {

  L.Icon.Default.imagePath='leaflet-images/'

  return (
    <MarkersProvider>
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
    </MarkersProvider>
    );
  };