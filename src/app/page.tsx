"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Map from "../components/Map";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-200 via-cyan-100 to-blue-400 relative overflow-hidden">
        {/* Fondo decorativo: Globo terráqueo SVG grande */}
        <svg className="absolute opacity-30 -z-10 animate-spin-slow" width="500" height="500" viewBox="0 0 500 500" style={{top: '10%', left: '50%', transform: 'translateX(-50%)'}} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="250" cy="250" r="200" fill="#52b6ff" />
          <ellipse cx="250" cy="250" rx="160" ry="200" fill="#a7e5ff" />
          <ellipse cx="250" cy="250" rx="120" ry="180" fill="#e0f7fa" />
        </svg>
        <h1 className="text-5xl font-extrabold mb-4 text-center text-blue-700 drop-shadow-lg">SecretMap 🌎✨</h1>
        <p className="text-lg text-blue-900 max-w-2xl text-center mb-8 font-medium">
          <span className="text-2xl">👀</span> Descubre secretos anónimos en el mundo, explora lugares icónicos y comparte tus historias con <span className="font-bold text-blue-600">cutesy vibes</span>.<br/>
          <span className="text-2xl">🗺️💬</span> ¡Inicia sesión para ver el mapa y empezar tu aventura secreta!
        </p>
        <div className="flex gap-6 mt-2">
          <a href="/login" className="bg-blue-400 text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg transition-transform duration-200 hover:scale-105 hover:bg-blue-500">Log In</a>
          <a href="/signup" className="bg-pink-400 text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg transition-transform duration-200 hover:scale-105 hover:bg-pink-500">Sign Up</a>
        </div>
        <div className="mt-12 text-blue-600/80 text-center text-base font-light">
          <span className="text-xl">🌍</span> Inspirado en Google Earth, pero mucho más cute y divertido. <span className="text-xl">✨</span>
        </div>
      </div>
    );
  }

  // Si hay usuario, muestra el mapa y los botones de acción
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-200 via-cyan-100 to-blue-400 relative">
      <div className="w-full h-[70vh] rounded-2xl shadow-xl border-2 border-blue-200 overflow-hidden bg-white/80 flex flex-col items-center justify-center relative">
        <Map />
      </div>
      <div className="mt-2 text-blue-500 font-medium flex items-center gap-2">
        <span className="text-xl">🌎</span> ¡Haz zoom y explora los secretos del mundo!
      </div>
      {/* Botones flotantes fixed SIEMPRE visibles */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-[999]">
        <button
          onClick={() => window.location.href = "/new-secret"}
          className="bg-pink-400 text-white rounded-full shadow-lg px-6 py-3 text-xl font-bold flex items-center gap-2 hover:bg-pink-500 active:scale-95 transition-all drop-shadow-md border-4 border-white/60 hover:shadow-2xl"
        >
          <span className="text-2xl">📝</span> Nuevo Secreto
        </button>
        <button
          onClick={() => window.location.href = "/likes"}
          className="bg-yellow-300 text-yellow-900 rounded-full shadow-lg px-6 py-3 text-xl font-bold flex items-center gap-2 hover:bg-yellow-400 active:scale-95 transition-all drop-shadow-md border-4 border-white/60 hover:shadow-2xl"
        >
          <span className="text-2xl">❤️</span> Likes
        </button>
      </div>
    </div>
  );
}
