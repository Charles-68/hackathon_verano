"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
}

interface Secret {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [secrets, setSecrets] = useState<Record<string, Secret[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user || data.user.email !== "charles8002.dgc@gmail.com") {
        router.push("/profile");
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetchUsers();
  }, [user]);

  async function fetchUsers() {
    const { data, error } = await supabase.rpc("get_all_users");
    if (!error && data) {
      setUsers(data);
      for (const u of data) {
        fetchSecrets(u.id);
      }
    }
    setLoading(false);
  }

  async function fetchSecrets(userId: string) {
    const { data, error } = await supabase
      .from("secrets")
      .select("id, user_id, content, created_at")
      .eq("user_id", userId);
    if (!error && data) {
      setSecrets(prev => ({ ...prev, [userId]: data }));
    }
  }

  async function handleDelete(secretId: string, userId: string) {
    if (!confirm("¿Eliminar este mensaje?")) return;
    const { error } = await supabase.from("secrets").delete().eq("id", secretId);
    if (!error) {
      setSecrets(prev => ({
        ...prev,
        [userId]: prev[userId].filter(s => s.id !== secretId),
      }));
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100 px-4">
      <div className="bg-white/90 p-8 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col gap-6 border border-yellow-200">
        <h2 className="text-3xl font-extrabold text-yellow-600 mb-2 drop-shadow flex items-center gap-2">
          <span>Admin Panel</span> <span className="text-2xl">👑</span>
        </h2>
        <div className="flex flex-col gap-2">
          <span className="font-bold text-blue-700">Usuarios registrados:</span>
          <div className="flex flex-wrap gap-2">
            {users.map(u => (
              <button
                key={u.id}
                className={`px-4 py-2 rounded-full text-sm font-semibold border border-blue-200 shadow transition-all ${selectedUser === u.id ? "bg-blue-300 text-white" : "bg-blue-100 hover:bg-blue-200"}`}
                onClick={() => setSelectedUser(u.id)}
              >
                {u.email}
              </button>
            ))}
          </div>
        </div>
        {selectedUser && (
          <div className="mt-6">
            <span className="font-bold text-pink-600">Mensajes de {users.find(u => u.id === selectedUser)?.email}:</span>
            <div className="flex flex-col gap-2 mt-2">
              {(secrets[selectedUser] || []).length === 0 && <span className="text-gray-500">Sin mensajes.</span>}
              {(secrets[selectedUser] || []).map(secret => (
                <div key={secret.id} className="bg-pink-100 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-blue-900">{secret.content}</span>
                  <button
                    className="ml-4 bg-red-400 text-white px-3 py-1 rounded-full font-bold hover:bg-red-500 transition"
                    onClick={() => handleDelete(secret.id, selectedUser)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
