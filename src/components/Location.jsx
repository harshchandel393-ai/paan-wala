import { motion } from "framer-motion";
import { MapPin, Clock, ArrowUpRight } from "lucide-react";
import { location } from "../data/content";

export default function Location() {
  return (
    <section id="location" className="relative overflow-hidden bg-night px-6 py-28 sm:px-10 lg:py-36">
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* illustrated map */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative border border-brass/25 bg-night-2/50 p-2"
        >
          <svg viewBox="0 0 500 420" className="h-auto w-full">
            <rect width="500" height="420" fill="#1D1109" />
            {/* streets */}
            <path d="M0 120 H500 M0 260 H500 M120 0 V420 M320 0 V420" stroke="#3A2110" strokeWidth="8" />
            <path d="M0 190 Q250 140 500 200" stroke="#C99A3B" strokeOpacity="0.4" strokeWidth="3" fill="none" strokeDasharray="6 6" />
            {/* building blocks */}
            {[[30, 20, 70, 80], [160, 20, 130, 80], [340, 20, 130, 80], [30, 150, 70, 90], [340, 150, 130, 90], [30, 290, 70, 100], [160, 150, 130, 90], [160, 290, 130, 100], [340, 290, 130, 100]].map(
              ([x, y, w, h], i) => (
                <rect key={i} x={x} y={y} width={w} height={h} fill="#2A1509" stroke="#160B06" strokeWidth="2" opacity={0.9} />
              )
            )}
            {/* marker */}
            <motion.g
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <circle cx="250" cy="195" r="16" fill="#E2891E" opacity="0.25" />
              <path
                d="M250 165 C266 165 278 177 278 193 C278 213 250 235 250 235 C250 235 222 213 222 193 C222 177 234 165 250 165 Z"
                fill="#9C3D2E"
                stroke="#F1E4C8"
                strokeWidth="2"
              />
              <circle cx="250" cy="192" r="7" fill="#F1E4C8" />
            </motion.g>
          </svg>
        </motion.div>

        {/* info */}
        <div>
          <p className="font-body text-[0.65rem] uppercase tracking-[0.35em] text-brass">
            <span className="divider-diamond" />VISIT US<span className="divider-diamond" />
          </p>
          <h2 className="mt-4 font-devnag text-4xl text-cream sm:text-5xl">
            {location.heading}
          </h2>
          <p className="mt-3 font-body text-sm italic text-cream-dim/60">
            {location.subheading}
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 text-marigold" size={20} />
              <div>
                <p className="font-devbody text-lg text-cream">{location.address[0]}</p>
                <p className="font-devbody text-lg text-cream">{location.address[1]}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="mt-1 text-marigold" size={20} />
              <p className="font-devbody text-lg text-cream">{location.hours}</p>
            </div>
          </div>

          <a
            href={location.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 border border-brass/40 px-8 py-3 font-body text-xs uppercase tracking-[0.3em] text-cream transition-all duration-300 hover:border-marigold hover:bg-marigold hover:text-night"
          >
            {location.cta}
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}
