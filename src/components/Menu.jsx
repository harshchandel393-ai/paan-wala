import { motion } from "framer-motion";
import { menuItems } from "../data/menuData";

function PaanIllustration({ leafColor, accent }) {
  return (
    <svg viewBox="0 0 120 140" className="h-24 w-24">
      <path
        d="M60 4 C100 20 112 66 84 104 C74 118 60 128 60 128 C60 128 46 118 36 104 C8 66 20 20 60 4 Z"
        fill={leafColor}
        stroke="#160B06"
        strokeWidth="2"
      />
      <path
        d="M60 14 C60 50 60 90 60 122"
        stroke="#160B06"
        strokeOpacity="0.35"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M60 40 C48 46 40 54 34 62 M60 40 C72 46 80 54 86 62 M60 70 C50 76 42 82 36 90 M60 70 C70 76 78 82 84 90"
        stroke="#160B06"
        strokeOpacity="0.25"
        strokeWidth="1.4"
        fill="none"
      />
      <circle cx="60" cy="96" r="7" fill={accent} opacity="0.9" />
      <circle cx="46" cy="86" r="4" fill={accent} opacity="0.6" />
      <circle cx="74" cy="86" r="4" fill={accent} opacity="0.6" />
    </svg>
  );
}

export default function Menu() {
  return (
    <section id="menu" className="relative bg-night-2 px-6 py-28 sm:px-10 lg:py-36">
      <div className="absolute inset-0 paper-texture" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="font-body text-[0.65rem] uppercase tracking-[0.35em] text-brass">
            <span className="divider-diamond" />THE MENU BOARD<span className="divider-diamond" />
          </p>
          <h2 className="mt-4 font-devnag text-4xl text-cream sm:text-5xl lg:text-6xl">
            हमारे मशहूर पान
          </h2>
          <p className="mt-3 font-body text-sm italic text-cream-dim/70">
            Five leaves, forty years of practice.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative border border-brass/25 bg-night/60 p-6 transition-colors duration-300 hover:border-brass/60"
            >
              {/* corner ornaments */}
              <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-brass/50" />
              <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-brass/50" />

              <div className="flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2">
                <PaanIllustration leafColor={item.leafColor} accent={item.accent} />
              </div>

              <h3 className="mt-4 text-center font-devnag text-2xl text-cream">
                {item.name}
              </h3>
              <p className="text-center font-body text-[0.7rem] uppercase tracking-[0.2em] text-brass/80">
                {item.nameLatin}
              </p>

              <p className="mt-3 text-center font-devbody text-sm text-cream-dim/90">
                {item.description}
              </p>
              <p className="mt-1 text-center font-body text-[0.7rem] italic text-cream-dim/50">
                {item.descLatin}
              </p>

              <div className="mt-5 flex items-center justify-center gap-3">
                <span className="h-[1px] w-8 bg-brass/40" />
                <span className="font-serif text-lg text-marigold-light">{item.price}</span>
                <span className="h-[1px] w-8 bg-brass/40" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
