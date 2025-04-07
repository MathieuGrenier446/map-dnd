import { createContext, Dispatch, useContext } from "react";
import { IMarker, IMarkerForm } from "../lib/database/interfaces";

interface MarkersContextType {
    markers: IMarker[],
    isAddMarkerMode: boolean,
    isUploadingNewMarker: boolean,
    newMarker: IMarkerForm | null,
    uploadNewMarker: ()=>void,
    setNewMarker: (newMarker: IMarkerForm | null)=>void,
    setIsAddMarkerMode: Dispatch<React.SetStateAction<boolean>>,
}

const defaultMarkersContextValue: MarkersContextType = {
    markers: [],
    isAddMarkerMode: false,
    isUploadingNewMarker: false,
    newMarker: null,
    uploadNewMarker: ()=>{},
    setNewMarker: ()=>{},
    setIsAddMarkerMode: ()=>{}
}

export const MarkersContext = createContext(defaultMarkersContextValue)

export const useMarkers = () => {
    const context = useContext(MarkersContext);
    if (!context) {
      throw new Error('useMarkers must be used within an MarkersProvider');
    }
    return context;
  };