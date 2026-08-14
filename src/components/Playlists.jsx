import React from "react";
import { useNavigate } from "react-router-dom";
import { playlists } from "../data/songsData";

const playlistInfo = {
  romantic: {
    title: "सफ़र का साथी",
    subtitle: "SAFAR KA SAATHI",
    description:
      "लंबे सफ़र, हाईवे और खिड़की के बाहर बदलते रास्तों के लिए पुराने नग़मे।",
  },

  dance: {
    title: "महफ़िल जमेगी",
    subtitle: "MEHFIL JAMEGI",
    description:
      "मस्ती, डांस, शादी और दोस्तों के साथ जमने वाली पुरानी यादों की धुनें।",
  },

  classics: {
    title: "दिल थोड़ा उदास है",
    subtitle: "DIL THODA UDAAS HAI",
    description:
      "धीमे, दर्द भरे और दिल को छू जाने वाले गाने — उन शामों के लिए जब यादें लौट आती हैं।",
  },

  melody: {
    title: "पान वाले की पसंद",
    subtitle: "PAAN WALE KI PASAND",
    description:
      "पान की दुकान की अपनी खास पसंद — वो गाने जो महफ़िल को पूरा करते हैं।",
  },
};

export default function Playlists() {
  const navigate = useNavigate();

  return (
    <section
      id="playlists"
      className="relative overflow-hidden bg-[#170907] px-6 py-24 text-[#f5ead7]"
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#c6923e]/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-14">
          <p className="mb-3 text-xs font-medium tracking-[0.4em] text-[#b99655]">
            PAAN WALA RADIO
          </p>

          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-bold leading-tight md:text-6xl">
                अपनी धुन चुनिए
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#b9a894] md:text-base">
                हर सफ़र, हर शाम और हर महफ़िल के लिए एक अलग धुन।
                पुराने गानों की हमारी खास playlists में से चुनिए।
              </p>
            </div>

            <div className="hidden text-right md:block">
              <p className="text-3xl font-semibold text-[#d6a653]">
                {playlists.length}
              </p>

              <p className="text-xs tracking-[0.25em] text-[#8f765e]">
                PLAYLISTS
              </p>
            </div>
          </div>
        </div>


        {/* Playlist Cards */}
        <div className="grid gap-5 md:grid-cols-2">

          {playlists.map((playlist, index) => {
            const info = playlistInfo[playlist.id];

            if (!info) return null;

            return (
              <button
                key={playlist.id}
                onClick={() =>
                  navigate(`/playlists/${playlist.id}`)
                }
                className="group relative overflow-hidden rounded-3xl border border-[#4d301f] bg-[#24100d] p-7 text-left transition-all duration-500 hover:-translate-y-2 hover:border-[#c6923e]/70 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
              >

                {/* Background number */}
                <span className="pointer-events-none absolute -right-2 -top-8 text-[150px] font-bold leading-none text-[#c6923e]/5 transition-all duration-500 group-hover:text-[#c6923e]/10">
                  0{index + 1}
                </span>


                {/* Top */}
                <div className="relative flex items-start justify-end">

                  <span className="rounded-full border border-[#60402c] px-3 py-1 text-[10px] tracking-[0.2em] text-[#8f765e]">
                    {playlist.songs.length} SONGS
                  </span>

                </div>


                {/* Content */}
                <div className="relative mt-8">

                  <h3 className="text-3xl font-bold text-[#f5ead7] transition-colors duration-300 group-hover:text-[#d6a653]">
                    {info.title}
                  </h3>

                  <p className="mt-2 text-xs tracking-[0.28em] text-[#c6923e]">
                    {info.subtitle}
                  </p>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-[#b9a894]">
                    {info.description}
                  </p>

                </div>


                {/* Bottom */}
                <div className="relative mt-7 flex items-center justify-between border-t border-[#4d301f] pt-5">

                  <span className="text-xs tracking-[0.2em] text-[#806953]">
                    PAAN WALA RADIO
                  </span>

                  <span className="flex items-center gap-2 text-sm font-medium text-[#d6a653] transition-all duration-300 group-hover:gap-4">
                    सुनें
                    <span>→</span>
                  </span>

                </div>

              </button>
            );
          })}

        </div>


        {/* Bottom line */}
        <div className="mt-10 flex items-center justify-center gap-4 text-[#806953]">

          <span className="h-px w-16 bg-[#60402c]" />

          <span className="text-xs tracking-[0.3em]">
            पुरानी धुनें • नई यादें
          </span>

          <span className="h-px w-16 bg-[#60402c]" />

        </div>

      </div>
    </section>
  );
}