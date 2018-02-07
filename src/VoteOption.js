//react and Front End imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import { Label, DropdownButton, MenuItem, Form } from 'react-bootstrap'


var me = null;


export default class VoteOption extends Component {

  // componentDidMount() {}
  // componentWillUnmount() {}
  
  

  constructor (props) {

    super(props);
    this.state = {
      optValue: 1,
    }

    me = this;
        
  }

  validate = () => {
    let s = this.refs.score.value;
    this.setState({optValue: s});
    
    //send the value back to the container
    this.props.onValueStore(this.props.id, s);

  }

  render() {
      return (
        <tr>
          <td>{this.props.id}</td>
          <td>{this.props.item}</td>
          <td>
            <input type="range" min="1" max={this.props.optionsCount} step="1" ref="score" onChange={this.validate} defaultValue="1"/>&nbsp;&nbsp;{this.state.optValue}
            
          </td>
          
        </tr>
      );                

  }
}