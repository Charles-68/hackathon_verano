"use client";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icono cutesy personalizado (emoji)
const secretIcon = new L.DivIcon({
  html: '<span style="font-size:2rem;">💌</span>',
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapComponent() {
  // Ejemplo: marcador en CDMX
  const exampleSecrets = [
    {
      id: 1,
      position: [19.4326, -99.1332],
      text: "¡Hola diva! Este es un secretito en CDMX 💖",
    },
  ];

  return (
    <MapContainer
      center={[19.4326, -99.1332]}
      zoom={5}
      scrollWheelZoom={true}
      className="w-full h-full"
      style={{ minHeight: 400 }}
    >
      <TileLayer
        attribution='<a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {exampleSecrets.map(secret => (
        <Marker key={secret.id} position={secret.position as [number, number]} icon={secretIcon}>
          <Popup>
            <span className="text-lg font-semibold">{secret.text}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
