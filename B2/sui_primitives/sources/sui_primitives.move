
module sui_primitives::sui_primitives {

    #[test]
    fun test_numbers() {
        let a = 50;
        let b = 50;
        assert!(a == b, 601);

        let sum = a + b; 
        assert!(sum == 100, 666); 

        let sub = sum - 90; 
        assert!(sub == 10, 667); 

        let d = sub / 3; 
        assert!(d == 3, 668); 

    }

    #[test]
    fun test_overflow() {
        let a : u16 = 200;
        let b : u16 = 200;

        let sum : u16 = a + b; 

        assert!(sum == 400, 669) ;
    }

    

    #[test]
    fun test_loop(){
        let fact = 5;
        let mut result : u256 = 1; 
        let mut i = 2; 
        while (i <= fact) {
            result = result *i; 
            i = i+1; 
        }; 
        std::debug::print(&result); 
        assert!(result == 120, 777); 


    }

    #[test]
    fun test_vector(){
        let mut myVec: vector<u8> = vector[10, 20, 30];
        let mut myOtherVec : vector<u8> = vector::empty(); 

        assert_eq(myVec.length(), 3); 
    
        assert_eq(myOtherVec.is_empty(), true);

        myVec.push_back(40); 
        assert_eq(myVec[3], 40); 

        assert_eq(myVec.length(), 4); 

        let num = myVec.pop_back(); 

        assert_eq(num, 40); 
        assert_eq(myVec.length(), 3); 

    }

    use std::string::{String};

    use sui::test_utils::assert_eq;


    #[test]
    fun test_string2(){
        let myStringArr = b"Hello, World!";
        let mut i : u64 = 0; 
        let mut indexOfW = 0;
        while (i < myStringArr.length()) {
            indexOfW = if (myStringArr[i] == 87) {i} else {indexOfW}; 
            i = i + 1; 
        } ;
        assert_eq(indexOfW, 7); 


    }

}
