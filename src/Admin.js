//react and Front End imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import { Label, DropdownButton, MenuItem, Form } from 'react-bootstrap'

//Eth libraries
import { default as Web3} from 'web3';

//contracts
import { default as contract } from 'truffle-contract'
import userRepository from './contracts/UserRepositoryImpl.json'
import scoreVoter from './contracts/ScoreVoter.json'

    //var watching = false; //start watching to events only 
    // var passwd = false;

    var web3 = null;
    var UserRepository = contract(userRepository);
    var ScoreVoter = contract(scoreVoter);

    //variable to refer to currnet component context
    // else ctx is not visible from anonymous functions and we cant call other functions like writeMsg
    var me = null;

export default class Admin extends Component {

  // componentDidMount() {}
  // componentWillUnmount() {}
  

  constructor (props) {

    super(props);
      //the url should come from config /props
     web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9090"));
     console.warn("webb3 connected  " + web3 );
     UserRepository.setProvider(web3.currentProvider);
     ScoreVoter.setProvider(web3.currentProvider);
    
      me = this;
        
  }

  componentDidMount() {
    this.props.notifier(null,false,false,true);
    // this.props.onContractDetails(UserRepository, ScoreVoter);

  }

  assignUserRepo = () => {
    this.props.notifier(null, false, false, true);

      try {
          let userRepoAddr = this.refs.userRepositoryId.value; 
          console.log("userrepo addr " + userRepoAddr);

          ///// CHANGE TO USER AUTH
          var userId = "0xf09564Ca641B9E3517dFc6f2e3525e7078eEa5A8";
          var unlocked = web3.personal.unlockAccount(userId, 'welcome123', 10);
          //var info = '';
          console.log('unlocked ' + unlocked);
        //   // if(!unlockaccount(auctioneerHash, phrase)) {
        //   //   return;
        //   }
          // var me = this;

          ScoreVoter.deployed().then(function(scoreVoterInst) {
            console.log("scoreVoterInst " + scoreVoterInst);

            var res = scoreVoterInst.setUserRepo( userRepoAddr,{gas:1500000,from:userId});
            console.log ('result of setting repo '+ res);
            me.props.notifier("User Repository assigned " + res , false, false);
            // scoreVoterInst.setUserRepo( userRepoAddr ,{gas:1500000,from:userId}).then(function(auction) {
            //     me.props.notifier("Auction created for "+ auctioneerHash, false, false);
            //     me.props.onAuctionDetails(auction, auctioneerHash);
            //  });
          });
        } catch (err) {
            me.props.notifier("assining user repo to voter  "+ err, true, false);
        }
  }


  render() {
    
    return (
        
            <form>
              <div className="card mb-3">
                <div className="card-header">Manage Survey</div>
                <div className="card-body">

                  <div className="form-group">
                    <label htmlFor="userRepositoryId">User Repository Address</label>
                    <input className="form-control" ref="userRepositoryId"  defaultValue="0xb407a4039d553ed50cd459ea0a34a36448fbad49" placeholder="User Repository Address" />
                  </div>

                  <div className="form-group">
                    <div className="form-row">
                      <div className="col-md-4">
                          <a className="btn btn-primary btn-block" onClick={this.assignUserRepo}>Assign User Repository</a>
                      </div>
                    </div>
                  </div>
                  </div>
                  </div>

                </form>
    );
  }
}


Admin.propTypes = {
  onContractDetails: PropTypes.func.isRequired,
  notifier : PropTypes.func.isRequired

}


