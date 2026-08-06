import { ReactNode, useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Locale, useLanguage } from "@/contexts/LanguageContext";
import { getSettings } from "@/lib/supabase";

const locales: { value: Locale; label: string }[] = [{ value: "ar", label: "العربية" }, { value: "fr", label: "Français" }, { value: "en", label: "English" }];

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [brandTaps, setBrandTaps] = useState(0);
  const [showAdminEntry, setShowAdminEntry] = useState(false);
  const [settings, setSettings] = useState<{ email?: string; whatsapp?: string; instagram_url?: string; linkedin_url?: string; behance_url?: string; announcement_text?: string; announcement_url?: string; announcement_image_url?: string; announcement_active?: boolean } | null>(null);
  const { locale, setLocale, t } = useLanguage();
  useEffect(() => { getSettings().then(data => setSettings(data || null)).catch(() => setSettings(null)); }, []);
  function handleBrandTap() { const next = brandTaps + 1; setBrandTaps(next); if (next >= 5) setShowAdminEntry(true); window.setTimeout(() => setBrandTaps(0), 1400); }
  const nav = [[t("work"), "/work"], [t("services"), "/services"], [t("journal"), "/journal"], [t("about"), "/about"]] as const;
  return <div className="min-h-screen overflow-x-hidden bg-[#090909] text-[#f4f0e9]">
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[#090909]/70 backdrop-blur-xl">
      <div className="lumen-container flex h-[76px] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => { setOpen(false); handleBrandTap(); }}>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#d6b17d]/70 text-xs font-bold text-[#d6b17d]">إ</span>
          <span className="text-xs font-extrabold tracking-[.18em] md:text-sm">إنتاج<span className="text-[#d6b17d]">/</span>دعاية وإشهار</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">{nav.map(([label, href]) => <Link key={href} href={href} className="text-xs text-[#a6a19a] transition hover:text-white">{label}</Link>)}<LanguagePicker locale={locale} setLocale={setLocale} label={t("language")} /><Link href="/contact" className="lumen-btn lumen-btn-primary ml-1 px-5 py-2.5">{t("contact")} <ArrowUpRight size={14}/></Link>{showAdminEntry&&<Link href="/admin/login" className="text-xs text-[#d6b17d]">{t("admin")}</Link>}</nav>
        <button className="md:hidden" aria-label={t("menu")} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>
      {open && <nav className="glass mx-3 mb-3 grid gap-1 rounded-2xl p-3 md:hidden">{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm text-[#a6a19a] hover:bg-white/10 hover:text-white">{label}</Link>)}<LanguagePicker locale={locale} setLocale={setLocale} label={t("language")} /><Link href="/contact" onClick={() => setOpen(false)} className="lumen-btn lumen-btn-primary mt-2">{t("contact")} <ArrowUpRight size={14}/></Link>{showAdminEntry&&<Link href="/admin/login" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-xs text-[#d6b17d]">{t("admin")}</Link>}</nav>}
    </header>
    <main className="pt-[76px]">{settings?.announcement_active && settings.announcement_text && <div className="border-b border-[#d6b17d]/20 bg-[#d6b17d]/10 px-5 py-3 text-center text-xs text-[#f4f0e9]"><a href={settings.announcement_url || "#"} target={settings.announcement_url ? "_blank" : undefined} rel={settings.announcement_url ? "noreferrer" : undefined} className="inline-flex items-center gap-3">{settings.announcement_image_url && <img src={settings.announcement_image_url} alt="" className="h-7 w-7 rounded-full object-cover"/>}<span>{settings.announcement_text}</span></a></div>}{children}</main>
    <footer className="border-t border-white/10 py-12"><div className="lumen-container flex flex-col justify-between gap-10 md:flex-row"><div><div className="mb-3 text-sm font-extrabold tracking-[.18em]">إنتاج<span className="text-[#d6b17d]">/</span>دعاية وإشهار</div><p className="max-w-xs text-sm leading-7 text-[#a6a19a]">{t("footer")}</p>{settings?.email&&<a href={`mailto:${settings.email}`} className="mt-4 inline-block text-xs text-[#d6b17d]">{settings.email}</a>}{settings?.whatsapp&&<a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g,"")}`} target="_blank" rel="noreferrer" className="mt-2 block text-xs text-[#d6b17d]">WhatsApp</a>}</div><div className="flex flex-wrap gap-6 text-sm text-[#a6a19a]">{settings?.instagram_url&&<a href={settings.instagram_url} target="_blank" rel="noreferrer">Instagram</a>}{settings?.linkedin_url&&<a href={settings.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>}{settings?.behance_url&&<a href={settings.behance_url} target="_blank" rel="noreferrer">Behance</a>}{showAdminEntry&&<Link href="/admin/login">{t("admin")}</Link>}</div></div><div className="lumen-container mt-10 flex justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[.16em] text-[#6f6b66]"><span>{t("copyright")}</span><span>{t("directionNote")}</span></div></footer>
  </div>;
}

function LanguagePicker({ locale, setLocale, label }: { locale: Locale; setLocale: (locale: Locale) => void; label: string }) {
  return <label className="relative flex items-center gap-1 text-[10px] uppercase tracking-[.12em] text-[#a6a19a]" aria-label={label}><select value={locale} onChange={event => setLocale(event.target.value as Locale)} className="appearance-none bg-transparent py-2 pe-5 outline-none"><option value="ar" className="bg-[#111]">AR</option><option value="fr" className="bg-[#111]">FR</option><option value="en" className="bg-[#111]">EN</option></select><ChevronDown size={12} className="pointer-events-none absolute end-0"/></label>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description?: string }) { return <section className="grid-lines relative overflow-hidden border-b border-white/10 py-24 md:py-32"><div className="orb right-[-10%] top-[-30%] h-72 w-72 bg-[#d6b17d]/20"/><div className="lumen-container relative"><p className="eyebrow mb-5">{eyebrow}</p><h1 className="max-w-4xl font-display text-5xl leading-[.98] md:text-8xl">{title}</h1>{description && <p className="mt-7 max-w-xl text-base leading-7 text-[#a6a19a]">{description}</p>}</div></section>; }
