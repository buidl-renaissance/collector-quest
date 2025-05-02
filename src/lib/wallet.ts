/**
 * Utility functions for managing the user's Sui wallet and collected items
 */

import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

/**
 * Gets the user's Sui wallet from localStorage
 * @returns The wallet keypair or null if not found
 */
export const getWallet = (): Ed25519Keypair | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const walletData = localStorage.getItem("suiWallet");
    if (!walletData) return null;
    
    const keypairData = JSON.parse(walletData);
    // Recreate the keypair from the stored private key
    // The secretKey should be exactly 32 bytes
    return Ed25519Keypair.fromSecretKey(
      new Uint8Array(keypairData.privateKey.slice(0, 32))
    );
  } catch (error) {
    console.error("Error retrieving Sui wallet:", error);
    return null;
  }
};

/**
 * Creates a new Sui wallet and stores it in localStorage
 * @returns The newly created wallet keypair
 */
export const createWallet = (): Ed25519Keypair => {
  const keypair = new Ed25519Keypair();
  const exportedKeypair = keypair.export();
  
  // Store the keypair in localStorage (securely in production you'd use a more secure approach)
  // Ensure we're only storing the correct 32 bytes for the private key
  localStorage.setItem("suiWallet", JSON.stringify({
    privateKey: Array.from(exportedKeypair.privateKey.slice(0, 32)),
    publicKey: Array.from(keypair.getPublicKey().toSuiBytes())
  }));
  
  return keypair;
};

/**
 * Gets or creates a Sui wallet
 * @returns An existing or new wallet keypair
 */
export const getOrCreateWallet = (): Ed25519Keypair => {
  const existingWallet = getWallet();
  if (existingWallet) return existingWallet;
  return createWallet();
};

/**
 * Gets a Sui client for the current network
 * @returns A configured SuiClient
 */
export const getSuiClient = (): SuiClient => {
  return new SuiClient({ 
    url: process.env.NEXT_PUBLIC_NETWORK === 'mainnet' 
      ? 'https://fullnode.mainnet.sui.io:443'
      : 'https://fullnode.testnet.sui.io:443'
  });
};

/**
 * Gets the wallet address
 * @returns The wallet address as a string or null if wallet not found
 */
export const getWalletAddress = (): string | null => {
  const wallet = getWallet();
  return wallet ? wallet.getPublicKey().toSuiAddress() : null;
};

/**
 * Clears the Sui wallet from localStorage
 */
export const clearWallet = (): void => {
  localStorage.removeItem("suiWallet");
};

/**
 * Gets the collected NFTs for the current wallet
 * @returns Promise resolving to an array of owned NFT objects
 */
export const getCollectedNFTs = async () => {
  const client = getSuiClient();
  const address = getWalletAddress();
  
  if (!address) return [];
  
  try {
    const objects = await client.getOwnedObjects({
      owner: address,
      options: { showContent: true }
    });
    
    return objects.data || [];
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

/**
 * Gets the balance of the current wallet
 * @returns The balance as a number or null if wallet not found
 */
export const getBalance = async (): Promise<number | null> => {
  const client = getSuiClient();
  const address = getWalletAddress();
  
  if (!address) return null;
  
  try {
    const balance = await client.getBalance({
      owner: address,
      coinType: '0x2::sui::SUI'
    });
    
    return Number(balance.totalBalance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};

/**
 * Requests a sponsored transaction from the server
 * @param coinId The ID of the collectible coin to mint
 * @returns Promise resolving to the transaction result
 */
export const requestSponsoredTransaction = async (coinId: string): Promise<any> => {
  const wallet = getOrCreateWallet();
  const address = getWalletAddress();
  
  if (!wallet || !address) {
    throw new Error("Wallet not available");
  }
  
  try {
    // Send request to the sponsoring server with the coin ID and wallet address
    const response = await fetch('/api/sponsor-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coinId,
        address,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the sponsored transaction data from the server
    // This would typically involve signing the transaction with the wallet
    // and then executing it

    
    return data;
  } catch (error) {
    console.error("Error requesting sponsored transaction:", error);
    throw error;
  }
};
