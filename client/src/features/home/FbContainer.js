import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import DataTable from './DataTable';
import FacebookLogin from 'react-facebook-login';
import { FormControl, Button, FormGroup, ControlLabel} from 'react-bootstrap';
import axios from 'axios'

export class FbContainer extends Component {
  
  constructor(props, context) {
    super(props, context)
    this.state = {
      fbid: ''
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

  submitFbId() {
    axios({
      method: 'GET',
      url: 'http://localhost:3000/fb/page/' + this.state.fbid
    }).then((result) => {
      const page = result.data.payload
      this.setState({
        fbSearchId: page.id,
        fbSearchAbout: page.about,
        fbSearchFanCount: page.fan_count,
        fbSearchPageTitle: page.name,
        modalShow: true
      })

    }).catch((err) => {
      console.log(err)
    })
  }

  facebookResponse(response) {
    console.log(response)
    // const user = Object.assign(this.state.user, {fbToken: response.accessToken})
    // this.updateUser(user)
  }

  render() {
    return (
      <div className='tab-container'>
      eee
        {
        //   this.state.user.fbToken ? (
        //   <div>
        //     <FormGroup controlId='facebook'>
        //       <ControlLabel>Please enter Facebook page id</ControlLabel>
        //       <FormControl
        //         type="text"
        //         value={this.state.fbid}
        //         placeholder="fb id"
        //         onChange={this.handleFbIdChange.bind(this)}
        //       />
        //       <Button onClick={this.submitFbId.bind(this)}>Submit</Button>         
        //     </FormGroup>
        //     <DataTable />
        //   </div>
        //   ) : (
        //   <FacebookLogin
        //     appId="1101264780014195"
        //     fields="name,email,picture"
        //     render={renderProps => (
        //       <button onClick={renderProps.onClick}>This is my custom FB button</button>
        //     )}
        //     callback={this.facebookResponse.bind(this)} 
        //   />
        // )
        }
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
    signIn: state.signIn
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
