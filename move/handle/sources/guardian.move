/*
/// Module: guardian
/// A contract to manage guardians who can confirm handle registrations
/// Guardians play a crucial role in the security of the handle registration system
*/

module handle::guardian {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use sui::vec_set::{Self, VecSet};
    use std::string::{Self, String};
    use sui::event;

    // Error codes
    const ENotAuthorized: u64 = 1;
    const EGuardianAlreadyRegistered: u64 = 2;
    const EGuardianNotFound: u64 = 3;
    const EInvalidGuardian: u64 = 4;

    // Registry to store all guardians
    struct GuardianRegistry has key {
        id: UID,
        guardians: Table<address, GuardianInfo>,
        admin: address
    }

    // Information about a guardian
    struct GuardianInfo has store {
        address: address,
        name: String,
        active: bool,
        handles_confirmed: u64,
        reputation_score: u64,
        specialties: VecSet<String>
    }

    // Events
    struct GuardianRegistered has copy, drop {
        guardian: address,
        name: String
    }

    struct GuardianDeactivated has copy, drop {
        guardian: address
    }

    struct GuardianReactivated has copy, drop {
        guardian: address
    }

    struct GuardianReputationUpdated has copy, drop {
        guardian: address,
        new_score: u64
    }

    // Initialize the guardian registry
    fun init(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        
        let registry = GuardianRegistry {
            id: object::new(ctx),
            guardians: table::new(ctx),
            admin: sender
        };
        
        transfer::share_object(registry);
    }

    // Register a new guardian
    public fun register_guardian(
        registry: &mut GuardianRegistry,
        name: String,
        specialties: vector<String>,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Only admin can register guardians
        assert!(sender == registry.admin, ENotAuthorized);
        
        // Ensure guardian is not already registered
        assert!(!table::contains(&registry.guardians, sender), EGuardianAlreadyRegistered);
        
        // Create specialty set
        let specialty_set = vec_set::empty();
        let i = 0;
        let len = vector::length(&specialties);
        
        while (i < len) {
            let specialty = vector::borrow(&specialties, i);
            vec_set::insert(&mut specialty_set, *specialty);
            i = i + 1;
        };
        
        // Add guardian to registry
        table::add(&mut registry.guardians, sender, GuardianInfo {
            address: sender,
            name,
            active: true,
            handles_confirmed: 0,
            reputation_score: 100, // Start with base reputation
            specialties: specialty_set
        });
        
        // Emit event
        event::emit(GuardianRegistered {
            guardian: sender,
            name
        });
    }

    // Deactivate a guardian
    public fun deactivate_guardian(
        registry: &mut GuardianRegistry,
        guardian: address,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Only admin can deactivate guardians
        assert!(sender == registry.admin, ENotAuthorized);
        
        // Ensure guardian exists
        assert!(table::contains(&registry.guardians, guardian), EGuardianNotFound);
        
        let guardian_info = table::borrow_mut(&mut registry.guardians, guardian);
        guardian_info.active = false;
        
        // Emit event
        event::emit(GuardianDeactivated {
            guardian
        });
    }

    // Reactivate a guardian
    public fun reactivate_guardian(
        registry: &mut GuardianRegistry,
        guardian: address,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Only admin can reactivate guardians
        assert!(sender == registry.admin, ENotAuthorized);
        
        // Ensure guardian exists
        assert!(table::contains(&registry.guardians, guardian), EGuardianNotFound);
        
        let guardian_info = table::borrow_mut(&mut registry.guardians, guardian);
        guardian_info.active = true;
        
        // Emit event
        event::emit(GuardianReactivated {
            guardian
        });
    }

    // Update guardian reputation score
    public fun update_reputation(
        registry: &mut GuardianRegistry,
        guardian: address,
        score_change: u64,
        increase: bool,
        ctx: &TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Only admin can update reputation
        assert!(sender == registry.admin, ENotAuthorized);
        
        // Ensure guardian exists
        assert!(table::contains(&registry.guardians, guardian), EGuardianNotFound);
        
        let guardian_info = table::borrow_mut(&mut registry.guardians, guardian);
        
        if (increase) {
            guardian_info.reputation_score = guardian_info.reputation_score + score_change;
        } else {
            // Ensure we don't underflow
            if (guardian_info.reputation_score > score_change) {
                guardian_info.reputation_score = guardian_info.reputation_score - score_change;
            } else {
                guardian_info.reputation_score = 0;
            }
        };
        
        // Emit event
        event::emit(GuardianReputationUpdated {
            guardian,
            new_score: guardian_info.reputation_score
        });
    }

    // Increment handle confirmation count for a guardian
    public fun increment_confirmation_count(
        registry: &mut GuardianRegistry,
        guardian: address
    ) {
        // Ensure guardian exists
        assert!(table::contains(&registry.guardians, guardian), EGuardianNotFound);
        
        let guardian_info = table::borrow_mut(&mut registry.guardians, guardian);
        guardian_info.handles_confirmed = guardian_info.handles_confirmed + 1;
    }

    // Check if an address is a registered and active guardian
    public fun is_active_guardian(registry: &GuardianRegistry, addr: address): bool {
        if (!table::contains(&registry.guardians, addr)) {
            return false
        };
        
        let guardian_info = table::borrow(&registry.guardians, addr);
        guardian_info.active
    }

    // Get guardian reputation score
    public fun get_reputation(registry: &GuardianRegistry, guardian: address): u64 {
        assert!(table::contains(&registry.guardians, guardian), EGuardianNotFound);
        let guardian_info = table::borrow(&registry.guardians, guardian);
        guardian_info.reputation_score
    }

    // Get number of handles confirmed by a guardian
    public fun get_confirmation_count(registry: &GuardianRegistry, guardian: address): u64 {
        assert!(table::contains(&registry.guardians, guardian), EGuardianNotFound);
        let guardian_info = table::borrow(&registry.guardians, guardian);
        guardian_info.handles_confirmed
    }

    // Check if a guardian has a specific specialty
    public fun has_specialty(registry: &GuardianRegistry, guardian: address, specialty: &String): bool {
        assert!(table::contains(&registry.guardians, guardian), EGuardianNotFound);
        let guardian_info = table::borrow(&registry.guardians, guardian);
        vec_set::contains(&guardian_info.specialties, specialty)
    }
}
