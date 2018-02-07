pragma solidity ^0.4.11;

import './UserRepository.sol';

contract UserRepositoryImpl is UserRepository{
    
    
    uint32 version = 4;
    //how risky can this get? pretty much cos its just an incremental number.
    // dont use this approach in prod
    uint32 private userId = 0;
    
    address private repoOwner;
    
    //list of users
    mapping(uint32 => User) users;
    
    mapping(address => User) wallets;
    
    //keep struct here to enable customization of users
    // 'exists' is just to check for key existing in mappings
    struct User {
        uint32 id;
        bytes32 name;
        address walletAddr;
        bool exists;
    }
    
    /**
	* Allow only admin to delete user
	*/
    modifier ownerOnly() {
    	require(msg.sender == repoOwner);
        _;
	}
    
    //events
    
    //to indicate that address is already added for user
    event CantUpdateWallet(uint32 uId);
    
    
    ///// FUNCTIONS 
    
    
    /**
     * Constructor init the repoOwner
     */
    function UserRepositoryImpl() public {
        repoOwner = msg.sender;
    }

    // repo interface functions
    
    function addUser(bytes32 name, address acId) public ownerOnly returns (uint32 newVoterId) {
        userId++;
        users[userId] = User(userId, name, acId, true);
        return userId;
    }
    
    function removeUser(uint32 id) public ownerOnly {
       delete users[id];
    }
    
    function updateUserWallet(uint32 id, address walAddr) public returns (bool) {
        
        if(!users[id].exists) {
            return false;
        }
        
        if(users[id].walletAddr != 0x0) {
            CantUpdateWallet(id);
            return false;
        }
        
        //update the wallet for this user
        users[id].walletAddr = walAddr;
        
        //add the user to wallets for lookup
        wallets[walAddr] = users[id];
        
        return true;
        
    }   
    
    function getUserCount() public returns (uint32) {
        return userId;
    }

    function getUserDetailsById(uint32 id) public returns (uint32 uid, bytes32 name, address wallet, bool isExist) {
        
        User storage u = users[id];
        return (u.id, u.name, u.walletAddr, u.exists);
    }
    
    function getWalletById(uint32 id) public returns (address wallet) {
        return users[id].walletAddr;
    }
     
    
    function isUserExistsByWallet(address wallet) constant public returns  (bool isExist) {
        return wallets[wallet].exists;
    }

    
    function getUserDetailsByWallet(address wallet) public returns  (uint32 uid, bytes32 name, address walAddr, bool isExist) {

        User storage u = wallets[wallet];
        return (u.id, u.name, u.walletAddr, u.exists);
           
    }

    function isAdmin(address wallet) constant public returns  (bool) {
        return wallet == repoOwner;
    }
    
}
