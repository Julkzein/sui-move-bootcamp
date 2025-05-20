module abilities_events_params::abilities_events_params;

use std::string::String;
use sui::event;

//Error Codes
const EMedalOfHonorNotAvailable: u64 = 111;

// Structs

public struct Hero has key {
    id: UID, // required
    name: String,
    medals: vector<Medal>
}

public struct HeroMinted has copy, drop {
    hero: ID, 
    owner: address
}

public struct HeroRegistry has key, store {
    id: UID, 
    heroes: vector<ID>
}

public struct MedalStorage has key, store {
    id: UID,
    medals: vector<Medal>, // Medals vector with Medal object
}

public struct Medal has key, store {
    id: UID,
    name: String
    
}

// Module Initializer
fun init(ctx: &mut TxContext) {
    let registry = HeroRegistry{
        id: object::new(ctx),
        heroes: vector[]
    };
    transfer::share_object(registry);

    let mut medalStorage = MedalStorage {
        id: object::new(ctx),
        medals: vector[],
    };
    medalStorage.medals.push_back(Medal {
            id: object::new(ctx),
            name: b"Medal 1".to_string(),
        });
    medalStorage.medals.push_back(Medal {
            id: object::new(ctx),
            name: b"Medal 2".to_string(),
        });

    transfer::share_object(medalStorage);

}

public fun mint_hero(heroReg: &mut HeroRegistry, name: String, ctx: &mut TxContext): Hero {
    let freshHero = Hero {
        id: object::new(ctx), // creates a new UID
        name,
        medals : vector[]
    };

    let minted = HeroMinted{
        hero: object::id(&freshHero),
        owner: ctx.sender()
    };

    event::emit(minted);
    heroReg.heroes.push_back(object::uid_to_inner(&freshHero.id));
    freshHero
}

public entry fun mint_and_keep_hero(heroReg: &mut HeroRegistry, name: String, ctx: &mut TxContext) {
    let hero = mint_hero(heroReg, name, ctx);
    transfer::transfer(hero, ctx.sender());
}

public fun award_medal1(hero: &mut Hero, medalStorage: &mut MedalStorage) {
    award_medal(hero, medalStorage, b"Medal 1".to_string());
}

public fun award_medal2(hero: &mut Hero, medalStorage: &mut MedalStorage) {
    award_medal(hero, medalStorage, b"Medal 2".to_string());
}


fun award_medal(hero: &mut Hero, medalStorage: &mut MedalStorage, medalName: String) {
    let medalOption: Option<Medal> = get_medal(medalName, medalStorage);

    assert!(medalOption.is_some(), EMedalOfHonorNotAvailable);

    hero.medals.append(medalOption.to_vec());
}

fun get_medal(name: String, medalStorage: &mut MedalStorage): option::Option<Medal> {
    let mut nb = 0;
    let length = medalStorage.medals.length();
    while (nb < length) {
        if (medalStorage.medals[nb].name == name) {
            let extractedMedal = vector::remove(&mut medalStorage.medals, nb);
            return option::some(extractedMedal)
        };
        nb = nb + 1;
    };
    option::none<Medal>()
}



/////// Tests ///////

#[test_only]
use sui::test_scenario as ts;
#[test_only]
use sui::test_scenario::{take_shared, return_shared};
#[test_only]
use sui::test_utils::{destroy, assert_eq};
use sui::test_scenario::ctx;


//--------------------------------------------------------------
//  Test 1: Hero Creation
//--------------------------------------------------------------
//  Objective: Verify the correct creation of a Hero object.
//  Tasks:
//      1. Complete the test by calling the mint_hero function with a hero name.
//      2. Assert that the created Hero's name matches the provided name.
//      3. Properly clean up the created Hero object using destroy.
//--------------------------------------------------------------
#[test]
fun test_hero_creation() {
    let mut test = ts::begin(@USER);
    init(test.ctx());
    test.next_tx(@USER);

    //Get hero Registry
    let mut registry = take_shared(&mut test);

    let hero = mint_hero(&mut registry, b"Flash".to_string(), test.ctx());
    assert_eq(hero.name, b"Flash".to_string());

    destroy(hero);
    return_shared(registry);
    test.end();
}

//--------------------------------------------------------------
//  Test 2: Event Emission
//--------------------------------------------------------------
//  Objective: Implement event emission during hero creation and verify its correctness.
//  Tasks:
//      1. Define a HeroMinted event struct with appropriate fields (e.g., hero ID, owner address).  Remember to add copy, drop abilities!
//      2. Emit the HeroMinted event within the mint_hero function after creating the Hero.
//      3. In this test, capture emitted events using event::events_by_type<HeroMinted>().
//      4. Assert that the number of emitted HeroMinted events is 1.
//      5. Assert that the owner field of the emitted event matches the expected address (e.g., @USER).
//--------------------------------------------------------------
#[test]
fun test_event_thrown() { 
    let mut test = ts::begin(@USER); 
    init(test.ctx());
    test.next_tx(@USER);

    let mut registry = take_shared<HeroRegistry>(&mut test);

    let hero = mint_hero(&mut registry, b"Batman".to_string(), test.ctx());

    let event = event::events_by_type<HeroMinted>(); 

    assert!(event.length() == 1, 667); 
    
    let mint_event = *vector::borrow(&event, 0); 

    assert!(mint_event.owner == @USER, 668); 

    destroy(hero);
    return_shared(registry);
    test.end();
}

//--------------------------------------------------------------
//  Test 3: Medal Awarding
//--------------------------------------------------------------
//  Objective: Implement medal awarding functionality to heroes and verify its effects.
//  Tasks:
//      1. Define a Medal struct with appropriate fields (e.g., medal ID, medal name). Remember to add key, store abilities!
//      2. Add a medals: vector<Medal> field to the Hero struct to store the medals a hero has earned.
//      3. Create functions to award medals to heroes, e.g., award_medal_of_honor(hero: &mut Hero).
//      4. In this test, mint a hero.
//      5. Award a specific medal (e.g., Medal of Honor) to the hero using your award_medal_of_honor function.
//      6. Assert that the hero's medals vector now contains the awarded medal.
//      7. Consider creating a shared MedalStorage object to manage the available medals.
//--------------------------------------------------------------
#[test]
fun test_medal_award() { 
    let mut test = ts::begin(@USER); 
    init(test.ctx());
    test.next_tx(@USER);

    let mut registry = take_shared<HeroRegistry>(&test);

    let mut medalStorage = take_shared<MedalStorage>(&test); 

    let mut hero = mint_hero(&mut registry, b"Batman".to_string(), test.ctx());

    award_medal1(&mut hero, &mut medalStorage);

    assert!(hero.medals.length() == 1, 12); 
    assert!(medalStorage.medals.length() == 1, 13);

    award_medal2(&mut hero, &mut medalStorage);

    assert!(hero.medals.length() == 2, 14); 
    assert!(medalStorage.medals.length() == 0, 15);

    destroy(hero);
    return_shared(registry);
    return_shared(medalStorage);
    test.end();
 }