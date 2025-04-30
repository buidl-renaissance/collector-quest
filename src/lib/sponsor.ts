// Node.js example
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { getSuiClient } from "./wallet";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export class SponsorService {
  /**
   * Executes a sponsored transaction
   * @param bytes The transaction bytes to sponsor and execute
   * @param userSignature Optional user signature for the transaction
   * @returns The transaction execution result
   */
  static async executeSponsorTransaction(
    sponsoredTx: any,
    userSignature?: string
  ) {
    try {
      const suiClient = getSuiClient();

      // console.log("EXECUTING TRANSACTION", {
      //   transactionBlock: sponsoredTx.transactionBytes,
      //   signature: userSignature
      //     ? [sponsoredTx.signature, userSignature]
      //     : [sponsoredTx.signature],
      //   options: {
      //     showEffects: true,
      //     showEvents: true,
      //   },
      // });

      // Execute the transaction with the client
      const result = await suiClient.executeTransactionBlock({
        transactionBlock: sponsoredTx.transactionBytes,
        signature: userSignature
          ? [sponsoredTx.signature, userSignature]
          : [sponsoredTx.signature],
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      return result;
    } catch (error) {
      console.error("Error executing sponsored transaction:", error);
      throw new Error("Failed to execute sponsored transaction");
    }
  }

  /**
   * Sponsors a transaction by adding gas and signing it
   * @param bytes The transaction bytes to sponsor
   * @param userSignature The user's signature for the transaction
   * @returns The sponsored transaction with signatures
   */
  static async sponsorTransaction(
    bytes: string,
    userAddress: string,
    userSignature?: string
  ) {
    try {
      const sponsorKeypair = this.getSponsorKeypair();
      const sponsorAddress = sponsorKeypair.getPublicKey().toSuiAddress();
      const suiClient = getSuiClient();

      console.log(
        "SPONSORING TRANSACTION",
        sponsorAddress,
        bytes,
        userSignature
      );

      const fullBytes = Buffer.from(bytes, "base64");
      // const transactionBlock = TransactionBlock.fromKind(bytes);
      // transactionBlock.setSender(userAddress);
      // transactionBlock.setGasOwner(sponsorAddress);
      // transactionBlock.setGasBudget(100000000);
      // const fullBytes = await transactionBlock.build({ client: suiClient });

      // console.log("FULL BYTES", fullBytes);

      const sponsorSignature = await sponsorKeypair.signTransactionBlock(
        fullBytes
      );

      // Execute the transaction with the client
      const result = await suiClient.executeTransactionBlock({
        transactionBlock: fullBytes,
        signature: userSignature
          ? [sponsorSignature.signature, userSignature]
          : [sponsorSignature.signature],
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      console.log("RESULT", result);
      // Return the sponsored transaction with signatures
      return result;
    } catch (error) {
      console.error("Error sponsoring transaction:", error);
      throw new Error("Failed to sponsor transaction");
    }
  }

  /**
   * Generates a new private key
   * @returns The base64 encoded private key
   */
  static generatePrivateKey(): string {
    const keypair = new Ed25519Keypair();

    // Step 2: Get the secret key (32 bytes)
    const secretKey = keypair.getSecretKey(); // Uint8Array, 32 bytes

    // Step 3: Encode to base64
    return Buffer.from(secretKey).toString("base64");

    // const privateKeyBytes = keypair.getSecretKey();
    //   return Buffer.from(privateKeyBytes).toString('hex');
  }

  /**
   * Loads the sponsor keypair from the environment variable or uses a hardcoded key
   * @returns The sponsor keypair for transaction sponsoring
   */
  static getSponsorKeypair(): Ed25519Keypair {
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
  }
}

// For backward compatibility
export const generatePrivateKey = SponsorService.generatePrivateKey;
export const getSponsorKeypair = SponsorService.getSponsorKeypair;
