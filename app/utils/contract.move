//NFT - Trial 3
#[allow(duplicate_alias, unused_use, unused_const, unused_variable)]
module oversui::tailz;

use std::string::{Self, String};
use sui::event;
use sui::object::{Self, UID};
use sui::object_table::{Self, ObjectTable};
use sui::transfer;
use sui::tx_context::{sender,Self, TxContext};
use sui::url::{Self, Url};
 use sui::coin::{Self, Coin, TreasuryCap, split, burn, mint_and_transfer};

use sui::transfer::public_transfer;
use sui::sui::SUI;
use sui::package;
use sui::clock::{Self, Clock};

public struct TAILZ has drop {}

const NOT_OWNER: u64 = 0;
    
  public struct Global has key {
        id: object::UID,
        owner: address,
        tailz_treasury: TreasuryCap<TAILZ>,
    }

//NFT Structure
public struct DynamicNFT has key, store {
    id: UID,
    image_url: Url,
    name: String,
    backstory: String,
    level: u64, // Changed from counter to level
    owner: address,
    happiness: u64,
    power: u64,
    multiplier: u64, // Stored as fixed-point (multiplied by 1000)
    points: u64,
    nft_id: u64,
}

// Main collection storage (unchanged)
public struct NFTCollection has key {
    id: UID,
    counter: u64,
    nfts: ObjectTable<u64, DynamicNFT>,
    account_nfts: ObjectTable<address, ObjectTable<u64, DynamicNFT>>,
}

// Events (unchanged)
public struct Minted has copy, drop {
    nft_id: u64,
    owner: address,
    image_url: Url,
}

public struct Updated has copy, drop {
    nft_id: u64,
    field: String,
    new_value: String,
    multiplier: u64,
    level: u64,
}

public struct Fed has copy, drop {
    nft_id: u64,
    happiness: u64,
    power: u64,
    multiplier: u64,
    points: u64,
}

public struct Trained has copy, drop {
    nft_id: u64,
    happiness: u64,
    power: u64,
    multiplier: u64,
    points: u64,
}

public struct LeveledUp has copy, drop {
    nft_id: u64,
    multiplier: u64,
    level: u64,
}

fun init(witness: TAILZ, ctx: &mut TxContext) {
   
    
    // Rest of your original init function
    let (mut treasury, metadata) = coin::create_currency<TAILZ>(
            witness,
            6,
            b"TAILZ",
            b"",
            b"A meme token on Sui",
            option::none(),
            ctx
        );

        transfer::public_freeze_object(metadata);

        let amount = 100_000_000_000; // 100,000 TAILZ with 6 decimals
        mint_and_transfer<TAILZ>(&mut treasury, amount, sender(ctx), ctx);

        let global = Global {
            id: object::new(ctx),
            owner: sender(ctx),
            tailz_treasury: treasury,
        };
        transfer::share_object(global);
    transfer::share_object(NFTCollection {
        id: object::new(ctx),
        counter: 0,
        nfts: object_table::new(ctx),
        account_nfts: object_table::new(ctx),
    });

    let collection = BattleCollection {
        id: object::new(ctx),
        counter: 0,
        battles: object_table::new(ctx),
    };

    transfer::share_object(collection);
}


