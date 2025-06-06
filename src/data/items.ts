export interface ItemAttribute {
  name: string;
  value: number;
  description?: string;
}

export interface ItemProperties {
  weight?: number;
  value?: number;
  rarity?: string;
  obtainedBy?: string;
}

export interface Item {
  id: string;
  objectId?: string;
  owner?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  quantity?: number;
  attributes?: ItemAttribute[];
  properties?: ItemProperties;
  lore?: string;
  type?: string;
}
