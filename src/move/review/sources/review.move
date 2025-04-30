/*
/// Module: review
module review::review;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module lord_smearington::review_nft {
    use sui::url::{Self, Url};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};
    use sui::vec_map::{Self, VecMap};
    use artwork::artwork::{Self, Artwork};

    struct ArtistNFT has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: Url,
        artist: String,
        critique: String,
        rating: String,
    }

    struct SmearingtonGallery has key {
        id: UID,
        submissions: VecMap<address, address>,
    }

    public entry fun init(ctx: &mut TxContext) {
        let gallery = SmearingtonGallery {
            id: object::new(ctx),
            submissions: vec_map::empty(),
        };
        transfer::share_object(gallery);
    }

    public entry fun submit_artwork(
        gallery: &mut SmearingtonGallery,
        artwork_id: address,
        ctx: &mut TxContext
    ) {
        let artist = tx_context::sender(ctx);
        vec_map::insert(&mut gallery.submissions, artist, artwork_id);
    }

    public entry fun critique_and_mint(
        gallery: &mut SmearingtonGallery,
        artist_address: address,
        critique: vector<u8>,
        rating: vector<u8>,
        ctx: &mut TxContext
    ) {
        let artwork_id = vec_map::remove(&mut gallery.submissions, &artist_address);
        let artwork = artwork::borrow_artwork(artwork_id);
        
        let nft = ArtistNFT {
            id: object::new(ctx),
            name: artwork::get_artwork_name(artwork),
            description: artwork::get_artwork_description(artwork),
            image_url: artwork::get_artwork_url(artwork),
            artist: string::utf8(b"Artist"),
            critique: string::utf8(critique),
            rating: string::utf8(rating),
        };
        transfer::public_transfer(nft, artist_address);
    }
}