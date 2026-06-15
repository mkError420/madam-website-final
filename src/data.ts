/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Album, Video, GalleryItem, TourEvent } from './types';

export const ARTIST_INFO = {
  name: "Aria Vance",
  genres: ["Neo-Soul", "Minimalist Indie", "Alternative Pop"],
  bioIntro: "Aria Vance is a modern musical alchemist, fusing the vulnerable, introspective poetry of acoustic indie-folk with the warm, rhythmic undercurrents of classic 70s neo-soul.",
  bioFull: [
    "Born and raised in the misty forests of the Pacific Northwest, Aria Vance began writing songs at the age of twelve, teaching herself classical guitar on her grandmother's vintage Spanish instrument.",
    "Her unique style is defined by spacious vocal textures, subtle rhythmic loops, and an uncompromising dedication to lyrics that read like modernist poetry. Inspired by the likes of Erykah Badu, Bon Iver, and Lianne La Havas, her music operates in the intimate spaces of the quiet hours.",
    "Her debut self-produced EP, 'Quiet Echoes', garnered critical acclaim from independent press in 2025, praised for its 'stunning acoustic arrangements and jaw-dropping vocal clarity'. Following a sold-out intimate acoustic venue tour, Aria released her highly-anticipated full-length sophomore record 'Solitude Sessions' in mid-2026, debuting a richer, neo-soul soundscape centered on custom Fender Rhodes grooves, minimalist drums, and lush ambient vocal choirs.",
    "Aria believes that performance is a sacred dialogue between artist and listener. Currently based in Brooklyn, NY, she splits her time between her compact analog studio and touring historic halls across the globe."
  ],
  pressQuotes: [
    {
      quote: "An arresting blend of neo-soul texture and poetic intimacy. Aria Vance is a singular voice of her generation.",
      source: "The Modern Ear",
      rating: 5
    },
    {
      quote: "Vance constructs majestic sonic cathedrals from nothing but a warm bass line, a whisper, and an acoustic guitar.",
      source: "Pitchway Magazine",
      rating: 5
    },
    {
      quote: "Her live session is a masterclass in minimalist restraint. You could hear a pin drop in the hall, yet the emotional impact was thunderous.",
      source: "Brooklyn Acoustic Beat",
      rating: 4.8
    }
  ],
  socials: {
    spotify: "https://spotify.com",
    appleMusic: "https://apple.com",
    youtube: "https://youtube.com",
    soundcloud: "https://soundcloud.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    bandcamp: "https://bandcamp.com"
  }
};

