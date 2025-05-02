/*
/// Module: username
module username::username;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module username::username {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::vec_set::{Self, VecSet};
    use std::string::{Self, String};
    use sui::event;
    use sui::hash::{Self, blake2b256};
    use std::vector;
    use sui::dynamic_object_field;
    use sui::object::ID;

    // Error codes
    const ENotAuthorized: u64 = 1;
    const EUsernameAlreadyRegistered: u64 = 2;
    const EAddressAlreadyRegistered: u64 = 3;
    const EUsernameNotFound: u64 = 4;
    const EAddressAlreadyLinked: u64 = 5;
    const EAddressNotLinked: u64 = 6;
    const EAddressNotRegistered: u64 = 7;

    // Registry to store all username registrations
    public struct Registry has key {
        id: UID,
        usernames: Table<String, ID>,
        addresses: Table<address, String>
    }

    // Information about a username registration
    public struct UsernameInfo has key, store {
        id: UID,
        username: String,
        owner: address,
        profile_image: String,
        linked_addresses: VecSet<address> // Multiple addresses linked to this username
    }

    // Events
    public struct UsernameRegistered has copy, drop {
        username: String,
        owner: address
    }
    
    public struct AddressLinked has copy, drop {
        username: String,
        address: address
    }
    
    public struct AddressUnlinked has copy, drop {
        username: String,
        address: address
    }
    
    public struct ProfileImageUpdated has copy, drop {
        username: String,
        new_image: String,
        owner: address
    }

    // Initialize the registry
    fun init(ctx: &mut TxContext) {
        let registry = Registry {
            id: object::new(ctx),
            usernames: table::new(ctx),
            addresses: table::new(ctx)
        };
        
        transfer::share_object(registry);
    }

    // Register a new username
    public entry fun register_username(
        registry: &mut Registry, 
        username: String,
        profile_image: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure username is not already registered
        assert!(!table::contains(&registry.usernames, username), EUsernameAlreadyRegistered);
        
        // Ensure address is not already registered
        assert!(!table::contains(&registry.addresses, sender), EAddressAlreadyRegistered);
        
        // Create linked addresses set with the owner as the first linked address
        let mut linked_addresses = vec_set::empty();
        vec_set::insert(&mut linked_addresses, sender);
        
        // Create username info with requester as owner
        let username_info = UsernameInfo {
            id: object::new(ctx),
            username: copy username,
            owner: sender,
            profile_image,
            linked_addresses
        };

        // Add to registry
        let username_info_id = object::id(&username_info);
        table::add(&mut registry.usernames, copy username, username_info_id);

        // Add to addresses table
        table::add(&mut registry.addresses, sender, username);
        
        // Emit event
        event::emit(UsernameRegistered {
            username: copy username,
            owner: sender
        });

        // Transfer the Username object to the caller
        dynamic_object_field::add(&mut registry.id, username_info_id, username_info);
    }

    // Link an additional address to a username
    public entry fun link_address(
        registry: &mut Registry,
        username: String,
        address_to_link: address,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure username exists
        assert!(table::contains(&registry.usernames, username), EUsernameNotFound);
        
        let username_id = table::borrow(&registry.usernames, username);
        let username_info = dynamic_object_field::borrow_mut<ID, UsernameInfo>(&mut registry.id, *username_id);
        
        // Ensure sender is the owner
        assert!(username_info.owner == sender, ENotAuthorized);
        
        // Ensure address is not already linked to any username
        assert!(!table::contains(&registry.addresses, address_to_link), EAddressAlreadyRegistered);
        
        // Ensure address is not already linked to this username
        assert!(!vec_set::contains(&username_info.linked_addresses, &address_to_link), EAddressAlreadyLinked);
        
        // Link the address
        vec_set::insert(&mut username_info.linked_addresses, address_to_link);
        
        // Add to addresses table
        table::add(&mut registry.addresses, address_to_link, copy username);
        
        // Emit event
        event::emit(AddressLinked {
            username: copy username,
            address: address_to_link
        });
    }

    // Unlink an address from a username
    public entry fun unlink_address(
        registry: &mut Registry,
        username: String,
        address_to_unlink: address,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure username exists
        assert!(table::contains(&registry.usernames, username), EUsernameNotFound);
        
        let username_id = table::borrow(&registry.usernames, username);
        let username_info = dynamic_object_field::borrow_mut<ID, UsernameInfo>(&mut registry.id, *username_id);
        
        // Ensure sender is the owner
        assert!(username_info.owner == sender, ENotAuthorized);
        
        // Ensure address is linked to this username
        assert!(vec_set::contains(&username_info.linked_addresses, &address_to_unlink), EAddressNotLinked);
        
        // Cannot unlink the owner's address
        assert!(address_to_unlink != username_info.owner, ENotAuthorized);
        
        // Unlink the address
        vec_set::remove(&mut username_info.linked_addresses, &address_to_unlink);
        
        // Remove from addresses table
        table::remove(&mut registry.addresses, address_to_unlink);
        
        // Emit event
        event::emit(AddressUnlinked {
            username: copy username,
            address: address_to_unlink
        });
    }

    // Update profile image
    public entry fun update_profile_image(
        registry: &mut Registry, 
        username: String, 
        new_image: String, 
        ctx: &mut TxContext
    ) {
        assert!(table::contains(&registry.usernames, username), EUsernameNotFound);
        
        let username_id = table::borrow(&registry.usernames, username);
        let username_info = dynamic_object_field::borrow_mut<ID, UsernameInfo>(&mut registry.id, *username_id);
        
        assert!(tx_context::sender(ctx) == username_info.owner, ENotAuthorized);
        
        username_info.profile_image = new_image;
        
        event::emit(ProfileImageUpdated {
            username,
            new_image,
            owner: username_info.owner
        });
    }

    // Get username by address
    public fun get_username_by_address(registry: &Registry, addr: address): String {
        assert!(table::contains(&registry.addresses, addr), EAddressNotRegistered);
        *table::borrow(&registry.addresses, addr)
    }

    // Check if a username exists
    public fun username_exists(registry: &Registry, username: &String): bool {
        table::contains(&registry.usernames, *username)
    }

    // Get username owner
    public fun get_username_owner(registry: &Registry, username: &String): address {
        assert!(table::contains(&registry.usernames, *username), EUsernameNotFound);
        
        let username_id = table::borrow(&registry.usernames, *username);
        let username_info = dynamic_object_field::borrow<ID, UsernameInfo>(&registry.id, *username_id);
        username_info.owner
    }

    // Get all linked addresses for a specific username
    public fun get_linked_addresses(registry: &Registry, username: &String): vector<address> {
        assert!(table::contains(&registry.usernames, *username), EUsernameNotFound);
        
        let username_id = table::borrow(&registry.usernames, *username);
        let username_info = dynamic_object_field::borrow<ID, UsernameInfo>(&registry.id, *username_id);
        vec_set::into_keys(username_info.linked_addresses)
    }
}
