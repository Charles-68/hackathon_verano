"use client";
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    async function signOut() {
      await supabase.auth.signOut();
      router.push("/login");
    }
    signOut();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-lg">Cerrando sesión...</p>
    </div>
  );
}
