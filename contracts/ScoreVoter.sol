pragma solidity ^0.4.11;

import './UserRepository.sol';

contract ScoreVoter {
    
    uint32 version =4;
    bool public isActive = true;

    uint32 private votedCount = 0;
    uint32 private optionId = 0;
    
    //list of options
    mapping(uint32 => Option) options;
    
    //userId to the options selected
    mapping(address => Vote[]) private votes;
    
    //list of users who have voted already
    mapping(address => bool) voted;
    
    //people voting currently
    //this could have been array but mappings are easier to read
    mapping(address => bool) voting;
    
    UserRepository private userRepo;
    
    address private owner;
    

    // data stucts
    
    struct Option {
        uint32 id;
        bytes32 value;
        uint32 score;
    }
    
    struct Vote {
        uint32 optionId;
        uint32 score;
        
    }    
    
    /**
    */
    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }
    
    // EVENTS
    
    //generated when a user logs in to start voting
    event StartVote(address voter);
    
    // when a user submits his vote(s)
    event EndVote(address voter);
    
    //user had logged in but cancels and leaves screen without voting
    
    event CancelVote(address voter);
    
    //user somehow tried voting second time
    event DoubleVoting(address voter);
    
    // when a user tries to login again when that id is already marked as StartVoting
    event InProcess(address voter);
    
    //if a given user id does not exist in system    
    event InvalidUserId(address);
    
    //when a user's is is updated successfully with wallet address
    event WalletUpdateSuccess(address);

    //when a user's is is updated successfully with wallet address
    event IncomleteVoting(address);



    /**
     * Constructor
     */
    function ScoreVoter() public {
        owner = msg.sender;
    }


    //DEPENDENCY INJECTION
    function setUserRepo(address repoAddr) public ownerOnly {
        userRepo = UserRepository(repoAddr);
    }


    //voting validation data
    function initVotingFor(address vId) public {
        
        if(!validateVoting(vId)) {
            return;
        }
        
        if(voting[vId] == true) {
            InProcess(vId);
            return;
        }
        
        voting[vId] = true;
        StartVote(vId);
    }
    
    function cancelVotingFor(address vId) public {
        voting[vId] = false;
        CancelVote(vId);
    }
    
    
    //voting
    function vote(address userId, uint32[] optId, uint32[] optScore) public {

        if(!validateVoting(userId)) {
            return;
        }
        
        //add the list of options for this voter and increment the score of each option
        //uint32 i = 1;
        uint32 j = 0;
        for(j = 0; j< optionId; j++) {
            votes[userId].push(Vote( {optionId: optId[j], score:optScore[j] } ));
            options[optId[j]].score += optScore[j];
        }
        
        //update audit state
        
        voting[userId] = false;
        voted[userId] = true;
        
        //mark end of voting for this user
        EndVote(userId);

        
    }
    
    function updateStatus() public {

        uint32 userCount = userRepo.getUserCount();
        for(uint32 i = 1; i <= userCount; i++) {
            address uaddr = userRepo.getWalletById(i);
            if(voted[uaddr] == false) {
                IncomleteVoting(uaddr);
                return;
            }
        }

        //update the status to be complete
        //enable this line for final version
        //isActive = false;
    }

    function validateVoting(address userId) public returns (bool) {
        
        //check if the wallet is registered
        //not doing revert to send an event that is readable
        if(!userRepo.isUserExistsByWallet(userId)) {
            InvalidUserId(userId);
            return false;
        }

        // voter not to have voted earlier
        if(voted[userId] == true) {
            DoubleVoting(userId);
            return false;
        }
        
        return true;
    }

    ///// OPTION FUNCTIONS
    function addOption(bytes32 name) ownerOnly public returns (uint32 newOptId)  {
        
        optionId++;
        options[optionId] = Option(optionId, name, 0);
        return optionId;
    }
    
    function getOptionById(uint32 id) constant public returns (bytes32 name) {
        return options[id].value;
    }
    
    function getOptionIdCount() constant public returns (uint32 ) {
        return optionId;
    }
    
    /**
    * Returns the value as optionName, totalScore to save multiple calls
    */
    function getOptionScore(uint32 optId) constant public returns (bytes32, uint32) {
        //can check status before returning so that
        //results are readable only after isActive is false
        //assert(!isActive);
        bytes32 opt =getOptionById(optId);
        return ( opt, options[optId].score);
    }


  
    
}
