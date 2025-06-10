import { useState } from "react";
import { GenerationResult } from "@/data/generate";

interface GenerationStatus {
  step: string;
  message: string;
  result?: any;
}

export const useGeneratedResult = <T,>() => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus | null>(null);
  const [result, setResult] = useState<T | null>(null);
  const [event, setEvent] = useState<GenerationResult<T> | null>(null);

  const startGeneration = async (
    generateFn: () => Promise<{ event: GenerationResult<T>; result?: T }>
  ) => {
    setIsGenerating(true);
    setError(null);
    setStatus(null);

    try {
      const { event, result } = await generateFn();

      if (result) {
        setResult(result);
        setIsGenerating(false);
      } else {
        setEvent(event);
        pollStatus(event.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start generation");
      setIsGenerating(false);
    }
  };

  const pollStatus = async (resultId: string) => {
    try {
      const response = await fetch(`/api/generate/results?id=${resultId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch status");
      }

      const data = await response.json();
      setStatus(data);

      const result = data.result;

      if (result) {
        setResult(result);
        setIsGenerating(false);
      } else if (data.step !== "complete") {
        // Continue polling if not complete
        setTimeout(() => pollStatus(resultId), 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
      setIsGenerating(false);
    }
  };

  return {
    startGeneration,
    isGenerating,
    error,
    status,
    result,
    event,
  };
};
