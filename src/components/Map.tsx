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
  const [user, setUser] = useState<any>(null);
  const [likes, setLikes] = useState<{[secretId:string]:boolean}>({});
  const [likeCounts, setLikeCounts] = useState<{[secretId:string]:number}>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchSecrets() {
      const { data, error } = await supabase
        .from("secrets")
        .select("id, content, lat, lng, created_at");
      if (!error && data) setSecrets(data.filter(s => s.lat && s.lng));
    }
    fetchSecrets();
  }, []);

  useEffect(() => {
    async function fetchLikes() {
      if (!user) return;
      const { data, error } = await supabase
        .from("likes")
        .select("secret_id")
        .eq("user_id", user.id);
      if (!error && data) {
        const likeMap: {[secretId:string]:boolean} = {};
        data.forEach((row:any) => { likeMap[row.secret_id] = true; });
        setLikes(likeMap);
      }
    }
    async function fetchLikeCounts() {
      // Trae todos los likes y cuenta por secret_id en el frontend
      const { data, error } = await supabase
        .from("likes")
        .select("secret_id");
      if (!error && data) {
        const countMap: {[secretId:string]:number} = {};
        data.forEach((row:any) => {
          countMap[row.secret_id] = (countMap[row.secret_id] || 0) + 1;
        });
        setLikeCounts(countMap);
      }
    }
    fetchLikes();
    fetchLikeCounts();
  }, [user, secrets]);

  // Like/Unlike handler
  async function handleLike(secretId:string) {
    if (!user) return;
    // Actualiza el contador localmente para feedback instantáneo
    setLikes(prev => ({ ...prev, [secretId]: !prev[secretId] }));
    setLikeCounts(prev => ({
      ...prev,
      [secretId]: prev[secretId] ? prev[secretId] - 1 : (prev[secretId] || 0) + 1
    }));
    if (likes[secretId]) {
      // Quitar like
      await supabase.from("likes").delete()
        .eq("user_id", user.id)
        .eq("secret_id", secretId);
    } else {
      // Dar like
      await supabase.from("likes").insert({ user_id: user.id, secret_id: secretId });
    }
    // Opcional: refresca likes y conteo desde backend para mantener consistencia
    setTimeout(async () => {
      const { data } = await supabase.from("likes").select("secret_id").eq("user_id", user.id);
      const likeMap: {[secretId:string]:boolean} = {};
      data?.forEach((row:any) => { likeMap[row.secret_id] = true; });
      setLikes(likeMap);
      const { data: counts } = await supabase.from("likes").select("secret_id");
      const countMap: {[secretId:string]:number} = {};
      counts?.forEach((row:any) => {
        countMap[row.secret_id] = (countMap[row.secret_id] || 0) + 1;
      });
      setLikeCounts(countMap);
    }, 500);
  }

  // Icono cutesy personalizado (emoji)
  let secretIcon = undefined;
  let leafletReady = false;
  if (typeof window !== "undefined") {
    try {
      const L = require("leaflet");
      secretIcon = new L.DivIcon({
        html: '<span style="font-size:2rem;">💌</span>',
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
      leafletReady = true;
    } catch (e) {
      leafletReady = false;
    }
  }

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
      {leafletReady && secrets.map(secret => (
        <Marker
          key={secret.id}
          position={[secret.lat, secret.lng]}
          icon={secretIcon}
        >
          <Popup>
            <span className="text-lg font-semibold">{secret.content}</span>
            <br />
            <span className="text-xs text-gray-400">{new Date(secret.created_at).toLocaleString()}</span>
            <div className="mt-2 flex items-center gap-2">
              <button
                className={`rounded-full px-3 py-1 text-lg font-bold transition-all ${user ? (likes[secret.id] ? 'bg-pink-400 text-white' : 'bg-pink-100 text-pink-600 hover:bg-pink-200') : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                title={user ? (likes[secret.id] ? 'Quitar like' : 'Dar like') : 'Inicia sesión para dar like'}
                onClick={() => user && handleLike(secret.id)}
                disabled={!user}
              >
                ❤️ {likeCounts[secret.id] || 0}
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
