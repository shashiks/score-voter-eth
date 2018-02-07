//react and Front End imports
import React, { Component } from 'react';

import VoteOption from './VoteOption.js';


var me = null;
var optionScores = new Map();


/*
* For now this is just a good practise component.
* All that is done here could be done from Vote.js But would just make it messy
*/
export default class Vote extends Component {


	 constructor (props) {
        super(props);
        this.state = {
          totalOptionCount: 0,
        }
        me = this;

    }


    validateAndStore = () =>{

    	this.props.notifier(null, true, false, true);
    	// do validations of no same values
    	var scoreCard = new Set();
		for (var [key, value] of optionScores) {
		 	console.log(key + ' = ' + value);
		 	if(!scoreCard.has(value)) {
		 		scoreCard.add(value);
		 	} else {
		 		this.props.notifier("ERR: Select unique score for each option.", true, false, false);
		 		return;
		 	}
		}


    	this.props.onSubmit(optionScores);

    }

    //stores the value of each option on change of score in widget
    optionValueStore(optionId, optionScore) {
		
		me.props.notifier(null, true, false, true);
    	//console.log('Got value from Option ' + optionId + ' ' + optionScore);
    	optionScores.set(optionId, optionScore);
    	//console.log('scores '+ optionScores);
    }


    eachOption = (row, index) => {
    	// console.log('in each option ' + row + ' ' + index);
    	let info = row.split(",");
    	return ( 
    		<VoteOption id={info[0]} item={info[1]} key={info[0]} optionsCount={this.state.totalOptionCount} onValueStore={this.optionValueStore}/>
    	);
    }


	componentDidMount() {

		///// console.log(' mu props ' + this.props);
		// //// set default value of all options to 1. So that user may opt not to change the option with value 1 for his choice
		// //// will help during validation to see if all options are valid and have been adjusted by user
		var optIds = this.props.optionIds;
		this.setState({totalOptionCount: optIds.length});
		for(let i=0; i<optIds.length; i++) {
			//the structure of item is id,name. so take just the id
			let info = optIds[i].split(",");
			optionScores.set(info[0], 1);

		}
		// console.log("totalOptionCount " + this.state.totalOptionCount);
	}


    render () {
		 

    	return (
    			<div>
				<div>        
                    <div className="card mb-3">
                      <div className="card-header">Option Details</div>
                        <div className="card-body">
                          <div className="table-responsive">
							<table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">

							<tbody>
                                <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Score</th>
                                </tr>
                  					{this.props.optionIds.map(this.eachOption)} 
                                       
                                <tr>
                                  <td>&nbsp;</td>
                                  <td>&nbsp;</td>
                                  <td><a className="btn btn-primary btn-block" onClick={this.validateAndStore}>Vote</a></td>
                                </tr>
                              </tbody> 
                         </table>                           
                              
                                           
                          </div>
                      </div>
                    </div>
                  </div>    			
						   			    			
					   			
				</div>
        );

    }


}