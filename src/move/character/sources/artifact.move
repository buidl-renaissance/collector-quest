/*
/// Module: artifact
module character::artifact;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module character::artifact {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::package;
    use sui::display;

    /// Error codes
    const ENotOwner: u64 = 0;
    const EInvalidRarity: u64 = 1;
    const ENotAuthorized: u64 = 2;

    /// Represents an artifact NFT
    public struct Artifact has key, store {
        id: UID,
        title: String,
        artist: String,
        year: String,
        medium: String,
        description: String,
        artifact_class: String,
        element: String,
        effect: String,
        rarity: String,
        visual_asset: String,
        passive_bonus: String,
        active_use: String,
        unlock_condition: String,
        reflection_trigger: String,
        story: String,
        image_url: String,
        relic_image_url: String,
        owner: address,
        created_at: u64,
    }

    /// Capability that represents the authority to mint artifacts
    public struct ArtifactMasterCap has key, store {
        id: UID,
        creator: address,
    }

    /// Events
    public struct ArtifactCreated has copy, drop {
        artifact_id: address,
        title: String,
        owner: address,
    }

    /// One-time witness for the package
    public struct ARTIFACT has drop {}

    /// Initialize the contract
    fun init(witness: ARTIFACT, ctx: &mut TxContext) {
        // Create the Publisher object
        let publisher = package::claim(witness, ctx);

        // Set up the Display for Artifact
        let keys = vector[
            string::utf8(b"title"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"artist"),
            string::utf8(b"class"),
            string::utf8(b"element"),
            string::utf8(b"effect"),
            string::utf8(b"rarity"),
            string::utf8(b"owner"),
        ];
        
        let values = vector[
            string::utf8(b"{title}"),
            string::utf8(b"A COLLECTOR QUEST artifact: {title} by {artist} - {rarity} {class} with {effect} power"),
            string::utf8(b"{image_url}"),
            string::utf8(b"{artist}"),
            string::utf8(b"{artifact_class}"),
            string::utf8(b"{element}"),
            string::utf8(b"{effect}"),
            string::utf8(b"{rarity}"),
            string::utf8(b"Owned by {owner}"),
        ];

        let mut display = display::new_with_fields<Artifact>(
            &publisher, keys, values, ctx
        );

        // Commit the Display
        display::update_version(&mut display);
        
        // Transfer the Publisher and Display to the transaction sender
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
        
        // Create and transfer the ArtifactMasterCap to the transaction sender
        let artifact_cap = ArtifactMasterCap {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
        };
        transfer::public_transfer(artifact_cap, tx_context::sender(ctx));
    }

    /// Create a new artifact
    public entry fun create_artifact(
        title: vector<u8>,
        artist: vector<u8>,
        year: vector<u8>,
        medium: vector<u8>,
        description: vector<u8>,
        artifact_class: vector<u8>,
        element: vector<u8>,
        effect: vector<u8>,
        rarity: vector<u8>,
        visual_asset: vector<u8>,
        passive_bonus: vector<u8>,
        active_use: vector<u8>,
        unlock_condition: vector<u8>,
        reflection_trigger: vector<u8>,
        story: vector<u8>,
        image_url: vector<u8>,
        relic_image_url: vector<u8>,
        ctx: &mut TxContext
    ): address {
        let artifact = Artifact {
            id: object::new(ctx),
            title: string::utf8(title),
            artist: string::utf8(artist),
            year: string::utf8(year),
            medium: string::utf8(medium),
            description: string::utf8(description),
            artifact_class: string::utf8(artifact_class),
            element: string::utf8(element),
            effect: string::utf8(effect),
            rarity: string::utf8(rarity),
            visual_asset: string::utf8(visual_asset),
            passive_bonus: string::utf8(passive_bonus),
            active_use: string::utf8(active_use),
            unlock_condition: string::utf8(unlock_condition),
            reflection_trigger: string::utf8(reflection_trigger),
            story: string::utf8(story),
            image_url: string::utf8(image_url),
            relic_image_url: string::utf8(relic_image_url),
            owner: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
        };

        let artifact_address = object::uid_to_address(&artifact.id);

        event::emit(ArtifactCreated {
            artifact_id: artifact_address,
            title: artifact.title,
            owner: artifact.owner,
        });

        transfer::public_transfer(artifact, tx_context::sender(ctx));

        artifact_address
    }

    /// Update artifact details
    public entry fun update_artifact_details(
        artifact: &mut Artifact,
        title: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == artifact.owner, ENotOwner);
        
        artifact.title = string::utf8(title);
        artifact.description = string::utf8(description);
        artifact.image_url = string::utf8(image_url);
    }

    /// Transfer artifact ownership
    public entry fun transfer_artifact(
        artifact: Artifact,
        recipient: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == artifact.owner, ENotOwner);
        transfer::public_transfer(artifact, recipient);
    }

    /// Delete artifact (burn)
    public entry fun delete_artifact(
        artifact: Artifact,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == artifact.owner, ENotOwner);
        let Artifact { 
            id, 
            title: _, 
            artist: _, 
            year: _, 
            medium: _, 
            description: _, 
            artifact_class: _, 
            element: _, 
            effect: _, 
            rarity: _, 
            visual_asset: _, 
            passive_bonus: _, 
            active_use: _, 
            unlock_condition: _, 
            reflection_trigger: _, 
            story: _, 
            image_url: _, 
            relic_image_url: _, 
            owner: _, 
            created_at: _ 
        } = artifact;
        object::delete(id);
    }

    // Getters
    public fun get_artifact_title(artifact: &Artifact): String {
        artifact.title
    }

    public fun get_artifact_artist(artifact: &Artifact): String {
        artifact.artist
    }

    public fun get_artifact_description(artifact: &Artifact): String {
        artifact.description
    }

    public fun get_artifact_image_url(artifact: &Artifact): String {
        artifact.image_url
    }

    public fun get_artifact_class(artifact: &Artifact): String {
        artifact.artifact_class
    }

    public fun get_artifact_element(artifact: &Artifact): String {
        artifact.element
    }

    public fun get_artifact_effect(artifact: &Artifact): String {
        artifact.effect
    }

    public fun get_artifact_rarity(artifact: &Artifact): String {
        artifact.rarity
    }

    public fun get_artifact_owner(artifact: &Artifact): address {
        artifact.owner
    }

    public fun get_artifact_story(artifact: &Artifact): String {
        artifact.story
    }

    public fun get_artifact_visual_asset(artifact: &Artifact): String {
        artifact.visual_asset
    }

    public fun get_artifact_passive_bonus(artifact: &Artifact): String {
        artifact.passive_bonus
    }

    public fun get_artifact_active_use(artifact: &Artifact): String {
        artifact.active_use
    }

    public fun get_artifact_unlock_condition(artifact: &Artifact): String {
        artifact.unlock_condition
    }

    public fun get_artifact_reflection_trigger(artifact: &Artifact): String {
        artifact.reflection_trigger
    }
}
