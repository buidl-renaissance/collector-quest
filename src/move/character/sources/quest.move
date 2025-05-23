/*
/// Module: quest
module character::quest;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module character::quest {
    use std::string::{Self, String};
    use std::vector;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::package;
    use sui::display;

    /// Error codes
    const ENotOwner: u64 = 0;
    const EInvalidStatus: u64 = 1;
    const ENotAuthorized: u64 = 2;
    const ENotAdmin: u64 = 3;
    const EQuestNotFound: u64 = 4;
    const EObjectiveNotFound: u64 = 5;
    const EQuestAlreadyCompleted: u64 = 6;
    const ERequirementsNotMet: u64 = 7;

    /// Represents a quest NFT
    public struct Quest has key, store {
        id: UID,
        title: String,
        description: String,
        story: String,
        quest_type: String, // exploration, puzzle, collection, mystery, artifact
        difficulty: String, // easy, medium, hard, epic
        status: String, // available, active, completed, locked
        required_level: u64,
        required_artifacts: vector<String>, // artifact IDs required
        required_relics: vector<String>, // relic IDs required
        required_previous_quests: vector<String>, // quest IDs that must be completed first
        reward_experience: u64,
        reward_artifacts: vector<String>, // artifact IDs awarded
        reward_relics: vector<String>, // relic IDs awarded
        reward_currency: u64,
        location: String,
        estimated_duration: u64, // in minutes
        image_url: String,
        creator: address,
        created_at: u64,
    }

    /// Represents a quest objective
    public struct QuestObjective has key, store {
        id: UID,
        quest_id: address,
        description: String,
        objective_type: String, // collect, interact, solve, discover, use
        target: String, // what needs to be collected/interacted with
        quantity: u64, // how many (for collect objectives)
        completed: bool,
        hint: String,
        created_at: u64,
    }

    /// Represents quest progress for a character
    public struct QuestProgress has key, store {
        id: UID,
        quest_id: address,
        character_id: address,
        status: String, // active, completed, failed
        objectives_progress: vector<ObjectiveProgress>,
        started_at: u64,
        completed_at: u64,
        created_at: u64,
    }

    /// Progress tracking for individual objectives
    public struct ObjectiveProgress has store, copy, drop {
        objective_id: address,
        completed: bool,
        progress: u64, // for objectives with quantity
    }

    /// Admin capability for quest management
    public struct QuestAdminCap has key, store {
        id: UID,
        admin: address,
    }

    /// Events
    public struct QuestCreated has copy, drop {
        quest_id: address,
        title: String,
        creator: address,
    }

    public struct QuestObjectiveCreated has copy, drop {
        objective_id: address,
        quest_id: address,
        description: String,
    }

    public struct QuestStarted has copy, drop {
        quest_id: address,
        character_id: address,
        started_at: u64,
    }

    public struct QuestCompleted has copy, drop {
        quest_id: address,
        character_id: address,
        completed_at: u64,
        experience_gained: u64,
    }

    public struct ObjectiveCompleted has copy, drop {
        objective_id: address,
        quest_id: address,
        character_id: address,
    }

    public struct AdminTransferred has copy, drop {
        old_admin: address,
        new_admin: address,
    }

    /// One-time witness for the package
    public struct QUEST has drop {}

    /// Initialize the contract
    fun init(witness: QUEST, ctx: &mut TxContext) {
        // Create the Publisher object
        let publisher = package::claim(witness, ctx);

        // Set up the Display for Quest
        let keys = vector[
            string::utf8(b"title"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"type"),
            string::utf8(b"difficulty"),
            string::utf8(b"status"),
        ];
        
        let values = vector[
            string::utf8(b"{title}"),
            string::utf8(b"A COLLECTOR QUEST: {title} - {description}"),
            string::utf8(b"{image_url}"),
            string::utf8(b"{quest_type}"),
            string::utf8(b"{difficulty}"),
            string::utf8(b"{status}"),
        ];

        let mut display = display::new_with_fields<Quest>(
            &publisher, keys, values, ctx
        );

        // Commit the Display
        display::update_version(&mut display);
        
        // Transfer the Publisher and Display to the transaction sender
        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));

        // Create and transfer the QuestAdminCap to the transaction sender
        let admin_cap = QuestAdminCap {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
        };
        transfer::public_transfer(admin_cap, tx_context::sender(ctx));
    }

    /// Transfer admin ownership to a new address
    public entry fun transfer_admin(
        admin_cap: QuestAdminCap,
        new_admin: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == admin_cap.admin, ENotAdmin);
        
        let old_admin = admin_cap.admin;
        
        // Create new admin cap for the new admin
        let new_admin_cap = QuestAdminCap {
            id: object::new(ctx),
            admin: new_admin,
        };

        // Emit event
        event::emit(AdminTransferred {
            old_admin,
            new_admin,
        });

        // Delete the old admin cap
        let QuestAdminCap { id, admin: _ } = admin_cap;
        object::delete(id);

        // Transfer new admin cap to the new admin
        transfer::public_transfer(new_admin_cap, new_admin);
    }

    /// Create a new quest
    public entry fun create_quest(
        title: vector<u8>,
        description: vector<u8>,
        story: vector<u8>,
        quest_type: vector<u8>,
        difficulty: vector<u8>,
        required_level: u64,
        reward_experience: u64,
        reward_currency: u64,
        location: vector<u8>,
        estimated_duration: u64,
        image_url: vector<u8>,
        ctx: &mut TxContext
    ): address {
        let quest = Quest {
            id: object::new(ctx),
            title: string::utf8(title),
            description: string::utf8(description),
            story: string::utf8(story),
            quest_type: string::utf8(quest_type),
            difficulty: string::utf8(difficulty),
            status: string::utf8(b"available"),
            required_level,
            required_artifacts: vector::empty(),
            required_relics: vector::empty(),
            required_previous_quests: vector::empty(),
            reward_experience,
            reward_artifacts: vector::empty(),
            reward_relics: vector::empty(),
            reward_currency,
            location: string::utf8(location),
            estimated_duration,
            image_url: string::utf8(image_url),
            creator: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
        };

        let quest_address = object::uid_to_address(&quest.id);

        event::emit(QuestCreated {
            quest_id: quest_address,
            title: quest.title,
            creator: quest.creator,
        });

        transfer::public_transfer(quest, tx_context::sender(ctx));

        quest_address
    }

    /// Create a quest objective
    public entry fun create_quest_objective(
        quest: &Quest,
        description: vector<u8>,
        objective_type: vector<u8>,
        target: vector<u8>,
        quantity: u64,
        hint: vector<u8>,
        ctx: &mut TxContext
    ): address {
        assert!(tx_context::sender(ctx) == quest.creator, ENotAuthorized);

        let objective = QuestObjective {
            id: object::new(ctx),
            quest_id: object::uid_to_address(&quest.id),
            description: string::utf8(description),
            objective_type: string::utf8(objective_type),
            target: string::utf8(target),
            quantity,
            completed: false,
            hint: string::utf8(hint),
            created_at: tx_context::epoch(ctx),
        };

        let objective_address = object::uid_to_address(&objective.id);

        event::emit(QuestObjectiveCreated {
            objective_id: objective_address,
            quest_id: object::uid_to_address(&quest.id),
            description: objective.description,
        });

        transfer::public_transfer(objective, tx_context::sender(ctx));

        objective_address
    }

    /// Start a quest for a character
    public entry fun start_quest(
        quest: &Quest,
        character_id: address,
        ctx: &mut TxContext
    ): address {
        // Check if quest is available
        assert!(quest.status == string::utf8(b"available"), EInvalidStatus);

        let progress = QuestProgress {
            id: object::new(ctx),
            quest_id: object::uid_to_address(&quest.id),
            character_id,
            status: string::utf8(b"active"),
            objectives_progress: vector::empty(),
            started_at: tx_context::epoch(ctx),
            completed_at: 0,
            created_at: tx_context::epoch(ctx),
        };

        let progress_address = object::uid_to_address(&progress.id);

        event::emit(QuestStarted {
            quest_id: object::uid_to_address(&quest.id),
            character_id,
            started_at: tx_context::epoch(ctx),
        });

        transfer::public_transfer(progress, tx_context::sender(ctx));

        progress_address
    }

    /// Update objective progress
    public entry fun update_objective_progress(
        progress: &mut QuestProgress,
        objective_id: address,
        new_progress: u64,
        completed: bool,
        ctx: &mut TxContext
    ) {
        let mut i = 0;
        let mut found = false;
        let len = vector::length(&progress.objectives_progress);

        // Look for existing objective progress
        while (i < len) {
            let obj_progress = vector::borrow_mut(&mut progress.objectives_progress, i);
            if (obj_progress.objective_id == objective_id) {
                obj_progress.progress = new_progress;
                obj_progress.completed = completed;
                found = true;
                break
            };
            i = i + 1;
        };

        // If not found, add new objective progress
        if (!found) {
            let new_obj_progress = ObjectiveProgress {
                objective_id,
                completed,
                progress: new_progress,
            };
            vector::push_back(&mut progress.objectives_progress, new_obj_progress);
        };

        if (completed) {
            event::emit(ObjectiveCompleted {
                objective_id,
                quest_id: progress.quest_id,
                character_id: progress.character_id,
            });
        };
    }

    /// Complete a quest
    public entry fun complete_quest(
        progress: &mut QuestProgress,
        experience_gained: u64,
        ctx: &mut TxContext
    ) {
        assert!(progress.status == string::utf8(b"active"), EInvalidStatus);

        progress.status = string::utf8(b"completed");
        progress.completed_at = tx_context::epoch(ctx);

        event::emit(QuestCompleted {
            quest_id: progress.quest_id,
            character_id: progress.character_id,
            completed_at: tx_context::epoch(ctx),
            experience_gained,
        });
    }

    /// Update quest status (admin only)
    public entry fun update_quest_status(
        _admin_cap: &QuestAdminCap,
        quest: &mut Quest,
        new_status: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == _admin_cap.admin, ENotAdmin);
        quest.status = string::utf8(new_status);
    }

    /// Add required artifact to quest (admin only)
    public entry fun add_required_artifact(
        _admin_cap: &QuestAdminCap,
        quest: &mut Quest,
        artifact_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == _admin_cap.admin, ENotAdmin);
        vector::push_back(&mut quest.required_artifacts, string::utf8(artifact_id));
    }

    /// Add required relic to quest (admin only)
    public entry fun add_required_relic(
        _admin_cap: &QuestAdminCap,
        quest: &mut Quest,
        relic_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == _admin_cap.admin, ENotAdmin);
        vector::push_back(&mut quest.required_relics, string::utf8(relic_id));
    }

    /// Add reward artifact to quest (admin only)
    public entry fun add_reward_artifact(
        _admin_cap: &QuestAdminCap,
        quest: &mut Quest,
        artifact_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == _admin_cap.admin, ENotAdmin);
        vector::push_back(&mut quest.reward_artifacts, string::utf8(artifact_id));
    }

    /// Add reward relic to quest (admin only)
    public entry fun add_reward_relic(
        _admin_cap: &QuestAdminCap,
        quest: &mut Quest,
        relic_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == _admin_cap.admin, ENotAdmin);
        vector::push_back(&mut quest.reward_relics, string::utf8(relic_id));
    }

    // Getters for Quest
    public fun get_quest_title(quest: &Quest): String {
        quest.title
    }

    public fun get_quest_description(quest: &Quest): String {
        quest.description
    }

    public fun get_quest_story(quest: &Quest): String {
        quest.story
    }

    public fun get_quest_type(quest: &Quest): String {
        quest.quest_type
    }

    public fun get_quest_difficulty(quest: &Quest): String {
        quest.difficulty
    }

    public fun get_quest_status(quest: &Quest): String {
        quest.status
    }

    public fun get_quest_required_level(quest: &Quest): u64 {
        quest.required_level
    }

    public fun get_quest_reward_experience(quest: &Quest): u64 {
        quest.reward_experience
    }

    public fun get_quest_reward_currency(quest: &Quest): u64 {
        quest.reward_currency
    }

    public fun get_quest_location(quest: &Quest): String {
        quest.location
    }

    public fun get_quest_estimated_duration(quest: &Quest): u64 {
        quest.estimated_duration
    }

    public fun get_quest_image_url(quest: &Quest): String {
        quest.image_url
    }

    public fun get_quest_creator(quest: &Quest): address {
        quest.creator
    }

    // Getters for QuestObjective
    public fun get_objective_description(objective: &QuestObjective): String {
        objective.description
    }

    public fun get_objective_type(objective: &QuestObjective): String {
        objective.objective_type
    }

    public fun get_objective_target(objective: &QuestObjective): String {
        objective.target
    }

    public fun get_objective_quantity(objective: &QuestObjective): u64 {
        objective.quantity
    }

    public fun get_objective_completed(objective: &QuestObjective): bool {
        objective.completed
    }

    public fun get_objective_hint(objective: &QuestObjective): String {
        objective.hint
    }

    // Getters for QuestProgress
    public fun get_progress_quest_id(progress: &QuestProgress): address {
        progress.quest_id
    }

    public fun get_progress_character_id(progress: &QuestProgress): address {
        progress.character_id
    }

    public fun get_progress_status(progress: &QuestProgress): String {
        progress.status
    }

    public fun get_progress_started_at(progress: &QuestProgress): u64 {
        progress.started_at
    }

    public fun get_progress_completed_at(progress: &QuestProgress): u64 {
        progress.completed_at
    }

    // Getter for AdminCap
    public fun get_admin(admin_cap: &QuestAdminCap): address {
        admin_cap.admin
    }
}
