import { SuiClient, SuiEvent, EventId } from "@mysten/sui.js/client";
import { getSuiClient } from "./wallet";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export interface Handle {
  id: string;
  name: string;
  owner: string;
  confirmed?: boolean;
}

interface HandleContent {
  fields: {
    name: string;
    owner: string;
  };
}

interface HandleEvent {
  id: EventId;
  parsedJson: {
    name: string;
    owner: string;
  };
}

export const getHandleByAddress = async (address: string): Promise<any> => {
  try {
    const client = getSuiClient();

    const packageId =
      process.env.NEXT_PUBLIC_PACKAGE_ID ||
      "0x0031f578c392104334987123ec60bba7f3c45a5ffa8c8a3a47181a504bc44096";
    const registryId =
      process.env.NEXT_PUBLIC_HANDLE_REGISTRY_ID ||
      "0x99f76cf66109f5acdcb2f7b54507955b314595a55e4110eafda57f966eee02ac";

    const txb = new TransactionBlock();

    txb.moveCall({
      target: `${packageId}::handle::get_handle_for_address`,
      arguments: [txb.object(registryId), txb.pure(address)],
    });

    const result = await client.devInspectTransactionBlock({
      transactionBlock: txb,
      sender: address,
    });

    const value = result.results?.[0]?.returnValues?.[0][0];
    console.log("RESULT", result.results?.[0]?.returnValues);
    console.log("VALUE", value);

    if (!value) {
      return null;
    }

    // Decode the returned value from base64
    // The first return value is the handle string
    if (
      Array.isArray(result.results?.[0]?.returnValues) &&
      result.results[0].returnValues.length > 0 &&
      Array.isArray(result.results[0].returnValues[0]) &&
      result.results[0].returnValues[0].length > 0
    ) {
      // Extract the handle string (first element in the tuple)
      const handleValue = result.results[0].returnValues[0][0];

      // If there's an image URL (second element in the tuple)
      if (result.results[0].returnValues[0].length > 1) {
        const imageUrl = result.results[0].returnValues[0][1];
        const handle = Buffer.from(handleValue as any, "base64").toString();
        const image = Buffer.from(imageUrl as any, "base64").toString();
        return { handle, image };
      }

      const handle = Buffer.from(handleValue as any, "base64").toString();
      return {
        handle,
        image: null,
      };
    }
  } catch (error) {
    console.error("Error fetching handle by address:", error);
    return null;
  }
};

/**
 * Get handle for a specific owner address
 * @param ownerAddress The address of the handle owner
 * @returns Handle object if found, null otherwise
 */
export async function getHandleByOwner(
  ownerAddress: string
): Promise<Handle | null> {
  try {
    // Connect to Sui network
    const provider = new SuiClient({
      url: process.env.SUI_CLIENT_URL || "https://fullnode.testnet.sui.io:443",
    });

    // Package ID from environment variable
    const packageId =
      process.env.NEXT_PUBLIC_HANDLE_PACKAGE_ID ||
      "0xab59c7c0acd861d656ae5cdf2df969c35fcefbc28ac28d9173064826f36bd182";

    // Query objects owned by the address
    const { data } = await provider.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: `${packageId}::handle::Handle`,
      },
      options: {
        showContent: true,
        showDisplay: true,
      },
    });

    // If no handle objects found
    if (!data || data.length === 0) {
      return null;
    }

    // Get the first handle object
    const handleObj = data[0];
    const content = handleObj.data?.content as HandleContent | undefined;

    if (!content || !content.fields) {
      return null;
    }

    // Return handle information
    return {
      id: handleObj.data?.objectId || "",
      name: content.fields.name,
      owner: content.fields.owner,
    };
  } catch (error) {
    console.error("Error fetching handle by owner:", error);
    return null;
  }
}

export async function getHandle(handleName: string): Promise<Handle | null> {
  try {
    // Connect to Sui network
    const provider = new SuiClient({
      url: process.env.SUI_CLIENT_URL || "https://fullnode.testnet.sui.io:443",
    });

    // Package ID from environment variable
    const packageId =
      process.env.NEXT_PUBLIC_HANDLE_PACKAGE_ID ||
      "0xab59c7c0acd861d656ae5cdf2df969c35fcefbc28ac28d9173064826f36bd182";

    // Query events for handle registration
    const { data } = await provider.queryEvents({
      query: {
        MoveEventType: `${packageId}::handle::HandleRegistered`,
      },
    });

    console.log("REGISTRED HANDLES> ", handleName, data);

    // Find the handle with the matching name
    const handleEvent = data.find(
      (event: SuiEvent) => (event.parsedJson as any)?.name === handleName
    ) as HandleEvent | undefined;

    console.log("HANDLE EVENT", handleEvent);

    if (!handleEvent) {
      return null;
    }

    // Return handle information
    return {
      id: handleEvent.id.txDigest,
      name: handleEvent.parsedJson.name,
      owner: handleEvent.parsedJson.owner,
    };
  } catch (error) {
    console.error("Error fetching handle:", error);
    throw new Error("Error fetching handle from blockchain");
  }
}

export async function getAllHandles(): Promise<Handle[]> {
  try {
    // Connect to Sui network
    const provider = new SuiClient({
      url: process.env.SUI_CLIENT_URL || "https://fullnode.testnet.sui.io:443",
    });

    // Package ID from environment variable
    const packageId =
      process.env.NEXT_PUBLIC_HANDLE_PACKAGE_ID ||
      "0xab59c7c0acd861d656ae5cdf2df969c35fcefbc28ac28d9173064826f36bd182";

    // Query all handle registration events
    const { data } = await provider.queryEvents({
      query: {
        MoveEventType: `${packageId}::handle::HandleRegistered`,
      },
    });

    if (data.length === 0) {
      return [];
    }

    // Transform events into Handle objects
    const handles: Handle[] = data.map((event: SuiEvent) => {
      const parsedJson = event.parsedJson as { name: string; owner: string };
      return {
        id: (event.id as EventId).txDigest,
        name: parsedJson.name,
        owner: parsedJson.owner,
      };
    });

    return handles;
  } catch (error) {
    console.error("Error fetching handles:", error);
    throw new Error("Error fetching handles from blockchain");
  }
}
