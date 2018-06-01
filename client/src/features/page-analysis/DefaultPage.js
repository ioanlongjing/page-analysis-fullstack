import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { Tabs, Tab } from 'react-bootstrap';
import DataTable from './DataTable';

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
