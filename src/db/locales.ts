import client from "./client";
import { Locale, LocaleType } from "../data/locales";
import { v4 as uuidv4 } from "uuid";

export async function createLocale(
  locale: Omit<Locale, "id" | "createdAt" | "updatedAt">
): Promise<Locale> {
  const id = uuidv4();
  
  await client("locales")
    .insert({
      id,
      name: locale.name,
      description: locale.description,
      imageUrl: locale.imageUrl,
      isRealWorld: locale.isRealWorld,
      type: locale.type,
      grid: locale.grid ? JSON.stringify(locale.grid) : null,
      geoLocation: locale.geoLocation ? JSON.stringify(locale.geoLocation) : null
    });

  const newLocale = await getLocale(id);
  if (!newLocale) {
    throw new Error("Failed to create locale");
  }
  return newLocale;
}

export async function updateLocale(
  id: string,
  locale: Partial<Omit<Locale, "id" | "createdAt" | "updatedAt">>
): Promise<Locale | null> {
  const updateData: any = { ...locale };
  if (locale.grid) {
    updateData.grid = JSON.stringify(locale.grid);
  }
  if (locale.geoLocation) {
    updateData.geoLocation = JSON.stringify(locale.geoLocation);
  }

  await client("locales")
    .where({ id })
    .update(updateData);

  return getLocale(id);
}

export async function getLocale(id: string): Promise<Locale | null> {
  const result = await client("locales")
    .where({ id })
    .first();

  if (!result) return null;

  return {
    ...result,
    grid: result.grid ? JSON.parse(result.grid) : undefined,
    geoLocation: result.geoLocation ? JSON.parse(result.geoLocation) : undefined
  };
}

export async function listLocales(filters?: {
  type?: LocaleType;
  isRealWorld?: boolean;
}): Promise<Locale[]> {
  let query = client("locales").select("*");

  if (filters?.type) {
    query = query.where("type", filters.type);
  }

  if (filters?.isRealWorld !== undefined) {
    query = query.where("isRealWorld", filters.isRealWorld);
  }

  const results = await query;

  return results.map(result => ({
    ...result,
    grid: result.grid ? JSON.parse(result.grid) : undefined,
    geoLocation: result.geoLocation ? JSON.parse(result.geoLocation) : undefined
  }));
}