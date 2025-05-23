import { useState } from 'react';
import { Artifact, Relic } from '@/data/artifacts';
import { useRelicRegistration } from './web3/useRelicRegistration';

interface PollResult {
  success: boolean;
  status: string;
  result: string;
}

interface UseArtifactReturn {
  artifact: Artifact;
  isGenerating: boolean;
  generatedRelicUrl: string | null;
  showRelicModal: boolean;
  setShowRelicModal: (show: boolean) => void;
  handleRelicAction: () => Promise<void>;
  closeModal: () => void;
}

export const useArtifact = (initialArtifact: Artifact): UseArtifactReturn => {
  const [artifact, setArtifact] = useState<Artifact>(initialArtifact);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRelic, setGeneratedRelic] = useState<Relic | null>(initialArtifact?.relic || null);
  const [generatedRelicUrl, setGeneratedRelicUrl] = useState<string | null>(null);
  const [showRelicModal, setShowRelicModal] = useState(false);
  const { registerRelic } = useRelicRegistration();
  
  const closeModal = () => {
    setShowRelicModal(false);
  };

  const handleRelicAction = async () => {
    if (artifact.relic?.imageUrl) {
      // If relic exists, just show it in the modal
      setGeneratedRelicUrl(artifact.relic.imageUrl);
      setShowRelicModal(true);
    } else {
      // Generate new relic
      setShowRelicModal(true);
      setIsGenerating(true);
      try {
        const response = await fetch("/api/artifacts/relic", {
          method: "POST",
          body: JSON.stringify({ artifactId: artifact.id }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to start relic generation");
        }

        const relicResult = await response.json();

        // Start polling for the relic
        const pollInterval = setInterval(async () => {
          try {
            const resultStatusResponse = await fetch(`/api/image/status?id=${relicResult.resultId}`);
            if (!resultStatusResponse.ok) {
              throw new Error("Failed to fetch artifact");
            }
            
            const data: PollResult = await resultStatusResponse.json();
            const result = JSON.parse(data.result);

            if (result.artifact) {
              setArtifact(result.artifact);
            }

            if (result.relic?.imageUrl) {
              setGeneratedRelic(result.relic);
              setGeneratedRelicUrl(result.relic.imageUrl);
              if (!result.relic.objectId) {
                await registerRelic(result.relic);
              }
            }

            if (data.status === 'completed') {
              setIsGenerating(false);
              clearInterval(pollInterval);
            }
          } catch (error) {
            console.error("Error polling for relic:", error);
            clearInterval(pollInterval);
            setIsGenerating(false);
          }
        }, 2000); // Poll every 2 seconds

        // Clear interval after 2 minutes (timeout)
        setTimeout(() => {
          clearInterval(pollInterval);
          if (isGenerating) {
            setIsGenerating(false);
          }
        }, 120000);

      } catch (error) {
        console.error("Error generating relic:", error);
        setIsGenerating(false);
      }
    }
  };

  return {
    artifact,
    isGenerating,
    generatedRelicUrl,
    showRelicModal,
    setShowRelicModal,
    handleRelicAction,
    closeModal,
  };
};
