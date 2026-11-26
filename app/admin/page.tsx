import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  let supabase;
  try { supabase = await createClient(); } catch { redirect("/login"); }
  const { data: { user } } = await supabase!.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase!.from("profiles").select("account_roles").eq("id", user.id).maybeSingle();
  if (!profile?.account_roles?.includes("admin")) redirect("/dashboard");
  const { count: pending } = await supabase!.from("land_listings").select("*", { count: "exact", head: true }).eq("status", "pending_review");
  const { count: published } = await supabase!.from("land_listings").select("*", { count: "exact", head: true }).eq("status", "published");
  return <main className="min-h-screen bg-[#f7f8f4]"><header className="border-b border-[#e7ebe5] bg-white"><div className="container flex h-20 items-center justify-between"><Link href="/" className="font-display text-xl font-extrabold">landsbank<span className="text-[#176b4a]">india</span></Link><span className="text-xs font-bold text-[#176b4a]">ADMIN CONSOLE</span></div></header><section className="container py-10"><div className="eyebrow">PLATFORM OPERATIONS</div><h1 className="font-display mt-2 text-3xl font-extrabold">Admin overview</h1><p className="mt-2 text-sm text-[#69766f]">Moderation counts from the connected database.</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><div className="soft-card p-6"><p className="text-sm text-[#69766f]">Pending review</p><p className="font-display mt-2 text-4xl font-extrabold">{pending ?? 0}</p></div><div className="soft-card p-6"><p className="text-sm text-[#69766f]">Published listings</p><p className="font-display mt-2 text-4xl font-extrabold">{published ?? 0}</p></div></div><div className="soft-card mt-5 p-6"><h2 className="font-display text-lg font-extrabold">Moderation workflow</h2><p className="mt-2 text-sm leading-6 text-[#69766f]">Listing approval actions will be enabled after the admin-only database policies and audit log are deployed. Never approve ownership or title based only on uploaded documents or AI output.</p></div></section></main>;
}
