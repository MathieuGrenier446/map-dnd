import { useMapEvents } from "react-leaflet";
import NewMarker from "../markers/NewMarker";
import { useMarkers } from "../../hooks/useMarkers";
import { IMarkerForm } from "../../lib/database/interfaces";
import NewMarkerButton from "../markers/NewMarkerButton";
import NewMarkerToolTip from "../markers/NewMarkerToolTip";
import CustomMarker from "../markers/Marker";
import { useEffect } from "react";

export default function MarkerLayer() {
    const {setNewMarker, setIsAddMarkerMode, isAddMarkerMode, markers, newMarker} = useMarkers()

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch(event.key){
                case "M":
                case "m":
                    setIsAddMarkerMode(true)
                    break
                case "Escape":
                    setIsAddMarkerMode(false)
                    setNewMarker(null)
                    break
            }
        };
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [setIsAddMarkerMode, setNewMarker]);

    useMapEvents({
        click: (e)=>{
            if(!isAddMarkerMode) return
            const {x, y} = {x: e.latlng.lat, y: e.latlng.lng}
            const marker: IMarkerForm = {position: {x, y}}
            setNewMarker(marker)
        }
    })

    return (
        <div>
            <NewMarkerButton/>
            {isAddMarkerMode && <NewMarkerToolTip/>}
            {newMarker && <NewMarker/>}

            {markers.map((marker)=>(
              <CustomMarker key={marker.id} marker={marker}/>
            ))}
        </div>
    )
}