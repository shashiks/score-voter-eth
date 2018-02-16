pragma solidity ^0.4.11;

import './UserRepository.sol';
import './UserRepositoryImpl.sol';
import './ScoreVoter.sol';

/**
    The factory instance to create an instance of a score based survey.
    The user repository created once by the survey creator can be reused based on the 
    <pre>createSurvey</pre>'s <pre>createUserRepo</pre> parameter. If the value is false
    an existing user repo for the requesting user would be looked up based on previous survey created.
    If one exists then that user repo would be reused. Else a new one created
    <p>
        Future version can enable creating just election type of surveys rather than score based
        based on a param to this factory
    </p>
 */
contract SurveyFactory {

    /**
    The version number to update deployment via truffle
     */
    uint32 version = 1;

    /**
        The owner of the factory/system
     */
    address owner;

    /**
    Stores the mapping of a survey against a userid
     */
    mapping(address => Survey) surveys;


    /**
    The definition of a survey
     */
    struct Survey {
        address userRepo;
        address scorer;
        //defaults to false
        bool hasRepo;
    }

    /**
        assign to owner-only functions
     */
    modifier ownerOnly() {
    	require(msg.sender == owner);
        _;
	}

    function SurveyFactory() public {
        owner = msg.sender;
    }


  function createSurvey(uint256 pEndTime, bool createUserRepo) public returns (address surveyAddress) {
        
        address surveyOwner = msg.sender;
        address repoAddr = surveys[surveyOwner].userRepo;

        //if a new repo is required or none exists for requesting user
        // create a new one and assign to the user's survey mapping
        if (createUserRepo == true || !surveys[surveyOwner].hasRepo) {
            repoAddr = new UserRepositoryImpl(surveyOwner);
            //surveys[surveyOwner].userRepo = repoAddr;
        }

        ScoreVoter aSurvey = new ScoreVoter(repoAddr, surveyOwner, pEndTime); 
        surveys[surveyOwner] = Survey({userRepo: repoAddr, scorer: aSurvey, hasRepo: true});
    
		return aSurvey;
    
    }

    function getSurvey(address surveyOwner) constant public returns (address) {
        return surveys[surveyOwner].scorer;
    }

    function getUserRepo(address surveyOwner) constant public returns (address) {
        return surveys[surveyOwner].userRepo;
    }


}