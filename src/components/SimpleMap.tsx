import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer} from "react-leaflet";
import MarkerLayer from './layers/MarkerLayer';
import L from 'leaflet';
import { MarkersProvider } from '../hooks/MarkersProvider';


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
          <MarkersProvider>
            <TileLayer
              url="/map-dnd/tiles_ezrie/{z}/{x}/{y}.png"
              noWrap={true}
              errorTileUrl="/map-dnd/tiles/leather-texture.png"
            /> 
            <MarkerLayer/>
          </MarkersProvider>
      </MapContainer>
    
    );
  };