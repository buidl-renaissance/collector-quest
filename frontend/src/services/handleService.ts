import { SuiClient } from "@mysten/sui.js/client";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

// Types
export interface Handle {
  id: string;
  name: string;
  owner: string;
  confirmed: boolean;
  createdAt: string;
}

// Initialize Sui client
const client = new SuiClient({ url: getFullnodeUrl("testnet") });

/**
 * Get all handles from the registry
 * @returns Promise<Handle[]> Array of handles
 */
export const getHandles = async (): Promise<Handle[]> => {
  // Connect to Sui network
  const provider = new SuiClient({
    url: process.env.SUI_CLIENT_URL || "https://fullnode.testnet.sui.io:443",
  });

  // Package ID from environment variable
  const packageId =
    process.env.NEXT_PUBLIC_HANDLE_REGISTRY_ID ||
    "0x033332b5de804714bdea0f0db308ebd7a8ddad039e3a08da5acb2ed8046827a7";

  // Query all objects of type Artwork from the package
  const { data } = await provider.queryEvents({
    query: {
      MoveEventType: `${packageId}::handle::HandleRegistrationRequested`,
    },
  });

  // Filter out duplicate artwork IDs
  // This is important because the same artwork might have multiple events
  const uniqueArtworkIds = new Set<string>();
  const filteredData = data.filter((item: any) => {
    const artworkId = item.parsedJson?.artwork_id;
    if (!artworkId || uniqueArtworkIds.has(artworkId)) {
      return false;
    }
    uniqueArtworkIds.add(artworkId);
    return true;
  });

  console.log(
    `Found ${filteredData.length} unique artworks from ${data.length} events`
  );

  return filteredData.map((item: any) => ({
    id: item.parsedJson?.artwork_id,
    name: item.parsedJson?.name,
    owner: item.parsedJson?.owner,
    confirmed: item.parsedJson?.confirmed,
    createdAt: item.parsedJson?.created_at,
  }));
};

/**
 * Get a handle by its name
 * @param name Handle name to search for
 * @returns Promise<Handle | null> Handle if found, null otherwise
 */
export const getHandleByName = async (name: string): Promise<Handle | null> => {
  // In a real implementation, this would query the blockchain
  // Example:
  // const result = await client.executeViewFunction({
  //   function: `${packageId}::handle_registry::get_handle_by_name`,
  //   arguments: [name],
  // });
  const txb = new TransactionBlock();
  txb.moveCall({
    target: "handle::handle::get_handle_by_name",
    arguments: [
      txb.object(process.env.NEXT_PUBLIC_HANDLE_REGISTRY_ID as string), // Registry object ID - replace with actual registry ID
      txb.pure.string(name),
    ],
  });

  const result = await client.devInspectTransactionBlock({
    sender: "0x0", // This can be any address for devInspect
    transactionBlock: txb,
  });

  console.log(result);

  const returnValue = result.results?.[0]?.returnValues?.[0];
  if (returnValue === undefined) {
    return null;
  }
  
  // The return value is a tuple of [number[], string], so we need to convert it to Handle
  // First, cast to unknown, then to Handle to avoid the TypeScript error
  return returnValue as unknown as Handle;
};

/**
 * Get a handle by owner address
 * @param owner Owner address to search for
 * @returns Promise<Handle | null> Handle if found, null otherwise
 */
export const getHandleByOwner = async (
  owner: string
): Promise<Handle | null> => {
  const txb = new TransactionBlock();
  txb.moveCall({
    target: "handle::handle::get_handle_by_owner",
    arguments: [
      txb.object(process.env.NEXT_PUBLIC_HANDLE_REGISTRY_ID as string),
      txb.pure(owner),
    ],
  });

  const result = await client.devInspectTransactionBlock({
    sender: "0x0", // This can be any address for devInspect
    transactionBlock: txb,
  });

  const returnValue = result.results?.[0]?.returnValues?.[0];
  if (returnValue === undefined) {
    return null;
  }
  
  return returnValue as unknown as Handle;
};

/**
 * Register a new handle
 * @param name Handle name to register
 * @param owner Owner address
 * @returns Promise<Handle> Newly created handle
 */
export const registerHandle = async (
  wallet: any,
  name: string
): Promise<Handle> => {
  // In a real implementation, we would execute a transaction like this:
  try {
    // Package ID from environment variable
    const packageId =
      process.env.NEXT_PUBLIC_HANDLE_PACKAGE_ID ||
      "0x98c0ccb80eb75d33294fd3bbd6843442de30ae06f8865cb60a4c92971eafefa3";

    // Registry object ID
    const registryId =
      process.env.NEXT_PUBLIC_HANDLE_REGISTRY_ID ||
      "0xe39e7bc6f2db921ba6a0ffc6f5afc2ff673d51260d2d34c62fc368e9b20603b5";

    // Generate a PIN code for the handle (in production, this would be user-provided)
    const pinCode = Math.floor(100000 + Math.random() * 900000).toString();

    // This would be the actual transaction to register a handle
    const txb = new TransactionBlock();
    txb.moveCall({
      target: `${packageId}::handle::request_handle_registration`,
      arguments: [
        txb.object(registryId),
        txb.pure(name),
        txb.pure(pinCode),
        txb.pure([]), // empty vector for handle-specific guardians
      ],
    });

    const result = await wallet.signAndExecuteTransactionBlock({
      transactionBlock: txb,
    });

    console.log(
      `Handle registration requested for ${name} with PIN: ${pinCode}`
    );
    console.log(
      "Store this PIN securely - it will be needed for guardians to confirm the handle"
    );

    return result;
  } catch (error) {
    console.error("Error registering handle:", error);
    throw error;
  }
};
