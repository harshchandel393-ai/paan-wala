# पान वाला — Paan Wala

A cinematic, illustrated one-page website for a fictional traditional Indian paan shop.
Built with React + Vite + Tailwind CSS v4 + Framer Motion + Lucide icons.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  data/
    content.js          → all site copy (hero, story, location, footer text)
    menuData.js          → the 5 paan menu items (name, description, price, colors)
    ingredientsData.js   → ingredients for the "Build your own paan" section
  components/
    Navbar.jsx            → transparent top navigation + live "online" indicator
    Hero.jsx              → full-screen hero with parallax scene + big Devanagari title
    SceneIllustration.jsx → the layered SVG night-bazaar illustration (signboard, jars,
                             seller, bicycle, bulbs, buildings) with scroll parallax
    MusicPlayer.jsx        → floating glass-style audio player (UI only, no real audio wired up)
    Menu.jsx                → vintage menu-board style paan cards
    Story.jsx               → editorial storytelling section
    PaanBuilder.jsx          → interactive "build your own paan" leaf builder
    Location.jsx              → illustrated map + address + hours
    Footer.jsx                 → closing footer
```

To edit any text on the site, edit the files inside `src/data/` — no component code
needs to change for copy edits, new menu items, or new ingredients.

## Notes

- All illustration is hand-built from SVG shapes/gradients (no external image assets),
  so it stays crisp at any size and can be recolored via the CSS variables in `src/index.css`.
- The music player is a UI shell — wire up a real `<audio>` element or streaming
  service if you want actual playback.
- Colors, fonts and other design tokens are defined in `src/index.css` under `@theme`.
