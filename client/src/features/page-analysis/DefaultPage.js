import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Tabs, Tab } from 'react-bootstrap';
import DataTable from './DataTable';

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
    this.state = {
      tab: 1,
    };
  }

  static propTypes = {
    pageAnalysis: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };


  switchTab(tab) {
    this.setState({ tab });
  }

  render() {
    return (
      <div className="page-analysis-default-page">
        <h3 className='title'>Page Analysis</h3>
        <Tabs
          activeKey={this.state.tab}
          onSelect={this.switchTab.bind(this)}
          id="controlled-tab-example"
        >
          <Tab eventKey={1} title="Tab 1">
            <DataTable />
          </Tab>
          <Tab eventKey={2} title="Tab 2">
            <DataTable />
          </Tab>
          <Tab eventKey={3} title="Tab 3">
            <DataTable />
          </Tab>
        </Tabs>

      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    pageAnalysis: state.pageAnalysis,
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
