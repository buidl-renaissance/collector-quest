import { useState } from "react";
import { Artifact } from "@/data/artifacts";
import { SuiClient as SuiAppClient } from "@/lib/client";
import { getOrCreateWallet } from "@/lib/wallet";


export const useArtifactRegistration = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredArtifact, setRegisteredArtifact] = useState<any>(null);
  const wallet = getOrCreateWallet();

  const registerArtifact = async (artifact: Artifact) => {
    setIsRegistering(true);
    setError(null);
    setRegisteredArtifact(null);

    try {
      // Execute the transaction
      const result = await executeArtifactRegisterTransaction(artifact);
      console.log("result", result);
      if (result && result.events[0].parsedJson) {
        const createdArtifact = result.events[0].parsedJson;
        setRegisteredArtifact(createdArtifact);
        await registerArtifactRequest(artifact, createdArtifact.artifact_id);
      }
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to register artifact";
      setError(errorMessage);
      console.error("Artifact registration error:", err);
      return null;
    } finally {
      setIsRegistering(false);
    }
  };

  const executeArtifactRegisterTransaction = async (artifact: Artifact) => {
    if (!artifact) {
      throw new Error("Artifact not found");
    }

    if (!wallet) {
      setError("Please connect your wallet first");
      return;
    }

    const client = new SuiAppClient(wallet);
    const result = await client.registerArtifact(artifact);
    return result;
  };

  const resetState = () => {
    setError(null);
    setRegisteredArtifact(null);
    setIsRegistering(false);
  };

  return {
    registerArtifact,
    isRegistering,
    error,
    registeredArtifact,
    resetState,
  };
};

const registerArtifactRequest = async (artifact: Artifact, registrationId: string) => {
    try {
      const response = await fetch("/api/artifacts/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artifactId: artifact.id,
          registrationId: registrationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register artifact");
      }

      return await response.json();
    } catch (error) {
      console.error("Error registering artifact:", error);
      throw error;
    }
  };
