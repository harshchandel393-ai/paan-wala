import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ingredients } from "../data/ingredientsData";
import { paanBuilder } from "../data/content";

export default function PaanBuilder() {
  const [selected, setSelected] = useState([]);
  const [locked, setLocked] = useState(false);

  const toggle = (id) => {
    if (locked) return;
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  const isReady = selected.length > 0;

  return (
    <section className="relative bg-night-2 px-6 py-28 sm:px-10 lg:py-36">
      <div className="absolute inset-0 paper-texture" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* left: controls */}
        <div>
          <p className="font-body text-[0.65rem] uppercase tracking-[0.35em] text-brass">
            <span className="divider-diamond" />CUSTOMISE<span className="divider-diamond" />
          </p>
          <h2 className="mt-4 font-devnag text-4xl text-cream sm:text-5xl">
            {paanBuilder.heading}
          </h2>
          <p className="mt-3 max-w-md font-body text-sm italic text-cream-dim/60">
            {paanBuilder.subheading}
          </p>
          <p className="mt-1 max-w-md font-devbody text-sm text-cream-dim/70">
            {paanBuilder.helper}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ingredients.map((ing) => {
              const active = selected.includes(ing.id);
              return (
                <button
                  key={ing.id}
                  onClick={() => toggle(ing.id)}
                  className={`group relative border px-4 py-3 text-left transition-all duration-300 ${
                    active
                      ? "border-marigold bg-marigold/10"
                      : "border-brass/25 hover:border-brass/60"
                  }`}
                >
                  <span
                    className="mb-1 block h-2 w-2 rounded-full"
                    style={{ backgroundColor: ing.color }}
                  />
                  <span className="block font-devbody text-base text-cream">
                    {ing.label}
                  </span>
                  <span className="block font-body text-[0.6rem] uppercase tracking-[0.15em] text-cream-dim/50">
                    {ing.labelLatin}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex items-center gap-5">
            <button
              disabled={!isReady}
              onClick={() => setLocked(true)}
              className={`px-8 py-3 font-body text-xs uppercase tracking-[0.3em] transition-all duration-300 ${
                isReady
                  ? "bg-marigold text-night hover:bg-marigold-light"
                  : "cursor-not-allowed bg-cream-dim/10 text-cream-dim/40"
              }`}
            >
              {paanBuilder.cta}
            </button>
            {locked && (
              <button
                onClick={() => {
                  setLocked(false);
                  setSelected([]);
                }}
                className="font-body text-xs uppercase tracking-[0.2em] text-cream-dim/60 underline underline-offset-4 hover:text-cream"
              >
                Start over
              </button>
            )}
          </div>

          <AnimatePresence>
            {locked && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 font-devbody text-lg text-marigold-light"
              >
                {paanBuilder.readyText}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* right: illustrated leaf that updates */}
        <div className="flex justify-center">
          <LeafPreview selected={selected} ingredientsList={ingredients} locked={locked} />
        </div>
      </div>
    </section>
  );
}

function LeafPreview({ selected, ingredientsList, locked }) {
  const active = ingredientsList.filter((i) => selected.includes(i.id));

  return (
    <div className="relative">
      <motion.div
        animate={locked ? { scale: [1, 1.06, 1] } : {}}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <svg viewBox="0 0 260 320" className="h-[320px] w-[260px] drop-shadow-[0_10px_40px_rgba(51,83,47,0.4)]">
          <path
            d="M130 8 C220 40 244 150 190 232 C165 268 130 298 130 298 C130 298 95 268 70 232 C16 150 40 40 130 8 Z"
            fill="#33532F"
            stroke="#160B06"
            strokeWidth="2.5"
          />
          <path
            d="M130 24 C130 110 130 210 130 284"
            stroke="#160B06"
            strokeOpacity="0.35"
            strokeWidth="2"
            fill="none"
          />
          {[70, 110, 150, 190].map((y, i) => (
            <path
              key={i}
              d={`M130 ${y} C${110 - i * 3} ${y + 10} ${90 - i * 5} ${y + 22} ${80 - i * 6} ${y + 34} M130 ${y} C${150 + i * 3} ${y + 10} ${170 + i * 5} ${y + 22} ${180 + i * 6} ${y + 34}`}
              stroke="#160B06"
              strokeOpacity="0.22"
              strokeWidth="1.3"
              fill="none"
            />
          ))}

          {/* ingredient dots scattered on leaf, appear as selected */}
          {active.map((ing, i) => {
            const positions = [
              [130, 120], [105, 150], [155, 150], [115, 190], [145, 190], [130, 220],
            ];
            const [cx, cy] = positions[i % positions.length];
            return (
              <motion.circle
                key={ing.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.95 }}
                transition={{ duration: 0.4 }}
                cx={cx}
                cy={cy}
                r={9}
                fill={ing.color}
                stroke="#160B06"
                strokeWidth="1"
              />
            );
          })}

          {locked && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {/* fold flap to suggest a wrapped, ready paan */}
              <path
                d="M80 232 C100 260 130 280 130 280 C130 280 160 260 180 232 C160 250 100 250 80 232 Z"
                fill="#241108"
                opacity="0.5"
              />
            </motion.g>
          )}
        </svg>
      </motion.div>

      {selected.length === 0 && (
        <p className="mt-4 text-center font-body text-xs uppercase tracking-[0.25em] text-cream-dim/40">
          empty leaf — choose an ingredient
        </p>
      )}
    </div>
  );
}
