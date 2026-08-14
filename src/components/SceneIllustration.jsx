import { motion } from "framer-motion";

/**
 * A hand-painted-style illustration of a night-time Indian street with a
 * traditional paan shop, built entirely from layered SVG shapes so it can
 * scale, recolor and parallax without any raster assets.
 */
export default function SceneIllustration({ yFar = 0, yMid = 0, yBulbs = 0, yBike = 0, ySign = 0, ySeller = 0, yCounter = 0 }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B0503" />
            <stop offset="55%" stopColor="#1C0F0A" />
            <stop offset="100%" stopColor="#2B140C" />
          </linearGradient>
          <linearGradient id="counterWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5A3420" />
            <stop offset="100%" stopColor="#331C10" />
          </linearGradient>
          <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE3A6" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#F2AE4E" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F2AE4E" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="shopGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#E2891E" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E2891E" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="jarGlass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F1E4C8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F1E4C8" stopOpacity="0.08" />
          </linearGradient>
          <filter id="hazeBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* SKY */}
        <rect width="1600" height="1000" fill="url(#sky)" />

        {/* stars */}
        {Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={i}
            cx={(i * 97) % 1600}
            cy={(i * 53) % 260}
            r={i % 5 === 0 ? 1.6 : 0.9}
            fill="#F1E4C8"
            opacity={0.25 + (i % 4) * 0.15}
          />
        ))}

        {/* FAR BUILDING SILHOUETTES (parallax layer 1) */}
        <motion.g style={{ y: yFar }} opacity={0.9}>
          <path
            d="M0 420 L0 260 L60 260 L60 220 L140 220 L140 270 L210 270 L210 200 L260 200 L260 250
               L340 250 L340 180 L420 180 L420 260 L520 260 L520 210 L600 210 L600 270 L700 270
               L700 190 L790 190 L790 260 L880 260 L880 230 L960 230 L960 280 L1050 280 L1050 200
               L1140 200 L1140 260 L1230 260 L1230 210 L1320 210 L1320 270 L1420 270 L1420 230
               L1500 230 L1500 280 L1600 280 L1600 420 Z"
            fill="#241108"
          />
          {/* scattered lit windows on far buildings */}
          {[
            [95, 240], [175, 245], [365, 210], [455, 225], [640, 235],
            [825, 220], [995, 250], [1175, 230], [1355, 240], [1465, 250],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="10" height="14" fill="#E2891E" opacity="0.55" />
          ))}
        </motion.g>

        {/* MID BUILDINGS with jharokha / balconies (parallax layer 2) */}
        <motion.g style={{ y: yMid }}>
          <path
            d="M-20 620 L-20 330 L120 330 L120 300 L140 300 L140 330 L300 330 L300 290 L340 290
               L340 330 L520 330 L520 310 L560 310 L560 330 L760 330 L760 280 L800 280 L800 330
               L980 330 L980 300 L1020 300 L1020 330 L1200 330 L1200 300 L1620 300 L1620 620 Z"
            fill="#301709"
          />
          {/* arched jharokha windows */}
          {[160, 380, 600, 840, 1060].map((x, i) => (
            <g key={i}>
              <path
                d={`M${x} 420 q0 -34 34 -34 q34 0 34 34 v70 h-68 z`}
                fill={i % 2 === 0 ? "#4C2412" : "#241108"}
                stroke="#C99A3B"
                strokeWidth="3"
                opacity="0.9"
              />
              <rect x={x + 10} y={430} width="48" height="55" fill={i % 3 === 0 ? "#E2891E" : "#160B06"} opacity={i % 3 === 0 ? 0.5 : 0.9} />
            </g>
          ))}
          {/* cornice line */}
          <rect x="-20" y="330" width="1640" height="8" fill="#C99A3B" opacity="0.4" />
        </motion.g>

        {/* STRING OF HANGING BULBS across the street */}
        <motion.g style={{ y: yBulbs }}>
          <path
            d="M0 300 Q 400 420 800 320 T 1600 300"
            fill="none"
            stroke="#3A2110"
            strokeWidth="3"
            opacity="0.8"
          />
          {bulbPositions().map((p, i) => (
            <g key={i} className="bulb">
              <circle cx={p.x} cy={p.y} r="18" fill="url(#bulbGlow)" />
              <circle cx={p.x} cy={p.y} r="5.5" fill="#FFE3A6" />
              <line x1={p.x} y1={p.y - 9} x2={p.x} y2={p.y - 2} stroke="#3A2110" strokeWidth="2" />
            </g>
          ))}
        </motion.g>

        {/* SHOP GLOW behind everything close */}
        <ellipse cx="800" cy="700" rx="560" ry="360" fill="url(#shopGlow)" />

        {/* BICYCLE (left, parked) */}
        <g transform="translate(120,760)">
          <motion.g style={{ y: yBike }}>
            <g stroke="#EDE0C4" strokeWidth="5" fill="none" strokeLinecap="round">
              <circle cx="0" cy="70" r="46" opacity="0.85" />
              <circle cx="150" cy="70" r="46" opacity="0.85" />
              <line x1="0" y1="70" x2="70" y2="20" />
              <line x1="70" y1="20" x2="150" y2="70" />
              <line x1="70" y1="20" x2="55" y2="70" />
              <line x1="55" y1="70" x2="0" y2="70" />
              <line x1="70" y1="20" x2="95" y2="0" />
              <line x1="55" y1="70" x2="150" y2="70" />
              <line x1="20" y1="0" x2="95" y2="0" />
            </g>
            <circle cx="0" cy="70" r="3" fill="#EDE0C4" />
            <circle cx="150" cy="70" r="3" fill="#EDE0C4" />
          </motion.g>
        </g>

        {/* SIGNBOARD */}
        <g transform="translate(560,470)">
          <motion.g style={{ y: ySign }}>
            <rect x="-4" y="-6" width="8" height="60" fill="#2A1509" />
            <rect x="480" y="-6" width="8" height="60" fill="#2A1509" />
            <g transform="translate(0,20) rotate(-1.2)">
              <rect x="-10" y="-46" width="500" height="92" fill="#7C2020" stroke="#C99A3B" strokeWidth="4" />
              <rect x="2" y="-34" width="476" height="68" fill="none" stroke="#F1E4C8" strokeWidth="2" opacity="0.5" />
              <text
                x="240"
                y="10"
                textAnchor="middle"
                fontFamily="'Yatra One', serif"
                fontSize="46"
                fill="#F1E4C8"
              >
                पान वाला
              </text>
            </g>
          </motion.g>
        </g>

        {/* PAAN SELLER SILHOUETTE behind counter */}
        <g transform="translate(880,540)">
          <motion.g style={{ y: ySeller }}>
            <path
              d="M0 260 C -6 170 6 100 40 70 C 55 56 85 56 100 70 C 134 100 146 170 140 260 Z"
              fill="#140A06"
            />
            <circle cx="70" cy="45" r="34" fill="#140A06" />
            {/* small cap */}
            <path d="M40 30 Q70 6 100 30 L96 40 Q70 22 44 40 Z" fill="#9C3D2E" />
          </motion.g>
        </g>

        {/* WOODEN COUNTER with jars */}
        <g transform="translate(560,760)">
          <motion.g style={{ y: yCounter }}>
            <rect x="0" y="0" width="600" height="180" fill="url(#counterWood)" />
            <rect x="0" y="0" width="600" height="14" fill="#7C2020" />
            <rect x="0" y="0" width="600" height="180" fill="none" stroke="#241108" strokeWidth="4" />
            {/* plank lines */}
            {[60, 140, 220, 300, 380, 460, 540].map((x, i) => (
              <line key={i} x1={x} y1={14} x2={x} y2={180} stroke="#241108" strokeWidth="2" opacity="0.5" />
            ))}
            {/* jars sitting on counter */}
            {jarLayout().map((jar, i) => (
              <g key={i} transform={`translate(${jar.x},-64)`}>
                <rect x="-16" y="0" width="32" height="64" rx="4" fill="url(#jarGlass)" stroke="#F1E4C8" strokeWidth="1.5" opacity="0.85" />
                <rect x="-18" y="-8" width="36" height="10" fill="#C99A3B" />
                <rect x="-11" y="30" width="22" height="30" fill={jar.color} opacity="0.85" />
              </g>
            ))}
          </motion.g>
        </g>

        {/* FOREGROUND HAZE PUFFS */}
        <g filter="url(#hazeBlur)">
          {[ [260, 830], [520, 800], [900, 820], [1180, 850] ].map(([x, y], i) => (
            <ellipse key={i} className="haze-puff" cx={x} cy={y} rx="60" ry="22" fill="#F1E4C8" opacity="0.05" />
          ))}
        </g>

        {/* FOREGROUND STREET */}
        <rect x="0" y="940" width="1600" height="60" fill="#0C0705" />
      </svg>
    </div>
  );
}


function bulbPositions() {
  const pts = [];
  const total = 14;
  for (let i = 0; i <= total; i++) {
    const t = i / total;
    const x = t * 1600;
    // matches the quadratic-ish path roughly
    const y = 300 + Math.sin(t * Math.PI) * 90;
    pts.push({ x, y });
  }
  return pts;
}

function jarLayout() {
  const colors = ["#7C2020", "#33532F", "#E2891E", "#C99A3B", "#9C3D2E", "#4E7346"];
  const xs = [40, 100, 160, 220, 300, 360, 420, 480, 540];
  return xs.map((x, i) => ({ x, color: colors[i % colors.length] }));
}
