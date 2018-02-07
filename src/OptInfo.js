//react and Front End imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import { Label, DropdownButton, MenuItem, Form } from 'react-bootstrap'


var me = null;


export default class UserInfo extends Component {

  // componentDidMount() {}
  // componentWillUnmount() {}
  
  

  constructor (props) {

    super(props);
    me = this;
        
  }

  render() {
      return (
        <tr>
          <td>{this.props.id}</td>
          <td>{this.props.item}</td>
        </tr>
      );                

  }
}