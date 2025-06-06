import { useState, useEffect, useCallback } from "react";
import { getCurrentCharacterId } from "@/utils/storage";
import { useCurrentCharacter } from "./useCurrentCharacter";
import { Traits } from "./useCurrentCharacter";
import { GenerationResult } from "@/data/generate";

interface GenerateTraitsResponse {
  success: boolean;
  event: GenerationResult<Traits>;
  message: string;
}

interface ResultData {
  step?: string;
  message?: string;
  traits?: {
    bonds?: string[];
    flaws?: string[];
    ideals?: string[];
    personality?: string[];
  };
  success?: boolean;
}

// Local storage key for generated traits
const GENERATED_TRAITS_STORAGE_KEY = "generatedTraits";

export function useGeneratedTraits() {
  const { character } = useCurrentCharacter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [traits, setTraits] = useState<Traits | null>(null);
  const [event, setEvent] = useState<GenerationResult<Traits> | null>(null);

  const loadTraits = useCallback(() => {
    const characterId = getCurrentCharacterId();
    if (characterId) {
      const storedTraits = localStorage.getItem(
        `${GENERATED_TRAITS_STORAGE_KEY}_${characterId}`
      );
      if (storedTraits) {
        const storedTraitsObject = JSON.parse(storedTraits);
        setTraits(storedTraitsObject);
        return storedTraitsObject;
      }
      return null;
    }
  }, []);

  useEffect(() => {
    loadTraits();
  }, [loadTraits]);

  // Function to start the trait generation process
  const generateTraits = async () => {
    const existingTraits = loadTraits();

    if (event || existingTraits || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const characterId = getCurrentCharacterId();
      if (!characterId) {
        throw new Error("No character selected");
      }

      const response = await fetch("/api/character/generate-traits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ characterId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start trait generation");
      }

      const data: GenerateTraitsResponse = await response.json();
      setEvent(data.event);

      // Start polling for results
      pollForResults(data.event.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
    }
  };

  // Function to poll for results
  const pollForResults = async (id: string) => {
    let pollTimeout: NodeJS.Timeout;

    try {
      const response = await fetch(`/api/generate/results?id=${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch results");
      }

      const data = await response.json();

      const result = data.result;

      if (result) {
        // Update character with the generated traits
        setTraits(result);
        setLoading(false);

        // Save to local storage
        const characterId = getCurrentCharacterId();
        if (characterId) {
          localStorage.setItem(
            `${GENERATED_TRAITS_STORAGE_KEY}_${characterId}`,
            JSON.stringify(result)
          );
        }
      }

      if (data.status === "pending") {
        // Continue polling after a delay
        pollTimeout = setTimeout(() => pollForResults(id), 2000);
      } else if (data.status === "failed") {
        throw new Error(data.error || "Trait generation failed");
      } else if (data.status === "completed") {
        setLoading(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
    }

    // Clear timeout when function exits
    return () => {
      if (pollTimeout) {
        clearTimeout(pollTimeout);
      }
    };
  };

  // Clear any previous state
  const reset = () => {
    setLoading(false);
    setError(null);
    setEvent(null);
    setTraits(null);

    // Clear from local storage
    const characterId = getCurrentCharacterId();
    if (characterId) {
      localStorage.removeItem(`${GENERATED_TRAITS_STORAGE_KEY}_${characterId}`);
    }
  };

  return {
    generateTraits,
    loading,
    error,
    traits,
    reset,
  };
}

export default useGeneratedTraits;
