import type { WeddingData } from "@/types/wedding";

/**
 * Every piece of copy, name and image on the site comes from this file.
 * To personalise the invitation, edit here only - no component hardcodes wedding content.
 *
 * ---------------------------------------------------------------------------
 * PHOTOGRAPHS
 * ---------------------------------------------------------------------------
 * The couple's real photographs live in `public/images/` and are referenced
 * through `photo()`. Two square, face-centred crops - `groom-portrait.jpg` and
 * `bride-portrait.jpg`, cut from 8.jpeg and 3.jpeg - back the circular frames
 * in the hero and the couple section, where the full-length originals would
 * leave the faces too small to read at 288px across.
 *
 * The groom's side - parents, siblings, uncle, aunt and bua - uses their own
 * photographs from `public/images/groom-family/`. The bride's relatives still
 * use `portrait()` headshots: no photographs of them were supplied. Drop real
 * ones in `public/images/` and swap the value - nothing else needs to change.
 *
 * ---------------------------------------------------------------------------
 * FOCUS POINTS
 * ---------------------------------------------------------------------------
 * Every supplied photograph but one is tall, and the layout crops photos into
 * circles, 16:10 event cards and masonry cells. `focus` is a CSS
 * `object-position` deciding which slice of a tall frame survives that crop -
 * it is what keeps faces inside the visible band instead of being cut off at
 * the chin. Omitting it falls back to a plain centre crop; tune a value if a
 * crop ever looks off.
 *
 * If an image ever fails to load, `WeddingImage` swaps in a local floral
 * placeholder, so the layout never breaks.
 */

/** A photograph from `public/images/`. */
const photo = (name: string) => `/images/${name}`;

/** A portrait headshot, used for relatives. `n` selects the face (1-70). */
const portrait = (n: number, size = 600) => `https://i.pravatar.cc/${size}?img=${n}`;

