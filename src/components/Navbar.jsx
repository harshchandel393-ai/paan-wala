import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { nav } from "../data/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay: 0.1,
      }}
      className={`fixed top-0 z-50 flex w-full items-center justify-end px-6 py-5 transition-all duration-500 sm:px-10 ${
        scrolled
          ? "bg-night/70 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      {/* NAVIGATION */}
      <nav className="flex items-center gap-4 font-body text-[0.65rem] uppercase tracking-[0.25em] text-cream sm:gap-8 sm:text-xs">
        {nav.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="relative pb-1 opacity-90 transition hover:opacity-100 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-marigold after:transition-all after:duration-300 hover:after:w-full"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </motion.header>
  );
}