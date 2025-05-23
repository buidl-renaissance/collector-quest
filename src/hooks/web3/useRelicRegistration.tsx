import { useState } from "react";
import { Relic } from "@/data/artifacts";
import { SuiClient as SuiAppClient } from "@/lib/client";
import { getOrCreateWallet } from "@/lib/wallet";


export const useRelicRegistration = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredRelic, setRegisteredRelic] = useState<any>(null);
  const wallet = getOrCreateWallet();

  const registerRelic = async (relic: Relic) => {
    setIsRegistering(true);
    setError(null);
    setRegisteredRelic(null);

    try {
      // Execute the transaction
      const result = await executeRelicRegisterTransaction(relic);
      console.log("result", result);
      if (result && result.events[0].parsedJson) {
        const createdRelic = result.events[0].parsedJson;
        setRegisteredRelic(createdRelic);
        await registerRelicRequest(relic, createdRelic.relic_id);
      }
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to register relic";
      setError(errorMessage);
      console.error("Relic registration error:", err);
      return null;
    } finally {
      setIsRegistering(false);
    }
  };

  const executeRelicRegisterTransaction = async (relic: Relic) => {
    if (!relic) {
      throw new Error("Relic not found");
    }

    if (!wallet) {
      setError("Please connect your wallet first");
      return;
    }

    const client = new SuiAppClient(wallet);
    const result = await client.registerRelic(relic);
    console.log("result", result);
    return result;
  };

  const resetState = () => {
    setError(null);
    setRegisteredRelic(null);
    setIsRegistering(false);
  };

  return {
    registerRelic,
    isRegistering,
    error,
    registeredRelic,
    resetState,
  };
};

const registerRelicRequest = async (relic: Relic, registrationId: string) => {
    try {
      const response = await fetch("/api/relics/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          relicId: relic.id,
          registrationId: registrationId,
        }),
      });

        if (!response.ok) {
            throw new Error("Failed to register relic");
      }

      return await response.json();
    } catch (error) {
        console.error("Error registering relic:", error);
        throw error;
    }
};
