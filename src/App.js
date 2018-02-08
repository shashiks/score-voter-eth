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

//import {watchEvents} from './event-watcher.js'



  var web3 = null;
  var UserRepository = contract(userRepository);
  var ScoreVoter = contract(scoreVoter);
  var me = null;

class App extends Component {

  // componentDidMount() {}
  // componentWillUnmount() {}
  
  constructor (props) {
        super(props);

       web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9090"));
       console.warn("webb3 connected  " + web3 );
       UserRepository.setProvider(web3.currentProvider);
       ScoreVoter.setProvider(web3.currentProvider);

        this.state = {
          currUser: null,
          isAdmin: false,
          feature: 'A',
          sub_feature: 'Options',
          message: null
        }
        me = this;
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
      //console.log('contract objects ' + pUserRepo + " " + pScoreVoter);
      //start listening to events when the auction is created
      console.log("got score voter instance " + pScoreVoter);
      watchEvents(pScoreVoter, pScoreVoter, this.messageBoard);

  }


  login = () => {
      this.messageBoard(null, false, false, true);

      let userId = this.refs.userId.value;
      let pwd = this.refs.password.value;
      try {
       let res =  web3.personal.unlockAccount(userId, pwd, 3);
       console.log('res of login ' + res);
      } catch(error) {
        this.messageBoard("Invalid userId / password. Please try again with valid credentials" , true, false, false);
        return;
      }
      this.setState({currUser: userId});

      try {
          UserRepository.deployed().then(function(instance) {
            console.log("userId in repo " + userId);
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

  logout = () => {
    
    this.setState({currUser : null}); 
    this.setState({isAdmin : false});
    this.messageBoard(null, false, false, true);
    this.setState({sub_feature : 'Options'});
  }


  render() {
    
    return (

            <div>

                {this.state.currUser === null && 
                      <div>
                      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
                        <div className="collapse navbar-collapse" id="navbarResponsive">
                          <ul className="navbar-nav navbar-sidenav" id="exampleAccordion">

                             <li className="nav-item" data-toggle="tooltip" data-placement="right" title="Survey Admin">
                              <a onClick={ () => { this.setState({sub_feature : 'Login'})  } }  className="nav-link nav-link-collapse collapsed" data-toggle="collapse" href="#collapseExamplePages" data-parent="#exampleAccordion">
                                
                                <span className="nav-link-text">Login</span>
                              </a>
                              <ul className="sidenav-second-level collapse" id="collapseExamplePages">
                                <li>
                                  <a onClick={ () => { this.setState({sub_feature : 'Login'}) } }>Login</a>
                                </li>
                                <li>
                                  <a onClick={ () => { this.logout } }>Logout</a>
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

                                {this.state.sub_feature === 'Login' && 
                                    <div className="card mb-3">
                                    <div className="card-header">Login</div>
                                      <div className="card-body">
                                        <div className="table-responsive">
                                          <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                            <tbody>
                                              <tr>
                                                <td>User Id</td>
                                                <td><a><input className="form-control" ref="userId" defaultValue="0xf09564Ca641B9E3517dFc6f2e3525e7078eEa5A8"  placeholder="User Id" /></a></td>
                                              </tr>
                                              <tr>
                                                <td>Password</td>
                                                <td><a><input className="form-control" ref="password" type="password" defaultValue="welcome123" placeholder="password" /></a></td>
                                              </tr>
                                              <tr>
                                                <td><a className="btn btn-primary btn-block" onClick={this.login}>Login</a></td>
                                                <td>&nbsp;</td>
                                              </tr>
                                            </tbody>
                                          </table>                
                                        </div>
                                    </div>
                                  </div>
                                 }                                  
                              </div> 
                            </div>
                          </div>
                }


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
                                      <a onClick={ () => { this.logout } }>Logout</a>
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
                                    <Admin currentUser={this.state.currUser} adminStatus={this.state.isAdmin} notifier={this.messageBoard}/>
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
                                  <a onClick={ () => { this.logout } }>Logout</a>
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
