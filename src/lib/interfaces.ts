export interface TimeSlot {
  id: number;
  date: string;
  datetime: string;
  startTime: string;
  endTime: string;
};

export interface Rsvp {
  id?: number;
  name: string;
  email: string;
  guests: number;
  datetime?: string;
  timeSlot?: TimeSlot;
  message?: string;
  confirmed?: boolean;
}

export interface Artist {
  id: number;
  name: string;
  handle: string;
  slug: string;
  profile_picture: string;
  bio: string;
  artwork?: Artwork[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ArtworkData {
  image?: string;
  collaborator_ids?: number[];
  is_for_sale?: boolean;
  price?: number;
  num_collaborators?: number;
  review?: {
    text: string;
    image: string;
  };
  artist_name?: string;
  uploaded_by?: string;
  transaction_digest?: string;
}

export interface Artwork {
  id: number;
  slug: string;
  title: string;
  description: string;
  artist_id?: number;
  artist?: Artist;
  collaborators?: Artist[];
  content?: Content[];
  data: ArtworkData;
  meta: Record<string, unknown>;
}

export interface Content {
  id: number;
  user: User;
  data: {
    width: number;
    height: number;
    type: string;
    youtubeId?: string;
    url?: string;
  };
  caption: string;
  timestamp: string;
  artwork: Artwork;
}

export interface Contact {
  cid?: string;
  name: string;
  email: string;
  phone: string;
  public_name: string;
  organization?: string;
}

export interface ImageData {
  file: string;
  width: number;
  height: number;
  "mime-type": string;
  filesize: number;
  url: string;
}

export interface DPoPEvent {
  categories: string[];
  cid: string;
  comments?: DPoPEventComment[];
  content: string;
  end_date: string;
  event_categories: string[];
  excerpt: string;
  featured: boolean;
  host: string | null;
  id: number;
  image_data: ImageData;
  image: string;
  slug: string;
  start_date: string;
  title: string;
  url?: string;
  venue_id?: number;
  venue: Venue;
}


export interface Member {
  id: number;
  user: User;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  cover: string;
  data: {
    type: string;
  };
  members?: Member[];
  is_member?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: number;
  cid: string;
  title: string;
  slug: string;
  image: string;
  geo: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    zipcode?: string;
  };
  event_count?: number;
  event_ids?: number[];
}

export interface DPoPEventRsvp {
  cid?: string;
  event_cid: string;
  user_cid: string;
  user?: User;
  number?: number;
  confirmed?: boolean;
}

export interface DPoPEventCheckIn {
  cid?: string;
  event_cid: string;
  user_cid: string;
  user?: User;
  rsvp?: DPoPEventRsvp;
  attestator?: User;
}

export interface DPoPEventComment {
  id: number;
  text: string;
  user: User;
}

export interface User {
  cid: string;
  created_at: string;
  email: string;
  email_verified_at: string | null;
  id: number;
  name: string;
  bio: string | null;
  phone: string | null;
  public_address: string | null;
  public_name: string | null; 
  organization: string | null;
  profile_picture: string | null;
  data: {
    instagram?: string | null;
    linkedin?: string | null;
    telegram?: string | null;
    twitter?: string | null;
  };
  communities?: Community[];
  updated_at: string;
}

export interface ContentSignature {
  content_id: string;
  signature: string;
  address: string;
}


export interface EventConnection {
  id: number;
  event_cid: string;
  connection_cid: string;
  connection: User;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  data: {
    image?: string;
    url?: string;
    parentMessageId?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Handle {
  id: string;
  name: string;
  owner: string;
  confirmed?: boolean;
}

export interface Artifact {
  id: string;
  title: string;
  description: string;
  image: string;
  attributes: {
    name: string;
    trait_type: string;
    value: string;
  }[];
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  description: string;
  videoUrl: string;
  script: string;
  realmId: string;
  artwork: string;
  createdAt: string;
}

export interface StoryResponse {
  id: string;
  storyId: string;
  response: string;
  createdAt: string;
}


// Types
