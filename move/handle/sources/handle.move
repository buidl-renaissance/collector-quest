/*
/// Module: handle
module handle::handle;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


module handle::handle {
    use std::string::{Self, String};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::event;

    /// Error codes
    const EHandleAlreadyRegistered: u64 = 0;
    const EHandleTooShort: u64 = 1;
    const EHandleTooLong: u64 = 2;
    const EInvalidHandleFormat: u64 = 3;

    /// Minimum and maximum handle length constraints
    const MIN_HANDLE_LENGTH: u64 = 3;
    const MAX_HANDLE_LENGTH: u64 = 32;
    
    /// Registry to store all handles
    public struct Registry has key {
        id: UID,
        handles: Table<String, address>
    }

    /// Handle NFT owned by users
    public struct Handle has key {
        id: UID,
        name: String,
        owner: address
    }

    /// Event emitted when a new handle is registered
    public struct HandleRegistered has copy, drop {
        name: String,
        owner: address
    }

    /// Initialize the registry. Called once when the module is published.
    fun init(ctx: &mut TxContext) {
        let registry = Registry {
            id: object::new(ctx),
            handles: table::new(ctx)
        };
        transfer::share_object(registry);
    }

    /// Register a new handle
    public entry fun register_handle(
        registry: &mut Registry,
        name: vector<u8>,
        ctx: &mut TxContext
    ) {
        let name_string = string::utf8(name);
        
        // Validate handle length
        let name_length = string::length(&name_string);
        assert!(name_length >= MIN_HANDLE_LENGTH, EHandleTooShort);
        assert!(name_length <= MAX_HANDLE_LENGTH, EHandleTooLong);
        
        // Validate handle format (only alphanumeric and underscores)
        // Note: In a real implementation, you would add more validation logic here
        
        // Check if handle is already registered
        assert!(!table::contains(&registry.handles, name_string), EHandleAlreadyRegistered);
        
        // Register the handle
        let owner = tx_context::sender(ctx);
        table::add(&mut registry.handles, name_string, owner);
        
        // Create and transfer the Handle NFT to the caller
        let handle = Handle {
            id: object::new(ctx),
            name: name_string,
            owner
        };
        
        // Emit event
        event::emit(HandleRegistered {
            name: name_string,
            owner
        });
        
        transfer::transfer(handle, owner);
    }

    /// Get the owner of a handle
    public fun get_handle_owner(registry: &Registry, name: String): address {
        *table::borrow(&registry.handles, name)
    }

    /// Check if a handle is registered
    public fun is_handle_registered(registry: &Registry, name: String): bool {
        table::contains(&registry.handles, name)
    }
}
