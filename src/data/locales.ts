export enum LocaleType {
  CITY = "city",
  TOWN = "town",
  VILLAGE = "village",
  CASTLE = "castle",
  TEMPLE = "temple",
  HALL = "hall",
  HALLWAY = "hallway",
  TOWER = "tower",
  FORT = "fort",
  WALL = "wall",
  GATE = "gate",
  PORTAL = "portal",
  BRIDGE = "bridge",
  ROAD = "road",
  TUNNEL = "tunnel",
  PASSAGE = "passage",
  TAVERN = "tavern",
  VENUE = "venue",
  INN = "inn",
  SHIP = "ship",
  PLANE = "plane",
  BOAT = "boat",
  CARAVAN = "caravan",
  CAMP = "camp",
  CHAMBER = "chamber",
  ROOM = "room",
  RUINS = "ruins",
  DUNGEON = "dungeon",
  CAVE = "cave",
  FOREST = "forest",
  MOUNTAIN = "mountain",
  LAKE = "lake",
  RIVER = "river",
  SEA = "sea",
  ISLAND = "island",
  OTHER = "other",
}

export interface Locale {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isRealWorld?: boolean;
  type: LocaleType;
  grid?: {
    origin: [number, number, number];
    squares?: [number, number, number][];
  };
  geoLocation?: {
    lat: number;
    lng: number;
    geometry?: {
      type:
        | "Point"
        | "Polygon"
        | "LineString"
        | "MultiPoint"
        | "MultiPolygon"
        | "MultiLineString"
        | "GeometryCollection";
      coordinates: [number, number] | [number, number][] | [number, number][][];
    };
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    countryCode?: string;
    placeId?: string;
  };
}
