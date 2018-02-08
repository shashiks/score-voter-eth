//react and Front End imports
import React, { Component } from 'react';

import UserItem from './UserItem.js'
import userRepository from './contracts/UserRepositoryImpl.json'
import { default as contract } from 'truffle-contract'
import { default as Web3} from 'web3'
var CONFIG = require('./config.json');

//import {watchEvents} from './event-watcher.js'

  var web3 = null;
  var UserRepository = contract(userRepository);
  var me = null;
  var userNames = [];

export default class VoterReg extends Component {


	 constructor (props) {
        super(props);

       web3 = new Web3(new Web3.providers.HttpProvider(CONFIG.gethUrl));
       console.warn("webb3 connected  " + web3 );
       UserRepository.setProvider(web3.currentProvider);
        this.state = {
          userNames: null,
          isVoterData: false,        	
        }
        me = this;

    }

    getUserList = () =>  {
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

	componentDidMount() {
		this.getUserList();
	}


    createUserAccount = () => {
    	console.log('user id selected ' + this.refs.userId.value);
    }


    render () {
		if(this.state.isVoterData) {
			userNames = userNames.map(function (row, index){
			        let info = row.split(",");
			        return <UserItem id={info[0]} item={info[1]} key={info[0]}/>;
			});
		}    	

    	return (
						<div className="card mb-3">
                        	<div className="card-body">
								<div className="form-group">
                            		<label htmlFor="userId">User Names</label>
                        			<select className="form-control" ref="userId">
					    				{userNames}
					    			</select>
                         		</div>
								<div className="form-group">
									<div className="form-row">
										<div className="col-md-4">
										  <a className="btn btn-primary btn-block" onClick={this.createUserAccount}>Create Account</a>
										</div>
									</div>
								</div>
                         	</div>    		
                        </div>
        );

    }


}