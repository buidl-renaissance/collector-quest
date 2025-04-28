/*
/// Module: handler
/// A contract to manage which addresses have access to a handle
/// This module works alongside the handle module to provide access control
*/

module handle::handler {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::vec_set::{Self, VecSet};
    use std::string::{Self, String};
    use sui::event;
    use handle::handle::{Self, Registry};

    // Error codes
    const ENotAuthorized: u64 = 1;
    const EHandleNotFound: u64 = 2;
    const EHandlerAlreadyExists: u64 = 3;
    const EHandlerNotFound: u64 = 4;
    const EAddressAlreadyAuthorized: u64 = 5;

    // Handler registry to manage access to handles
    struct HandlerRegistry has key {
        id: UID,
        // Maps handle to a set of authorized addresses
        handlers: Table<String, HandlerInfo>
    }

    // Information about handlers for a specific handle
    struct HandlerInfo has store {
        handle: String,
        owner: address,
        authorized_addresses: VecSet<address>
    }

    // Events
    struct HandlerCreated has copy, drop {
        handle: String,
        owner: address
    }

    struct AddressAuthorized has copy, drop {
        handle: String,
        authorized_address: address
    }

    struct AddressDeauthorized has copy, drop {
        handle: String,
        deauthorized_address: address
    }

    // Initialize the handler registry
    fun init(ctx: &mut TxContext) {
        let handler_registry = HandlerRegistry {
            id: object::new(ctx),
            handlers: table::new(ctx)
        };
        
        transfer::share_object(handler_registry);
    }

    // Create a new handler for a handle
    // Only the owner of a confirmed handle can create a handler
    public fun create_handler(
        registry: &Registry,
        handler_registry: &mut HandlerRegistry,
        handle: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Verify handle exists and is confirmed
        assert!(handle::is_handle_confirmed(registry, &handle), EHandleNotFound);
        
        // Verify sender is the owner of the handle
        let owner_handle = handle::get_handle_for_address(registry, sender);
        assert!(string::to_ascii(owner_handle) == string::to_ascii(handle), ENotAuthorized);
        
        // Ensure handler doesn't already exist
        assert!(!table::contains(&handler_registry.handlers, handle), EHandlerAlreadyExists);
        
        // Create handler info
        let handler_info = HandlerInfo {
            handle: string::clone(&handle),
            owner: sender,
            authorized_addresses: vec_set::empty()
        };
        
        // Add owner as an authorized address
        vec_set::insert(&mut handler_info.authorized_addresses, sender);
        
        // Add to registry
        table::add(&mut handler_registry.handlers, string::clone(&handle), handler_info);
        
        // Emit event
        event::emit(HandlerCreated {
            handle: string::clone(&handle),
            owner: sender
        });
    }

    // Authorize an address to use a handle
    public fun authorize_address(
        handler_registry: &mut HandlerRegistry,
        handle: String,
        address_to_authorize: address,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure handler exists
        assert!(table::contains(&handler_registry.handlers, handle), EHandlerNotFound);
        
        let handler_info = table::borrow_mut(&mut handler_registry.handlers, handle);
        
        // Ensure sender is the owner
        assert!(handler_info.owner == sender, ENotAuthorized);
        
        // Ensure address is not already authorized
        assert!(!vec_set::contains(&handler_info.authorized_addresses, &address_to_authorize), EAddressAlreadyAuthorized);
        
        // Add address to authorized addresses
        vec_set::insert(&mut handler_info.authorized_addresses, address_to_authorize);
        
        // Emit event
        event::emit(AddressAuthorized {
            handle: string::clone(&handler_info.handle),
            authorized_address: address_to_authorize
        });
    }

    // Deauthorize an address from using a handle
    public fun deauthorize_address(
        handler_registry: &mut HandlerRegistry,
        handle: String,
        address_to_deauthorize: address,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure handler exists
        assert!(table::contains(&handler_registry.handlers, handle), EHandlerNotFound);
        
        let handler_info = table::borrow_mut(&mut handler_registry.handlers, handle);
        
        // Ensure sender is the owner
        assert!(handler_info.owner == sender, ENotAuthorized);
        
        // Remove address from authorized addresses if it exists
        if (vec_set::contains(&handler_info.authorized_addresses, &address_to_deauthorize)) {
            vec_set::remove(&mut handler_info.authorized_addresses, &address_to_deauthorize);
            
            // Emit event
            event::emit(AddressDeauthorized {
                handle: string::clone(&handler_info.handle),
                deauthorized_address: address_to_deauthorize
            });
        };
    }

    // Check if an address is authorized to use a handle
    public fun is_authorized(
        handler_registry: &HandlerRegistry,
        handle: &String,
        addr: address
    ): bool {
        if (!table::contains(&handler_registry.handlers, *handle)) {
            return false
        };
        
        let handler_info = table::borrow(&handler_registry.handlers, *handle);
        vec_set::contains(&handler_info.authorized_addresses, &addr)
    }

    // Get all authorized addresses for a handle
    public fun get_authorized_addresses(
        handler_registry: &HandlerRegistry,
        handle: &String
    ): vector<address> {
        assert!(table::contains(&handler_registry.handlers, *handle), EHandlerNotFound);
        
        let handler_info = table::borrow(&handler_registry.handlers, *handle);
        vec_set::into_keys(handler_info.authorized_addresses)
    }

    // Transfer ownership of a handler
    public fun transfer_ownership(
        handler_registry: &mut HandlerRegistry,
        handle: String,
        new_owner: address,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure handler exists
        assert!(table::contains(&handler_registry.handlers, handle), EHandlerNotFound);
        
        let handler_info = table::borrow_mut(&mut handler_registry.handlers, handle);
        
        // Ensure sender is the current owner
        assert!(handler_info.owner == sender, ENotAuthorized);
        
        // Update owner
        handler_info.owner = new_owner;
        
        // Ensure new owner is authorized
        if (!vec_set::contains(&handler_info.authorized_addresses, &new_owner)) {
            vec_set::insert(&mut handler_info.authorized_addresses, new_owner);
        };
    }
}
