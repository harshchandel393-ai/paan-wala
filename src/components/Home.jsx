import React, { useEffect, useState } from "react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const liveTime = currentTime.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <main className="w-full bg-black overflow-hidden">
      <section
        id="home"
        className="relative w-full overflow-hidden bg-black"
      >
        {/* LIVE TIME */}
        <div
          className="absolute top-6 left-8 z-[9999] sm:top-6 sm:left-8"
          style={{
            color: "#f1e4c8",
            fontSize: "14px",
            letterSpacing: "0.12em",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            pointerEvents: "none",
          }}
        >
          {liveTime}
        </div>

        {/* HERO IMAGE */}
        <img
          src="/paan-wala-hero.png"
          alt="Paan Ki Dukaan"
          className="block w-full h-auto object-contain object-top"
        />

        {/* SUBTLE DARK GRADIENT */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:h-32 bg-gradient-to-t from-black/50 to-transparent" />
      </section>
    </main>
  );
}