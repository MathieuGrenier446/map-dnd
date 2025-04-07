import { useEffect, useRef } from "react";
import { useMarkers } from "../../hooks/useMarkers"
import L from "leaflet";

export default function NewMarkerButton() {
    const {isAddMarkerMode, setIsAddMarkerMode, setNewMarker} = useMarkers()
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (buttonRef.current) {
            L.DomEvent.disableClickPropagation(buttonRef.current);
            L.DomEvent.disableScrollPropagation(buttonRef.current); // optional
        }
    }, []);

    return (
        <div style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
        }}>
            <button 
                ref={buttonRef}
                onClick={(e)=>{
                    e.stopPropagation()
                    setIsAddMarkerMode(prev=>!prev)
                    if (isAddMarkerMode) setNewMarker(null)
                        
                }}
                className="text-xl absolute z-1000 top-2 right-2 text-nowrap w-40"
                style={{
                    padding: '8px 16px',
                    backgroundColor: isAddMarkerMode ? '#ff6b6b' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                {isAddMarkerMode ? 'Cancel' : 'Add Marker'}
            </button>
        </div>
    )
}