export const ALBUMS: Album[] = [
  {
    id: "solitude_sessions_2026",
    title: "Solitude Sessions",
    releaseYear: 2026,
    type: "album",
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=600",
    description: "Her groundbreaking sophomore album, exploring themes of growth, separation, and find beauty in stillness, wrapped in lush, late-night analog neo-soul arrangement.",
    tracks: [
      { id: "ss_1", title: "Vesper Hills", duration: "03:45", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", plays: "184,204", lyrics: "Vesper hills in the failing light / Shadows dance across the quiet height / Hold your breath and let the rhythm take / All the promises we couldn't make..." },
      { id: "ss_2", title: "Rhodes & Rust", duration: "04:12", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", plays: "142,098", lyrics: "Dust on the keys, vintage gold / Tales that the old Rhodes told / Rust in the gears, warmth in the tone / Singing to the cold stone..." },
      { id: "ss_3", title: "Subtle Indigo", duration: "03:18", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", plays: "98,450", lyrics: "Indigo skies on a Tuesday night / Falling inside of a neon light / Speak in a voice that is low and true / Everything circles back to you..." },
      { id: "ss_4", title: "Chasing the Lows", duration: "04:55", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", plays: "76,120", lyrics: "We were chasing the lows, down by the bay / Watching the memories wither away / Minimal bass on a four-on-the-floor / Nobody knocking at the studio door..." },
      { id: "ss_5", title: "Glass Harbor", duration: "03:32", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", plays: "115,640", lyrics: "Reflections in the glass, high tide rising / Silver linings that are compromising / Docked in the Harbor, safe from the storm / Waiting for the sea breeze to keep us warm..." }
    ],
    streaming: {
      spotify: "https://open.spotify.com",
      appleMusic: "https://music.apple.com",
      youtubeMusic: "https://music.youtube.com",
      bandcamp: "https://bandcamp.com",
      soundcloud: "https://soundcloud.com"
    }
  },
  {
    id: "quiet_echoes_2025",
    title: "Quiet Echoes",
    releaseYear: 2025,
    type: "EP",
    coverUrl: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?auto=format&fit=crop&q=80&w=600",
    description: "Aria's debut EP, recorded live in an old timber cabin. Features raw acoustic guitar, intimate woodwind guest features, and evocative vocal harmonies.",
    tracks: [
      { id: "qe_1", title: "Timber Hearth", duration: "02:58", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", plays: "312,401", lyrics: "Log by log, feed the flame / Whispering a forgotten name / Cracking spruce and heavy snow / Deep in the woods where the echoes go..." },
      { id: "qe_2", title: "Silver Pines", duration: "03:24", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", plays: "245,391", lyrics: "Silver pines and frozen roots / Walking around in heavy boots / Winter wind is starting to bite / Keep me safe through the frozen night..." },
      { id: "qe_3", title: "Wind & Wire", duration: "04:02", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", plays: "189,451", lyrics: "Fingers brushing against the steel / Finding out if the love is real / Wind in the wires, hum on the line / Hoping your heart connects with mine..." }
    ],
    streaming: {
      spotify: "https://open.spotify.com",
      bandcamp: "https://bandcamp.com",
      soundcloud: "https://soundcloud.com"
    }
  },
  {
    id: "velvet_skies_2024",
    title: "Velvet Skies",
    releaseYear: 2024,
    type: "single",
    coverUrl: "https://images.unsplash.com/photo-1446057032654-9d8885b7511a?auto=format&fit=crop&q=80&w=600",
    description: "A standalone break-out single that captured global playlist attention. A moody, atmospheric ballad driven by a solitary cello and acoustic nylon bass.",
    tracks: [
      { id: "vs_1", title: "Velvet Skies", duration: "03:51", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", plays: "1,204,490", lyrics: "Velvet skies closing down / Over the noise of this velvet town / One more drink, one more sigh / Let the clouds roll across the sky..." }
    ],
    streaming: {
      spotify: "https://open.spotify.com",
      appleMusic: "https://music.apple.com",
      soundcloud: "https://soundcloud.com"
    }
  }
];

export const VIDEOS: Video[] = [
  {
    id: "vid_1",
    title: "Vesper Hills (Official Music Video)",
    type: "music-video",
    embedId: "q6g0X4HRExE", // Mock id for styling and simulated embedding
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
    duration: "03:52",
    releaseYear: 2026,
    description: "An evocative, shadow-filled cinematic journey shot on Super 8 film along the rugged, misty coastlines of Oregon. Directing assistance by Julian Cole."
  },
  {
    id: "vid_2",
    title: "Timber Hearth (Live at the Chapel Sessions)",
    type: "live-session",
    embedId: "L8S3_P0G_7E",
    thumbnailUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800",
    duration: "03:15",
    releaseYear: 2025,
    description: "Recorded live at the historic St. Jude Chapel in New York. Features a solo performance with Aria Vance on acoustic guitar under a single high-contrast window beam."
  },
  {
    id: "vid_3",
    title: "Rhodes & Rust (Behind the Album Documentary)",
    type: "behind-the-scenes",
    embedId: "X_S_U3g_82",
    thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
    duration: "08:44",
    releaseYear: 2026,
    description: "An intimate look into Aria's Brooklyn home recording studio, showcasing her process of restoring old keyboards, mic arrangements, and vocal layering styles."
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal_1",
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800",
    caption: "Aria Vance press portrait, London, 2026",
    category: "editorial",
    aspectRatio: "portrait"
  },
  {
    id: "gal_2",
    url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800",
    caption: "Performing live at the Bowery Ballroom, April 2026",
    category: "stage",
    aspectRatio: "landscape"
  },
  {
    id: "gal_3",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800",
    caption: "Reverberation lights at El Rey Theatre, Los Angeles, 2026",
    category: "stage",
    aspectRatio: "landscape"
  },
  {
    id: "gal_4",
    url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
    caption: "Laying down tracks for Solitude Sessions, Brooklyn, 2026",
    category: "studio",
    aspectRatio: "square"
  },
  {
    id: "gal_5",
    url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800",
    caption: "Aria's faithful acoustic nylon companion backstage",
    category: "backstage",
    aspectRatio: "portrait"
  },
  {
    id: "gal_6",
    url: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=800",
    caption: "Behind the curtain minutes before taking the stage",
    category: "backstage",
    aspectRatio: "landscape"
  },
  {
    id: "gal_7",
    url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800",
    caption: "Analog inspirations: tapes, notes, and vintage warmths",
    category: "studio",
    aspectRatio: "square"
  }
];

export const TOUR_DATES: TourEvent[] = [
  {
    id: "tour_1",
    date: "2026-07-10",
    venue: "Bowery Ballroom",
    city: "New York, NY",
    country: "USA",
    status: "available",
    ticketUrl: "#"
  },
  {
    id: "tour_2",
    date: "2026-07-12",
    venue: "Lincoln Theatre",
    city: "Washington, D.C.",
    country: "USA",
    status: "available",
    ticketUrl: "#"
  },
  {
    id: "tour_3",
    date: "2026-07-16",
    venue: "The Sinclair",
    city: "Boston, MA",
    country: "USA",
    status: "sold-out",
    ticketUrl: "#"
  },
  {
    id: "tour_4",
    date: "2026-07-22",
    venue: "Union Transfer",
    city: "Philadelphia, PA",
    country: "USA",
    status: "available",
    ticketUrl: "#"
  },
  {
    id: "tour_5",
    date: "2026-08-04",
    venue: "The Royal Albert Hall (Elgar Room)",
    city: "London",
    country: "UK",
    status: "available",
    ticketUrl: "#"
  },
  {
    id: "tour_6",
    date: "2026-08-08",
    venue: "La Maroquinerie",
    city: "Paris",
    country: "France",
    status: "available",
    ticketUrl: "#"
  },
  {
    id: "tour_7",
    date: "2026-08-11",
    venue: "Sidney Myer Music Bowl",
    city: "Melbourne",
    country: "Australia",
    status: "past"
  },
  {
    id: "tour_8",
    date: "2026-08-14",
    venue: "Soda Club Acoustic",
    city: "San Francisco, CA",
    country: "USA",
    status: "past"
  }
];
