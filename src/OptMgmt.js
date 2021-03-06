//react and Front End imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { default as Web3} from 'web3';

import { default as contract } from 'truffle-contract'
import scoreVoter from './contracts/ScoreVoter.json'
import {TxnConsensus} from './block-verify.js';
import OptInfo from './OptInfo.js';
import Auth from './auth.js'
var CONFIG = require('./config.json');

    var web3;
    //var UserRepository = contract(userRepository);
    var ScoreVoter = contract(scoreVoter);

    var me = null;
 
var optNames = [];
export default class OptMgmt extends Component {

  constructor (props) {

    super(props);

      this.state = {
          optNames: null,
          optionValue: null,
          isOptData: false,
          doAuth: false,
        }

      me = this;
        
  }

  componentDidMount() {
        this.props.notifier(null,false,false,true);
        web3 = window.web3;
       console.warn("after webb3 connected  " + web3 );
       ScoreVoter.setProvider(web3.currentProvider);

  }


  validate = (aName) => {
  
    if(!aName || aName.length < 3) {
      this.props.notifier("Invalid Option value. Please enter name with atleast 3 chars.", true, false);
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
        
  //   this.addOption();
        
  // }





  addOption = () => {

    //reset state to not update view
    this.setState({isOptData:false});
    this.props.notifier(null, false, false, true);

    let optValue = this.refs.optName.value;
    if(!this.validate(optValue)) {
      return;
    }
    
      try {

          // let optValue = this.state.optionValue;
          //let userId = this.props.currentUser;

          ScoreVoter.deployed().then(function(instance) {
            console.log("instance ScoreVoter " + instance + ' ' + optValue);

            instance.addOption.sendTransaction( optValue, {gas:2000000,from: me.props.currentUser}).then(function(txnHash) {
                    console.log("Transaction Id " + txnHash);
                    me.props.notifier("Operation submitted. Txn Id : " + txnHash, false, false, false);
                    TxnConsensus(web3, txnHash, 3, 30000, 4, function(err, receipt) { 
                      console.log("Got result from block confirmation" + receipt);
                      if(receipt) {
                        console.log("optName blockHash " + receipt.blockHash);
                        console.log("optName blockNumber " + receipt.blockNumber);
                        console.log("optName transactionIndex " + receipt.transactionIndex);            
                            instance.getOptionIdCount.call().then(function(lastOptId) {
                              me.props.notifier("Option " + optValue + " added successfully with Id :: " + lastOptId , false, true, false);
                            });
                      } else {
                        console.log("err from poll " + err);
                        me.props.notifier("Error adding option " + err, true, true, false);
                    }
              });
            });
          });
        } catch (err) {
            me.props.notifier("Coudn't add Option  "+ err, true, false);
        }
    }

  showOptionList = () => {

    optNames = [];
    ScoreVoter.deployed().then(function(instance) {

        instance.getOptionIdCount.call().then( function(optCount) {
          // console.log("Total options count in system " + optCount);
          for(let i = 1 ; i <= optCount; i++) {
            instance.getOptionById.call(i).then(function(optName) {
              // console.log(" values from opt detail. Id : " + i + " name : " +  web3.toAscii(optName) );
              optNames.push( i+ "," + web3.toAscii(optName));
              
              if(i == optCount){
                me.setState({isOptData: true});
                // console.log('final optNames  ' + optNames);
              }
            });
          } 
          

      });

    });
  }


  render() {

      if(this.state.isOptData) {
        optNames = optNames.map(function (row, index){
          let info = row.split(",");
          return <OptInfo id={info[0]} item={info[1]} key={info[0]}/>;
        });
      }

    return (

                <div>        
                  <form>
                    <div className="card mb-3">
                      
                      <div className="card-body">

                        <div className="form-group">
                          <label htmlFor="optName">Option Value</label>
                          <input className="form-control" ref="optName"  placeholder="Option Name" />
                        </div>

                        <div className="form-group">
                          <div className="form-row">
                            <div className="col-md-4">
                                <a className="btn btn-primary btn-block" onClick={this.addOption}>Create Option</a>
                            </div>
                          </div>
                        </div>
                        </div>
                        </div>
                      </form>

                    <div className="card mb-3">
                      <div className="card-header">Option Details</div>
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td>&nbsp;</td>
                                  <td><a className="btn btn-primary btn-block" onClick={this.showOptionList}>View Options list</a></td>
                                </tr>
                                {
                                  optNames
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




OptMgmt.propTypes = {
  notifier : PropTypes.func.isRequired

}


