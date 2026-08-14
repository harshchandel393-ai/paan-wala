import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SceneIllustration from "./SceneIllustration";
import { brand } from "../data/content";

export default function Hero() {
  const ref = useRef(null);

  // Live clock
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date());
    };

    updateClock();

    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  const liveTime = currentTime.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yFar = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yBulbs = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yBike = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const ySign = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const ySeller = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const yCounter = useTransform(scrollYProgress, [0, 1], [0, 210]);

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <>
      {/* =========================
          LIVE CLOCK
          ========================= */}
      <div
        style={{
          position: "fixed",
          top: "28px",
          left: "32px",
          zIndex: 999999,
          color: "#f1e4c8",
          fontSize: "14px",
          fontFamily: "inherit",
          fontWeight: "400",
          letterSpacing: "0.12em",
          textShadow: "0 2px 12px rgba(0, 0, 0, 0.9)",
          pointerEvents: "none",
          display: "block",
          visibility: "visible",
          opacity: 1,
        }}
      >
        {liveTime}
      </div>

      {/* =========================
          HERO
          ========================= */}
      <section
        ref={ref}
        className="relative h-[100vh] w-full overflow-hidden bg-night"
      >
        <SceneIllustration
          yFar={yFar}
          yMid={yMid}
          yBulbs={yBulbs}
          yBike={yBike}
          ySign={ySign}
          ySeller={ySeller}
          yCounter={yCounter}
        />

        <div className="vignette" />

        {/* Center hero typography */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-3 font-body text-[0.7rem] uppercase tracking-[0.35em] text-cream-dim"
          >
            {brand.established}
            <span className="mx-2 text-brass">•</span>
            {brand.hours}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.1,
              delay: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-devnag leading-[0.95] text-cream drop-shadow-[0_6px_30px_rgba(226,137,30,0.35)]"
            style={{ fontSize: "clamp(4.5rem, 16vw, 11rem)" }}
          >
            <span className="block">{brand.nameDevanagari[0]}</span>
            <span className="block">{brand.nameDevanagari[1]}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
            className="mt-6 font-devbody text-xl text-marigold-light sm:text-2xl"
          >
            {brand.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-1 font-body text-xs italic text-cream-dim/70"
          >
            {brand.taglineTranslit}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="mt-10 flex flex-col items-center gap-2"
          >
            <span className="h-10 w-[1px] bg-cream-dim/40" />

            <span className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-cream-dim/60">
              scroll
            </span>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}