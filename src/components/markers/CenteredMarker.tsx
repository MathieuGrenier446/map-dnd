import { ReactNode, RefObject, useEffect } from "react"
import { useMap } from "react-leaflet"
import { IMarker, IMarkerForm } from "../../lib/database/interfaces"
import { Marker, Popup } from "leaflet"

export function CenterMarkerWrapper({children, marker, markerRef}:{children: ReactNode, marker: IMarker | IMarkerForm, markerRef: RefObject<Marker | Popup | null>}) {
        const map = useMap()
    
        useEffect(()=>{
            const centerMarker = () => {
                setTimeout(() => {
                    map.setView([marker.position.x, marker.position.y], map.getZoom());
                }, 0);
            }
            const ref = markerRef
            ref.current?.on("click", ()=>{
                centerMarker()
            })
            
        }, [markerRef, map, marker])
        

        return (
            <>
                {children}
            </>
        )
}