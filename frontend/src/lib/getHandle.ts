import { SuiClient, SuiEvent, EventId } from '@mysten/sui.js/client';

export interface Handle {
  id: string;
  name: string;
  owner: string;
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

/**
 * Get handle for a specific owner address
 * @param ownerAddress The address of the handle owner
 * @returns Handle object if found, null otherwise
 */
export async function getHandleByOwner(ownerAddress: string): Promise<Handle | null> {
  try {
    // Connect to Sui network
    const provider = new SuiClient({
      url: process.env.SUI_CLIENT_URL || "https://fullnode.testnet.sui.io:443"
    });
    
    // Package ID from environment variable
    const packageId = process.env.NEXT_PUBLIC_HANDLE_PACKAGE_ID || "0xab59c7c0acd861d656ae5cdf2df969c35fcefbc28ac28d9173064826f36bd182";
    
    // Query objects owned by the address
    const { data } = await provider.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: `${packageId}::handle::Handle`
      },
      options: {
        showContent: true,
        showDisplay: true,
      }
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
      id: handleObj.data?.objectId || '',
      name: content.fields.name,
      owner: content.fields.owner
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
      url: process.env.SUI_CLIENT_URL || "https://fullnode.testnet.sui.io:443"
    });
    
    // Package ID from environment variable
    const packageId = process.env.NEXT_PUBLIC_HANDLE_PACKAGE_ID || "0xab59c7c0acd861d656ae5cdf2df969c35fcefbc28ac28d9173064826f36bd182";
    
    // Query events for handle registration
    const { data } = await provider.queryEvents({
      query: {
        MoveEventType: `${packageId}::handle::HandleRegistered`
      },
    });

    console.log("REGISTRED HANDLES> ", handleName, data);

    // Find the handle with the matching name
    const handleEvent = data.find((event: SuiEvent) => 
      (event.parsedJson as any)?.name === handleName
    ) as HandleEvent | undefined;

    console.log("HANDLE EVENT", handleEvent);

    if (!handleEvent) {
      return null;
    }

    // Return handle information
    return {
      id: handleEvent.id.txDigest,
      name: handleEvent.parsedJson.name,
      owner: handleEvent.parsedJson.owner
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
      url: process.env.SUI_CLIENT_URL || "https://fullnode.testnet.sui.io:443"
    });
    
    // Package ID from environment variable
    const packageId = process.env.NEXT_PUBLIC_HANDLE_PACKAGE_ID || "0xab59c7c0acd861d656ae5cdf2df969c35fcefbc28ac28d9173064826f36bd182";
    
    // Query all handle registration events
    const { data } = await provider.queryEvents({
      query: {
        MoveEventType: `${packageId}::handle::HandleRegistered`
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
        owner: parsedJson.owner
      };
    });
    
    return handles;
  } catch (error) {
    console.error("Error fetching handles:", error);
    throw new Error("Error fetching handles from blockchain");
  }
}
