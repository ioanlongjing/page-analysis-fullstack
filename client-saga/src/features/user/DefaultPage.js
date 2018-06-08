import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Button, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';

export class DefaultPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: ''
    }
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    })
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

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
          <Button onClick={this.props.actions.signIn.bind(null, this.state.email)}>Submit</Button>         
        </FormGroup>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    user: state.user,
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
