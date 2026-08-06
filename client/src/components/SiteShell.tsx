import { ReactNode, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Menu, X } from "lucide-react";

const nav = [
  ["Work", "/work"], ["Services", "/services"], ["Journal", "/journal"], ["About", "/about"],
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen overflow-x-hidden bg-[#090909] text-[#f4f0e9]">
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[#090909]/70 backdrop-blur-xl">
      <div className="lumen-container flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#d6b17d]/70 text-xs font-bold text-[#d6b17d]">L</span>
          <span className="text-sm font-extrabold tracking-[.22em]">LUMEN<span className="text-[#d6b17d]">/</span>STUDIO</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">{nav.map(([label, href]) => <Link key={href} href={href} className="text-xs text-[#a6a19a] transition hover:text-white">{label}</Link>)}<Link href="/contact" className="lumen-btn lumen-btn-primary ml-3 px-5 py-2.5">Start a project <ArrowUpRight size={14}/></Link></nav>
        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>
      {open && <nav className="glass mx-3 mb-3 grid gap-1 rounded-2xl p-3 md:hidden">{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm text-[#a6a19a] hover:bg-white/10 hover:text-white">{label}</Link>)}<Link href="/contact" onClick={() => setOpen(false)} className="lumen-btn lumen-btn-primary mt-2">Start a project <ArrowUpRight size={14}/></Link></nav>}
    </header>
    <main className="pt-[76px]">{children}</main>
    <footer className="border-t border-white/10 py-12"><div className="lumen-container flex flex-col justify-between gap-10 md:flex-row"><div><div className="mb-3 text-sm font-extrabold tracking-[.22em]">LUMEN<span className="text-[#d6b17d]">/</span>STUDIO</div><p className="max-w-xs text-sm leading-7 text-[#a6a19a]">Independent creative production for brands that want to be remembered.</p></div><div className="flex gap-10 text-sm text-[#a6a19a]"><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://vimeo.com" target="_blank" rel="noreferrer">Vimeo</a><Link href="/admin">Admin</Link></div></div><div className="lumen-container mt-10 flex justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[.16em] text-[#6f6b66]"><span>© 2026 Lumen Studio</span><span>Stories with a pulse.</span></div></footer>
  </div>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description?: string }) { return <section className="grid-lines relative overflow-hidden border-b border-white/10 py-24 md:py-32"><div className="orb right-[-10%] top-[-30%] h-72 w-72 bg-[#d6b17d]/20"/><div className="lumen-container relative"><p className="eyebrow mb-5">{eyebrow}</p><h1 className="max-w-4xl font-display text-5xl leading-[.98] md:text-8xl">{title}</h1>{description && <p className="mt-7 max-w-xl text-base leading-7 text-[#a6a19a]">{description}</p>}</div></section>; }