export const weddingData: WeddingData = {
  hashtag: "#PranjalWedsShriya",
  dateRange: "24 November 2026",
  countdownTarget: "2026-11-24T18:00:00+05:30",

  invitationMessage:
    "joyfully request the pleasure of your gracious presence, with family and friends, at the wedding of their beloved son",
  finalInvitationMessage:
    "With hearts full of happiness and families full of blessings, we invite you to join us as we celebrate the beginning of a beautiful new chapter.",

  groom: {
    name: "Pranjal Singh",
    shortName: "Pranjal",
    title: "The Groom",
    father: "Kamlesh Singh",
    mother: "Lalita Singh",
    address: "Santrabadi, Durg, Chhattisgarh – 491001",
    bio: "Born and raised in Raipur, Pranjal is an architect who believes every good building — like every good marriage — begins with a strong foundation. He loves early morning chai, old Hindi film music, and making his family laugh at the dinner table.",
    // Square face crop of 8.jpeg - the circular hero frame is only ~288px wide,
    // so the full-length original would render his face barely legible.
    image: photo("groom-portrait.jpg"),
    alt: "Portrait of Pranjal Singh, the groom, in his wine sherwani",
    gallery: [
      {
        // 3:4 original - fills the showcase's 3:4 hero frame with no crop at all.
        src: photo("8.jpeg"),
        alt: "Pranjal Singh standing in a deep wine embroidered sherwani",
        caption: "The Sherwani",
      },
      {
        src: photo("11.jpeg"),
        alt: "Pranjal Singh laughing with Shriya as they walk in hand in hand",
        caption: "That Smile",
        focus: "50% 22%",
      },
      {
        src: photo("7.jpeg"),
        alt: "Pranjal Singh leading Shriya into the hall through the smoke",
        caption: "The Grand Entry",
        focus: "50% 0%",
      },
      {
        src: photo("13.jpeg"),
        alt: "Pranjal Singh looking at Shriya during a stop on a drive",
        caption: "Off Duty",
        focus: "50% 0%",
      },
    ],
  },

  bride: {
    name: "Shriya Singh",
    shortName: "Shriya",
    title: "The Bride",
    father: "Sandeep Singh",
    mother: "Sangeeta Singh",
    bio: "Shriya is a classical dancer turned graphic designer from Raipur. She collects handwoven sarees, paints when the house is quiet, and has never once said no to a plate of jalebi. Her warmth is the first thing everyone remembers about her.",
    // Square face crop of 3.jpeg, for the same reason as the groom's.
    image: photo("bride-portrait.jpg"),
    alt: "Portrait of Shriya Singh, the bride, in a blush pink lehenga",
    gallery: [
      {
        src: photo("12.jpeg"),
        alt: "Shriya Singh in her blush lehenga before the ceremony",
        caption: "Getting Ready",
        // Trims the empty curtain above her so she sits centred in the frame.
        focus: "50% 78%",
      },
      {
        src: photo("3.jpeg"),
        alt: "Shriya Singh smiling in a studio portrait, mehendi on her hands",
        caption: "Pink & Silver",
        focus: "55% 58%",
      },
      {
        src: photo("5.jpeg"),
        alt: "Shriya Singh seated for the ceremony beside the puja thali",
        caption: "The Rituals",
        focus: "52% 34%",
      },
      {
        src: photo("9.jpeg"),
        alt: "Shriya Singh walking in hand in hand with Pranjal",
        caption: "Hand In Hand",
        focus: "50% 0%",
      },
    ],
  },

  // Listed in ceremony order: Mehendi, Haldi, Sangeet, Wedding, Reception.
  events: [
    {
      id: "mehendi",
      name: "Mehendi",
      date: "22 November 2026",
      start: "2026-11-22T16:00:00+05:30",
      end: "2026-11-22T21:00:00+05:30",
      time: "4:00 PM onwards",
      venue: "At Home, Singh's Villa",
      address: "Santrabadi, Durg, Chhattisgarh",
      mapQuery: "Singh's Villa, Santrabadi, Durg, Chhattisgarh",
      description:
        "An evening of henna, dholak songs and far too many sweets. Bring your best voice — the ladies of both families have promised a singing duel.",
      theme: "mehendi",
      icon: "🌿",
      image: photo("ceremonies/mehendi.jpg"),
      alt: "Hands painted with intricate bridal mehendi, stacked with red and ivory bangles",
      focus: "50% 58%",
      calendar: false,
    },
    {
      id: "haldi",
      name: "Haldi",
      date: "23 November 2026",
      start: "2026-11-23T10:00:00+05:30",
      end: "2026-11-23T13:00:00+05:30",
      time: "10:00 AM onwards",
      venue: "At Home, Singh's Villa",
      address: "Santrabadi, Durg, Chhattisgarh",
      mapQuery: "Singh's Villa, Santrabadi, Durg, Chhattisgarh",
      description:
        "Turmeric, laughter and a very yellow morning. Come ready to be smeared in blessings — and please do not wear anything you love too much.",
      theme: "haldi",
      icon: "🌼",
      image: photo("ceremonies/haldi.jpg"),
      alt: "Hennaed hands holding a bowl of turmeric haldi paste against an orange saree",
      focus: "62% 45%",
      calendar: false,
    },
    {
      id: "sangeet",
      name: "Sangeet",
      date: "23 November 2026",
      start: "2026-11-23T19:00:00+05:30",
      end: "2026-11-23T23:30:00+05:30",
      time: "7:00 PM onwards",
      venue: "Hotel Alka Palace",
      address: "Station Road, Durg, Chhattisgarh",
      description:
        "A night of music, dance and family performances. Both sides have been rehearsing in secret — come cheer, sing along and take over the dance floor.",
      theme: "sangeet",
      icon: "🎶",
      image: photo("ceremonies/sangeet.jpg"),
      alt: "Hennaed hands with gold and blue bangles raised in a dance pose",
      focus: "50% 50%",
      calendar: false,
    },
    {
      id: "barat",
      name: "Wedding",
      date: "24 November 2026",
      start: "2026-11-24T18:00:00+05:30",
      end: "2026-11-24T23:59:00+05:30",
      time: "6:00 PM onwards",
      venue: "Thakur Vighnaharan Singh Rajput Bhawan",
      address: "Sarona, Raipur, Chhattisgarh",
      description:
        "The dhol starts at six and does not stop. Dance the groom to the gate, watch the pheras under the stars, and stay for the feast.",
      theme: "barat",
      icon: "🥁",
      image: photo("ceremonies/wedding.jpg"),
      alt: "A floral wedding mandap draped in roses and greenery, lit by crystal chandeliers",
      focus: "50% 45%",
      calendar: true,
    },
    {
      id: "reception",
      name: "Reception",
      date: "25 November 2026",
      start: "2026-11-25T19:00:00+05:30",
      end: "2026-11-25T23:59:00+05:30",
      time: "7:00 PM onwards",
      venue: "Nirmal's SAPTAPADI, Marriage Garden and Resort",
      address: "Borsi Road, near Nirmal HP Fuels, Hanoda, Durg, Chhattisgarh",
      description:
        "A royal evening to close the celebration — dinner, music, and the newlyweds meeting every single guest who made the journey.",
      theme: "reception",
      icon: "✨",
      image: photo("ceremonies/reception.jpg"),
      alt: "Reception hall set with gold chairs, white linen and tall red rose centrepieces",
      focus: "50% 45%",
      calendar: true,
    },
  ],

  story: [
    {
      id: "first-meeting",
      title: "First Meeting",
      date: "February 2022",
      description:
        "A mutual friend's birthday in Raipur. Pranjal was arguing about architecture; Shriya disagreed with every word. Neither of them left early.",
      icon: "✨",
      image: photo("2.jpeg"),
      alt: "Pranjal and Shriya standing together on an afternoon out",
      focus: "50% 31%",
    },
    {
      id: "first-conversation",
      title: "First Conversation",
      date: "March 2022",
      description:
        "One coffee turned into four hours, a shared plate of samosas, and a promise to continue the argument next week.",
      icon: "☕",
      image: photo("13.jpeg"),
      alt: "Pranjal and Shriya laughing during a stop on a drive",
      focus: "50% 23%",
    },
    {
      id: "friendship",
      title: "Friendship",
      date: "2022 – 2023",
      description:
        "Two years of long drives, terrible movie choices, and being the first person the other called with good news.",
      icon: "🌿",
      image: photo("1.jpeg"),
      alt: "Pranjal and Shriya on a drive together",
      focus: "50% 29%",
    },
    {
      id: "families-met",
      title: "Our Families Met",
      date: "August 2024",
      description:
        "Tea at the Singh house. The mothers exchanged recipes within ten minutes and the fathers discovered they support the same cricket team.",
      icon: "🏡",
      image: photo("11.jpeg"),
      alt: "Pranjal and Shriya laughing together as they walk in hand in hand",
      focus: "50% 10%",
    },
    {
      id: "engagement",
      title: "The Engagement",
      date: "January 2026",
      description:
        "A courtyard full of marigolds, both families singing, and a yes that surprised absolutely nobody.",
      icon: "💍",
      image: photo("10.jpeg"),
      alt: "Pranjal handing Shriya a bouquet of red roses under the floral arch",
      focus: "50% 33%",
    },
    {
      id: "wedding",
      title: "The Wedding Day",
      date: "24 November 2026",
      description:
        "The chapter we have been writing towards. And you are invited to the very first page of it.",
      icon: "🪔",
      image: photo("9.jpeg"),
      alt: "Pranjal and Shriya walking hand in hand between the guests",
      focus: "50% 19%",
    },
  ],

  groomFamily: {
    title: "Groom's Family",
    subtitle: "The Singh family of Raipur welcomes you with folded hands",
    parents: [
      {
        name: "Kamlesh Singh",
        role: "Father of the Groom",
        image: photo("groom-family/groom-father.jpeg"),
        alt: "Portrait of Kamlesh Singh, father of the groom, in a navy collared shirt",
        // 473x644 headshot: the family circles are square, and a plain centre
        // crop would cut the top of his head. This lifts the window so the eyes
        // land at about 45% of the frame.
        focus: "50% 16%",
        note: "The quiet planner behind every family celebration.",
      },
      {
        name: "Lalita Singh",
        role: "Mother of the Groom",
        image: photo("groom-family/groom-mother.jpeg"),
        alt: "Portrait of Lalita Singh, mother of the groom, in an orange saree",
        focus: "50% 20%",
        note: "Keeper of the family recipes and everyone's favourite person.",
      },
    ],
    members: [
      {
        name: "Arvind Singh",
        role: "Uncle (Chacha)",
        image: photo("groom-family/groom-uncle.jpeg"),
        alt: "Portrait of Arvind Singh, uncle of the groom, in a black shirt",
        focus: "50% 0%",
      },
      {
        name: "Rupa Singh",
        role: "Aunt (Chachi)",
        image: photo("groom-family/groom-aunty.jpeg"),
        alt: "Portrait of Rupa Singh, aunt of the groom, in a grey and gold saree",
        focus: "50% 0%",
      },
      {
        name: "Manish Singh",
        role: "Bua (Father's Sister)",
        image: photo("groom-family/groom-bua.jpeg"),
        alt: "Portrait of Manish Singh, bua of the groom, in a cream blazer",
      },
      {
        name: "Himanshu Singh",
        role: "Brother",
        image: photo("groom-family/groom-brother-1.jpeg"),
        alt: "Portrait of Himanshu Singh, brother of the groom, in a printed shirt",
        // 1024x1280 and his head starts at the very top edge, so the square
        // crop has to begin there too.
        focus: "50% 0%",
      },
      {
        name: "Ishan Singh",
        role: "Brother",
        image: photo("groom-family/groom-brother-2.jpeg"),
        alt: "Portrait of Ishan Singh, brother of the groom, in a checked overshirt",
        // Landscape 423x366 and he stands well right of frame, so the square
        // crop takes the right-hand side and drops the doorway behind him.
        focus: "85% 50%",
      },
      {
        name: "Palak Singh",
        role: "Sister",
        image: photo("groom-family/groom-sister.jpg"),
        alt: "Portrait of Palak Singh, sister of the groom, by the water",
        // Landscape 960x720 with her off to the left of frame.
        focus: "33% 50%",
      },
      {
        name: "Rajveer Singh",
        role: "Brother",
        image: photo("groom-family/groom-brother-3.jpg"),
        alt: "Portrait of Rajveer Singh, the youngest brother of the groom, smiling",
        focus: "50% 20%",
      },
    ],
  },

  brideFamily: {
    title: "Bride's Family",
    subtitle: "The Singh family of Raipur awaits you with open hearts",
    parents: [
      {
        name: "Sandeep Singh",
        role: "Father of the Bride",
        image: portrait(59),
        alt: "Portrait of Sandeep Singh, father of the bride",
        note: "Has been practising his speech since the engagement.",
      },
      {
        name: "Sangeeta Singh",
        role: "Mother of the Bride",
        image: portrait(43),
        alt: "Portrait of Sangeeta Singh, mother of the bride",
        note: "Will feed you twice before you reach the door.",
      },
    ],
    members: [
      {
        name: "Arjun Singh",
        role: "Brother",
        image: portrait(56),
        alt: "Portrait of Arjun Singh, brother of the bride",
      },
      {
        name: "Meera Singh",
        role: "Elder Sister",
        image: portrait(42),
        alt: "Portrait of Meera Singh, elder sister of the bride",
      },
      {
        name: "Vikram Singh",
        role: "Uncle (Mama)",
        image: portrait(11),
        alt: "Portrait of Vikram Singh, uncle of the bride",
      },
      {
        name: "Priya Singh",
        role: "Aunt (Mami)",
        image: portrait(21),
        alt: "Portrait of Priya Singh, aunt of the bride",
      },
      {
        name: "Rohan Singh",
        role: "Cousin",
        image: portrait(60),
        alt: "Portrait of Rohan Singh, cousin of the bride",
      },
      {
        name: "Tanvi Singh",
        role: "Cousin",
        image: portrait(35),
        alt: "Portrait of Tanvi Singh, cousin of the bride",
      },
      {
        name: "Suresh Singh",
        role: "Grandfather (Nanaji)",
        image: portrait(17),
        alt: "Portrait of Suresh Singh, grandfather of the bride",
      },
      {
        name: "Shanti Devi",
        role: "Grandmother (Naniji)",
        image: portrait(26),
        alt: "Portrait of Shanti Devi, grandmother of the bride",
      },
    ],
  },

  gallery: [
    // The masonry mixes tall cells (row-span-2, roughly 3:4) with short ones
    // (row-span-1, roughly 16:10). `tall` matches each photo's own shape, and
    // `focus` is what keeps faces inside the short, landscape-shaped cells.
    {
      src: photo("11.jpeg"),
      alt: "Pranjal and Shriya laughing together as they walk in hand in hand",
      caption: "Us, Together",
      tall: true,
      focus: "50% 10%",
    },
    {
      src: photo("13.jpeg"),
      alt: "Pranjal and Shriya laughing during a stop on a drive",
      caption: "Just Us Two",
      focus: "50% 23%",
    },
    {
      src: photo("8.jpeg"),
      alt: "Pranjal in his deep wine embroidered sherwani",
      caption: "The Groom",
      tall: true,
    },
    {
      src: photo("1.jpeg"),
      alt: "Pranjal and Shriya on a drive together before the wedding",
      caption: "Golden Days",
      focus: "50% 29%",
    },
    {
      src: photo("5.jpeg"),
      alt: "Shriya seated for the ceremony beside the puja thali",
      caption: "The Rituals",
      focus: "50% 31%",
    },
    {
      src: photo("3.jpeg"),
      alt: "Shriya smiling in a studio portrait, mehendi on her hands",
      caption: "The Bride",
      tall: true,
      focus: "55% 49%",
    },
    {
      src: photo("7.jpeg"),
      alt: "Pranjal leading Shriya into the hall through the smoke",
      caption: "The Grand Entry",
      focus: "50% 12%",
    },
    {
      src: photo("2.jpeg"),
      alt: "Pranjal and Shriya standing together on an afternoon out",
      caption: "Before It All Began",
      focus: "50% 31%",
    },
    {
      src: photo("12.jpeg"),
      alt: "Shriya in her blush lehenga before the ceremony",
      caption: "Getting Ready",
      tall: true,
      focus: "50% 95%",
    },
    {
      src: photo("10.jpeg"),
      alt: "Pranjal handing Shriya a bouquet of red roses under the floral arch",
      caption: "Roses & Promises",
      focus: "50% 33%",
    },
    {
      // The one landscape photograph in the set - it fills a short cell exactly.
      src: photo("4.jpeg"),
      alt: "Shriya reflected in the mirror while she waits, softly lit",
      caption: "A Quiet Moment",
      focus: "60% 40%",
    },
    {
      src: photo("9.jpeg"),
      alt: "Pranjal and Shriya walking hand in hand between the guests",
      caption: "Hand In Hand",
      focus: "50% 19%",
    },
  ],

  venue: {
    label: "Wedding",
    icon: "🛕",
    name: "Thakur Vighnaharan Singh Rajput Bhawan",
    address: "Sarona, Raipur, Chhattisgarh, India",
    city: "Raipur, Chhattisgarh, India",
    description:
      "A palace-style banquet with lantern-lit lawns and a marble mandap courtyard — where the Barat arrives and the pheras are taken.",
    // Real photographs of the venue, from its VenueLook listing (595x400 is
    // the largest size published there).
    photos: [
      {
        src: photo("venues/wedding/1.jpg"),
        alt: "Dining lawn at Rajput Bhawan under rows of crystal chandeliers and hanging floral strands",
        caption: "Chandelier dining lawn",
      },
      {
        src: photo("venues/wedding/2.jpg"),
        alt: "The carved mandap stage at Rajput Bhawan lit up in gold and violet at night",
        caption: "Mandap stage",
      },
      {
        src: photo("venues/wedding/3.jpg"),
        alt: "Tables and carved chairs set beneath chandeliers on the open lawn",
        caption: "Banquet seating",
      },
      {
        src: photo("venues/wedding/4.jpg"),
        alt: "Golden buffet counter with brass serving urns beside the lawn",
        caption: "Buffet counter",
      },
    ],
    date: "24 November 2026",
    time: "6:00 PM onwards",
    // Used as the event's map link in search results; "Get Directions" routes
    // to `name, address` instead.
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Thakur+Vighnaharan+Singh+Rajput+Bhawan+Sarona+Raipur+Chhattisgarh",
  },

  receptionVenue: {
    label: "Reception",
    icon: "🥂",
    name: "Nirmal's SAPTAPADI, Marriage Garden and Resort",
    address: "Borsi Road, near Nirmal HP Fuels, Hanoda, Durg, Chhattisgarh, India",
    city: "Durg, Chhattisgarh, India",
    description:
      "A marriage garden and resort on Borsi Road, Durg — the setting for a royal evening of dinner, music and blessings for the newlyweds.",
    // Real photographs of the resort, from its official website.
    photos: [
      {
        // Cover: the resort building lit up at night behind the decorated lawn.
        src: photo("venues/reception/lawn-night.jpg"),
        alt: "Nirmal's Saptapadi Resort at night: the lit two-storey building behind a decorated lawn with red sofas and white chairs",
        caption: "Resort by night",
        focus: "50% 40%",
      },
      {
        src: photo("venues/reception/stage-aisle.jpg"),
        alt: "Flower-lined aisle with glowing globe lamps leading to the lit floral stage, pink-draped chairs on either side",
        caption: "Stage & aisle",
        focus: "50% 62%",
      },
      {
        src: photo("venues/reception/stage-seating.jpg"),
        alt: "Rows of pink satin-draped chairs facing the decorated stage on the lawn at night",
        caption: "Reception seating",
        focus: "50% 58%",
      },
      {
        src: photo("venues/reception/floral-stage.jpg"),
        alt: "Red and white floral stage with chandeliers, white arches and a velvet couch for the couple",
        caption: "Floral stage",
        focus: "50% 50%",
      },
      {
        src: photo("venues/reception/buffet.jpg"),
        alt: "Long golden buffet counter lit up beside red drapes and glowing arches",
        caption: "Buffet",
        focus: "50% 55%",
      },
    ],
    date: "25 November 2026",
    time: "7:00 PM onwards",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Nirmal%27s+SAPTAPADI+Marriage+Garden+and+Resort+Borsi+Road+Hanoda+Durg+Chhattisgarh",
  },

  nav: [
    { label: "Home", href: "#home" },
    { label: "Countdown", href: "#countdown" },
    { label: "Invitation", href: "#invitation" },
    { label: "Events", href: "#events" },
    { label: "Photos", href: "#photos" },
    { label: "Venues", href: "#venue" },
  ],

  music: {
    // Drop the track at /public/music/wedding-theme.mp3 — see the README in
    // that folder. It starts softly on open and loops.
    src: "/music/wedding-theme.mp3",
    title: "Shehnai & Shree Ganesh Vandana",
  },

  contact: [
    { label: "Call Kamlesh Singh", value: "+91 98271 16205", href: "tel:+919827116205" },
    { label: "Call Arvind Singh", value: "+91 98271 82384", href: "tel:+919827182384" },
    { label: "Call Honey", value: "+91 98279 30007", href: "tel:+919827930007" },
  ],
};

export default weddingData;