// Mint function updated with level initialization
public entry fun mint(collection: &mut NFTCollection, image_url: String, name: String, backstory: String, ctx: &mut TxContext) {
    collection.counter = collection.counter + 1;
    let nft_id = collection.counter;

    let owner = tx_context::sender(ctx);
    let nft1 = DynamicNFT {
        id: object::new(ctx),
        image_url: url::new_unsafe_from_bytes(image_url.into_bytes()),
        name: name,
        backstory: backstory,
        level: 1,
        owner,
        happiness: 0,
        power: 0,
        multiplier: 1000, // 1.0 in fixed-point
        points: 0,
        nft_id: collection.counter,
    };

    let nft2 = DynamicNFT {
        id: object::new(ctx),
        image_url: url::new_unsafe_from_bytes(image_url.into_bytes()),
        name: name,
        backstory: backstory,
        level: 1,
        owner,
        happiness: 0,
        power: 0,
        multiplier: 1000, // 1.0 in fixed-point
        points: 0,
        nft_id: collection.counter,
    };

    object_table::add(&mut collection.nfts, nft_id, nft1);

    if (!object_table::contains(&collection.account_nfts, owner)) {
        object_table::add(
            &mut collection.account_nfts,
            owner,
            object_table::new(ctx),
        );
    };
    let account_nfts = object_table::borrow_mut(&mut collection.account_nfts, owner);
    object_table::add(account_nfts, nft_id, nft2);

    event::emit(Minted {
        nft_id,
        owner,
        image_url: url::new_unsafe_from_bytes(image_url.into_bytes()),
    });
}

// Feed function (public)
public entry fun feed(collection: &mut NFTCollection, 
nft_id: u64, 
mut payment: Coin<SUI>,
        global: &mut Global,
        ctx: &mut TxContext) {
    let required = 50_000_000; // 0.05 SUI
        let actual_payment = split(&mut payment, required, ctx);
        public_transfer(actual_payment, global.owner);
        public_transfer(payment, sender(ctx));

        mint_and_transfer<TAILZ>(&mut global.tailz_treasury, 1_000_000, sender(ctx), ctx);

    let nft = object_table::borrow_mut(&mut collection.nfts, nft_id);
    nft.happiness = nft.happiness + 5;
    nft.power = nft.power + 1;
    nft.multiplier = nft.multiplier + 100; // 0.1 * 1000
    update_points(nft);

    event::emit(Fed {
        nft_id,
        happiness: nft.happiness,
        power: nft.power,
        multiplier: nft.multiplier,
        points: nft.points,
    });
}



// Train function (owner only)
public entry fun train(collection: &mut NFTCollection, nft_id: u64,  mut payment: Coin<SUI>,
        global: &mut Global,ctx: &mut TxContext) {
            let required = 50_000_000; 
        let actual_payment = split(&mut payment, required, ctx);
        public_transfer(actual_payment, global.owner);
        public_transfer(payment, sender(ctx));

        mint_and_transfer<TAILZ>(&mut global.tailz_treasury, 1_000_000, sender(ctx), ctx);
    let owner = tx_context::sender(ctx);
    let nft = object_table::borrow_mut(&mut collection.nfts, nft_id);

    assert!(nft.owner == owner, NOT_OWNER);

    nft.happiness = nft.happiness + 1;
    nft.power = nft.power + 5;
    nft.multiplier = nft.multiplier + 150; // 0.15 * 1000
    update_points(nft);

    event::emit(Trained {
        nft_id,
        happiness: nft.happiness,
        power: nft.power,
        multiplier: nft.multiplier,
        points: nft.points,
    });
}

public entry fun update_backstory(
    nft: &mut DynamicNFT,
    new_backstory: String,
    caller: address,
) {
    // Ensure only the owner can update the backstory
    assert!(nft.owner == caller, 0);

    // Update the backstory
    nft.backstory = new_backstory;
}

public entry fun update_image(
    nft: &mut DynamicNFT,
    new_image_url: String,
    caller: address,
) {
    // Ensure only the owner can update the backstory
    assert!(nft.owner == caller, 0);

    // Update the backstory
    nft.image_url = url::new_unsafe_from_bytes(new_image_url.into_bytes())
}


//LevelUp Function (owner only)
public entry fun level_up_without_changes(
    collection: &mut NFTCollection,
    nft_id: u64,
    ctx: &mut TxContext,
) {
    let owner = tx_context::sender(ctx);
    let nft = object_table::borrow_mut(&mut collection.nfts, nft_id);

    assert!(nft.owner == owner, NOT_OWNER);

    nft.multiplier = nft.multiplier + 700; // 0.7 * 1000
    nft.level = nft.level + 1;
    update_points(nft);

    event::emit(LeveledUp {
        nft_id,
        multiplier: nft.multiplier,
        level: nft.level,
    });
}

