import { motion } from "framer-motion";
import { story } from "../data/content";

export default function Story() {
  return (
    <section id="story" className="relative overflow-hidden bg-night px-6 py-28 sm:px-10 lg:py-40">
      {/* backdrop texture: faded jharokha arch motif */}
      <svg
        className="pointer-events-none absolute -right-24 top-0 h-full w-[60%] opacity-[0.07]"
        viewBox="0 0 400 800"
      >
        <path
          d="M0 800 V300 Q0 200 100 200 Q200 200 200 300 V800"
          fill="none"
          stroke="#C99A3B"
          strokeWidth="4"
        />
        <path
          d="M120 800 V420 Q120 340 200 340 Q280 340 280 420 V800"
          fill="none"
          stroke="#C99A3B"
          strokeWidth="3"
        />
      </svg>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="font-body text-[0.65rem] uppercase tracking-[0.35em] text-brass">
            <span className="divider-diamond" />OUR STORY<span className="divider-diamond" />
          </p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-6 font-serif text-4xl leading-[1.15] text-cream sm:text-5xl lg:text-[3.4rem]"
          >
            {story.heading[0]}
            <br />
            {story.heading[1]}
          </motion.h2>
          <p className="mt-3 font-body text-sm italic text-cream-dim/60">
            {story.subheading}
          </p>

          <div className="mt-10 space-y-6">
            {story.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="font-devbody text-[1.05rem] leading-relaxed text-cream-dim/90"
              >
                {p}
              </motion.p>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 border-l-2 border-marigold/50 pl-5 font-body text-sm italic text-cream-dim/70"
          >
            {story.englishEcho}
          </motion.p>
        </div>

        {/* pull quote panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col items-center justify-center border border-brass/25 bg-night-2/60 p-10 text-center"
        >
          <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-brass/50" />
          <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-brass/50" />
          <svg viewBox="0 0 80 80" className="mb-6 h-16 w-16 opacity-70">
            <circle cx="40" cy="40" r="38" fill="none" stroke="#C99A3B" strokeWidth="1.5" />
            <path
              d="M40 20 C50 30 50 50 40 60 C30 50 30 30 40 20 Z"
              fill="#33532F"
              stroke="#F1E4C8"
              strokeWidth="1"
            />
          </svg>
          <p className="font-devbody text-xl leading-relaxed text-marigold-light">
            {story.quote}
          </p>
          <p className="mt-4 font-body text-xs uppercase tracking-[0.25em] text-cream-dim/60">
            {story.quoteAttribution}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
