pragma solidity ^0.4.11;

contract UserRepository {




    function addUser(bytes32 name, address acId) public returns (uint32 newVoterId);
    
    function removeUser(uint32 id) public;
    
    function updateUserWallet(uint32 userId, address walletAddr) public returns (bool);
    
    function getUserCount() public returns (uint32);
    
    function getWalletById(uint32 id) public returns (address wallet);
    
    function getUserDetailsById(uint32 id) public returns (uint32 userId, bytes32 name, address wallet, bool exists);
    
    function getUserDetailsByWallet(address wallet) public returns (uint32 userId, bytes32 name, address walAddr, bool exists);
    
    function isUserExistsByWallet(address wallet) constant public returns  (bool isExist);

    /**
    * indicates if the address passed is the owner of this contract
    */
    function isAdmin(address wallet) constant public returns  (bool);
    

}



