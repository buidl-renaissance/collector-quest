/*
/// Module: artwork
module artwork::artwork;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module artwork::artwork {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    use sui::event;
    use sui::package;
    use sui::display;

    /// Error codes
    const ENotOwner: u64 = 0;
    const EInvalidPrice: u64 = 1;

    /// Represents a digital artwork NFT
    public struct Artwork has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        artist: address,
        created_at: u64,
        for_sale: bool,
        price: u64,
    }

    /// Capability that represents the authority to mint artworks
    public struct ArtistCap has key, store {
        id: UID,
        artist: address,
    }

    /// Events
    public struct ArtworkCreated has copy, drop {
        artwork_id: address,
        name: String,
        artist: address,
    }

    public struct ArtworkSold has copy, drop {
        artwork_id: address,
        seller: address,
        buyer: address,
        price: u64,
    }

    /// One-time witness for the package
    public struct ARTWORK has drop {}

    /// Initialize the contract
    fun init(witness: ARTWORK, ctx: &mut TxContext) {
        // Create the Publisher object
        let publisher = package::claim(witness, ctx);

        // Set up the Display for Artwork
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"creator"),
            string::utf8(b"price"),
        ];
        
        let values = vector[
            string::utf8(b"{name}"),
            string::utf8(b"{description}"),
            string::utf8(b"{url}"),
            string::utf8(b"Created by {artist}"),
            string::utf8(b"{price}"),
        ];

        let mut display = display::new_with_fields<Artwork>(
            &publisher, keys, values, ctx
        );

        // Commit the Display
        display::update_version(&mut display);
        
        // Transfer the Publisher and Display to the transaction sender
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
        
        // Create and transfer the ArtistCap to the transaction sender
        let artist_cap = ArtistCap {
            id: object::new(ctx),
            artist: tx_context::sender(ctx),
        };
        transfer::public_transfer(artist_cap, tx_context::sender(ctx));
    }

    /// Create a new artwork
    public entry fun create_artwork(
        _cap: &ArtistCap,
        name: vector<u8>,
        description: vector<u8>,
        url_string: vector<u8>,
        price: u64,
        ctx: &mut TxContext
    ) {
        let artwork = Artwork {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url_string),
            artist: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
            for_sale: true,
            price,
        };

        event::emit(ArtworkCreated {
            artwork_id: object::uid_to_address(&artwork.id),
            name: artwork.name,
            artist: artwork.artist,
        });

        transfer::public_transfer(artwork, tx_context::sender(ctx));
    }

    /// Purchase an artwork
    public entry fun purchase_artwork(
        artwork: Artwork,
        ctx: &mut TxContext
    ) {
        assert!(artwork.for_sale, ENotOwner);
        assert!(artwork.price > 0, EInvalidPrice);
        
        // In a real implementation, this would involve a coin payment
        // For simplicity, we're just transferring the artwork
        
        let seller = artwork.artist;
        let buyer = tx_context::sender(ctx);
        let artwork_id = object::uid_to_address(&artwork.id);
        let price = artwork.price;
        
        // Update artwork properties
        let mut mut_artwork = artwork;
        mut_artwork.for_sale = false;
        
        event::emit(ArtworkSold {
            artwork_id,
            seller,
            buyer,
            price,
        });
        
        transfer::public_transfer(mut_artwork, buyer);
    }

    /// List artwork for sale
    public entry fun list_for_sale(
        artwork: &mut Artwork,
        price: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == artwork.artist, ENotOwner);
        assert!(price > 0, EInvalidPrice);
        
        artwork.for_sale = true;
        artwork.price = price;
    }

    /// Delist artwork from sale
    public entry fun delist_from_sale(
        artwork: &mut Artwork,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == artwork.artist, ENotOwner);
        artwork.for_sale = false;
    }

    /// Update artwork details
    public entry fun update_artwork_details(
        artwork: &mut Artwork,
        name: vector<u8>,
        description: vector<u8>,
        url_string: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == artwork.artist, ENotOwner);
        
        artwork.name = string::utf8(name);
        artwork.description = string::utf8(description);
        artwork.url = url::new_unsafe_from_bytes(url_string);
    }

    // Getters
    public fun get_artwork_name(artwork: &Artwork): String {
        artwork.name
    }

    public fun get_artwork_description(artwork: &Artwork): String {
        artwork.description
    }

    public fun get_artwork_url(artwork: &Artwork): Url {
        artwork.url
    }

    public fun get_artwork_artist(artwork: &Artwork): address {
        artwork.artist
    }

    public fun get_artwork_price(artwork: &Artwork): u64 {
        artwork.price
    }

    public fun is_for_sale(artwork: &Artwork): bool {
        artwork.for_sale
    }
}
