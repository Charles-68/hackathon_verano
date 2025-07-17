"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-pink-100 to-pink-300 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-pink-500 mb-2 drop-shadow">¡Únete a SecretMap! 🌍💖</h2>
        <p className="text-pink-700 font-medium">Crea tu cuenta y empieza a descubrir secretos en el mundo.</p>
      </div>
      <form onSubmit={handleSignup} className="bg-white/90 p-8 rounded-2xl shadow-xl w-80 flex flex-col gap-4 border border-pink-100">
        <span className="text-4xl text-pink-400 text-center mb-2">📝</span>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-lg"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-lg"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-pink-400 text-white py-2 rounded-full font-bold text-lg mt-2 transition-transform duration-200 hover:scale-105 hover:bg-pink-500 shadow"
          disabled={loading}
        >
          {loading ? "Creando..." : "Sign Up"}
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}
