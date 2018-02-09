//react and Front End imports
import React, { Component } from 'react';

import Admin from './Admin.js'
import UserMgmt from './UserMgmt.js'
import OptMgmt from './OptMgmt.js'
import userRepository from './contracts/UserRepositoryImpl.json'
import scoreVoter from './contracts/ScoreVoter.json'
import { default as contract } from 'truffle-contract'
import { default as Web3} from 'web3'
import Vote from './Vote.js'
import Result from './Result.js'

import {watchEvents} from './event-watcher.js'
var CONFIG = require('./config.json');

//import {watchEvents} from './event-watcher.js'



  var web3;
  var UserRepository = contract(userRepository);
  var ScoreVoter = contract(scoreVoter);
  var me = null;

class App extends Component {

    constructor (props) {
        console.log('cons');
        super(props);
        
       //web3 = new Web3(new Web3.providers.HttpProvider(web3.currentProvider));
        this.state = {
          currUser: null,
          isAdmin: false,
          feature: 'A',
          sub_feature: 'Options',
          message: null
        }
        me = this;
    }



  componentDidMount() {

       web3 = window.web3;
       console.warn("after webb3 connected  " + web3 );
       UserRepository.setProvider(web3.currentProvider);
       ScoreVoter.setProvider(web3.currentProvider);

       me.initUserProfile();

  }


  initUserProfile = () => {

       let userId = window.web3.eth.defaultAccount;
       console.log('current user id ' + userId);
       this.setState({currUser: userId});


      try {
          UserRepository.deployed().then(function(instance) {
            console.log("userId in session " + userId);
            instance.isAdmin.call( userId).then(function(adminStatus) {
              console.log("curr user is Admin " + adminStatus);
              if(adminStatus) {
                me.setState({isAdmin: adminStatus});
              }
            });
          });

          //enable event watching for ScoreVoter too
          ScoreVoter.deployed().then(function(voterInstance) {
            me.addEventListener(voterInstance) 
          });


      } catch (err) {
        me.messageBoard("Err looking for Admin capability  "+ err, true, false);
        return;
      }

  }

  


  messageBoard = (msgVal, isErr, append, clear)  => {


        if(clear) {
          this.setState({message: null});
          return;
        }

        if(isErr) {
          msgVal = "<font color='red'>" + msgVal + "</font>";
        }
        msgVal = "<p>" + msgVal + "</p>";
        if(append && this.state.message) {
          msgVal = this.state.message + msgVal;
        } 
        this.setState({message: msgVal});
  }


  addEventListener = (pScoreVoter) => {
      console.log("got score voter instance " + pScoreVoter);
      watchEvents(pScoreVoter, pScoreVoter, this.messageBoard);

  }


  // login = () => {
  //     this.messageBoard(null, false, false, true);

  //     let userId = this.refs.userId.value;
  //     let pwd = this.refs.password.value;
  //     try {
  //      let res =  web3.personal.unlockAccount(userId, pwd, 3);
  //      console.log('res of login ' + res);
  //     } catch(error) {
  //       this.messageBoard("Invalid userId / password. Please try again with valid credentials" , true, false, false);
  //       return;
  //     }
  //     this.setState({currUser: userId});

  //     try {
  //         UserRepository.deployed().then(function(instance) {
  //           console.log("userId in repo " + userId);
  //           instance.isAdmin.call( userId).then(function(adminStatus) {
  //             console.log("curr user is Admin " + adminStatus);
  //             if(adminStatus) {
  //               me.setState({isAdmin: adminStatus});
  //             }
  //           });
  //         });

  //         //enable event watching for ScoreVoter too
  //         ScoreVoter.deployed().then(function(voterInstance) {
  //           me.addEventListener(voterInstance) 
  //         });


  //     } catch (err) {
  //       me.messageBoard("Err looking for Admin capability  "+ err, true, false);
  //       return;
  //     }

  // }


