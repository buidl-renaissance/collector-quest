import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui.js/utils';

// Constants for package and registry addresses
// These would need to be replaced with actual addresses from your deployed contracts
const REALM_PACKAGE_ID = '0x...'; // Replace with actual package ID
const REALM_REGISTRY_ID = '0x...'; // Replace with actual registry object ID
const KINGDOM_REGISTRY_ID = '0x...'; // Replace with actual kingdom registry object ID

export interface RealmData {
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  kingdomName: string;
  guardians: string[];
  invitationOnly: boolean;
  requiresVerification: boolean;
}

/**
 * Creates a transaction to register a new realm
 * @param realmData The data for the new realm
 * @returns A transaction block ready to be signed and executed
 */
export function createRegisterRealmTransaction(realmData: RealmData): TransactionBlock {
  const txb = new TransactionBlock();
  
  // Convert guardians array to a vector for the Move call
  const guardiansVector = txb.pure(realmData.guardians);
  
  // Create arguments for the transaction
  const args = [
    txb.object(REALM_REGISTRY_ID), // Realm registry object
    txb.object(KINGDOM_REGISTRY_ID), // Kingdom registry object
    txb.pure(realmData.name), // Realm name
    txb.pure(realmData.description), // Description
    txb.pure(realmData.imageUrl || ''), // Image URL (empty string if not provided)
    txb.pure(realmData.location || ''), // Location (empty string if not provided)
    guardiansVector, // Guardians vector
    txb.pure(realmData.invitationOnly), // Invitation only flag
    txb.pure(realmData.requiresVerification), // Requires verification flag
    txb.object(SUI_CLOCK_OBJECT_ID), // Clock object for timestamp
  ];
  
  // Call the create_realm function from the realm module
  txb.moveCall({
    target: `${REALM_PACKAGE_ID}::realm::create_realm`,
    arguments: args,
  });
  
  return txb;
}

/**
 * Executes a realm registration transaction
 * @param wallet The connected wallet to sign the transaction
 * @param realmData The data for the new realm
 * @returns The transaction response
 */
export async function registerRealm(wallet: any, realmData: RealmData) {
  try {
    const txb = createRegisterRealmTransaction(realmData);
    
    // Sign and execute the transaction
    const response = await wallet.signAndExecuteTransactionBlock({
      transactionBlock: txb,
      options: {
        showEffects: true,
        showEvents: true,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Error registering realm:', error);
    throw error;
  }
}
