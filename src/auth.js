//react and Front End imports
import React, {Component } from 'react';
import PropTypes from 'prop-types';
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
var CONFIG = require('./config.json');

    var web3;
    var me = null;

export default class Auth extends Component {

  componentDidMount() {
      web3 = window.web3;
       console.warn("after webb3 connected  " + web3 );

  }
  // componentWillUnmount() {}
  

  constructor (props) {

    super(props);
     this.state = {
      message: null
     }
  }

  unlockaccount = () => {

    let id = this.props.userId;
    let phrase = this.refs.phrase.value;
    console.log(id + ' ' + phrase);
    
    try {
      web3.personal.unlockAccount(id, phrase, 5);
    } catch(error) {
      this.setState({message: error});
      return 
    }
    //this.setState({message: 'unlocked account....'});
    this.props.resultCallback(true, this.props.stateProps);
    
  }

  cancel = () => {
    //this.setState({message: 'canceled....'});
    console.log('cancelled ....');
    this.props.resultCallback();
  }

  render() {
   

    return (
      <form>
        <div className="card card-login mx-auto mt-8">
          <div className="card-header">Authorize Transaction</div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                 <tbody>
                    <tr>
                      <td>Account Id</td>
                      <td>{this.props.userId}</td>
                    </tr>
                    <tr>
                      <td>Password</td>
                      <td><input className="form-control" ref="phrase" type='password' placeholder="Password" /></td>
                    </tr>
                  </tbody>
                </table>                
              </div>
              <div className="form-group">
                <div className="form-row">
                  <div className="col-md-6">
                      <a className="btn btn-primary btn-block" onClick={this.unlockaccount}>Submit</a>
                  </div>
                  <div className="col-md-6">
                      <a className="btn btn-primary btn-block" onClick={this.cancel}>Cancel</a>
                  </div>
                </div>
              </div>
                <div> 
                  <div dangerouslySetInnerHTML={{__html: this.state.message}} />
                </div>
          </div>
        </div>
      </form>




    );
  }

}

Auth.propTypes = {
  resultCallback: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  //use this to pass values that will be passed back to the caller
  stateProps: PropTypes.array

};


//
// Auth.propTypes = {
//   auctioneerId: PropTypes.string.isRequired,
//   onAuctionId: PropTypes.func.isRequired,
//   notifier: PropTypes.func.isRequired,
//}



