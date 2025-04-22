import { SuiClient } from '@mysten/sui.js/client';
import { Artwork } from '@/lib/interfaces';

export async function getArtworks(): Promise<Artwork[]> {
  try {
    // Connect to Sui network
    const provider = new SuiClient({
      url: process.env.SUI_CLIENT_URL || "https://fullnode.testnet.sui.io:443"
    });
    
    // Package ID from environment variable
    const packageId = process.env.NEXT_PUBLIC_ARTWORK_PACKAGE_ID || "0x033332b5de804714bdea0f0db308ebd7a8ddad039e3a08da5acb2ed8046827a7";
    
    // Query all objects of type Artwork from the package
    const { data } = await provider.queryEvents({
      query: {
        MoveEventType: `${packageId}::artwork::ArtworkCreated`
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
    
    console.log(`Found ${filteredData.length} unique artworks from ${data.length} events`);
    
    // Fetch detailed object information for each artwork ID
    if (uniqueArtworkIds.size > 0) {
      try {
        // Convert Set to Array for processing
        const artworkIds = Array.from(uniqueArtworkIds);
        
        // Batch fetch objects by IDs
        const objectsResponse = await provider.multiGetObjects({
          ids: artworkIds,
          options: {
            showContent: true,
            showDisplay: true,
            showOwner: true,
          }
        });
        
        console.log(`Retrieved ${objectsResponse.length} artwork objects from blockchain`);
        
        // Process the detailed object data
        // This will be used later to enhance the artwork data with more details
        const artworkObjects = objectsResponse.reduce((acc: Record<string, any>, obj: any) => {
          if (obj.data && obj.data.objectId) {
            acc[obj.data.objectId] = obj.data;
          }
          return acc;
        }, {} as Record<string, any>);
        
        // Now we have detailed object data in artworkObjects that can be used
        // when transforming the events data into Artwork objects
        // console.log(artworkObjects);

        const artworks: Artwork[] = Object.values(artworkObjects).map((obj: any) => {
          return {
            id: obj.objectId,
            slug: `${obj.objectId}`,
            title: obj.content?.fields?.name,
            description: obj.content?.fields?.description,
            data: {
              image: obj.content?.fields?.url,
              artist_name: obj.content?.fields?.artist,
              is_for_sale: obj.content?.fields?.for_sale,
              price: obj.content?.fields?.price,
              review: {
                text: "This masterpiece from the blockchain radiates with DIGITAL BRILLIANCE! Each pixel VIBRATES with the energy of decentralized creation!",
                image: "",
              },
            },
            meta: {},
          };
        });

        // console.log("ARTWORKS", artworks);
        
        return artworks;
      } catch (error) {
        console.error("Error fetching artwork objects:", error);
        throw new Error("Error fetching artwork objects");
      }
    } else {
      // No artworks found
      return [];
    }
  } catch (error) {
    console.error("Error fetching artworks from blockchain:", error);
    throw new Error("Error fetching artworks from blockchain");
  }
}
