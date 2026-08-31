import type { WeddingData } from "@/types/wedding";

/**
 * Every piece of copy, name and image on the site comes from this file.
 * To personalise the invitation, edit here only — no component hardcodes wedding content.
 *
 * ---------------------------------------------------------------------------
 * DUMMY IMAGES
 * ---------------------------------------------------------------------------
 * Two placeholder sources are used, both verified to serve real photographs:
 *
 *   scene()    — Unsplash wedding photography (ceremonies, decor, venue, couple)
 *   portrait() — pravatar.cc headshots, used for the family member cards
 *
 * To use your own photos, drop them in `public/images/` and replace the value
 * with a plain path, e.g.  image: "/images/pranjal.jpg".
 * Nothing else needs to change — every component reads from this file.
 *
 * If an image ever fails to load, `WeddingImage` swaps in a local floral
 * placeholder, so the layout never breaks.
 */

/** A wedding photograph from Unsplash, cropped to the size the layout needs. */
const scene = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

/** A portrait headshot, used for relatives. `n` selects the face (1–70). */
const portrait = (n: number, size = 600) => `https://i.pravatar.cc/${size}?img=${n}`;

/** Named Unsplash photo ids, so each slot below reads as what it depicts. */
const SCENE = {
  brideSaree: "1610030469983-98e550d6193c",
  groomPortrait: "1607346256330-dee7af15f7c5",
  groomFormal: "1618886614638-80e3c103d31a",
  coupleConfetti: "1583939003579-730e3918a45a",
  coupleBarn: "1595407753234-0882f1e77954",
  couplePalms: "1606216794074-735e91aa2c92",
  coupleField: "1604017011826-d3b4c23f8914",
  coupleBeach: "1544078751-58fee2d8a03b",
  brideVeilBeach: "1537633552985-df8429e8048b",
  brideVeilMono: "1460978812857-470ed1c77af0",
  handsHeart: "1520854221256-17451cc331bf",
  handsTable: "1556484687-30636164638b",
  ringHands: "1465495976277-4387d4b0b4c6",
  bouquet: "1519741497674-611481863552",
  aisleFlowers: "1469371670807-013ccf25f16a",
  tableFlowers: "1519225421980-715cb0215aed",
  receptionCandles: "1525772764200-be829a350797",
  celebrationLights: "1516450360452-9312f5e86fc7",
  bridalParty: "1583939411023-14783179e581",
  weddingShoes: "1509927083803-4bd519298ac4",
  lawnChairs: "1522673607200-164d1b6ce486",
  balloons: "1530103862676-de8c9debad1d",
  feast: "1600891964092-4316c288032e",
} as const;

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
    image: scene(SCENE.groomPortrait, 900, 1200),
    alt: "Portrait of Pranjal Singh, the groom, in traditional wedding attire",
    gallery: [
      {
        src: scene(SCENE.groomPortrait, 800, 1000),
        alt: "Pranjal Singh in a cream sherwani",
        caption: "The Sherwani",
      },
      {
        src: scene(SCENE.coupleBarn, 800, 1000),
        alt: "Pranjal Singh smiling during a family celebration",
        caption: "Family Function",
      },
      {
        src: scene(SCENE.groomFormal, 800, 1000),
        alt: "Pranjal Singh dressed for the engagement in a formal black suit",
        caption: "Golden Hour",
      },
      {
        src: scene(SCENE.handsHeart, 800, 1000),
        alt: "Pranjal Singh during his engagement ceremony",
        caption: "Engagement Day",
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
    image: scene(SCENE.brideSaree, 900, 1200),
    alt: "Portrait of Sherya Singh, the bride, in bridal red and gold",
    gallery: [
      {
        src: scene(SCENE.brideSaree, 800, 1000),
        alt: "Sherya Singh in a red bridal lehenga",
        caption: "Bridal Red",
      },
      {
        src: scene(SCENE.handsTable, 800, 1000),
        alt: "Sherya Singh with mehendi on her hands",
        caption: "Mehendi Hands",
      },
      {
        src: scene(SCENE.brideVeilBeach, 800, 1000),
        alt: "Sherya Singh laughing at a family gathering",
        caption: "Pure Joy",
      },
      {
        src: scene(SCENE.brideVeilMono, 800, 1000),
        alt: "Sherya Singh in a marigold decorated courtyard",
        caption: "Marigold Courtyard",
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
      image: scene(SCENE.bouquet, 900, 700),
      alt: "Marigold and turmeric decorations set up for a Haldi ceremony",
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
      image: scene(SCENE.handsTable, 900, 700),
      alt: "Henna patterns being applied at a Mehendi ceremony",
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
      image: scene(SCENE.celebrationLights, 900, 700),
      alt: "A Barat procession with dhol players and festive lights",
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
      image: scene(SCENE.receptionCandles, 900, 700),
      alt: "An elegantly lit banquet hall prepared for a wedding reception",
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
    {
      src: scene(SCENE.coupleConfetti, 900, 1200),
      alt: "Pranjal and Sherya together at their engagement",
      caption: "Us, Together",
      tall: true,
    },
    {
      src: scene(SCENE.groomPortrait, 900, 700),
      alt: "Pranjal in a festive kurta during a family function",
      caption: "The Groom",
    },
    {
      src: scene(SCENE.brideSaree, 900, 1200),
      alt: "Sherya in a red lehenga with traditional jewellery",
      caption: "The Bride",
      tall: true,
    },
    {
      src: scene(SCENE.bouquet, 900, 700),
      alt: "Turmeric and marigolds arranged for the Haldi ceremony",
      caption: "Haldi Mornings",
    },
    {
      src: scene(SCENE.handsTable, 900, 700),
      alt: "Intricate henna patterns drawn on hands",
      caption: "Mehendi Evening",
    },
    {
      src: scene(SCENE.aisleFlowers, 900, 1200),
      alt: "Marigold garlands hanging above a wedding mandap",
      caption: "Marigold Skies",
      tall: true,
    },
    {
      src: scene(SCENE.celebrationLights, 900, 700),
      alt: "Dhol players leading a Barat procession",
      caption: "Barat Beats",
    },
    {
      src: scene(SCENE.bridalParty, 900, 700),
      alt: "Both families gathered for a group photograph",
      caption: "Our People",
    },
    {
      src: scene(SCENE.receptionCandles, 900, 1200),
      alt: "A softly lit reception stage with floral arrangements",
      caption: "Reception Night",
      tall: true,
    },
    {
      src: scene(SCENE.weddingShoes, 900, 700),
      alt: "Traditional wedding outfits and jewellery laid out",
      caption: "The Trousseau",
    },
    {
      src: scene(SCENE.tableFlowers, 900, 700),
      alt: "Rose petals and jasmine flowers in a brass bowl",
      caption: "Petals & Prayers",
    },
    {
      src: scene(SCENE.coupleField, 900, 700),
      alt: "Pranjal and Sherya laughing during a photoshoot",
      caption: "Somewhere In Between",
    },
  ],

  venue: {
    name: "Royal Palace & Banquet",
    address: "VIP Road, Near Marine Drive",
    city: "Raipur, Chhattisgarh, India",
    description:
      "A palace-style banquet with lantern-lit lawns, a marble mandap courtyard, and parking for 300 cars. Both the Barat and the Reception happen here, so you only need to find your way once.",
    image: scene(SCENE.aisleFlowers, 1400, 900),
    alt: "The Royal Palace and Banquet venue lit up in the evening",
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
