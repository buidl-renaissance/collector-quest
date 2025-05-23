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
        image_url: String,
        owner: address,
        created_at: u64,
    }

    /// Represents a relic NFT tied to an artifact
    public struct Relic has key, store {
        id: UID,
        artifact_id: address,
        title: String,
        image_url: String,
        class: String,
        element: String,
        effect: String,
        rarity: String,
        visual_asset: String,
        passive_bonus: String,
        active_use: String,
        unlock_condition: String,
        reflection_trigger: String,
        story: String,
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

    public struct RelicCreated has copy, drop {
        relic_id: address,
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
            string::utf8(b"owner"),
        ];
        
        let values = vector[
            string::utf8(b"{title}"),
            string::utf8(b"A COLLECTOR QUEST artifact: {title} by {artist} - {artifact_class}"),
            string::utf8(b"{image_url}"),
            string::utf8(b"{artist}"),
            string::utf8(b"{artifact_class}"),
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
        image_url: vector<u8>,
        ctx: &mut TxContext
    ): address {
        let artifact = Artifact {
            id: object::new(ctx),
            title: string::utf8(title),
            artist: string::utf8(artist),
            year: string::utf8(year),
            medium: string::utf8(medium),
            description: string::utf8(description),
            image_url: string::utf8(image_url),
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

    /// Generate a new relic tied to an artifact
    public entry fun generate_relic(
        artifact: &Artifact,
        image_url: vector<u8>,
        class: vector<u8>,
        element: vector<u8>,
        effect: vector<u8>,
        rarity: vector<u8>,
        visual_asset: vector<u8>,
        passive_bonus: vector<u8>,
        active_use: vector<u8>,
        unlock_condition: vector<u8>,
        reflection_trigger: vector<u8>,
        story: vector<u8>,
        ctx: &mut TxContext
    ): address {
        assert!(tx_context::sender(ctx) == artifact.owner, ENotOwner);
        
        let mut relic_title = string::utf8(b"Relic of ");
        string::append(&mut relic_title, artifact.title);
        
        let relic = Relic {
            id: object::new(ctx),
            artifact_id: object::uid_to_address(&artifact.id),
            title: relic_title,
            image_url: string::utf8(image_url),
            class: string::utf8(class),
            element: string::utf8(element),
            effect: string::utf8(effect),
            rarity: string::utf8(rarity),
            visual_asset: string::utf8(visual_asset),
            passive_bonus: string::utf8(passive_bonus),
            active_use: string::utf8(active_use),
            unlock_condition: string::utf8(unlock_condition),
            reflection_trigger: string::utf8(reflection_trigger),
            story: string::utf8(story),
            owner: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
        };

        let relic_address = object::uid_to_address(&relic.id);

        event::emit(RelicCreated {
            relic_id: relic_address,
            artifact_id: object::uid_to_address(&artifact.id),
            title: relic.title,
            owner: relic.owner,
        });

        transfer::public_transfer(relic, tx_context::sender(ctx));

        relic_address
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

    /// Transfer relic ownership
    public entry fun transfer_relic(
        relic: Relic,
        recipient: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == relic.owner, ENotOwner);
        transfer::public_transfer(relic, recipient);
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
            image_url: _, 
            owner: _, 
            created_at: _ 
        } = artifact;
        object::delete(id);
    }

    /// Delete relic (burn)
    public entry fun delete_relic(
        relic: Relic,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == relic.owner, ENotOwner);
        let Relic { 
            id, 
            artifact_id: _, 
            title: _, 
            image_url: _, 
            class: _,
            element: _,
            effect: _,
            rarity: _,
            visual_asset: _,
            passive_bonus: _,
            active_use: _,
            unlock_condition: _,
            reflection_trigger: _,
            story: _,
            owner: _, 
            created_at: _ 
        } = relic;
        object::delete(id);
    }

    // Getters for Artifact
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

    public fun get_artifact_owner(artifact: &Artifact): address {
        artifact.owner
    }

    // Getters for Relic
    public fun get_relic_title(relic: &Relic): String {
        relic.title
    }

    public fun get_relic_artifact_id(relic: &Relic): address {
        relic.artifact_id
    }

    public fun get_relic_image_url(relic: &Relic): String {
        relic.image_url
    }

    public fun get_relic_element(relic: &Relic): String {
        relic.element
    }

    public fun get_relic_effect(relic: &Relic): String {
        relic.effect
    }

    public fun get_relic_rarity(relic: &Relic): String {
        relic.rarity
    }

    public fun get_relic_visual_asset(relic: &Relic): String {
        relic.visual_asset
    }

    public fun get_relic_passive_bonus(relic: &Relic): String {
        relic.passive_bonus
    }

    public fun get_relic_active_use(relic: &Relic): String {
        relic.active_use
    }

    public fun get_relic_unlock_condition(relic: &Relic): String {
        relic.unlock_condition
    }

    public fun get_relic_reflection_trigger(relic: &Relic): String {
        relic.reflection_trigger
    }

    public fun get_relic_story(relic: &Relic): String {
        relic.story
    }

    public fun get_relic_owner(relic: &Relic): address {
        relic.owner
    }

    public fun get_relic_created_at(relic: &Relic): u64 {
        relic.created_at
    }
}
