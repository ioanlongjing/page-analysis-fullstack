import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { FormControl, Button, FormGroup, ControlLabel } from 'react-bootstrap';

export class DefaultPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
    };
  }

  static propTypes = {
    signIn: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    })
  }

  componentDidMount() {
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      this.props.actions.signIn(userEmail)
      this.props.history.push('/')
    }
  }

  signIn() {
    this.props.actions.signIn(this.state.email)
    this.props.history.push('/')
  }

  render() {
    return (
      <div>
        <FormGroup controlId='email'>
          <ControlLabel>Please enter your email to login / signup</ControlLabel>
          <FormControl
            type="text"
            value={this.state.email}
            placeholder="email"
            onChange={this.handleEmailChange.bind(this)}
          />
          <Button onClick={this.signIn.bind(this)}>Submit</Button>         
        </FormGroup>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    signIn: state.signIn,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultPage);
