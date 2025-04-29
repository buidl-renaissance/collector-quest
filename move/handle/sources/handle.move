/*
/// Module: handle
/// A contract to register a handle, where guardians confirm the wallet registration to a handle
/// with a secure PIN code for additional security
*/

module handle::handle {
    use sui::object::{Self, UID};
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
    const EInsufficientGuardians: u64 = 4;
    const EAlreadyConfirmed: u64 = 5;
    const EHandleNotFound: u64 = 6;
    const EInvalidPinCode: u64 = 7;
    const EHandleLocked: u64 = 8;
    const EGuardianAlreadyAdded: u64 = 9;
    const EInvalidGuardian: u64 = 10;

    // Minimum number of guardian confirmations required
    const MIN_CONFIRMATIONS: u64 = 2;
    
    // Maximum number of failed PIN attempts before locking
    const MAX_FAILED_ATTEMPTS: u64 = 5;

    // Registry to store all handle registrations
    public struct Registry has key {
        id: UID,
        handles: Table<String, HandleInfo>,
        addresses: Table<address, String>,
        guardians: VecSet<address>
    }

    // Information about a handle registration
    public struct HandleInfo has store {
        handle: String,
        owner: address,
        pin_hash: vector<u8>, // Hashed PIN code for security
        confirmations: VecSet<address>,
        confirmed: bool,
        failed_attempts: u64,
        locked: bool,
        handle_guardians: VecSet<address> // Specific guardians for this handle
    }

    // Events
    public struct HandleRegistrationRequested has copy, drop {
        handle: String,
        requester: address
    }

    public struct HandleConfirmed has copy, drop {
        handle: String,
        owner: address,
        guardian: address
    }

    public struct HandleRegistrationCompleted has copy, drop {
        handle: String,
        owner: address
    }
    
    public struct HandleLocked has copy, drop {
        handle: String,
        owner: address
    }
    
    public struct GuardianAdded has copy, drop {
        handle: String,
        guardian: address
    }

    // Initialize the registry
    fun init(ctx: &mut TxContext) {
        let registry = Registry {
            id: object::new(ctx),
            handles: table::new(ctx),
            addresses: table::new(ctx),
            guardians: vec_set::empty()
        };
        
        transfer::share_object(registry);
    }

    // Add a guardian to the registry
    public fun add_guardian(registry: &mut Registry, guardian: address, ctx: &TxContext) {
        // Only the deployer can add guardians initially
        // In a real implementation, you might want more sophisticated guardian management
        assert!(tx_context::sender(ctx) == @0x1, ENotAuthorized);
        vec_set::insert(&mut registry.guardians, guardian);
    }

    // Add a guardian specific to a handle
    public fun add_handle_guardian(
        registry: &mut Registry,
        handle: String,
        guardian: address,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure handle exists
        assert!(table::contains(&registry.handles, handle), EHandleNotFound);
        
        let handle_info = table::borrow_mut(&mut registry.handles, handle);
        
        // Ensure sender is the owner
        assert!(handle_info.owner == sender, ENotAuthorized);
        
        // Ensure guardian is not already added for this handle
        assert!(!vec_set::contains(&handle_info.handle_guardians, &guardian), EGuardianAlreadyAdded);
        
        // Add guardian to handle's guardians
        vec_set::insert(&mut handle_info.handle_guardians, guardian);
        
        // Emit event
        event::emit(GuardianAdded {
            handle: handle_info.handle,
            guardian
        });
    }

    // Hash the PIN code for secure storage
    fun hash_pin(pin: vector<u8>): vector<u8> {
        blake2b256(&pin)
    }

    // Request a handle registration with a PIN code and optional handle guardians
    public fun request_handle_registration(
        registry: &mut Registry, 
        handle: String,
        pin_code: vector<u8>,
        handle_guardians: vector<address>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure handle is not already registered
        assert!(!table::contains(&registry.handles, handle), EHandleAlreadyRegistered);
        
        // Ensure address is not already registered
        assert!(!table::contains(&registry.addresses, sender), EAddressAlreadyRegistered);
        
        // Hash the PIN code for secure storage, we need to hash the handle name with the pin code to ensure unique hash for each handle
        let pin_hash = hash_pin(pin_code);
        
        // Create handle guardians set
        let mut guardians_set = vec_set::empty();
        let mut i = 0;
        let len = vector::length(&handle_guardians);
        
        while (i < len) {
            let guardian = *vector::borrow(&handle_guardians, i);
            // Ensure guardian is a valid global guardian
            assert!(vec_set::contains(&registry.guardians, &guardian), EInvalidGuardian);
            vec_set::insert(&mut guardians_set, copy guardian);
            i = i + 1;
        };
        
        // Create handle info with requester as owner
        let handle_info = HandleInfo {
            handle,
            owner: sender,
            pin_hash,
            confirmations: vec_set::empty(),
            confirmed: false,
            failed_attempts: 0,
            locked: false,
            handle_guardians: guardians_set
        };
        
        // Add to registry
        table::add(&mut registry.handles, handle, handle_info);
        
        // Emit event
        event::emit(HandleRegistrationRequested {
            handle,
            requester: sender
        });
    }

