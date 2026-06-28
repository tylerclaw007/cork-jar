/* Cork Jar: gallery manifest (real photographs by Tyler Law)
   ------------------------------------------------------------------
   To add or swap photos later:
   1. Drop the file into assets/photos/<category>/
   2. Add or edit an entry below (src, title, year, span, ratio).
   span  = grid width: col-4 / col-5 / col-6 / col-7 / col-8
   ratio = shape: row-tall / row-wide / row-square / row-portrait
   ------------------------------------------------------------------ */

(function () {
  window.CJ_GALLERY = {
    "street-editorial": [
      {
        src: "assets/photos/street-editorial/reflection-peacock.jpg",
        title: "Self, Reflected",
        year: "2024",
        span: "col-7",
        ratio: "row-wide",
      },
      {
        src: "assets/photos/street-editorial/ramen-sign.jpg",
        title: "Tatsunoya",
        year: "2024",
        span: "col-5",
        ratio: "row-tall",
      },
      {
        src: "assets/photos/street-editorial/night-flock.jpg",
        title: "Paper Flock",
        year: "2025",
        span: "col-5",
        ratio: "row-tall",
      },
      {
        src: "assets/photos/street-editorial/hong-kong-walkup.jpg",
        title: "Density",
        year: "2024",
        span: "col-7",
        ratio: "row-wide",
      },
      {
        src: "assets/photos/street-editorial/courtyard-lamp.jpg",
        title: "One Lamp",
        year: "2024",
        span: "col-7",
        ratio: "row-wide",
      },
      {
        src: "assets/photos/street-editorial/brick-alley.jpg",
        title: "The Long Way Home",
        year: "2024",
        span: "col-5",
        ratio: "row-tall",
      },
      {
        src: "assets/photos/street-editorial/main-street-dusk.jpg",
        title: "Closing Time",
        year: "2025",
        span: "col-7",
        ratio: "row-wide",
      },
      {
        src: "assets/photos/street-editorial/neon-night.jpg",
        title: "Yangshuo Nights",
        year: "2025",
        span: "col-5",
        ratio: "row-wide",
      },
      {
        src: "assets/photos/street-editorial/old-town-crowd.jpg",
        title: "Sunday Crowd",
        year: "2024",
        span: "col-6",
        ratio: "row-wide",
      },
    ],
    "landscape-travel": [
      {
        src: "assets/photos/landscape-travel/arch-bridge-dusk.jpg",
        title: "Stone & Lantern",
        year: "2025",
        span: "col-5",
        ratio: "row-tall",
      },
      {
        src: "assets/photos/landscape-travel/lone-bird.jpg",
        title: "One Bird, Whole Sky",
        year: "2025",
        span: "col-7",
        ratio: "row-wide",
      },
      {
        src: "assets/photos/landscape-travel/stilt-house.jpg",
        title: "House on Water",
        year: "2024",
        span: "col-5",
        ratio: "row-tall",
      },
      {
        src: "assets/photos/landscape-travel/garden-arch.jpg",
        title: "Bloom Walk",
        year: "2024",
        span: "col-7",
        ratio: "row-wide",
      },
      {
        src: "assets/photos/landscape-travel/still-boats.jpg",
        title: "Still Water",
        year: "2024",
        span: "col-5",
        ratio: "row-portrait",
      },
      {
        src: "assets/photos/landscape-travel/canal-night.jpg",
        title: "After Dark, Canal",
        year: "2025",
        span: "col-7",
        ratio: "row-wide",
      },
      {
        src: "assets/photos/landscape-travel/temple-night.jpg",
        title: "Temple, Lit",
        year: "2025",
        span: "col-5",
        ratio: "row-portrait",
      },
      {
        src: "assets/photos/landscape-travel/beach-dusk.jpg",
        title: "Last Light",
        year: "2024",
        span: "col-7",
        ratio: "row-wide",
      },
    ],
    architecture: [
      {
        src: "assets/photos/architecture/minimal-facade.jpg",
        title: "Negative Space",
        year: "2024",
        span: "col-4",
        ratio: "row-tall",
      },
      {
        src: "assets/photos/architecture/tower-arch.jpg",
        title: "Through the Arch",
        year: "2024",
        span: "col-4",
        ratio: "row-tall",
      },
      {
        src: "assets/photos/architecture/dome-through-trees.jpg",
        title: "Civic",
        year: "2024",
        span: "col-4",
        ratio: "row-tall",
      },
      {
        src: "assets/photos/architecture/yellow-lines.jpg",
        title: "Double Yellow",
        year: "2024",
        span: "col-6",
        ratio: "row-square",
      },
      {
        src: "assets/photos/architecture/wrong-way.jpg",
        title: "Wrong Way",
        year: "2024",
        span: "col-6",
        ratio: "row-wide",
      },
      {
        src: "assets/photos/architecture/white-roses.jpg",
        title: "White Roses",
        year: "2023",
        span: "col-6",
        ratio: "row-wide",
      },
    ],
  };

  // Featured edit for the homepage (a tight, varied selection)
  window.CJ_FEATURED = [
    {
      src: "assets/photos/landscape-travel/arch-bridge-dusk.jpg",
      title: "Stone & Lantern",
      meta: "Travel",
      span: "col-5",
      ratio: "row-portrait",
    },
    {
      src: "assets/photos/landscape-travel/lone-bird.jpg",
      title: "One Bird, Whole Sky",
      meta: "Landscape",
      span: "col-7",
      ratio: "row-wide",
    },
    {
      src: "assets/photos/street-editorial/main-street-dusk.jpg",
      title: "Closing Time",
      meta: "Street",
      span: "col-7",
      ratio: "row-wide",
    },
    {
      src: "assets/photos/street-editorial/night-flock.jpg",
      title: "Paper Flock",
      meta: "Editorial",
      span: "col-5",
      ratio: "row-portrait",
    },
    {
      src: "assets/photos/landscape-travel/stilt-house.jpg",
      title: "House on Water",
      meta: "Travel",
      span: "col-5",
      ratio: "row-portrait",
    },
    {
      src: "assets/photos/street-editorial/reflection-peacock.jpg",
      title: "Self, Reflected",
      meta: "Street",
      span: "col-7",
      ratio: "row-wide",
    },
  ];

  // Prints available to collect (best wall pieces)
  window.CJ_PRINTS = [
    {
      src: "assets/photos/landscape-travel/arch-bridge-dusk.jpg",
      title: "Stone & Lantern",
      edition: "Edition of 25",
      price: "from $85",
      ratio: "row-portrait",
    },
    {
      src: "assets/photos/landscape-travel/lone-bird.jpg",
      title: "One Bird, Whole Sky",
      edition: "Edition of 25",
      price: "from $85",
      ratio: "row-portrait",
    },
    {
      src: "assets/photos/landscape-travel/stilt-house.jpg",
      title: "House on Water",
      edition: "Edition of 50",
      price: "from $65",
      ratio: "row-portrait",
    },
    {
      src: "assets/photos/architecture/tower-arch.jpg",
      title: "Through the Arch",
      edition: "Edition of 25",
      price: "from $85",
      ratio: "row-portrait",
    },
    {
      src: "assets/photos/landscape-travel/still-boats.jpg",
      title: "Still Water",
      edition: "Edition of 50",
      price: "from $65",
      ratio: "row-portrait",
    },
    {
      src: "assets/photos/street-editorial/neon-night.jpg",
      title: "Yangshuo Nights",
      edition: "Open edition",
      price: "from $45",
      ratio: "row-portrait",
    },
  ];

  // LUT / preset packs. The before/after uses the same real frame; the
  // "before" side is flattened with a CSS filter to show the grade.
  window.CJ_LUTS = [
    {
      name: "Cork Jar: Daylight",
      desc: "Warm, faded film tone for daylight, gardens and travel. The everyday pack.",
      frames: 6,
      price: "$24",
      before: "assets/photos/landscape-travel/garden-arch.jpg",
      after: "assets/photos/landscape-travel/garden-arch.jpg",
    },
    {
      name: "Cork Jar: Nightfall",
      desc: "Moody low-light grade for street and neon. Lifts shadows, keeps the glow.",
      frames: 6,
      price: "$24",
      before: "assets/photos/street-editorial/neon-night.jpg",
      after: "assets/photos/street-editorial/neon-night.jpg",
    },
    {
      name: "Cork Jar: Blue Hour",
      desc: "Cool, cinematic tone for dusk, water and architecture. My signature look.",
      frames: 8,
      price: "$29",
      before: "assets/photos/landscape-travel/arch-bridge-dusk.jpg",
      after: "assets/photos/landscape-travel/arch-bridge-dusk.jpg",
    },
  ];
})();
