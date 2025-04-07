import { useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import { useMarkers } from "../../hooks/useMarkers";
import ImageUpload from "../utils/ImageUpload";

export default function NewMarker() {
    
    const pendingMarkerRef = useRef<L.Marker | null>(null);
    const popupRef = useRef<L.Popup | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const {setNewMarker, isUploadingNewMarker, newMarker, uploadNewMarker, setIsAddMarkerMode} = useMarkers()

    useEffect(() => {
        if (popupRef.current && pendingMarkerRef.current) {
            setTimeout(() => {
                pendingMarkerRef.current?.openPopup();
                textareaRef.current?.focus();
            }, 0);
        }
    }, [newMarker]);

    if (newMarker === null) return <></>
    
    return (
        <Marker ref={(ref) => { pendingMarkerRef.current = ref }} position={[newMarker.position.x, newMarker.position.y]}>   
            <Popup ref={(ref) => { popupRef.current = ref }}>
                <div className="flex flex-col z-50 items-center">
                    <p className="italic underline">New marker!</p>
                    <p>{`(${newMarker.position.x.toPrecision(4)},${newMarker.position.y.toPrecision(4)})`}</p>
                    <textarea
                        className="border p-2 rounded w-full text-center"
                        placeholder="Enter marker text..."
                        value={newMarker.text}
                        onChange={(e) => setNewMarker({...newMarker, text: e.target.value})}
                        rows={3}
                        ref={(ref) => { 
                            textareaRef.current = ref
                            textareaRef.current?.focus();
                            }}
                    />
                    <ImageUpload/>
                    <div className="flex justify-between gap-2 mt-4">
                        <button 
                            className="bg-gray-200 px-3 py-1 rounded-full shadow-xl hover:bg-gray-400"
                            onClick={()=>{
                                setNewMarker(null)
                                setIsAddMarkerMode(false)
                            }}
                            disabled={isUploadingNewMarker}
                        >
                            Cancel
                        </button>
                        <button 
                            className="bg-green-500 px-3 py-1 rounded-full shadow-xl text-white hover:bg-green-700"
                            onClick={()=>uploadNewMarker()}
                            disabled={isUploadingNewMarker}
                        >
                            {isUploadingNewMarker ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </Popup>
        </Marker>
    )
}