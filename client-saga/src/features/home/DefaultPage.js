import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from './redux/actions';
import { Tabs, Tab } from 'react-bootstrap';
import FbContainer from './FbContainer'

export class DefaultPage extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      tab: 1
    }
  }

  switchTab(tab) {
    this.setState({ tab });
  }
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const user = localStorage.getItem('userEmail')
    if (!user) {
      this.props.history.push('/user')
    }
    
  }

  render() {
    return (
      <div className="home-default-page">
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
ss            </div>
          </Tab>
          <Tab eventKey={3} title="Google">
            <div className='tab-container'>
ss            </div>
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
    user: state.user
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultPage);
