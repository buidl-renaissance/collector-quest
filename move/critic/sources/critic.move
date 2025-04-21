module critic::critic {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    use std::string::{Self, String};
    use artwork::artwork::{Self, Artwork};

    /// NFT representing a critique of an artwork by Lord Smearington
    struct CriticNFT has key, store {
        id: UID,
        /// Title of the critique
        title: String,
        /// The artwork being critiqued
        artwork_id: address,
        /// Lord Smearington's commentary
        smearington_comment: String,
        /// Image URL for the critique certificate
        image_url: Url,
        /// Edition number of this critique
        edition: u64,
    }

    /// Keeps track of the critiques and manages the minting process
    struct CriticRegistry has key {
        id: UID,
        /// Total number of critiques that can be minted per artwork
        max_editions_per_artwork: u64,
        /// Tracks how many critiques have been minted for each artwork
        editions_minted: vector<address>,
    }

    /// Event emitted when a new critique is created
    struct CritiqueCreated has copy, drop {
        artwork_id: address,
        critic_id: address,
        edition: u64,
    }

    /// Initialize the critic module
    public entry fun init(ctx: &mut TxContext) {
        let registry = CriticRegistry {
            id: object::new(ctx),
            max_editions_per_artwork: 10, // Default limit of 10 critiques per artwork
            editions_minted: vector::empty(),
        };
        transfer::share_object(registry);
    }

    /// Create a critique for an artwork
    public entry fun create_critique(
        registry: &mut CriticRegistry,
        artwork_id: address,
        title: vector<u8>,
        comment: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        // Check if we've reached the maximum number of editions
        let current_editions = 0;
        let i = 0;
        let len = vector::length(&registry.editions_minted);
        
        while (i < len) {
            if (*vector::borrow(&registry.editions_minted, i) == artwork_id) {
                current_editions = current_editions + 1;
            };
            i = i + 1;
        };
        
        assert!(current_editions < registry.max_editions_per_artwork, 0);
        
        // Add this artwork to the minted editions
        vector::push_back(&mut registry.editions_minted, artwork_id);
        
        // Create the critique NFT
        let nft = CriticNFT {
            id: object::new(ctx),
            title: string::utf8(title),
            artwork_id,
            smearington_comment: string::utf8(comment),
            image_url: url::new_unsafe_from_bytes(image_url),
            edition: current_editions + 1,
        };
        
        // Transfer the NFT to the transaction sender
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    /// Update the maximum number of editions per artwork
    public entry fun update_max_editions(
        registry: &mut CriticRegistry,
        new_max: u64,
        ctx: &mut TxContext
    ) {
        // Only the owner can update this
        assert!(tx_context::sender(ctx) == @0x1, 0); // Replace with actual admin address
        registry.max_editions_per_artwork = new_max;
    }
}
