import { TileLayer, useMapEvents } from "react-leaflet";

export default function LoggingLayer() {
    const map = useMapEvents(({
        move: ()=>{
            console.log(`Center: ${map.getCenter()}`)
        },
        zoom: ()=>{
            console.log(`Zoom: ${map.getZoom()}`)
        }
        
    }))

    return (
    <TileLayer
        url="/map-dnd/tiles_ezrie/{z}/{x}/{y}.png"
        noWrap={true}
        errorTileUrl="/map-dnd/tiles/leather-texture.png"
    />) 
}