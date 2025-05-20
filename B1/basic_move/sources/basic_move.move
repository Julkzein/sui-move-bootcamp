module basic_move::basic_move;


//Imports
use std::string::{String, utf8}; 

use sui::test_scenario::{begin};

//Execption codes

const EAlreadyCarriesWeapon : u64 = 1; 
//Init
public struct Hero has key, store {
    id: UID, 
    name: String,
    stamina: u64,
    weapon: Option<Weapon>
}

public struct Weapon has key, store {
    id: UID,
    name: String, 
    power: u64
}


public fun mint_hero(name_param: String, stamina: u64, ctx: &mut TxContext): Hero {
    let aHero = Hero {
        id: object::new(ctx),
        name: name_param,
        stamina, 
        weapon: option::none()
    };
    aHero
}

public fun create_weapon(
    weapon_name: String, 
    destruction_power: u64,
    ctx: &mut TxContext
): Weapon {
    Weapon {
        id: object::new(ctx), 
        name: weapon_name, 
        power: destruction_power
    }
}

public fun equip_hero(hero: &mut Hero, weapon: Weapon) {
    assert!(hero.weapon.is_none(), EAlreadyCarriesWeapon); 
    hero.weapon.fill(weapon); 
}

#[test]
fun test_mint() {
    let mut test = begin(@0xCAFE);
    let name : String = utf8(b"Superman");
    let hero = mint_hero( name,89,  test.ctx());
    assert!( hero.name == name , 666);
    destroy_for_testing(hero);
    test.end();
}


#[test]
fun test_equip(){
    let mut test = begin(@0xCAFE);
    let mut hero = mint_hero(utf8(b"Batman"), 66, test.ctx());
    assert!(hero.name == utf8(b"Batman"), 666);
    assert!(hero.weapon.is_none(), 667);

    let aWeapon = create_weapon(utf8(b"Batmobile"), 99, test.ctx()); 
    hero.equip_hero(aWeapon); 

    assert!(hero.weapon.is_some(), 9998); 
    let w = hero.weapon.borrow();
    assert!(w.name == b"Batmobile".to_string(), 9999); 

    destroy_for_testing(hero);
    test.end();
}

#[test]
#[expected_failure(abort_code = EAlreadyCarriesWeapon)]
fun test_equip_with_existing_error(){
    let mut test = begin(@0xCAFE);
    let mut hero = mint_hero(utf8(b"Batman"), 66, test.ctx());
    assert!(hero.name == utf8(b"Batman"), 666);
    assert!(hero.weapon.is_none(), 667);

    let aWeapon = create_weapon(utf8(b"Batmobile"), 99, test.ctx()); 
    hero.equip_hero(aWeapon); 

    let aWeapon2 = create_weapon(utf8(b"Batarang"), 99, test.ctx()); 
    hero.equip_hero(aWeapon2);




    destroy_for_testing(hero);
    test.end();
}



#[test_only]
fun destroy_for_testing(hero: Hero) {
    let Hero {
        id ,
        name: _,
        stamina: _,
        weapon: _w 
    } = hero; 
    object::delete(id); 

    if (_w.is_some()) {
        let Weapon {
            id: wid, 
            name: _, 
            power: _
        } = _w.destroy_some(); 
        object::delete(wid); 
    } else {
        _w.destroy_none(); 
    }
}