// Helper function to update points
fun update_points(nft: &mut DynamicNFT) {
    nft.points = (nft.happiness + nft.power) * nft.multiplier / 1000;
}

// Updated image function with level increment
public entry fun level_up_with_changes(
    collection: &mut NFTCollection,
    nft_id: u64,
    new_url: String,
    ctx: &mut TxContext,
) {
    let owner = tx_context::sender(ctx);
    let nft = object_table::borrow_mut(&mut collection.nfts, nft_id);

    assert!(nft.owner == owner, NOT_OWNER);

    // Update image URL
    nft.image_url = url::new_unsafe_from_bytes(new_url.into_bytes());
    nft.multiplier = nft.multiplier + 700; // 0.7 * 1000
    nft.level = nft.level + 1;
    update_points(nft);

    event::emit(Updated {
        nft_id,
        field: b"image_url".to_string(),
        new_value: (new_url),
        multiplier: nft.multiplier,
        level: nft.level,
    });
}

// View functions (unchanged)
public fun get_nft(collection: &NFTCollection, nft_id: u64): &DynamicNFT {
    object_table::borrow(&collection.nfts, nft_id)
}

public fun get_account_nfts(
    collection: &NFTCollection,
    owner: address,
): &ObjectTable<u64, DynamicNFT> {
    object_table::borrow(&collection.account_nfts, owner)

}

public struct StakeInfo has key, store {
    id: UID,
    stakes_pet1: ObjectTable<address, Coin<TAILZ>>,
    stakes_pet2: ObjectTable<address, Coin<TAILZ>>,
    stakers_pet1: vector<address>,  // New
    stakers_pet2: vector<address>   // New
}


public struct Battle has key, store {
    id: UID,
    pet1: String,
    pet2: String,
    battle_id: u64,
    stake_total_pet1: u64,
    stake_total_pet2: u64,
    creator: address,
    is_active: bool,
    stake_info: StakeInfo,
    winner_pet: String,  // New
    has_winner: bool,    // New
    created_at: u64
}


public struct BattleCollection has key, store {
    id: UID,
    counter: u64,
    battles: ObjectTable<u64, Battle>,
}



public entry fun create_battle(
    collection: &mut BattleCollection,
    pet1: String,
    pet2: String,
     clock: &Clock,
    ctx: &mut TxContext,
    
) {
    let stake_info = StakeInfo {
        id: object::new(ctx),
        stakes_pet1: object_table::new(ctx),
        stakes_pet2: object_table::new(ctx),
        stakers_pet1: vector::empty(),  // Initialize empty vector
        stakers_pet2: vector::empty()   // Initialize empty vector
    };
    collection.counter= collection.counter+1;

    let battle = Battle {
        id: object::new(ctx),
        pet1: pet1,
        pet2: pet2,
        battle_id: collection.counter ,
        stake_total_pet1: 0,
        stake_total_pet2: 0,
        creator: sender(ctx),
        is_active: true,
        stake_info,
        winner_pet: b"None".to_string(),  // Default value
        has_winner: false,   // Initial state
        created_at: clock.timestamp_ms(),  // Set timestamp
    };
    
    object_table::add(&mut collection.battles, collection.counter , battle);
    
}



