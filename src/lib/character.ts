import { Race } from "@/data/races";

/**
 * Saves a race to the database
 * @param race The race to save
 * @returns The saved race
 */
export const saveRace = async (race: Race) => {
   const response = await fetch("/api/races", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: race.id,
      name: race.name,
      source: race.source,
      description: race.description,
      image: race.image,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save race and image");
  }

  return response.json();
}