/**
 * Domain types for the wedding invitation.
 * Everything the site renders is described here and filled in from `src/data/wedding.ts`.
 */

export interface Person {
  name: string;
  /** Relationship label, e.g. "Father of the Bride". */
  role: string;
  image: string;
  alt: string;
  /**
   * CSS `object-position` for the crop, e.g. "50% 32%".
   * Real photographs are mostly tall, and the layout crops them to circles,
   * 16:10 cards and masonry cells — this keeps faces inside the crop.
   * Omit for the default `50% 50%`.
   */
  focus?: string;
  /** Optional one-line note shown on family cards. */
  note?: string;
}

export interface Partner {
  name: string;
  shortName: string;
  /** "Groom" | "Bride" — used for headings and aria labels. */
  title: string;
  father: string;
  mother: string;
  bio: string;
  image: string;
  alt: string;
  /**
   * CSS `object-position` for the crop, e.g. "50% 32%".
   * Real photographs are mostly tall, and the layout crops them to circles,
   * 16:10 cards and masonry cells — this keeps faces inside the crop.
   * Omit for the default `50% 50%`.
   */
  focus?: string;
  /** 3–5 extra portraits used by the couple showcase. */
  gallery: GalleryImage[];
}

export type EventTheme = "haldi" | "mehendi" | "barat" | "reception";

export interface WeddingEvent {
  id: string;
  name: string;
  /** Human readable date, e.g. "23 November 2026". */
  date: string;
  /** ISO start used for calendar links and the countdown. */
  start: string;
  /** ISO end used for calendar links. */
  end: string;
  time: string;
  venue: string;
  address: string;
  description: string;
  theme: EventTheme;
  icon: string;
  image: string;
  alt: string;
  /**
   * CSS `object-position` for the crop, e.g. "50% 32%".
   * Real photographs are mostly tall, and the layout crops them to circles,
   * 16:10 cards and masonry cells — this keeps faces inside the crop.
   * Omit for the default `50% 50%`.
   */
  focus?: string;
  /** Whether this event gets an "Add to calendar" card. */
  calendar: boolean;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  /**
   * CSS `object-position` for the crop, e.g. "50% 32%".
   * Real photographs are mostly tall, and the layout crops them to circles,
   * 16:10 cards and masonry cells — this keeps faces inside the crop.
   * Omit for the default `50% 50%`.
   */
  focus?: string;
  /** Tall images span two rows in the masonry grid. */
  tall?: boolean;
}

export interface StoryMoment {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  description: string;
  image: string;
  alt: string;
  /**
   * CSS `object-position` for the crop, e.g. "50% 32%".
   * Real photographs are mostly tall, and the layout crops them to circles,
   * 16:10 cards and masonry cells — this keeps faces inside the crop.
   * Omit for the default `50% 50%`.
   */
  focus?: string;
  date: string;
  time: string;
  /** Replace with a real Google Maps link when the venue is confirmed. */
  mapsUrl: string;
}

export interface FamilyGroup {
  /** e.g. "Groom's Family" */
  title: string;
  subtitle: string;
  parents: [Person, Person];
  members: Person[];
}

export interface NavItem {
  label: string;
  href: `#${string}`;
}

export interface WeddingData {
  groom: Partner;
  bride: Partner;
  hashtag: string;
  invitationMessage: string;
  finalInvitationMessage: string;
  dateRange: string;
  /** ISO timestamp the countdown targets (the Barat). */
  countdownTarget: string;
  events: WeddingEvent[];
  story: StoryMoment[];
  groomFamily: FamilyGroup;
  brideFamily: FamilyGroup;
  gallery: GalleryImage[];
  venue: Venue;
  nav: NavItem[];
  music: { src: string; title: string };
  contact: { label: string; value: string; href: string }[];
}
