"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

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
    <nav className="w-full flex items-center justify-between px-8 py-4 border-b bg-white/80 backdrop-blur-md fixed top-0 left-0 z-50">
      <Link href="/" className="text-xl font-bold tracking-tight">🌎 SecretMap</Link>
      <div className="flex gap-4 items-center">
        {!user && (
          <>
            <Link href="/login" className={`font-medium hover:underline${pathname === "/login" ? " text-blue-600" : ""}`}>Log In</Link>
<Link href="/signup" className={`font-medium hover:underline${pathname === "/signup" ? " text-green-600" : ""}`}>Sign Up</Link>
          </>
        )}
        {user && (
          <>
            <Link href="/profile" className="font-medium hover:underline">Perfil</Link>
          </>
        )}
      </div>
    </nav>
  );
}
