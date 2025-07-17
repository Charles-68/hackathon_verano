"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/profile");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-cyan-100 to-blue-400 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-2 drop-shadow">¡Bienvenido de vuelta! 🌎✨</h2>
        <p className="text-blue-900 font-medium">Inicia sesión para explorar el mundo de los secretos.</p>
      </div>
      <form onSubmit={handleLogin} className="bg-white/90 p-8 rounded-2xl shadow-xl w-80 flex flex-col gap-4 border border-blue-100">
        <span className="text-4xl text-blue-400 text-center mb-2">🔑</span>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-400 text-white py-2 rounded-full font-bold text-lg mt-2 transition-transform duration-200 hover:scale-105 hover:bg-blue-500 shadow"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Log In"}
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
