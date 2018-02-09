//react and Front End imports
import React, { Component } from 'react';

import UserItem from './UserItem.js'
import userRepository from './contracts/UserRepositoryImpl.json'
import scoreVoter from './contracts/ScoreVoter.json'
import { default as contract } from 'truffle-contract'
import { default as Web3} from 'web3'
import VoteOptionList from './VoteOptionList.js';
import VoteOption from './VoteOption.js';
import Auth from './auth.js'
import {TxnConsensus} from './block-verify.js';
var CONFIG = require('./config.json');



  var web3;
  var UserRepository = contract(userRepository);
  var ScoreVoter = contract(scoreVoter);
  var me = null;
  var optNames = [];



export default class Vote extends Component {


  componentDidMount() {
    //this.checkUserVotedStatus();

    this.props.notifier(null,false,false,true);
    web3 = window.web3;
    console.warn("after webb3 connected  " + web3 );
    UserRepository.setProvider(web3.currentProvider);
    ScoreVoter.setProvider(web3.currentProvider);
    this.initOptionList();

  }


	 constructor (props) {
        super(props);

        this.state = {
          optNames: null,
          optionValue: null,
          isOptData: false,
          totalOptionsCount: 0,
          resultScores: 0,
          doAuth: false,
          voted: false,
        }
        me = this;

    }



    // authAndStore = (scoresMap) => {

    //   console.log('got map of scores ' + scoresMap);
    //   // for (var [key, value] of scoresMap) {
    //   //    console.log(key + ' = ' + value);
    //   // }
    //   this.state.resultScores = scoresMap;
    //   this.vote();

    // }


  	vote = (scoresMap) => {
      
  		console.log('current user in vote ' + this.props.currentUser  + " isAdmin " + this.props.adminStatus);
  		console.log('vote called score values ');
      //instead of running two iterators for map and value
      //store them in separate arrays in one go and call vote on contract
      let keys= [];
      let vals= []; 
      for (var [key, value] of scoresMap) {
         //console.log(key + ' = ' + value);
         keys.push(parseInt(key));
         vals.push(parseInt(value));
      }

      console.log('values for vote ' + keys + vals + me.props.currentUser )


      try {

          ScoreVoter.deployed().then(function(instance) {
            // console.log("instance ScoreVoter " + instance);

            instance.vote.sendTransaction( me.props.currentUser, keys, vals, {gas:4712300,from: me.props.currentUser}).then(function(txnHash) {
                    console.log("Vote Txn Id " + txnHash);
                    me.props.notifier("Your votes are being submitted. Txn Id : " + txnHash, false, false, false);
                    TxnConsensus(web3, txnHash, 3, 30000, 4, function(err, receipt) { 
                      console.log("Vote txn " + receipt);
                      if(receipt) {
                        console.log("Vote blockHash " + receipt.blockHash);
                        console.log("Vote blockNumber " + receipt.blockNumber);
                        console.log("Vote transactionIndex " + receipt.transactionIndex);            
                            
                      } else {
                        console.log("err from poll " + err);
                        me.props.notifier("Error voting for user " + me.props.currentUser + err, true, false);
                    }
              });
            });
          });
        } catch (err) {
            me.props.notifier("Coudn't vote "+ err, true, false);
        }



  	}


    initOptionList = () => {

	    optNames = [];
	    ScoreVoter.deployed().then(function(instance) {

	        instance.getOptionIdCount.call().then( function(optCount) {
	          // console.log("Total options count in system " + optCount);
	          let v = optCount.toString();
	          me.setState({totalOptionsCount : v});
	          console.log('Total opt count ' + me.state.totalOptionsCount);
	          for(let i = 1 ; i <= optCount; i++) {
	            instance.getOptionById.call(i).then(function(optName) {
	              // console.log(" values from opt detail. Id : " + i + " name : " +  web3.toAscii(optName) );
	              optNames.push( i+ "," + web3.toAscii(optName));
	              
	              if(i == optCount){
	                me.setState({isOptData: true});
	                console.log('final optNames  ' + optNames);
	              }
	            });
	          } 
	          

	      });

	    });
  }

  //validate if the user has already voted
  checkUserVotedStatus = () => {
    let userId = this.props.currentUser;
    ScoreVoter.deployed().then(function(instance) {

          instance.voted.call(userId).then( function(hasVoted) {
            me.setState({voted : hasVoted});
            if(hasVoted === true) {
              me.props.notifier("User account " + me.props.currentUser + " has already voted ", true, true, false);
              console.log('Current user has already voted ' + me.state.totalOptionsCount);
            }
        });

      });    

  }


    render () {

    	return (
      		<div>

              { this.state.voted && 
                  <div>
                    All Done!!! Thanks for voting.
                  </div>

              }

				      { this.state.doAuth &&
              		<Auth resultCallback={this.doAuth} userId={this.props.currentUser} />
            	}

            {!this.state.doAuth && this.state.isOptData && 
              <VoteOptionList optionIds={optNames} onSubmit={this.vote} notifier={this.props.notifier}/> 
            }


            </div>            
        );

    }


}