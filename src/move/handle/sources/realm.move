module handle::realm {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::vec_set::{Self, VecSet};
    use std::string::{Self, String};
    use sui::event;
    use std::vector;
    use handle::handle::{Self, Registry};

    // Error codes
    const ENotAuthorized: u64 = 1;
    const ERealmAlreadyExists: u64 = 2;
    const ERealmNotFound: u64 = 3;
    const EAlreadyMember: u64 = 4;
    const ENotMember: u64 = 5;
    const EGuardianAlreadyAdded: u64 = 6;
    const EInvalidGuardian: u64 = 7;
    const EHandleNotRegistered: u64 = 8;
    const EHandleNotConfirmed: u64 = 9;

    // Registry to store all realms
    public struct RealmRegistry has key {
        id: UID,
        realms: Table<String, Realm>,
        guardians: VecSet<address>
    }

    // Realm structure representing a community
    public struct Realm has store {
        name: String,
        description: String,
        image_url: String,
        location: String,
        creator: address,
        members: VecSet<String>, // Store handles instead of addresses
        member_count: u64,
        realm_guardians: VecSet<address>,
        created_at: u64
    }

    // Events
    public struct RealmCreated has copy, drop {
        name: String,
        creator: address
    }

    public struct MemberJoined has copy, drop {
        realm_name: String,
        member_handle: String
    }

    public struct MemberLeft has copy, drop {
        realm_name: String,
        member_handle: String
    }

    public struct GuardianAdded has copy, drop {
        realm_name: String,
        guardian: address
    }

    // Initialize the realm registry
    fun init(ctx: &mut TxContext) {
        let registry = RealmRegistry {
            id: object::new(ctx),
            realms: table::new(ctx),
            guardians: vec_set::empty()
        };
        
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
        handle_registry: &Registry,
        name: String,
        description: String,
        image_url: String,
        location: String,
        realm_guardians: vector<address>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure realm doesn't already exist
        assert!(!table::contains(&registry.realms, name), ERealmAlreadyExists);
        
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
        
        // Get creator's handle
        let creator_handle = handle::get_handle_for_address(handle_registry, sender);
        
        // Create members set with creator's handle as first member
        let mut members = vec_set::empty();
        vec_set::insert(&mut members, copy creator_handle);
        
        // Create realm
        let realm = Realm {
            name,
            description,
            image_url,
            location,
            creator: sender,
            members,
            member_count: 1,
            realm_guardians: guardians_set,
            created_at: tx_context::epoch(ctx)
        };
        
        // Add to registry
        table::add(&mut registry.realms, name, realm);
        
        // Emit event
        event::emit(RealmCreated {
            name,
            creator: sender
        });
    }

    // Join a realm with handle
    public fun join_realm(
        registry: &mut RealmRegistry,
        handle_registry: &Registry,
        realm_name: String,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Get user's handle
        let user_handle = handle::get_handle_for_address(handle_registry, sender);
        
        // Ensure handle is confirmed
        assert!(handle::is_handle_confirmed(handle_registry, &user_handle), EHandleNotConfirmed);
        
        // Ensure realm exists
        assert!(table::contains(&registry.realms, realm_name), ERealmNotFound);
        
        let realm = table::borrow_mut(&mut registry.realms, realm_name);
        
        // Ensure user is not already a member
        assert!(!vec_set::contains(&realm.members, &user_handle), EAlreadyMember);
        
        // Add user's handle to members
        vec_set::insert(&mut realm.members, user_handle);
        realm.member_count = realm.member_count + 1;
        
        // Emit event
        event::emit(MemberJoined {
            realm_name: realm_name,
            member_handle: user_handle
        });
    }

    // Leave a realm
    public fun leave_realm(
        registry: &mut RealmRegistry,
        handle_registry: &Registry,
        realm_name: String,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Get user's handle
        let user_handle = handle::get_handle_for_address(handle_registry, sender);
        
        // Ensure realm exists
        assert!(table::contains(&registry.realms, realm_name), ERealmNotFound);
        
        let realm = table::borrow_mut(&mut registry.realms, realm_name);
        
        // Ensure user is a member
        assert!(vec_set::contains(&realm.members, &user_handle), ENotMember);
        
        // Remove user's handle from members
        vec_set::remove(&mut realm.members, &user_handle);
        realm.member_count = realm.member_count - 1;
        
        // Emit event
        event::emit(MemberLeft {
            realm_name: realm_name,
            member_handle: user_handle
        });
    }

    // Add a guardian to a realm
    public fun add_realm_guardian(
        registry: &mut RealmRegistry,
        realm_name: String,
        guardian: address,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Ensure realm exists
        assert!(table::contains(&registry.realms, realm_name), ERealmNotFound);
        
        let realm = table::borrow_mut(&mut registry.realms, realm_name);
        
        // Ensure sender is the creator
        assert!(realm.creator == sender, ENotAuthorized);
        
        // Ensure guardian is valid
        assert!(vec_set::contains(&registry.guardians, &guardian), EInvalidGuardian);
        
        // Ensure guardian is not already added
        assert!(!vec_set::contains(&realm.realm_guardians, &guardian), EGuardianAlreadyAdded);
        
        // Add guardian
        vec_set::insert(&mut realm.realm_guardians, guardian);
        
        // Emit event
        event::emit(GuardianAdded {
            realm_name: realm_name,
            guardian
        });
    }

    // Check if a handle is a member of a realm
    public fun is_member(registry: &RealmRegistry, realm_name: String, handle: &String): bool {
        if (!table::contains(&registry.realms, realm_name)) {
            return false
        };
        
        let realm = table::borrow(&registry.realms, realm_name);
        vec_set::contains(&realm.members, handle)
    }

    // Get realm member count
    public fun get_member_count(registry: &RealmRegistry, realm_name: String): u64 {
        assert!(table::contains(&registry.realms, realm_name), ERealmNotFound);
        let realm = table::borrow(&registry.realms, realm_name);
        realm.member_count
    }

    // Get realm details
    public fun get_realm_details(registry: &RealmRegistry, realm_name: String): (String, String, String, address, u64) {
        assert!(table::contains(&registry.realms, realm_name), ERealmNotFound);
        let realm = table::borrow(&registry.realms, realm_name);
        (
            realm.name,
            realm.description,
            realm.image_url,
            realm.creator,
            realm.member_count
        )
    }
}
