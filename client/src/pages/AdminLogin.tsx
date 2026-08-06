import { FormEvent, useState } from "react";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AdminLogin() {
  const { locale } = useLanguage();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const copy = {
    ar: { eyebrow: "مساحة خاصة", title: "دخول المشرف", description: "أدخل بيانات الحساب الإداري لإدارة المحتوى والهوية والوسائط.", email: "البريد الإلكتروني", password: "كلمة المرور", submit: "تسجيل الدخول", back: "العودة إلى المنصة", required: "أدخل البريد وكلمة المرور.", invalid: "بيانات الدخول غير صحيحة أو الحساب غير مفعّل." },
    fr: { eyebrow: "ESPACE PRIVÉ", title: "Connexion admin", description: "Connectez-vous pour gérer le contenu, l’identité et les médias.", email: "E-mail", password: "Mot de passe", submit: "Se connecter", back: "Retour à la plateforme", required: "Saisissez l’e-mail et le mot de passe.", invalid: "Identifiants incorrects ou compte non activé." },
    en: { eyebrow: "PRIVATE SPACE", title: "Admin sign in", description: "Sign in to manage content, brand identity, and media.", email: "Email", password: "Password", submit: "Sign in", back: "Back to the platform", required: "Enter your email and password.", invalid: "Invalid credentials or inactive account." },
  }[locale];

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password) return setError(copy.required);
    setBusy(true); setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (authError) return setError(copy.invalid);
    navigate("/admin");
  }

  return <main className="grid min-h-[calc(100vh-76px)] place-items-center bg-[#090909] px-5 py-16 text-white"><div className="grid-lines absolute inset-0 opacity-40"/><section className="glass relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 p-7 shadow-2xl shadow-black/40 sm:p-12"><div className="orb left-[-20%] top-[-30%] h-56 w-56 bg-[#d6b17d]/20"/><div className="relative"><div className="mb-10 flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-full border border-[#d6b17d]/60 text-[#d6b17d]"><LockKeyhole size={19}/></span><span className="eyebrow">إنتاج / ADMIN</span></div><p className="eyebrow mb-5">{copy.eyebrow}</p><h1 className="font-display text-5xl leading-none sm:text-7xl">{copy.title}</h1><p className="mt-6 max-w-md text-sm leading-7 text-[#a6a19a]">{copy.description}</p><form onSubmit={submit} className="mt-10 grid gap-4"><label className="grid gap-2 text-xs text-[#c7c0b7]"><span>{copy.email}</span><input dir="ltr" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#d6b17d]"/></label><label className="grid gap-2 text-xs text-[#c7c0b7]"><span>{copy.password}</span><input dir="ltr" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#d6b17d]"/></label>{error&&<p role="alert" className="text-sm text-[#ee806f]">{error}</p>}<button disabled={busy} className="lumen-btn lumen-btn-primary mt-3 justify-center disabled:cursor-wait disabled:opacity-60">{busy?"…":copy.submit}<ArrowUpRight size={15}/></button></form><Link href="/" className="mt-8 inline-flex text-xs text-[#a6a19a] transition hover:text-white">{copy.back}</Link></div></section></main>;
}