  render() {
    
    return (

            <div>

                  {this.state.currUser != null && this.state.isAdmin && 
                      <div>
                            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
                            <div className="collapse navbar-collapse" id="navbarResponsive">
                              <ul className="navbar-nav navbar-sidenav" id="exampleAccordion">

                                 <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Survey Admin">
                                  <a onClick={ () => { this.setState({sub_feature : 'Manage'})  } }  className="nav-link nav-link-collapse collapsed" data-toggle="collapse" href="#collapseExamplePages" data-parent="#exampleAccordion">
                                    
                                    <span className="nav-link-text">Survey Management</span>
                                  </a>
                                  <ul className="sidenav-second-level collapse" id="collapseExamplePages">
                                    <li>
                                      <a onClick={ () => { this.setState({sub_feature : 'Manage'}) } }>Manage Survey </a>
                                    </li>
                                    <li>
                                      <a onClick={ () => { this.setState({sub_feature : 'Voters'}) } }>Manage Voters </a>
                                    </li>
                                    <li>
                                      <a onClick={ () => { this.setState({sub_feature : 'Options'}) } }>Manage Options</a>
                                    </li>
                                    <li>
                                      <a onClick={ () => { this.setState({sub_feature : 'Result'}) } }>View Result</a>
                                    </li>
                                    <li>
                                      <a onClick={ () => { this.setState({currUser : null}); this.setState({isAdmin : false}); this.messageBoard(null, false, false, true); this.setState({sub_feature : 'Options'}) ;} }>Logout</a>
                                    </li>

                                  </ul>
                                </li>
                              </ul>
                            </div>
                          </nav>

                            <div className="content-wrapper">
                              <div className="container-fluid">
                                <ol className="breadcrumb">
                                  <li className="breadcrumb-item active">Survey</li>
                                  <li className="breadcrumb-item">{this.state.sub_feature}</li>
                                </ol>
                                
                                  <div className="card-header"> 
                                        <div dangerouslySetInnerHTML={{__html: this.state.message}} />
                                  </div>

                                  {this.state.sub_feature === 'Manage' && 
                                    <Admin currentUser={this.state.currUser} adminStatus={this.state.isAdmin}  notifier={this.messageBoard}/>
                                  } 

                                  {this.state.sub_feature === 'Voters' && 
                                    <UserMgmt currentUser={this.state.currUser} adminStatus={this.state.isAdmin} notifier={this.messageBoard}/>
                                  } 

                                  {this.state.sub_feature === 'Options' && 
                                    <OptMgmt currentUser={this.state.currUser} adminStatus={this.state.isAdmin} notifier={this.messageBoard}/>
                                  } 

                                  {this.state.sub_feature === 'Result' && 
                                    <Result currentUser={this.state.currUser} adminStatus={this.state.isAdmin} notifier={this.messageBoard}/>
                                  } 

                              </div> 
                            </div>   
                          </div>              
                    }

                  {this.state.currUser != null && !this.state.isAdmin && 
                    <div>
                      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
                        <div className="collapse navbar-collapse" id="navbarResponsive">
                          <ul className="navbar-nav navbar-sidenav" id="exampleAccordion">

                             <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Survey Admin">
                              <a onClick={ () => { this.setState({sub_feature : 'Vote'})  } }  className="nav-link nav-link-collapse collapsed" data-toggle="collapse" href="#collapseExamplePages" data-parent="#exampleAccordion">
                                
                                <span className="nav-link-text">Vote</span>
                              </a>
                              <ul className="sidenav-second-level collapse" id="collapseExamplePages">
                                <li>
                                  <a onClick={ () => { this.setState({sub_feature : 'Vote'}) } }>Vote</a>
                                </li>
                                <li>
                                  <a onClick={ () => { this.setState({currUser : null}); this.setState({isAdmin : false}); this.messageBoard(null, false, false, true); this.setState({sub_feature : 'Options'}) ;} }>Logout</a>
                                </li>                                
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </nav>

                      <div className="content-wrapper">
                        <div className="container-fluid">
                            <ol className="breadcrumb">
                              
                              <li className="breadcrumb-item">{this.state.sub_feature}</li>
                            </ol>
                            
                              <div className="card-header"> 
                                    <div dangerouslySetInnerHTML={{__html: this.state.message}} />
                              </div>

                                {this.state.sub_feature === 'Vote' && 
                                    <Vote currentUser={this.state.currUser} adminStatus={this.state.isAdmin} notifier={this.messageBoard}/>
                                 }                                  
                              </div> 
                            </div>
                          </div>                  
                }


               

            </div>                
      

    );
  }
}


export default App;
