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
 * Relatives still use `portrait()` headshots: no photographs of the family
 * were supplied. Drop real ones in `public/images/` and swap the value -
 * nothing else needs to change.
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
  hashtag: "#PranjalWedsSherya",
  dateRange: "25 November 2026 – 26 November 2026",
  countdownTarget: "2026-11-25T10:00:00+05:30",

  invitationMessage:
    "Together with our families, we invite you to celebrate the beginning of our beautiful journey.",
  finalInvitationMessage:
    "With hearts full of happiness and families full of blessings, we invite you to join us as we celebrate the beginning of a beautiful new chapter.",

  groom: {
    name: "Pranjal Singh",
    shortName: "Pranjal",
    title: "The Groom",
    father: "Kamlesh Singh",
    mother: "Lalita Singh",
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
        alt: "Pranjal Singh laughing with Sherya as they walk in hand in hand",
        caption: "That Smile",
        focus: "50% 22%",
      },
      {
        src: photo("7.jpeg"),
        alt: "Pranjal Singh leading Sherya into the hall through the smoke",
        caption: "The Grand Entry",
        focus: "50% 0%",
      },
      {
        src: photo("13.jpeg"),
        alt: "Pranjal Singh looking at Sherya during a stop on a drive",
        caption: "Off Duty",
        focus: "50% 0%",
      },
    ],
  },

  bride: {
    name: "Sherya Singh",
    shortName: "Sherya",
    title: "The Bride",
    father: "Sandeep Singh",
    mother: "Suneeta Singh",
    bio: "Sherya is a classical dancer turned graphic designer from Raipur. She collects handwoven sarees, paints when the house is quiet, and has never once said no to a plate of jalebi. Her warmth is the first thing everyone remembers about her.",
    // Square face crop of 3.jpeg, for the same reason as the groom's.
    image: photo("bride-portrait.jpg"),
    alt: "Portrait of Sherya Singh, the bride, in a blush pink lehenga",
    gallery: [
      {
        src: photo("12.jpeg"),
        alt: "Sherya Singh in her blush lehenga before the ceremony",
        caption: "Getting Ready",
        // Trims the empty curtain above her so she sits centred in the frame.
        focus: "50% 78%",
      },
      {
        src: photo("3.jpeg"),
        alt: "Sherya Singh smiling in a studio portrait, mehendi on her hands",
        caption: "Pink & Silver",
        focus: "55% 58%",
      },
      {
        src: photo("5.jpeg"),
        alt: "Sherya Singh seated for the ceremony beside the puja thali",
        caption: "The Rituals",
        focus: "52% 34%",
      },
      {
        src: photo("9.jpeg"),
        alt: "Sherya Singh walking in hand in hand with Pranjal",
        caption: "Hand In Hand",
        focus: "50% 0%",
      },
    ],
  },

  events: [
    {
      id: "haldi",
      name: "Haldi",
      date: "23 November 2026",
      start: "2026-11-23T10:00:00+05:30",
      end: "2026-11-23T13:00:00+05:30",
      time: "10:00 AM onwards",
      venue: "Singh Nivas, Courtyard",
      address: "Shankar Nagar, Raipur, Chhattisgarh",
      description:
        "Turmeric, laughter and a very yellow morning. Come ready to be smeared in blessings — and please do not wear anything you love too much.",
      theme: "haldi",
      icon: "🌼",
      image: photo("5.jpeg"),
      alt: "Sherya seated for the ceremony rituals beside the puja thali",
      focus: "50% 31%",
      calendar: false,
    },
    {
      id: "mehendi",
      name: "Mehendi",
      date: "24 November 2026",
      start: "2026-11-24T16:00:00+05:30",
      end: "2026-11-24T21:00:00+05:30",
      time: "4:00 PM onwards",
      venue: "The Green Courtyard Lawn",
      address: "Civil Lines, Raipur, Chhattisgarh",
      description:
        "An evening of henna, dholak songs and far too many sweets. Bring your best voice — the ladies of both families have promised a singing duel.",
      theme: "mehendi",
      icon: "🌿",
      image: photo("12.jpeg"),
      alt: "Sherya with mehendi on both hands, waiting in her blush lehenga",
      focus: "50% 48%",
      calendar: false,
    },
    {
      id: "barat",
      name: "Barat & Wedding",
      date: "25 November 2026",
      start: "2026-11-25T18:00:00+05:30",
      end: "2026-11-25T23:59:00+05:30",
      time: "6:00 PM onwards",
      venue: "Royal Palace & Banquet",
      address: "VIP Road, Raipur, Chhattisgarh",
      description:
        "The dhol starts at six and does not stop. Dance the groom to the gate, watch the pheras under the stars, and stay for the feast.",
      theme: "barat",
      icon: "🥁",
      image: photo("7.jpeg"),
      alt: "Pranjal and Sherya walking into the hall through the smoke",
      focus: "50% 12%",
      calendar: true,
    },
    {
      id: "reception",
      name: "Reception",
      date: "26 November 2026",
      start: "2026-11-26T19:00:00+05:30",
      end: "2026-11-26T23:59:00+05:30",
      time: "7:00 PM onwards",
      venue: "Royal Palace & Banquet, Grand Hall",
      address: "VIP Road, Raipur, Chhattisgarh",
      description:
        "A royal evening to close the celebration — dinner, music, and the newlyweds meeting every single guest who made the journey.",
      theme: "reception",
      icon: "✨",
      image: photo("9.jpeg"),
      alt: "Pranjal and Sherya walking hand in hand between the guests",
      focus: "50% 19%",
      calendar: true,
    },
  ],

  story: [
    {
      id: "first-meeting",
      title: "First Meeting",
      date: "February 2022",
      description:
        "A mutual friend's birthday in Raipur. Pranjal was arguing about architecture; Sherya disagreed with every word. Neither of them left early.",
      icon: "✨",
    },
    {
      id: "first-conversation",
      title: "First Conversation",
      date: "March 2022",
      description:
        "One coffee turned into four hours, a shared plate of samosas, and a promise to continue the argument next week.",
      icon: "☕",
    },
    {
      id: "friendship",
      title: "Friendship",
      date: "2022 – 2023",
      description:
        "Two years of long drives, terrible movie choices, and being the first person the other called with good news.",
      icon: "🌿",
    },
    {
      id: "families-met",
      title: "Our Families Met",
      date: "August 2024",
      description:
        "Tea at the Singh house. The mothers exchanged recipes within ten minutes and the fathers discovered they support the same cricket team.",
      icon: "🏡",
    },
    {
      id: "engagement",
      title: "The Engagement",
      date: "January 2026",
      description:
        "A courtyard full of marigolds, both families singing, and a yes that surprised absolutely nobody.",
      icon: "💍",
    },
    {
      id: "wedding",
      title: "The Wedding Day",
      date: "25 November 2026",
      description:
        "The chapter we have been writing towards. And you are invited to the very first page of it.",
      icon: "🪔",
    },
  ],

  groomFamily: {
    title: "Groom's Family",
    subtitle: "The Singh family of Raipur welcomes you with folded hands",
    parents: [
      {
        name: "Kamlesh Singh",
        role: "Father of the Groom",
        image: portrait(13),
        alt: "Portrait of Kamlesh Singh, father of the groom",
        note: "The quiet planner behind every family celebration.",
      },
      {
        name: "Lalita Singh",
        role: "Mother of the Groom",
        image: portrait(44),
        alt: "Portrait of Lalita Singh, mother of the groom",
        note: "Keeper of the family recipes and everyone's favourite person.",
      },
    ],
    members: [
      {
        name: "Aditya Singh",
        role: "Elder Brother",
        image: portrait(12),
        alt: "Portrait of Aditya Singh, elder brother of the groom",
      },
      {
        name: "Ananya Singh",
        role: "Sister",
        image: portrait(36),
        alt: "Portrait of Ananya Singh, sister of the groom",
      },
      {
        name: "Mahesh Singh",
        role: "Uncle (Chacha)",
        image: portrait(51),
        alt: "Portrait of Mahesh Singh, uncle of the groom",
      },
      {
        name: "Rekha Singh",
        role: "Aunt (Chachi)",
        image: portrait(32),
        alt: "Portrait of Rekha Singh, aunt of the groom",
      },
      {
        name: "Kabir Singh",
        role: "Cousin",
        image: portrait(53),
        alt: "Portrait of Kabir Singh, cousin of the groom",
      },
      {
        name: "Ishita Singh",
        role: "Cousin",
        image: portrait(47),
        alt: "Portrait of Ishita Singh, cousin of the groom",
      },
      {
        name: "Ramesh Singh",
        role: "Grandfather (Dadaji)",
        image: portrait(50),
        alt: "Portrait of Ramesh Singh, grandfather of the groom",
      },
      {
        name: "Kamla Devi",
        role: "Grandmother (Dadiji)",
        image: portrait(29),
        alt: "Portrait of Kamla Devi, grandmother of the groom",
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
        name: "Suneeta Singh",
        role: "Mother of the Bride",
        image: portrait(43),
        alt: "Portrait of Suneeta Singh, mother of the bride",
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
      alt: "Pranjal and Sherya laughing together as they walk in hand in hand",
      caption: "Us, Together",
      tall: true,
      focus: "50% 10%",
    },
    {
      src: photo("13.jpeg"),
      alt: "Pranjal and Sherya laughing during a stop on a drive",
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
      alt: "Pranjal and Sherya on a drive together before the wedding",
      caption: "Golden Days",
      focus: "50% 29%",
    },
    {
      src: photo("5.jpeg"),
      alt: "Sherya seated for the ceremony beside the puja thali",
      caption: "The Rituals",
      focus: "50% 31%",
    },
    {
      src: photo("3.jpeg"),
      alt: "Sherya smiling in a studio portrait, mehendi on her hands",
      caption: "The Bride",
      tall: true,
      focus: "55% 49%",
    },
    {
      src: photo("7.jpeg"),
      alt: "Pranjal leading Sherya into the hall through the smoke",
      caption: "The Grand Entry",
      focus: "50% 12%",
    },
    {
      src: photo("2.jpeg"),
      alt: "Pranjal and Sherya standing together on an afternoon out",
      caption: "Before It All Began",
      focus: "50% 31%",
    },
    {
      src: photo("12.jpeg"),
      alt: "Sherya in her blush lehenga before the ceremony",
      caption: "Getting Ready",
      tall: true,
      focus: "50% 95%",
    },
    {
      src: photo("10.jpeg"),
      alt: "Pranjal handing Sherya a bouquet of red roses under the floral arch",
      caption: "Roses & Promises",
      focus: "50% 33%",
    },
    {
      // The one landscape photograph in the set - it fills a short cell exactly.
      src: photo("4.jpeg"),
      alt: "Sherya reflected in the mirror while she waits, softly lit",
      caption: "A Quiet Moment",
      focus: "60% 40%",
    },
    {
      src: photo("9.jpeg"),
      alt: "Pranjal and Sherya walking hand in hand between the guests",
      caption: "Hand In Hand",
      focus: "50% 19%",
    },
  ],

  venue: {
    name: "Royal Palace & Banquet",
    address: "VIP Road, Near Marine Drive",
    city: "Raipur, Chhattisgarh, India",
    description:
      "A palace-style banquet with lantern-lit lawns, a marble mandap courtyard, and parking for 300 cars. Both the Barat and the Reception happen here, so you only need to find your way once.",
    image: photo("10.jpeg"),
    alt: "The floral arch and chandelier of the banquet hall on the wedding day",
    focus: "50% 33%",
    date: "25 – 26 November 2026",
    time: "Barat 6:00 PM · Reception 7:00 PM",
    // Replace with the real Google Maps place link once confirmed.
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Royal+Palace+Banquet+Raipur+Chhattisgarh",
  },

  rsvp: {
    endpoint: null,
    eventOptions: ["Haldi", "Mehendi", "Barat & Wedding", "Reception", "All Events"],
    maxGuests: 10,
    deadline: "1 November 2026",
  },

  nav: [
    { label: "Home", href: "#home" },
    { label: "Couple", href: "#couple" },
    { label: "Events", href: "#events" },
    { label: "Families", href: "#families" },
    { label: "Story", href: "#story" },
    { label: "Gallery", href: "#gallery" },
    { label: "Venue", href: "#venue" },
    { label: "RSVP", href: "#rsvp" },
  ],

  music: {
    // Drop your own track at /public/music/wedding-theme.mp3 to replace this.
    src: "/music/wedding-theme.mp3",
    title: "Shehnai — Wedding Theme",
  },

  contact: [
    { label: "Call Kamlesh Singh", value: "+91 98000 00001", href: "tel:+919800000001" },
    { label: "Call Sandeep Singh", value: "+91 98000 00002", href: "tel:+919800000002" },
    { label: "Email us", value: "pranjalwedssherya@example.com", href: "mailto:pranjalwedssherya@example.com" },
  ],
};

export default weddingData;
