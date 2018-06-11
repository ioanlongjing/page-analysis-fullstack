import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Tabs, Tab, FormControl, Button, FormGroup, ControlLabel, Modal } from 'react-bootstrap';
import DataTable from './DataTable';
import axios from 'axios';
import FbContainer from './FbContainer'

// {
//   "success": false,
//   "payload": null,
//   "error": {
//     "type": "ERROR_FB_FIND_PAGE",
//     "message": {
//       "message": "(#4) Application request limit reached",
//       "type": "OAuthException",
//       "is_transient": true,
//       "code": 4,
//       "fbtrace_id": "G8ZgrH94hzh"
//     }
//   }
// }

export class DefaultPage extends Component {
  constructor(props, context) {
    super(props, context);
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) {
      this.props.history.push('/sign-in')
    } else {
      this.props.actions.signin(userEmail)
    }
    this.state = {
      tab: 1,
      loading: false,
      fbid: '',
      modalShow: false,
      fbSearchId: '',
      fbSearchPageTitle: '',
      fbSearchFanCount: 0,
      fbSearchAbout: '',
      fbSearchPicture: ''
    };
  }

  static propTypes = {
    // pageAnalysis: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  switchTab(tab) {
    this.setState({ tab });
  }

  updateUser(data) {
    axios({
      method: 'PUT',
      url: 'http://localhost:3000/updateUser',
      data
    }).then((result) => {
      if (result.data.payload) {
        this.setState({
          user: result.data.payload
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  getUserFbPages() {
    axios({
      method: 'GET',
      url: 'http://localhost:3000/db/fb/pages/listAll/' + localStorage.getItem('userEmail')
    }).then((result) => {
      console.log(result)
    }).catch((err) => {
      console.log(err)
    })
  }

  componentDidMount() {
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      this.submitEmail(userEmail)
      this.props.actions.getUserFbPages(userEmail)
    }
  }

  handleModalClose() {
    this.setState({
      modalShow: false
    })
  }

  storeFbPage() {
    axios({
      method: 'POST',
      url: 'http://localhost:3000/fb/page',
      data: {
        id: this.state.fbSearchId,
        userEmail: this.state.user.email
      }
    }).then((result) => {
      console.log(result)
      this.setState({
        modalShow: false
      })
    }).catch((err) => {
      console.log(err)
    })
    this.getUserFbPages()
  }

  render() {  

    return (
      <div className="page-analysis-default-page">
        <Modal show={this.state.modalShow} onHide={this.handleModalClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              {this.state.fbSearchPageTitle}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>About: {this.state.fbSearchAbout}</p>
            <p>Fan count: {this.state.fbSearchFanCount}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.storeFbPage.bind(this)}>Add</Button>
            <Button onClick={this.handleModalClose.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>
        {this.state.loading && (
          <div className='loading'>
            <div className="loader"></div>
          </div>
        )}
        
        <h3 className='title'>Page Analysis</h3>
          <Tabs
            activeKey={this.state.tab}
            onSelect={this.switchTab.bind(this)}
            id="controlled-tab-example"
          >
            <Tab eventKey={1} title="Facebook">
              <FbContainer />
            </Tab>
            <Tab eventKey={2} title="Twitter">
              <div className='tab-container'>
                <DataTable />
              </div>
            </Tab>
            <Tab eventKey={3} title="Google">
              <div className='tab-container'>
                <DataTable />
              </div>
            </Tab>
          </Tabs>
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
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultPage);
