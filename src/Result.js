//react and Front End imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { default as Web3} from 'web3';

import { default as contract } from 'truffle-contract'
import scoreVoter from './contracts/ScoreVoter.json'
import ResultItem from './ResultItem.js';
var CONFIG = require('./config.json');


    var web3 ;
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

    this.viewResults();
  }


  viewResults = () => {

    optNames = [];
    me.setState({isOptData: false});
    ScoreVoter.deployed().then(function(instance) {

        instance.getOptionIdCount.call().then( function(optCount) {
          // console.log("Total options count in system " + optCount);
          for(let i = 1 ; i <= optCount; i++) {
            instance.getOptionScore.call(i).then(function(score) {
              console.log(" values from opt detail. Id : " + i + " name : " +  web3.toAscii(score[0]) + "," + score[1].toString());
              optNames.push( i+ "," + web3.toAscii(score[0]) + "," + score[1].toString());
              
              if(i == optCount){
                me.setState({isOptData: true});
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
          //0 = id, 1 = name , 2 = score
          return <ResultItem id={info[0]} item={info[1]} score={info[2]} key={info[0]} />;
        });
      }

    return (
           
        <div>        
            <div className="card mb-3">
              <div className="card-header">Option Details</div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td>&nbsp;</td>
                          <td><a className="btn btn-primary btn-block" onClick={this.viewResults}>View Results</a></td>
                          <td>&nbsp;</td>
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