    // Guardian confirms a handle registration with PIN verification
    public fun confirm_handle(
        registry: &mut Registry,
        handle: String,
        pin_code: vector<u8>,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure handle exists
        assert!(table::contains(&registry.handles, handle), EHandleNotFound);
        
        let handle_info = table::borrow_mut(&mut registry.handles, handle);
        
        // Ensure sender is either a global guardian or a handle-specific guardian
        assert!(
            vec_set::contains(&registry.guardians, &sender) || 
            vec_set::contains(&handle_info.handle_guardians, &sender), 
            ENotAuthorized
        );
        
        // Ensure handle is not already confirmed
        assert!(!handle_info.confirmed, EAlreadyConfirmed);
        
        // Ensure handle is not locked due to too many failed attempts
        assert!(!handle_info.locked, EHandleLocked);
        
        // Verify PIN code
        let pin_hash = hash_pin(pin_code);
        if (pin_hash != handle_info.pin_hash) {
            // Increment failed attempts
            handle_info.failed_attempts = handle_info.failed_attempts + 1;
            
            // Lock the handle if max attempts reached
            if (handle_info.failed_attempts >= MAX_FAILED_ATTEMPTS) {
                handle_info.locked = true;
                
                // Emit locked event
                event::emit(HandleLocked {
                    handle: handle_info.handle,
                    owner: handle_info.owner
                });
            };
            
            // Return error for invalid PIN code
            assert!(false, EInvalidPinCode);
        };
        
        // Reset failed attempts on successful PIN verification
        handle_info.failed_attempts = 0;
        
        // Ensure guardian hasn't already confirmed
        assert!(!vec_set::contains(&handle_info.confirmations, &sender), EAlreadyConfirmed);
        
        // Add confirmation
        vec_set::insert(&mut handle_info.confirmations, sender);
        
        // Emit confirmation event
        event::emit(HandleConfirmed {
            handle: handle_info.handle,
            owner: handle_info.owner,
            guardian: sender
        });
        
        // Check if we have enough confirmations
        if (vec_set::size(&handle_info.confirmations) >= MIN_CONFIRMATIONS) {
            handle_info.confirmed = true;
            
            // Register the address to handle mapping
            table::add(&mut registry.addresses, handle_info.owner, handle_info.handle);
            
            // Emit completion event
            event::emit(HandleRegistrationCompleted {
                handle: handle_info.handle,
                owner: handle_info.owner
            });
        }
    }

    // Get handle for an address
    public fun get_handle_for_address(registry: &Registry, addr: address): String {
        assert!(table::contains(&registry.addresses, addr), EAddressAlreadyRegistered);
        *table::borrow(&registry.addresses, addr)
    }

    // Check if a handle is registered and confirmed
    public fun is_handle_confirmed(registry: &Registry, handle: &String): bool {
        if (!table::contains(&registry.handles, *handle)) {
            return false
        };
        
        let handle_info = table::borrow(&registry.handles, *handle);
        handle_info.confirmed
    }
    
    // Check if a handle is locked due to too many failed PIN attempts
    public fun is_handle_locked(registry: &Registry, handle: &String): bool {
        if (!table::contains(&registry.handles, *handle)) {
            return false
        };
        
        let handle_info = table::borrow(&registry.handles, *handle);
        handle_info.locked
    }
    
    // Get all guardians for a specific handle
    public fun get_handle_guardians(registry: &Registry, handle: &String): vector<address> {
        assert!(table::contains(&registry.handles, *handle), EHandleNotFound);
        
        let handle_info = table::borrow(&registry.handles, *handle);
        vec_set::into_keys(handle_info.handle_guardians)
    }

    // Get handle owner
    public fun get_handle_owner(registry: &Registry, handle: &String): address {
        assert!(table::contains(&registry.handles, *handle), EHandleNotFound);
        
        let handle_info = table::borrow(&registry.handles, *handle);
        handle_info.owner
    }
    
    // Check if a handle exists
    public fun handle_exists(registry: &Registry, handle: &String): bool {
        table::contains(&registry.handles, *handle)
    }
}
