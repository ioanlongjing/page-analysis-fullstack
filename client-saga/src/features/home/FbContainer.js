import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as userActions from '../user/redux/actions';
import * as homeActions from './redux/actions';
import { Modal, Button, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import DataTable from './DataTable';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'


export class FbContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      fbid: '',
      modalShow: false,
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

  updateUserFb(data) {
    this.props.actions.updateUser({
      userEmail: localStorage.getItem('userEmail'),
      fbId: data.id,
      fbToken: data.accessToken
    })
  }

  componentDidMount() {
    console.log('tet')
    this.props.actions.getAllFbPages()
  }

  render() {
    return (
      <div className="tab-container">
          <Modal show={!!this.props.home.fbPageDisplay.id} onHide={this.props.actions.removeFbPage}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">
                {this.props.home.fbPageDisplay.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>About:</p>
              <p>{this.props.home.fbPageDisplay.about}</p>
              <p>Description:</p>
              <p>{this.props.home.fbPageDisplay.description}</p>
              <p>Fan count:</p>
              <p>{this.props.home.fbPageDisplay.fan_count}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.props.actions.addFbPage}>Add</Button>
              <Button onClick={this.props.actions.removeFbPage}>Close</Button>
            </Modal.Footer>
          </Modal>

          {this.props.user.user.fbToken ? (
          <div>
            <div className='fb-search'>
              <FormGroup controlId='facebook'>
                <ControlLabel>Please enter Facebook page id:</ControlLabel>
                <FormControl
                  className='search-box'
                  type="text"
                  value={this.state.fbid}
                  placeholder="fb id"
                  onChange={this.handleFbIdChange.bind(this)}
                />
                <Button className='search-button' onClick={this.props.actions.getFbPage.bind(null, this.state.fbid)}>Search</Button>         
                
              </FormGroup>
            </div>
            {this.props.home.pages.length > 0 && (
              <DataTable submitChange={this.props.actions.submitChange} switchPageOrder={this.props.actions.switchPageOrder} updatePageAnnotation={this.props.actions.updatePageAnnotation} editing={this.state.editing} setReorder={this.props.actions.setReorder} pages={this.props.home.pages} columns={this.props.home.columns} />
            )}
            
          </div>
          ) : (
            <FacebookLogin
              appId="1101264780014195"
              autoLoad
              callback={this.updateUserFb.bind(this)}
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
    actions: bindActionCreators({ ...userActions, ...homeActions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FbContainer);
