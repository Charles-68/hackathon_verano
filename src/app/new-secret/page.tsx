"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });
import { useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({ setLocation, location }: { setLocation: (loc: [number, number]) => void, location: [number, number] | null }) {
  // Importa leaflet sólo en cliente
  const L = require("leaflet");
  const secretIcon = new L.DivIcon({
    html: '<span style="font-size:2rem;">💌</span>',
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  useMapEvent('click', (e: any) => {
    setLocation([e.latlng.lat, e.latlng.lng]);
  });
  return location ? (
    <Marker position={location as [number, number]} icon={secretIcon}>
      <Popup>
        Aquí aparecerá tu secreto 💌
      </Popup>
    </Marker>
  ) : null;
}

function NewSecretPage() {
  const [content, setContent] = useState("");
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Debes iniciar sesión para publicar un secreto.");
      setLoading(false);
      return;
    }
    if (!location) {
      setError("Selecciona una ubicación en el mapa para tu secreto.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("secrets").insert({
      user_id: user.id,
      content,
      lat: location[0],
      lng: location[1],
    });
    setLoading(false);
    if (error) setError(error.message);
    else {
      router.push("/");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-blue-200 px-4">
      <div className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-4 border border-pink-100 items-center">
        <h2 className="text-3xl font-extrabold text-pink-500 mb-2 drop-shadow flex items-center gap-2">
          <span>Nuevo Secreto</span> <span className="text-2xl">📝</span>
        </h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <textarea
            className="border p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-lg resize-none min-h-[100px]"
            placeholder="Escribe tu secreto aquí..."
            value={content}
            onChange={e => setContent(e.target.value)}
            maxLength={300}
            required
          />
          <div className="w-full h-56 rounded-xl overflow-hidden border border-pink-200 shadow relative">
            <MapContainer
              center={[19.4326, -99.1332]}
              zoom={5}
              scrollWheelZoom={true}
              className="w-full h-full"
              style={{ minHeight: 180 }}
            >
              <TileLayer
                attribution='<a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              />
              <LocationMarker setLocation={setLocation} location={location} />
            </MapContainer>
            <div className="absolute bottom-1 left-1 bg-white/80 rounded px-2 py-1 text-xs text-pink-500 shadow">Toca el mapa para elegir ubicación 💌</div>
          </div>
          <button
            type="submit"
            className="bg-pink-400 text-white py-3 rounded-full font-bold text-lg mt-2 transition-transform duration-200 hover:scale-105 hover:bg-pink-500 shadow w-full disabled:opacity-60"
            disabled={loading || !content.trim() || !location}
          >
            {loading ? "Publicando..." : "Publicar Secreto 💌"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-center font-bold">¡Secreto publicado! 🎉</p>}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(NewSecretPage), { ssr: false });
