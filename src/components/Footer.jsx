import { footer, nav } from "../data/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-brass/20 bg-night px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <p className="font-devnag text-2xl text-cream">{footer.line1}</p>
        <p className="font-body text-xs italic text-cream-dim/60">{footer.line2}</p>

        <div className="mt-2 flex gap-6 font-body text-[0.65rem] uppercase tracking-[0.25em] text-cream-dim/70">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-marigold-light">
              {l.label}
            </a>
          ))}
        </div>

        <p className="mt-6 font-body text-[0.6rem] uppercase tracking-[0.2em] text-cream-dim/40">
          {footer.credit}
        </p>
      </div>
    </footer>
  );
}
