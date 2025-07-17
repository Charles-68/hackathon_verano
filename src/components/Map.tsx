"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

export default function Map() {
  const [secrets, setSecrets] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSecrets() {
      const { data, error } = await supabase
        .from("secrets")
        .select("id, content, lat, lng, created_at");
      if (!error && data) setSecrets(data.filter(s => s.lat && s.lng));
    }
    fetchSecrets();
  }, []);

  // Icono cutesy personalizado (emoji)
  const L = typeof window !== "undefined" ? require("leaflet") : null;
  const secretIcon = L
    ? new L.DivIcon({
        html: '<span style="font-size:2rem;">💌</span>',
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })
    : undefined;

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
      {secrets.map(secret => (
        <Marker
          key={secret.id}
          position={[secret.lat, secret.lng]}
          icon={secretIcon}
        >
          <Popup>
            <span className="text-lg font-semibold">{secret.content}</span>
            <br />
            <span className="text-xs text-gray-400">{new Date(secret.created_at).toLocaleString()}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
