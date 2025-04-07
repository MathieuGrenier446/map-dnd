import { Marker, Popup } from "react-leaflet"
import { IMarker } from "../../lib/database/interfaces"
import { useRef } from "react"
import { deleteDocument } from "../../lib/database/controllers"
import { MARKERS_DB_TABLE } from "../../lib/database/tables"
import L from "leaflet"

export default function CustomMarker({marker}:{marker:IMarker}){
    const markerRef = useRef<L.Marker>(null)
    return (
    <Marker ref={markerRef} position={[marker.position.x, marker.position.y]}>
        <Popup>
            <div className="flex flex-col items-center">
                <p>{marker.text || `Unnamed marker`}</p>
                <p>{`(${marker.position.x.toPrecision(4)},${marker.position.y.toPrecision(4)})`}</p>
                <button className="bg-gray-300 hover:bg-red-400 px-3 py-1 rounded-full shadow-xl" onClick={async (e)=>{
                    await deleteDocument(MARKERS_DB_TABLE, marker.id)
                    e.stopPropagation()
                }}>
                    Delete
                </button>
            </div>
        </Popup>
    </Marker>
    )
}