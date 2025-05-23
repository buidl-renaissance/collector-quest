import { getOrCreateWallet, getWalletAddress, clearWallet, getSuiClient } from "@/lib/wallet";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { useEffect, useState } from "react";

export const useWallet = () => {
  const [wallet, setWallet] = useState<Ed25519Keypair | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const client = getSuiClient();

  useEffect(() => {
    const wallet = getOrCreateWallet();
    setWallet(wallet);
    const address = getWalletAddress();
    setAddress(address);
  }, []);

  const disconnect = () => {
    clearWallet();
  };

  const getBalance = async () => {
    if (!address) return null;
    try {
      const balance = await client.getBalance({ owner: address });
      return balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  };

  const getOwnedObjects = async () => {
    if (!address) return [];
    try {
      const objects = await client.getOwnedObjects({
        owner: address,
        options: { showContent: true }
      });
      return objects.data;
    } catch (error) {
      console.error("Error fetching owned objects:", error);
      return [];
    }
  };

  return {
    wallet,
    address,
    client,
    disconnect,
    getBalance,
    getOwnedObjects,
    connected: !!wallet && !!address
  };
};
