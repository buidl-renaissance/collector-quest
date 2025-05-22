import { useState, useEffect, useCallback } from "react";
import { getCurrentCharacterId } from "@/utils/storage";
import { useCharacter } from "./useCharacter";
import { Traits } from "./useCharacter";

interface GenerateTraitsResponse {
  success: boolean;
  resultId: string;
  message: string;
}

interface PollResultResponse {
  id: string;
  status: "pending" | "completed" | "failed";
  result?: string;
  error?: string;
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
  const { character } = useCharacter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [traits, setTraits] = useState<Traits | null>(null);

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

    if (resultId || existingTraits || loading) {
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
      setResultId(data.resultId);

      // Start polling for results
      pollForResults(data.resultId);
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
      const response = await fetch(`/api/image/status?id=${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch results");
      }

      const result: PollResultResponse = await response.json();

      const resultData: ResultData = result.result
        ? JSON.parse(result.result)
        : null;

      if (resultData?.traits) {
        // Update character with the generated traits
        setTraits(resultData.traits);

        // Save to local storage
        const characterId = getCurrentCharacterId();
        if (characterId) {
          localStorage.setItem(
            `${GENERATED_TRAITS_STORAGE_KEY}_${characterId}`,
            JSON.stringify(resultData.traits)
          );
        }
      }

      if (result.status === "pending") {
        // Continue polling after a delay
        pollTimeout = setTimeout(() => pollForResults(id), 2000);
      } else if (result.status === "failed") {
        throw new Error(result.error || "Trait generation failed");
      } else if (result.status === "completed") {
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
    setResultId(null);
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
