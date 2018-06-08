import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Modal, Button, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import DataTable from './DataTable';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'


export class FbContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      fbid: '',
      modalShow: false
    }
  }

  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  handleFbIdChange(e) {
    this.setState({
      fbid: e.target.value
    })
  }

  handleModalClose() {
    this.setState({
      modalShow: false
    })
  }

  facebookResponse(response) {
    console.log(response)
    // const user = Object.assign(this.state.user, {fbToken: response.accessToken})
    // this.updateUser(user)
  }

  render() {
    return (
      <div className="tab-container">
          {this.props.user.fbToken ? (
          <div>
            <FormGroup controlId='facebook'>
              <ControlLabel>Please enter Facebook page id</ControlLabel>
              <FormControl
                type="text"
                value={this.state.fbid}
                placeholder="fb id"
                onChange={this.handleFbIdChange.bind(this)}
              />
              <Button onClick={this.props.actions.submitFbId(this.state.fbid)}>Submit</Button>         
            </FormGroup>
            <DataTable />
          </div>
          ) : (
            <FacebookLogin
              appId="1101264780014195"
              autoLoad
              callback={this.props.actions.updateUser}
              render={renderProps => (
                <button onClick={renderProps.onClick}>This is my custom FB button</button>
              )}
            />
        )}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
    user: state.user
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
)(FbContainer);
