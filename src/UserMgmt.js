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
import {TxnConsensus} from './block-verify.js';
import UserInfo from './UserInfo.js';
import Auth from './auth.js'
var CONFIG = require('./config.json');

    //var watching = false; //start watching to events only 
    // var passwd = false;

    var web3;
    var UserRepository = contract(userRepository);
    var ScoreVoter = contract(scoreVoter);

    //variable to refer to currnet component context
    // else ctx is not visible from anonymous functions and we cant call other functions like writeMsg
    var me = null;
 
var userNames = [];
export default class UserMgmt extends Component {


  constructor (props) {

    super(props);
      this.state = {
          uname: null,
          uAc: null,
          isVoterData: false,
          doAuth: false,
        }
      me = this;
        
  }

  componentDidMount() {
    this.props.notifier(null,false,false,true);
       web3 = window.web3;
       console.warn("after webb3 connected  " + web3 );
       UserRepository.setProvider(web3.currentProvider);
       ScoreVoter.setProvider(web3.currentProvider);

  }

  validateInput = (aName, addr) => {

    
    if(!aName || aName.length <= 2) {
      this.props.notifier("Invalid User Name. Please enter name with atleast 3 chars.", true, false);
      return false;
    }
    
    
    if(!addr || addr.length < 35) {
      this.props.notifier("Invalid User Account. Please enter a valid value.", true, false);
      return false;
    }

    return true;

  }

  // doAuth = (authStatus, returnProps) => {

  //   //close the auth screen
  //   this.setState({doAuth: false});
  //   if(!authStatus) {
  //     me.props.notifier('Transaction Auth Cancelled!', false, false);
  //     return;
  //   }
        
  //   this.addUser();
        
  // }




  addUser = () => {

    let uname = this.refs.userName.value;
    let addr = this.refs.userAc.value;

    this.setState({isVoterData:false});
    this.props.notifier(null, false, false, true);
    if(!this.validateInput(uname, addr)) {
      return;
    }

      try {
          
          UserRepository.deployed().then(function(instance) {
            console.log("instance userRepo " + instance);


            instance.addUser.sendTransaction( uname, addr, {gas:4712300,from: me.props.currentUser}).then(function(txnHash) {
                    console.log("Transaction Id " + txnHash);
                    me.props.notifier("Operation submitted. Txn Id : " + txnHash, false, false, false);
                    TxnConsensus(web3, txnHash, 3, 30000, 4, function(err, receipt) { 
                      console.log("Got result from block confirmation" + receipt);
                      if(receipt) {
                        console.log("userId blockHash " + receipt.blockHash);
                        console.log("userId blockNumber " + receipt.blockNumber);
                        console.log("userId transactionIndex " + receipt.transactionIndex);            
                            instance.getUserCount.call().then(function(lastUserId) {
                              me.props.notifier("User " + uname + " added successfully with Id :: " + lastUserId , false, true, false);
                            });
                      } else {
                        console.log("err from poll " + err);
                        me.props.notifier("Error adding user " + err, true, true, false);
                    }
              });
            });
          });
        } catch (err) {
            me.props.notifier("Coudn't add user  "+ err, true, false);
        }



  }

  showUserList = () => {

    userNames = [];
    UserRepository.deployed().then(function(instance) {

        instance.getUserCount.call().then( function(userCount) {
          // console.log("Total voters count in system " + userCount);
          for(let i = 1 ; i <= userCount; i ++) {
            instance.getUserDetailsById.call(i).then(function(id) {
              // console.log(" values from user detail. Id : " + id[0] + " name : " +  web3.toAscii(id[1]) );
              userNames.push(id[0] + "," + web3.toAscii(id[1]));
              // console.log('push  ' + userNames);
              if(i == userCount){
                me.setState({isVoterData: true});
              }
            });
          } 
          

      });

    });
  }


  render() {

      if(this.state.isVoterData === true) {
          console.log('usernames after '+ this.state.isVoterData + " " + userNames);
            userNames = userNames.map(function (row, index){
                // console.log('row item ' + row + " " + index);
              let info = row.split(",");
              return <UserInfo id={info[0]} item={info[1]} key={info[0]}/>;
            });
      }

    return (

             <div> 
                    <form>
                      <div className="card mb-3">
                        
                        <div className="card-body">

                          <div className="form-group">
                            <label htmlFor="userName">User Name</label>
                            <input className="form-control" ref="userName"  placeholder="Voter's Name" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="userAc">User Account</label>
                            <input className="form-control" ref="userAc"  placeholder="Voter's Address" />
                          </div>

                          <div className="form-group">
                            <div className="form-row">
                              <div className="col-md-4">
                                  <a className="btn btn-primary btn-block" onClick={this.addUser}>Add User</a>
                              </div>
                            </div>
                          </div>
                          </div>
                          </div>
                        </form>

                      <div className="card mb-3">
                        <div className="card-header">Voter Details</div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    <td>&nbsp;</td>
                                    <td><a className="btn btn-primary btn-block" onClick={this.showUserList}>View Voter&apos;s list</a></td>
                                  </tr>
                                  {
                                    userNames
                                  }
                                </tbody>
                              </table>                
                            </div>
                        </div>
                      </div>
              </div>
    );
  }
}




UserMgmt.propTypes = {
  notifier : PropTypes.func.isRequired

}


