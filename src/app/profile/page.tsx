"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (!user) return null;

  const isAdmin = user.email === "charles8002.dgc@gmail.com";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-pink-100 to-blue-400 px-4">
      <div className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-4 border border-blue-100 items-center">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-2 drop-shadow flex items-center gap-2">
          <span>Mi Perfil</span> <span className="text-2xl">👤</span>
        </h2>
        <div className="flex flex-col gap-2 w-full text-blue-900 text-lg">
          <span><strong>Email:</strong> {user.email}</span>
          <span><strong>ID:</strong> {user.id}</span>
          {isAdmin && (
            <span className="text-green-600 font-semibold flex items-center gap-1">Admin <span className="text-xl">👑</span></span>
          )}
        </div>
        <button
          className="bg-red-400 text-white py-2 rounded-full font-bold text-lg mt-4 transition-transform duration-200 hover:scale-105 hover:bg-red-500 shadow w-full"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
        >
          Cerrar sesión
        </button>
        {isAdmin && (
          <button
            className="bg-yellow-300 text-yellow-900 py-2 rounded-full font-bold text-lg mt-2 transition-transform duration-200 hover:scale-105 hover:bg-yellow-400 shadow w-full border-2 border-yellow-400"
            onClick={() => router.push("/profile/admin")}
          >
            Admin Panel
          </button>
        )}
      </div>
    </div>
  );
}