public entry fun stake(
    collection: &mut BattleCollection,
    battle_id: u64,
    pet_number: u8, // 1 or 2
    mut payment: Coin<TAILZ>,
    ctx: &mut TxContext
) {
    let required = 5_000_000; // 5 TAILZ (assuming 6 decimals)
    let actual_payment = coin::split(&mut payment, required, ctx);
    
    transfer::public_transfer(payment, sender(ctx)); // refund dust/change if any

    let sender_addr = sender(ctx);
    let battle = object_table::borrow_mut(&mut collection.battles, battle_id);
    let stake_info = &mut battle.stake_info;

    if (pet_number == 1) {
        assert!(
            !object_table::contains(&stake_info.stakes_pet1, sender_addr),
            0, // You can use a custom error code or define an error module
        );
         vector::push_back(&mut stake_info.stakers_pet1, sender_addr);
        object_table::add(&mut stake_info.stakes_pet1, sender_addr, actual_payment);
        battle.stake_total_pet1 = battle.stake_total_pet1 + required;
    } else {
        assert!(
            !object_table::contains(&stake_info.stakes_pet2, sender_addr),
            1,
        );
        vector::push_back(&mut stake_info.stakers_pet2, sender_addr);
        object_table::add(&mut stake_info.stakes_pet2, sender_addr, actual_payment);
        battle.stake_total_pet2 = battle.stake_total_pet2 + required;
    };
}


public fun get_battle(
    collection: &mut BattleCollection,
    battle_id: u64
): &mut Battle {
    assert!(object_table::contains(&collection.battles, battle_id), 1); // Error code 1: Battle not found
    object_table::borrow_mut(&mut collection.battles, battle_id)
}

public entry fun withdraw_stake_pet1(
    collection: &mut BattleCollection,
    battle_id: u64,
    staker_addr: address,
    ctx: &mut TxContext
) {
    // let sender_addr = sender(ctx);
    let battle = object_table::borrow_mut(&mut collection.battles, battle_id);
    let stake_info = &mut battle.stake_info;

    assert!(object_table::contains(&stake_info.stakes_pet1, staker_addr), 0);

    let staked_coin = object_table::remove(&mut stake_info.stakes_pet1, staker_addr);
    transfer::public_transfer(staked_coin, staker_addr);
}

public entry fun withdraw_stake_pet2(
    collection: &mut BattleCollection,
    battle_id: u64,
    staker_addr: address,
    ctx: &mut TxContext
) {
    // let sender_addr = sender(ctx);
    let battle = object_table::borrow_mut(&mut collection.battles, battle_id);
    let stake_info = &mut battle.stake_info;

    assert!(object_table::contains(&stake_info.stakes_pet2, staker_addr), 0);

    let staked_coin = object_table::remove(&mut stake_info.stakes_pet2, staker_addr);
    transfer::public_transfer(staked_coin, staker_addr);
}

public entry fun withdraw_stake_to_global_owner(
    collection: &mut BattleCollection,
    battle_id: u64,
    staker_addr: address,
    global: &Global,
) {
    let battle = object_table::borrow_mut(&mut collection.battles, battle_id);
    let stake_info = &mut battle.stake_info;

    let staked_coin = object_table::remove(&mut stake_info.stakes_pet1, staker_addr);
    transfer::public_transfer(staked_coin, global.owner);
}


public entry fun declare_winner(
    collection: &mut BattleCollection,
    battle_id: u64,
    winner_pet: String,
    global: &Global,
    ctx: &mut TxContext
) {
    let battle = object_table::borrow_mut(&mut collection.battles, battle_id);
    assert!(battle.is_active, 0); // Battle must be active
    assert!(sender(ctx) == battle.creator, 1); // Only creator can declare winner
    assert!(!battle.has_winner, 2); // Winner already declared

    // Update winner fields
    battle.has_winner = true;
    battle.winner_pet = winner_pet;
    battle.is_active = false;


}



public entry fun transfer_rewards(
    mut payment: Coin<TAILZ>,
    required: u64,
    recipient: address,
    global: &mut Global,
    ctx: &mut TxContext
) {
   
    let actual_payment = coin::split(&mut payment, required, ctx);
    transfer::public_transfer(actual_payment, recipient);
    transfer::public_transfer(payment, global.owner);
}