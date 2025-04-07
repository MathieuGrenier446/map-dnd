import { useEffect, useState } from "react";
import { MarkersContext } from "./useMarkers";
import { IMarker, IMarkerForm } from "../lib/database/interfaces";
import { addDocument, subscribeToCollection } from "../lib/database/controllers";
import { MARKERS_DB_TABLE } from "../lib/database/tables";

export const MarkersProvider = ({ children }: {children: React.ReactNode}) => {
    const [markers, setMarkers] = useState<IMarker[]>([])
    const [newMarker, _setNewMarker] = useState<IMarkerForm|null>(null)
    const [isAddMarkerMode, setIsAddMarkerMode] = useState<boolean>(false)
    const [isUploadingNewMarker, setIsUploadingNewMarker] = useState<boolean>(false)

    useEffect(()=>{
        const unsubscribe = subscribeToCollection(MARKERS_DB_TABLE, (data)=>{
            setMarkers(data as IMarker[])
        })
        return ()=>unsubscribe()
    }, [])

    const setNewMarker = (newMarker: IMarkerForm | null) => {
        if (!isAddMarkerMode || isUploadingNewMarker) return
        _setNewMarker(newMarker)
    }

    const uploadNewMarker = async () => {
        if (!newMarker || isUploadingNewMarker || !isAddMarkerMode) return
        setIsUploadingNewMarker(true)
        await addDocument(MARKERS_DB_TABLE, newMarker)
        setIsAddMarkerMode(false);
        setIsUploadingNewMarker(false)
        _setNewMarker(null)
    }
    
    return (
    <MarkersContext.Provider 
        value={{ 
            markers, 
            isAddMarkerMode, 
            isUploadingNewMarker, 
            newMarker, 
            uploadNewMarker,
            setNewMarker, 
            setIsAddMarkerMode 
        }}>
        {children}
    </MarkersContext.Provider>
    );
}

