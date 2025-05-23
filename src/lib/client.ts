import { TransactionBlock } from "@mysten/sui.js/transactions";
import { registerHandleTransaction } from "./mint";
import { getSuiClient } from "./wallet";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { Character } from "@/data/character";
import { CHARACTER_PACKAGE_ID } from "@/hooks/web3/useCharacterRegistration";

export class SuiClient {
  private client: ReturnType<typeof getSuiClient>;
  private userWallet: Ed25519Keypair;
  constructor(userWallet: Ed25519Keypair) {
    this.client = getSuiClient();
    this.userWallet = userWallet;
  }

  async registerCharacter(character: Character) {
    const owner = this.userWallet.getPublicKey().toSuiAddress();
    // Create a transaction to create a new character
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

    tx.setSender(owner);
    tx.setGasOwner('0x1551923e851c9ffe82ea65139d123b0ec32784d65c06ab6b7a3d75aea00b6b85');
    tx.setGasBudget(100000000);
    const bytes = await tx.build({
      client: this.client,
    //   onlyTransactionKind: true,
    });
    const signedTx = await this.userWallet.signTransactionBlock(bytes);
    return await this.sponsorTransaction(signedTx.bytes, signedTx.signature);
  }


  async registerHandle(
    handle: string,
    imageUrl: string,
    owner: string,
    pinCode: string,
    guardians: string[]
  ) {
    const tx = registerHandleTransaction({ handle, imageUrl, owner, pinCode, guardians });
    tx.setSender(owner);
    tx.setGasOwner('0x1551923e851c9ffe82ea65139d123b0ec32784d65c06ab6b7a3d75aea00b6b85');
    tx.setGasBudget(100000000);
    const bytes = await tx.build({
      client: this.client,
    //   onlyTransactionKind: true,
    });
    const signedTx = await this.userWallet.signTransactionBlock(bytes);
    return await this.sponsorTransaction(signedTx.bytes, signedTx.signature);
  }

  async executeRegisterHandle(
    handle: string,
    imageUrl: string,
    owner: string,
    pinCode: string,
    guardians: string[]
  ) {
    const tx = registerHandleTransaction({ handle, imageUrl, owner, pinCode, guardians });
    const bytes = await tx.build({ client: this.client });

    return await this.client.executeTransactionBlock({
      transactionBlock: bytes,
      signature: [], // Adding required signature property
      options: {
        showEffects: true,
        showEvents: true,
      },
    });
  }

  /**
   * Sponsors a transaction by sending it to the sponsor API endpoint
   * @param transactionBytes The transaction bytes to sponsor
   * @param userSignature Optional user signature for the transaction
   * @returns The result of the sponsored transaction execution
   */
  async sponsorTransaction(
    transactionBytes: string,
    userSignature?: string
  ) {
    try {
      // Prepare the request payload
      const payload = {
        transactionBytes,
        userAddress: this.userWallet.getPublicKey().toSuiAddress(),
        userSignature,
      };

      // Send the request to the sponsor API endpoint
      const response = await fetch("/api/sponsor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Parse and validate the response
      const res = await response.json();

      if (!res.success) {
        throw new Error(res.error || "Sponsoring transaction failed");
      }

      const sponsoredTx = res.result;

      return sponsoredTx;
      
    //   // Sign the sponsored transaction bytes directly without any conversion
    //   const userSponsoredSignature = await this.userWallet.signTransactionBlock(
    //     sponsoredTx.transactionBytes
    //   );

    //   console.log("USER SPONSORED SIGNATURE", userSponsoredSignature);

    //   const executeResponse = await fetch("/api/sponsor/execute", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       transactionBytes: sponsoredTx.transactionBytes,
    //       userSignature: userSponsoredSignature.signature,
    //     }),
    //   });

    //   const executeRes = await executeResponse.json();

    //   console.log("RESULT", executeRes.result);

    //   return executeRes.result;
    } catch (error) {
      console.error("Error sponsoring transaction:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to sponsor transaction"
      );
    }
  }

  async executeTransaction(transactionBytes: string) {
    return await this.client.executeTransactionBlock({
      transactionBlock: transactionBytes,
      signature: [],
      options: { showEffects: true, showEvents: true },
    });
  }

}

// For backward compatibility
export const registerHandle = async (
  userWallet: Ed25519Keypair,
  handle: string,
  imageUrl: string,
  owner: string,
  pinCode: string,
  guardians: string[]
) => {
  const suiClient = new SuiClient(userWallet);
  return suiClient.registerHandle(handle, imageUrl, owner, pinCode, guardians);
};
