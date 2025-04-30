// Node.js example
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

export const generatePrivateKey = () => {
  const keypair = new Ed25519Keypair();

  // Step 2: Get the secret key (32 bytes)
  const secretKey = keypair.getSecretKey(); // Uint8Array, 32 bytes

  // Step 3: Encode to base64
  return Buffer.from(secretKey).toString("base64");

  // const privateKeyBytes = keypair.getSecretKey();
  //   return Buffer.from(privateKeyBytes).toString('hex');
};
/**
 * Loads the sponsor keypair from the environment variable or uses a hardcoded key
 * @returns The sponsor keypair for transaction sponsoring
 */
export const getSponsorKeypair = () => {
  try {
    // Use the hardcoded private key for the sponsor
    const privateKey = process.env.LORD_SMEARINGTON_PK;

    if (!privateKey) {
      throw new Error(
        "Sponsor private key (LORD_SMEARINGTON_PK) not found in environment variables"
      );
    }

    // const privateKeyBytes = Uint8Array.from(Buffer.from(privateKey, "hex"));
    const keypairBytes = Uint8Array.from(Buffer.from(privateKey, "base64"));
    const privateKeyBytes = keypairBytes.slice(0, 32);

    // Create and return the keypair from the Sui private key format
    return Ed25519Keypair.fromSecretKey(privateKeyBytes);
  } catch (error) {
    console.error("Error creating sponsor keypair:", error);
    throw new Error(
      "Failed to create sponsor keypair from provided private key"
    );
  }
};
