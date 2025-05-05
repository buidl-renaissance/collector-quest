import { TransactionBlock } from '@mysten/sui.js/transactions';

// Constants for package and registry addresses
// These would need to be replaced with actual addresses from your deployed contracts
const REALM_PACKAGE_ID = '0x109f3eddc1cc0122144ba37f57a5d5486ac6490b077cbdb5bd9f71f62d6ee610'; // Replace with actual package ID
const REALM_REGISTRY_ID = '0xf7ac547cfc70c518f7871463ed2e462162f71c2aa6b5ddf5f02e5600ecde79a7'; // Replace with actual registry object ID

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
    txb.pure(Array.from(new TextEncoder().encode(realmData.name))), // Realm name as encoded bytes
    txb.pure(Array.from(new TextEncoder().encode(realmData.description))), // Description as encoded bytes
    txb.pure(Array.from(new TextEncoder().encode(realmData.imageUrl || ''))), // Image URL as encoded bytes
    txb.pure(Array.from(new TextEncoder().encode(realmData.location || ''))), // Location as encoded bytes
    txb.pure(1), // Max handles per user
    txb.pure(realmData.invitationOnly), // Invitation only flag
    txb.pure(realmData.requiresVerification), // Requires verification flag
    guardiansVector, // Guardians vector
  ];
  console.log('args', args);
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
