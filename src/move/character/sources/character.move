/*
/// Module: character
module character::character;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module character::character {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::package;
    use sui::display;

    /// Error codes
    const ENotOwner: u64 = 0;
    const EInvalidLevel: u64 = 1;
    const ENotAuthorized: u64 = 2;

    /// Represents a D&D character NFT
    public struct Character has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
        race: String,
        class: String,
        level: u8,
        sex: String,
        owner: address,
        created_at: u64,
    }

    /// Capability that represents the authority to mint characters
    public struct CharacterMasterCap has key, store {
        id: UID,
        creator: address,
    }

    /// Events
    public struct CharacterCreated has copy, drop {
        character_id: address,
        name: String,
        owner: address,
    }

    /// One-time witness for the package
    public struct CHARACTER has drop {}

    /// Initialize the contract
    fun init(witness: CHARACTER, ctx: &mut TxContext) {
        // Create the Publisher object
        let publisher = package::claim(witness, ctx);

        // Set up the Display for Character
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"race"),
            string::utf8(b"class"),
            string::utf8(b"level"),
            string::utf8(b"owner"),
        ];
        
        let values = vector[
            string::utf8(b"{name}"),
            string::utf8(b"A COLLECTOR QUEST character: {name} - Level {level} {race} {class}"),
            string::utf8(b"{image_url}"),
            string::utf8(b"{race}"),
            string::utf8(b"{class}"),
            string::utf8(b"Level {level}"),
            string::utf8(b"Owned by {owner}"),
        ];

        let mut display = display::new_with_fields<Character>(
            &publisher, keys, values, ctx
        );

        // Commit the Display
        display::update_version(&mut display);
        
        // Transfer the Publisher and Display to the transaction sender
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
        
        // Create and transfer the CharacterMasterCap to the transaction sender
        let character_cap = CharacterMasterCap {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
        };
        transfer::public_transfer(character_cap, tx_context::sender(ctx));
    }

    /// Create a new character
    public entry fun create_character(
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        race: vector<u8>,
        class: vector<u8>,
        sex: vector<u8>,
        ctx: &mut TxContext
    ): address {
        let character = Character {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            image_url: string::utf8(image_url),
            race: string::utf8(race),
            class: string::utf8(class),
            level: 1,
            sex: string::utf8(sex),
            owner: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
        };

        let character_address = object::uid_to_address(&character.id);

        event::emit(CharacterCreated {
            character_id: character_address,
            name: character.name,
            owner: character.owner,
        });

        transfer::public_transfer(character, tx_context::sender(ctx));

        character_address
    }

    /// Update character level
    public entry fun set_level(
        character: &mut Character,
        level: u8,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == character.owner, ENotOwner);
        assert!(level > 0 && level <= 20, EInvalidLevel);
        
        character.level = level;
    }

    /// Update character details
    public entry fun update_character_details(
        character: &mut Character,
        name: vector<u8>,
        description: vector<u8>,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == character.owner, ENotOwner);
        
        character.name = string::utf8(name);
        character.description = string::utf8(description);
        character.image_url = string::utf8(image_url);
    }

    // Getters
    public fun get_character_name(character: &Character): String {
        character.name
    }

    public fun get_character_description(character: &Character): String {
        character.description
    }

    public fun get_character_image_url(character: &Character): String {
        character.image_url
    }

    public fun get_character_race(character: &Character): String {
        character.race
    }

    public fun get_character_class(character: &Character): String {
        character.class
    }

    public fun get_character_level(character: &Character): u8 {
        character.level
    }

    public fun get_character_owner(character: &Character): address {
        character.owner
    }
}
