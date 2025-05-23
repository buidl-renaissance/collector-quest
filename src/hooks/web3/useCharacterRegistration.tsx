import { useState } from "react";
import { Character } from "@/data/character";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SuiClient as SuiAppClient } from "@/lib/client";
import { useCharacter } from "@/hooks/useCharacter";
import { getOrCreateWallet } from "@/lib/wallet";

// Package and registry constants - update these with your deployed contract addresses
export const CHARACTER_PACKAGE_ID =
  "0xac616046431e16cbe4524e24c0219aa9e5efbd52f6750aafe63b82c4a92f6ee7";

export const useCharacterRegistration = () => {
  const { character, updateCharacter, saveCharacter } = useCharacter();
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

// Create a transaction to create a new character
export function registerCharacterTransaction(
  character: Character
): TransactionBlock {
  const tx = new TransactionBlock();

  // Set a gas budget to avoid dry run budget determination issues
  tx.setGasBudget(10_000_000); // 0.01 SUI

  tx.moveCall({
    target: `${CHARACTER_PACKAGE_ID}::character::create_character`,
    arguments: [
      tx.pure(Array.from(new TextEncoder().encode(character.name || ""))),
      tx.pure(
        Array.from(
          new TextEncoder().encode(
            "BEGIN YOUR COLLECTOR QUEST at https://collectorquest.ai"
          )
        )
      ),
      tx.pure(Array.from(new TextEncoder().encode(character.image_url || ""))),
      tx.pure(Array.from(new TextEncoder().encode(character.race?.name || ""))),
      tx.pure(
        Array.from(new TextEncoder().encode(character.class?.name || ""))
      ),
      // tx.pure(Array.from(new TextEncoder().encode(''))),
      // tx.pure(Array.from(new TextEncoder().encode(character.motivation || ''))),
      // tx.pure(Array.from(new TextEncoder().encode(character.backstory || ''))),
      tx.pure(Array.from(new TextEncoder().encode(character.sex || ""))),
    ],
  });

  return tx;
}

// Create a transaction to update character level
export function setCharacterLevelTransaction(
  characterId: string,
  level: number
): TransactionBlock {
  const tx = new TransactionBlock();

  // Set a gas budget
  tx.setGasBudget(5000000); // 0.005 SUI

  tx.moveCall({
    target: `${CHARACTER_PACKAGE_ID}::character::set_level`,
    arguments: [tx.object(characterId), tx.pure.u8(level)],
  });

  return tx;
}

// Create a transaction to transfer character ownership
export function transferCharacterTransaction(
  characterId: string,
  recipient: string
): TransactionBlock {
  const tx = new TransactionBlock();

  // Set a gas budget
  tx.setGasBudget(5000000); // 0.005 SUI

  tx.moveCall({
    target: `${CHARACTER_PACKAGE_ID}::character::transfer_character`,
    arguments: [tx.object(characterId), tx.pure.address(recipient)],
  });

  return tx;
}

// Create a transaction to delete a character
export function deleteCharacterTransaction(
  characterId: string
): TransactionBlock {
  const tx = new TransactionBlock();

  // Set a gas budget
  tx.setGasBudget(5000000); // 0.005 SUI

  tx.moveCall({
    target: `${CHARACTER_PACKAGE_ID}::character::delete_character`,
    arguments: [tx.object(characterId)],
  });

  return tx;
}
