import { ReactNode, RefObject, useEffect } from "react"
import { useMap } from "react-leaflet"
import { IMarker, IMarkerForm } from "../../lib/database/interfaces"
import L, { Marker, Popup } from "leaflet"

export function CenterPopupWrapper({
  children, 
  marker, 
  markerRef, 
  popupRef
}: {
  children: ReactNode, 
  marker: IMarker | IMarkerForm, 
  markerRef: RefObject<Marker | null>,
  popupRef: RefObject<Popup | null>
}) {
  const map = useMap()
  
  useEffect(() => {
    if (!markerRef.current || !popupRef.current) return;

    const ref = popupRef
    
    // Function to center the view on the popup
    const centerPopup = () => {
      // Wait for the popup to be fully rendered
      setTimeout(() => {
        if (popupRef.current === null || !popupRef.current.isOpen()) return 
        
        const popupEl = popupRef.current.getElement();
        
        if (!popupEl) return 
        const popupLatLng = popupRef.current.getLatLng();
        if (!popupLatLng) return
        
        map.setView(popupLatLng, map.getZoom());
        
        // Optional: you can offset the view to account for the popup's height
        // First get the popup dimensions
        const popupHeight = popupEl.offsetHeight;
        
        // Calculate a point offset in pixels
        const offset = L.point(0, -popupHeight/2);
        
        // Convert pixel offset to geographic offset
        const offsetLatLng = map.containerPointToLatLng(
            map.latLngToContainerPoint(popupLatLng).add(offset)
        );
        
        // Set the view with the calculated offset
        map.setView(offsetLatLng, map.getZoom());
        
        
      }, 50); // Small delay to ensure popup is rendered
    };
    
    // Listen for the popup open event
    popupRef.current.on('add', centerPopup);
    
    return () => {
      if (ref.current) {
        ref.current.off('add', centerPopup);
      }
    };
  }, [markerRef, popupRef, map, marker]);
  
  return (
    <>
      {children}
    </>
  );
}

// Usage example:
// In your main component:
// const markerRef = useRef(null);
// const popupRef = useRef(null);
// 
// <Marker ref={markerRef} position={[lat, lng]}>
//   <Popup ref={popupRef}>
//     <YourPopupContent />
//   </Popup>
// </Marker>
// 
// <CenterPopupWrapper marker={marker} markerRef={markerRef} popupRef={popupRef}>
//   {/* Any additional content */}
// </CenterPopupWrapper>