"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Secret {
  id: string;
  content: string;
  created_at: string;
}

export default function LikesPage() {
  const [user, setUser] = useState<any>(null);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        fetchLikes(data.user.id);
      }
    });
  }, [router]);

  async function fetchLikes(userId: string) {
    // Suponiendo que hay una tabla likes con user_id y secret_id
    const { data: likes, error } = await supabase
      .from("likes")
      .select("secret_id, secrets:secret_id(content, created_at, id)")
      .eq("user_id", userId);
    if (!error && likes) {
      setSecrets(likes.map((l: any) => l.secrets));
    }
    setLoading(false);
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 px-4">
      <div className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-4 border border-yellow-100 items-center">
        <h2 className="text-3xl font-extrabold text-yellow-500 mb-2 drop-shadow flex items-center gap-2">
          <span>Mis Likes</span> <span className="text-2xl">❤️</span>
        </h2>
        {secrets.length === 0 ? (
          <p className="text-gray-500">Aún no has dado like a ningún secreto.</p>
        ) : (
          <ul className="flex flex-col gap-3 w-full">
            {secrets.map(secret => (
              <li key={secret.id} className="bg-yellow-100 p-4 rounded-xl text-blue-900 shadow flex flex-col">
                <span className="text-lg">{secret.content}</span>
                <span className="text-xs text-gray-500 mt-1">{new Date(secret.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
