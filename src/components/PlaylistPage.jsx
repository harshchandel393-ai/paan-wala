import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { playlists } from "../data/songsData";

export default function PlaylistPage({ onSongSelect }) {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
}, []);

  const playlist = playlists.find(
    (item) => item.id === playlistId
  );

  if (!playlist) {
    return (
      <div className="min-h-screen bg-[#160907] px-6 py-20 text-center text-white">
        <h1 className="text-3xl font-bold">
          Playlist nahi mili
        </h1>

        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-full border border-[#60432b] px-6 py-3 text-[#c99a45]"
        >
          ← Back Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#170907] px-5 pb-40 pt-28 text-[#f4e7cf] md:px-10">

      <div className="mx-auto max-w-5xl">

        {/* BACK */}
        <button
          onClick={() => navigate("/")}
          className="mb-10 text-sm text-[#c99a45] transition hover:text-white"
        >
          ← सभी playlists
        </button>


        {/* HEADER */}
        <section className="mb-10 border-b border-[#4d301f] pb-10">

          <div className="min-w-0">

            {/* ENGLISH TITLE */}
            <p className="text-xs tracking-[0.35em] text-[#c99a45]">
              {playlist.nameEn}
            </p>


            {/* MAIN TITLE */}
            <h1 className="mt-3 text-4xl font-bold md:text-6xl">
              {playlist.name}
            </h1>


            {/* DESCRIPTION */}
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b9a58d]">
              {playlist.description}
            </p>


            {/* SONG COUNT */}
            <p className="mt-5 text-xs tracking-[0.25em] text-[#806b58]">
              {playlist.songs.length} SONGS
            </p>

          </div>

        </section>


        {/* SONG LIST */}
        <section>

          {/* TRACKLIST HEADER */}
          <div className="mb-4 flex items-center justify-between px-2">

            <p className="text-xs tracking-[0.3em] text-[#806b58]">
              TRACKLIST
            </p>

            <p className="text-xs text-[#806b58]">
              {playlist.songs.length} songs
            </p>

          </div>


          {/* SONGS */}
          <div className="overflow-hidden rounded-2xl border border-[#3d2418]">

            {playlist.songs.map((song, index) => (

              <button
                key={`${playlist.id}-${song.id}-${index}`}
                onClick={() => {

                  if (onSongSelect) {
                    onSongSelect(playlist.id, index);
                  }

                }}
                className="group flex w-full items-center gap-4 border-b border-[#3d2418] bg-[#1e0d0a] px-4 py-5 text-left transition last:border-b-0 hover:bg-[#2a1410]"
              >

                {/* NUMBER */}
                <span className="w-8 shrink-0 text-sm text-[#806b58]">
                  {String(index + 1).padStart(2, "0")}
                </span>


                {/* PLAY BUTTON */}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#60432b] text-sm text-[#c99a45] transition group-hover:border-[#c99a45] group-hover:bg-[#c99a45] group-hover:text-black">
                  ▶
                </span>


                {/* SONG DETAILS */}
                <div className="min-w-0 flex-1">

                  <h3 className="truncate font-medium text-[#f4e7cf] md:text-base">
                    {song.titleHi || song.title}
                  </h3>

                  <p className="mt-1 truncate text-xs text-[#806b58]">
                    {song.artist}
                    {" • "}
                    {song.movie}
                    {song.year && ` • ${song.year}`}
                  </p>

                </div>


                {/* DURATION */}
                <span className="hidden shrink-0 text-xs text-[#806b58] sm:block">
                  {song.duration}
                </span>

              </button>

            ))}

          </div>

        </section>

      </div>

    </main>
  );
}