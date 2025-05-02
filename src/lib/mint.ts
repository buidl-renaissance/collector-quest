import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getSponsorKeypair } from "./sponsor";
import { getSuiClient } from "./wallet";
import { Artifact } from "./interfaces";

export const getArtifactSponsoredTx = async (artifact: Artifact) => {
  const tx = new TransactionBlock();

  // Check the correct number of arguments for the mint function
  // Assuming we need to fix the number of arguments based on the error
  tx.moveCall({
    target:
      "0x78b86454d1f4ac9fe1b8261d0a824b0fa7fe24b0967a8c6b2d3935a5f7e88b6f::collectible::mint",
    arguments: [
      tx.pure(
        "0x379276e515345598b1d337018599c6b90844086ebacdb241faf6a350388b7aa1"
      ), // Publisher object ID
      tx.pure(artifact.id), // Coin ID
      tx.pure(artifact.title), // Title
      tx.pure(artifact.description), // Description
      tx.pure(artifact.image), // Image URL
      tx.pure(artifact.attributes), // Attributes
      // Add any missing required arguments here if needed
    ],
  });

  tx.setGasBudget(10000000);

  tx.setSender(
    "0x3094f32ff9bb1dd472d49b181c15f1e3729eccad8dbe513819d0712923efd6b7"
  );

  // Build the transaction with the client to get proper gas estimation
  const client = getSuiClient();
  const txBytes = await tx.build({ client });

  const keypair = getSponsorKeypair();
  const signedTx = await keypair.signTransactionBlock(txBytes);

  return signedTx;
};

export const mintArtifactForUser = async (
  artifact: Artifact,
) => {
  try {
    const client = getSuiClient();
    const tx = new TransactionBlock();

    const sponsorKeypair = getSponsorKeypair();
    tx.setSender(sponsorKeypair.getPublicKey().toSuiAddress());

    // Call the mint function with the correct parameters based on the collectible module
    tx.moveCall({
      target:
        "0x78b86454d1f4ac9fe1b8261d0a824b0fa7fe24b0967a8c6b2d3935a5f7e88b6f::collectible::mint",
      arguments: [
        tx.pure(
          "0x379276e515345598b1d337018599c6b90844086ebacdb241faf6a350388b7aa1"
        ), // Registry object ID
        tx.pure(artifact.title), // Title
        tx.pure(artifact.description || "A digital collectible"), // Description
        tx.pure(artifact.image), // Image URL
        tx.pure(artifact.attributes), // Attributes
        // The ctx parameter is automatically provided by the Move runtime
      ],
    });
    tx.setGasBudget(10000000);

    console.log("sponsorKeypair", sponsorKeypair.getPublicKey().toSuiAddress());

    // Set the transaction sender

    // Build the transaction
    const bytes = await tx.build({ client });

    // Sign and execute the transaction with additional options
    const result = await client.signAndExecuteTransactionBlock({
      signer: sponsorKeypair,
      transactionBlock: bytes,
      options: {
        showEffects: true,
        showEvents: true,
      },
    });

    console.log("Artifact minted for user:", result);
    if (result && result.digest) {
      return {
        success: true,
        digest: result.digest,
        artifactId: artifact.id,
      };
    } else {
      throw new Error("Minting failed: No transaction digest returned");
    }
  } catch (error) {
    console.error("Error minting artifact for user:", error);
    throw error;
  }
};

interface RegisterHandleParams {
  handle: string;
  imageUrl: string;
  owner: string;
  pinCode: string;
  guardians: string[];
}

export const registerHandleTransaction = ({
  handle,
  imageUrl,
  owner,
  pinCode,
  guardians,
}: RegisterHandleParams) => {
  const tx = new TransactionBlock();
  tx.setSender(owner);
  tx.moveCall({
    target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::handle::request_handle_registration`,
    arguments: [
      tx.pure(
        process.env.NEXT_PUBLIC_HANDLE_REGISTRY_ID ||
          "0xe39e7bc6f2db921ba6a0ffc6f5afc2ff673d51260d2d34c62fc368e9b20603b5"
      ), // Registry object ID
      tx.pure(handle),
      tx.pure(imageUrl),
      tx.pure(pinCode),
      tx.pure(guardians),
    ],
  });

  return tx;
};
