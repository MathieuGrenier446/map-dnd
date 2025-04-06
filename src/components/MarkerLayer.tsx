import { Marker, Popup, useMapEvents } from "react-leaflet";
import { IMarker, IMarkerForm } from '../lib/database/interfaces';
import { addDocument, deleteDocument, subscribeToCollection } from '../lib/database/controllers';
import { MARKERS_DB_TABLE } from '../lib/database/tables';
import { useEffect, useRef, useState } from 'react';
import  L  from "leaflet";

export default function MarkerLayer() {
    const [isAddingMarker, setIsAddingMarker] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [pendingMarker, setPendingMarker] = useState<IMarkerForm|null> (null)
    const [markers, setMarkers]= useState<IMarker[]>([])
    const pendingMarkerRef = useRef<L.Marker | null>(null);
    const popupRef = useRef<L.Popup | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useMapEvents({
        click: async (e)=>{
            if(!isAddingMarker || isLoading) return;
            const {x, y} = {x: e.latlng.lat, y: e.latlng.lng}
            const marker: IMarkerForm = {position: {x, y}}
            setPendingMarker(marker)
        }
    })

    useEffect(()=>{
        const unsubscribe = subscribeToCollection(MARKERS_DB_TABLE, (data)=>{
            setMarkers(data as IMarker[])
        })
        return ()=>unsubscribe()
    }, [])

    useEffect(() => {
        if (popupRef.current && pendingMarkerRef.current) {
            setTimeout(() => {
                pendingMarkerRef.current?.openPopup();
                textareaRef.current?.focus();
            }, 0);
        }
    }, [pendingMarker]);

    const handleSubmitMarker = async () => {
        if (!pendingMarker || isLoading || !isAddingMarker) return
        setIsLoading(true)
        await addDocument(MARKERS_DB_TABLE, pendingMarker)
        setIsAddingMarker(false);
        setIsLoading(false)
        setPendingMarker(null)
    }
    
    const toggleAddMarkerMode = () => {
        setIsAddingMarker(prevState => !prevState);
    };

    return (
        <div>
            <div className="marker-button-container" style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px', 
                zIndex: 1000 
            }}>
                <button 
                    onClick={toggleAddMarkerMode}
                    className="text-xl z-50"
                    style={{
                        padding: '8px 16px',
                        backgroundColor: isAddingMarker ? '#ff6b6b' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {isAddingMarker ? 'Cancel' : 'Add Marker'}
                </button>
            </div>
            {isAddingMarker && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    zIndex: 1000
                }}>
                    Click anywhere on the map to add a marker
                </div>
            )}

            {pendingMarker && (
                <Marker ref={(ref) => { pendingMarkerRef.current = ref }} position={[pendingMarker.position.x, pendingMarker.position.y]}>
                    
                    <Popup ref={(ref) => { popupRef.current = ref }}>
                        <div className="flex flex-col gap-2">
                            <textarea
                                className="border p-2 rounded w-full"
                                placeholder="Enter marker text..."
                                value={pendingMarker.text}
                                onChange={(e) => setPendingMarker((prev)=>
                                    prev === null ? null : {...prev, text: e.target.value}
                                )}
                                rows={3}
                                ref={(ref) => { 
                                    textareaRef.current = ref
                                    textareaRef.current?.focus();
                                 }}
                            />
                            <div className="flex justify-between gap-2 mt-2">
                                <button 
                                    className="bg-red px-3 py-1 rounded-full shadow-xl"
                                    onClick={()=>{
                                        setPendingMarker(null)
                                        setIsAddingMarker(false)
                                    }}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="bg-green-500 px-3 py-1 rounded-full shadow-xl text-white"
                                    onClick={handleSubmitMarker}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            )}

            {markers.map((marker, index)=>(
              <Marker key={index} position={[marker.position.x, marker.position.y]}>
               
                <Popup>
                    <div className="flex">
                        <p>{marker.text}</p>
                        <button className="bg-red px-3 py-1 rounded-full shadow-xl" onClick={async ()=>{
                            await deleteDocument(MARKERS_DB_TABLE, marker.id)
                        }}>
                            Delete
                        </button>
                    </div>
                    
                </Popup>
              </Marker>
            ))}

        </div>
    )
}