/*
/// Module: realm
/// A contract to manage realms, which are isolated namespaces for handles
/// Each realm is managed by a guardian who can set policies and approve handles
*/

module realm::realm {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::url::{Self, Url};
    use sui::table::{Self, Table};
    use sui::vec_set::{Self, VecSet};
    use std::string::{Self, String};
    use sui::event;
    use std::vector;
    use sui::package;
    use sui::display;

    // Error codes
    const ENotAuthorized: u64 = 1;
    const ERealmAlreadyExists: u64 = 2;
    const ERealmNotFound: u64 = 3;
    const EHandleAlreadyRegistered: u64 = 4;
    const EHandleNotFound: u64 = 5;
    const EInvalidInviteCode: u64 = 6;
    const EInviteCodeAlreadyUsed: u64 = 7;
    const EHandleNotOwnedByUser: u64 = 8;
    const EHandleAlreadyGlobal: u64 = 9;
    const EMaxHandlesReached: u64 = 10;
    const EGuardianAlreadyAdded: u64 = 12;
    const EInvalidGuardian: u64 = 13;

    // Registry to store all realms
    public struct RealmRegistry has key {
        id: UID,
        realms: Table<ID, Realm>,
        guardians: VecSet<address>
    }

    // Realm structure representing a namespace
    public struct Realm has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        location: String,
        primary_guardian: address,
        guardians: VecSet<address>,
        handles: Table<String, Handle>,
        address_to_handle: Table<address, String>,
        invite_codes: Table<String, bool>,
        max_handles_per_user: u64,
        invitation_only: bool,
        requires_verification: bool
    }

    // Handle structure
    public struct Handle has key, store {
        id: UID,
        realm_id: ID,
        owner: address,
        name: String,
        is_global: bool,
        verified: bool,
        created_at: u64
    }

    // Events
    public struct RealmCreated has copy, drop {
        name: String,
        primary_guardian: address
    }

    public struct InviteIssued has copy, drop {
        realm_id: ID,
        code: String
    }

    public struct HandleRegistered has copy, drop {
        realm_id: ID,
        handle_name: String,
        owner: address
    }

    public struct GuardianAdded has copy, drop {
        realm_id: ID,
        guardian: address
    }

    // Realm capability to track ownership
    public struct RealmCapability has key, store {
        id: UID,
        realm_id: ID
    }

    /// One-time witness for the package
    public struct REALM has drop {}

    // Initialize the realm registry
    fun init(witness: REALM, ctx: &mut TxContext) {
        // Create the Publisher object
        let publisher = package::claim(witness, ctx);
        
        // Create the registry
        let registry = RealmRegistry {
            id: object::new(ctx),
            realms: table::new(ctx),
            guardians: vec_set::empty()
        };
        
        // Set up the Display for Realm
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"url"),
            string::utf8(b"location"),
            string::utf8(b"primary_guardian"),
        ];
        
        let values = vector[
            string::utf8(b"{name}"),
            string::utf8(b"{description}"),
            string::utf8(b"{url}"),
            string::utf8(b"{location}"),
            string::utf8(b"Managed by {primary_guardian}"),
        ];

        let mut display = display::new_with_fields<Realm>(
            &publisher, keys, values, ctx
        );

        // Commit the Display
        display::update_version(&mut display);
        
        // Transfer the Publisher and Display to the transaction sender
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));

        transfer::share_object(registry);
    }

    // Add a guardian to the registry
    public fun add_guardian(registry: &mut RealmRegistry, guardian: address, ctx: &TxContext) {
        // Only the deployer can add guardians initially
        assert!(tx_context::sender(ctx) == @0x1, ENotAuthorized);
        vec_set::insert(&mut registry.guardians, guardian);
    }
    
    // Create a new realm
    public fun create_realm(
        registry: &mut RealmRegistry,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        location: vector<u8>,
        max_handles_per_user: u64,
        invitation_only: bool,
        requires_verification: bool,
        realm_guardians: vector<address>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Create guardians set
        let mut guardians_set = vec_set::empty();
        let mut i = 0;
        let len = vector::length(&realm_guardians);
        
        while (i < len) {
            let guardian = *vector::borrow(&realm_guardians, i);
            // Ensure guardian is valid
            assert!(vec_set::contains(&registry.guardians, &guardian), EInvalidGuardian);
            vec_set::insert(&mut guardians_set, guardian);
            i = i + 1;
        };
        
        // Add the creator as a guardian if not already added
        if (!vec_set::contains(&guardians_set, &sender)) {
            vec_set::insert(&mut guardians_set, sender);
        };
        
        // Create realm
        let realm = Realm {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            location: string::utf8(location),
            primary_guardian: sender,
            guardians: guardians_set,
            handles: table::new(ctx),
            address_to_handle: table::new(ctx),
            invite_codes: table::new(ctx),
            max_handles_per_user,
            invitation_only,
            requires_verification
        };

        // Add to registry
        let realm_id = object::uid_to_inner(&realm.id);
        table::add(&mut registry.realms, realm_id, realm);
        
        // Create and transfer capability to sender
        let capability = RealmCapability {
            id: object::new(ctx),
            realm_id
        };
        transfer::transfer(capability, sender);

        // Emit event
        event::emit(RealmCreated {
            name: string::utf8(name),
            primary_guardian: sender
        });
    }

    // Add a guardian to a realm
    public fun add_realm_guardian(
        registry: &mut RealmRegistry,
        realm_id: ID,
        guardian: address,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure realm exists
        assert!(table::contains(&registry.realms, realm_id), ERealmNotFound);
        
        let realm = table::borrow_mut(&mut registry.realms, realm_id);
        
        // Ensure sender is the primary guardian
        assert!(realm.primary_guardian == sender, ENotAuthorized);
        
        // Ensure guardian is valid
        assert!(vec_set::contains(&registry.guardians, &guardian), EInvalidGuardian);
        
        // Ensure guardian is not already added
        assert!(!vec_set::contains(&realm.guardians, &guardian), EGuardianAlreadyAdded);
        
        // Add guardian
        vec_set::insert(&mut realm.guardians, guardian);
        
        // Emit event
        event::emit(GuardianAdded {
            realm_id,
            guardian
        });
    }

    // Issue an invitation code for a realm
    public fun issue_invite(
        registry: &mut RealmRegistry,
        realm_id: ID,
        code: String,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure realm exists
        assert!(table::contains(&registry.realms, realm_id), ERealmNotFound);
        
        let realm = table::borrow_mut(&mut registry.realms, realm_id);
        
        // Ensure sender is a guardian
        assert!(vec_set::contains(&realm.guardians, &sender), ENotAuthorized);
        
        // Add invite code
        table::add(&mut realm.invite_codes, code, false);
        
        // Emit event
        event::emit(InviteIssued {
            realm_id,
            code
        });
    }

    // Register a handle within a realm
    public fun register_handle(
        registry: &mut RealmRegistry,
        realm_id: ID,
        handle_name: String,
        invite_code: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure realm exists
        assert!(table::contains(&registry.realms, realm_id), ERealmNotFound);
        
        let realm = table::borrow_mut(&mut registry.realms, realm_id);
        
        // Check if invitation-only and validate code
        if (realm.invitation_only) {
            assert!(table::contains(&realm.invite_codes, invite_code), EInvalidInviteCode);
            assert!(!*table::borrow(&realm.invite_codes, invite_code), EInviteCodeAlreadyUsed);
            
            // Mark code as used
            *table::borrow_mut(&mut realm.invite_codes, invite_code) = true;
        };
        
        // Ensure handle doesn't already exist
        assert!(!table::contains(&realm.handles, handle_name), EHandleAlreadyRegistered);
        
        // Create handle
        let handle = Handle {
            id: object::new(ctx),
            realm_id,
            owner: sender,
            name: copy handle_name,
            is_global: false,
            verified: !realm.requires_verification,
            created_at: tx_context::epoch(ctx)
        };
        // Add to realm
        table::add(&mut realm.handles, handle_name, handle);
        table::add(&mut realm.address_to_handle, sender, handle_name);
        
        // Emit event
        event::emit(HandleRegistered {
            realm_id,
            handle_name,
            owner: sender
        });
    }

    // Get handle by address
    public fun get_handle_by_address(
        registry: &RealmRegistry,
        realm_id: ID,
        addr: address
    ): String {
        // Ensure realm exists
        assert!(table::contains(&registry.realms, realm_id), ERealmNotFound);
        
        let realm = table::borrow(&registry.realms, realm_id);
        
        // Ensure address has a handle
        assert!(table::contains(&realm.address_to_handle, addr), EHandleNotFound);
        
        *table::borrow(&realm.address_to_handle, addr)
    }

    // Resolve global handle to owner address
    public fun resolve_global_handle(
        registry: &RealmRegistry,
        realm_id: ID,
        handle_name: String
    ): address {
        // Ensure realm exists
        assert!(table::contains(&registry.realms, realm_id), ERealmNotFound);
        
        let realm = table::borrow(&registry.realms, realm_id);
        
        // Ensure handle exists
        assert!(table::contains(&realm.handles, handle_name), EHandleNotFound);
        
        let handle = table::borrow(&realm.handles, handle_name);
        
        // Return owner
        handle.owner
    }
}
