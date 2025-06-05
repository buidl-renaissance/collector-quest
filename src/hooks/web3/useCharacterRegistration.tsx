import { useState } from "react";
import { SuiClient as SuiAppClient } from "@/lib/client";
import { useCurrentCharacter } from "@/hooks/useCurrentCharacter";
import { getOrCreateWallet } from "@/lib/wallet";

// Package and registry constants - update these with your deployed contract addresses

export const useCharacterRegistration = () => {
  const { character, updateCharacter, saveCharacter } = useCurrentCharacter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredCharacter, setRegisteredCharacter] = useState<any>(null);
  const wallet = getOrCreateWallet();

  const registerCharacter = async () => {
    setIsRegistering(true);
    setError(null);
    setRegisteredCharacter(null);

    try {
      // Execute the transaction
      const result = await executeCharacterRegisterTransaction();
      console.log("result", result);
      if (result && result.events[0].parsedJson) {
        const createdCharacter = result.events[0].parsedJson;
        setRegisteredCharacter(createdCharacter);
        if (createdCharacter.character_id) {
          await updateCharacter({
            registration_id: createdCharacter.character_id,
          });
          await saveCharacter();
        }
      }
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to register character";
      setError(errorMessage);
      console.error("Character registration error:", err);
      return null;
    } finally {
      setIsRegistering(false);
    }
  };

  const executeCharacterRegisterTransaction = async () => {
    if (!character) {
      throw new Error("Character not found");
    }

    if (!wallet) {
      setError("Please connect your wallet first");
      return;
    }

    const client = new SuiAppClient(wallet);
    const result = await client.registerCharacter(character);
    return result;
  };

  const resetState = () => {
    setError(null);
    setRegisteredCharacter(null);
    setIsRegistering(false);
  };

  return {
    registerCharacter,
    isRegistering,
    error,
    registeredCharacter,
    resetState,
  };
};
