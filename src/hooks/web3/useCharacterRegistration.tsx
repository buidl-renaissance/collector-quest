import { useState } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Character } from '@/data/character';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from "@mysten/sui.js/client";
import { useCharacter } from '@/hooks/useCharacter';
// Package and registry constants - update these with your deployed contract addresses
export const CHARACTER_PACKAGE_ID = '0xac616046431e16cbe4524e24c0219aa9e5efbd52f6750aafe63b82c4a92f6ee7';

const client = new SuiClient({
  url: process.env.SUI_CLIENT_URL || "https://fullnode.testnet.sui.io:443",
});

export const useCharacterRegistration = () => {
  const { character, updateCharacter, saveCharacter } = useCharacter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredCharacter, setRegisteredCharacter] = useState<any>(null);
  const wallet = useWallet();

  const registerCharacter = async () => {
    if (!wallet.connected) {
      setError('Wallet not connected');
      return null;
    }

    setIsRegistering(true);
    setError(null);
    setRegisteredCharacter(null);

    try {      
      // Execute the transaction
      const result = await executeCharacterRegisterTransaction();

      // Wait for the transaction to be confirmed
      await confirmTransaction(result.digest);
      
      setRegisteredCharacter(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register character';
      setError(errorMessage);
      console.error('Character registration error:', err);
      return null;
    } finally {
      setIsRegistering(false);
    }
  };

  const executeCharacterRegisterTransaction = async () => {
    if (!character) {
      throw new Error('Character not found');
    }

    const tx = registerCharacterTransaction(character);

    const txResult = await wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx as any,
      options: {
        showObjectChanges: true,
        showEvents: true,
        showEffects: true,
      },
    });
    return txResult;
  }
 
  const confirmTransaction = async (digest: string) => {
    let confirmedResult;
    for (let i = 0; i < 10; i++) {
      confirmedResult = await client.getTransactionBlock({ digest, options: {
        showObjectChanges: true,
        showEvents: true,
        showEffects: true,
      }});

      // Find the created character from object changes
      const createdCharacter = confirmedResult.objectChanges?.find((o: any) => 
        o.type === 'created' && o.objectType.includes('character::Character')
      );

      if (createdCharacter) {
        console.log("created character", createdCharacter);
        setRegisteredCharacter(createdCharacter);
        const objectId = (createdCharacter as any).objectId as string;
        await updateCharacter({ registration_id: objectId });
        await saveCharacter();
        break;
      }

      console.log("confirmedResult", confirmedResult);

      if (confirmedResult.confirmedLocalExecution) {
        break;
      }

      // wait 1 sec
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

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
    isConnected: wallet.connected,
  };
};

// Create a transaction to create a new character
export function registerCharacterTransaction(character: Character): TransactionBlock {
  const tx = new TransactionBlock();

  // Set a gas budget to avoid dry run budget determination issues
  tx.setGasBudget(10_000_000); // 0.01 SUI

  tx.moveCall({
    target: `${CHARACTER_PACKAGE_ID}::character::create_character`,
    arguments: [
      tx.pure(Array.from(new TextEncoder().encode(character.name || ''))),
      tx.pure(Array.from(new TextEncoder().encode('BEGIN YOUR COLLECTOR QUEST at https://collectorquest.ai'))),
      tx.pure(Array.from(new TextEncoder().encode(character.image_url || ''))),
      tx.pure(Array.from(new TextEncoder().encode(character.race?.name || ''))),
      tx.pure(Array.from(new TextEncoder().encode(character.class?.name || ''))),
      // tx.pure(Array.from(new TextEncoder().encode(''))),
      // tx.pure(Array.from(new TextEncoder().encode(character.motivation || ''))),
      // tx.pure(Array.from(new TextEncoder().encode(character.backstory || ''))),
      tx.pure(Array.from(new TextEncoder().encode(character.sex || ''))),
    ],
  });

  return tx;
}

// Create a transaction to update character level
export function setCharacterLevelTransaction(characterId: string, level: number): TransactionBlock {
  const tx = new TransactionBlock();
  
  // Set a gas budget
  tx.setGasBudget(5000000); // 0.005 SUI

  tx.moveCall({
    target: `${CHARACTER_PACKAGE_ID}::character::set_level`,
    arguments: [
      tx.object(characterId),
      tx.pure.u8(level),
    ],
  });

  return tx;
}

// Create a transaction to transfer character ownership
export function transferCharacterTransaction(characterId: string, recipient: string): TransactionBlock {
  const tx = new TransactionBlock();
  
  // Set a gas budget
  tx.setGasBudget(5000000); // 0.005 SUI

  tx.moveCall({
    target: `${CHARACTER_PACKAGE_ID}::character::transfer_character`,
    arguments: [
      tx.object(characterId),
      tx.pure.address(recipient),
    ],
  });

  return tx;
}

// Create a transaction to delete a character
export function deleteCharacterTransaction(characterId: string): TransactionBlock {
  const tx = new TransactionBlock();
  
  // Set a gas budget
  tx.setGasBudget(5000000); // 0.005 SUI

  tx.moveCall({
    target: `${CHARACTER_PACKAGE_ID}::character::delete_character`,
    arguments: [
      tx.object(characterId),
    ],
  });

  return tx;
}
