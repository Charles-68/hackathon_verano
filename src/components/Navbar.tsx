"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2 md:py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg md:text-xl">
          <span className="text-2xl md:text-3xl">🌎</span>
          SecretMap
        </Link>
        {/* Desktop links */}
        <div className="hidden md:flex gap-6 items-center">
          {user && <Link href="/profile" className="font-medium hover:underline">Perfil</Link>}
          {!user && (
            <>
              <Link href="/login" className="font-medium hover:underline">Entrar</Link>
              <Link href="/signup" className="font-medium hover:underline">Registro</Link>
            </>
          )}
        </div>
        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col justify-center items-center p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
          <span className="block w-6 h-0.5 bg-gray-800 mb-1 rounded"></span>
          <span className="block w-6 h-0.5 bg-gray-800 mb-1 rounded"></span>
          <span className="block w-6 h-0.5 bg-gray-800 rounded"></span>
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 border-t border-gray-200 px-4 pb-4 flex flex-col gap-4 animate-fade-in">
          {user && <Link href="/profile" className="font-medium hover:underline" onClick={()=>setMenuOpen(false)}>Perfil</Link>}
          {!user && (
            <>
              <Link href="/login" className="font-medium hover:underline" onClick={()=>setMenuOpen(false)}>Entrar</Link>
              <Link href="/signup" className="font-medium hover:underline" onClick={()=>setMenuOpen(false)}>Registro</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
