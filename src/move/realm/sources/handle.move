/// Module: handle
/// A contract to manage handles within realms
/// Handles are unique identifiers for users within a realm


module realm::handle {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::vec_set::{Self, VecSet};
    use std::string::{Self, String};
    use sui::event;
    use sui::hash::{Self, blake2b256};
    use std::vector;

    // Error codes
    const ENotAuthorized: u64 = 1;
    const EHandleAlreadyRegistered: u64 = 2;
    const EAddressAlreadyRegistered: u64 = 3;
    const EHandleNotFound: u64 = 4;
    const EHandleLocked: u64 = 6;
    const EAddressAlreadyLinked: u64 = 7;
    const EAddressNotLinked: u64 = 8;
    const EInvalidHandle: u64 = 9;
    const EAddressNotRegistered: u64 = 10;

    // Registry to store all handle registrations
    public struct Registry has key {
        id: UID,
        handles: Table<String, ID>,
        realm_id: ID
    }

    // Information about a handle registration
    public struct HandleInfo has key, store {
        id: UID,
        handle: String,
        owner: address,
        image: String,
        locked: bool,
        created_at: u64,
        updated_at: u64
    }

    // Events
    public struct HandleRegistered has copy, drop {
        handle: String,
        owner: address,
        realm_id: ID
    }

    public struct HandleLocked has copy, drop {
        handle: String,
        owner: address
    }
    
    public struct HandleImageUpdated has copy, drop {
        handle: String,
        new_image: String,
        owner: address
    }

    // Initialize a new handle registry for a realm
    public fun create_registry(realm_id: ID, ctx: &mut TxContext): Registry {
        Registry {
            id: object::new(ctx),
            handles: table::new(ctx),
            realm_id
        }
    }

    // Register a new handle
    public fun register_handle(
        registry: &mut Registry,
        handle: String,
        image: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure handle doesn't already exist
        assert!(!table::contains(&registry.handles, handle), EHandleAlreadyRegistered);

        // Create handle info
        let handle_info = HandleInfo {
            id: object::new(ctx),
            handle: copy handle,
            owner: sender,
            image,
            locked: false,
            created_at: tx_context::epoch(ctx),
            updated_at: tx_context::epoch(ctx)
        };
        
        // Store handle info
        let handle_id = object::uid_to_inner(&handle_info.id);
        table::add(&mut registry.handles, copy handle, handle_id);
        
        // Store handle info as a dynamic field
        sui::dynamic_object_field::add(&mut registry.id, handle_id, handle_info);
        
        // Emit event
        event::emit(HandleRegistered {
            handle,
            owner: sender,
            realm_id: registry.realm_id
        });
    }

    // Update handle image
    public fun update_handle_image(
        registry: &mut Registry,
        handle: String,
        new_image: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure handle exists
        assert!(table::contains(&registry.handles, handle), EHandleNotFound);
        
        let handle_id = *table::borrow(&registry.handles, handle);
        let handle_info = borrow_handle_mut(registry, handle_id);
        
        // Ensure sender is the owner
        assert!(handle_info.owner == sender, ENotAuthorized);
        
        // Ensure handle is not locked
        assert!(!handle_info.locked, EHandleLocked);
        
        // Update image
        handle_info.image = new_image;
        
        // Update timestamp
        handle_info.updated_at = tx_context::epoch(ctx);
        
        // Emit event
        event::emit(HandleImageUpdated {
            handle,
            new_image,
            owner: sender
        });
    }

    // Check if handle exists
    public fun handle_exists(registry: &Registry, handle: &String): bool {
        table::contains(&registry.handles, *handle)
    }

    // Get handle owner
    public fun get_handle_owner(registry: &Registry, handle: &String): address {
        assert!(table::contains(&registry.handles, *handle), EHandleNotFound);
        
        let handle_id = *table::borrow(&registry.handles, *handle);
        let handle_info = borrow_handle(registry, handle_id);
        handle_info.owner
    }

    // Helper function to borrow handle info
    fun borrow_handle(registry: &Registry, handle_id: ID): &HandleInfo {
        sui::dynamic_object_field::borrow<ID, HandleInfo>(&registry.id, handle_id)
    }

    // Helper function to borrow mutable handle info
    fun borrow_handle_mut(registry: &mut Registry, handle_id: ID): &mut HandleInfo {
        sui::dynamic_object_field::borrow_mut<ID, HandleInfo>(&mut registry.id, handle_id)
    }
}
