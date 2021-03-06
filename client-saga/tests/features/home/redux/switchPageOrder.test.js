import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_SWITCH_PAGE_ORDER_BEGIN,
  HOME_SWITCH_PAGE_ORDER_SUCCESS,
  HOME_SWITCH_PAGE_ORDER_FAILURE,
  HOME_SWITCH_PAGE_ORDER_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  switchPageOrder,
  dismissSwitchPageOrderError,
  doSwitchPageOrder,
  reducer,
} from 'src/features/home/redux/switchPageOrder';

describe('home/redux/switchPageOrder', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by switchPageOrder', () => {
    expect(switchPageOrder()).to.have.property('type', HOME_SWITCH_PAGE_ORDER_BEGIN);
  });

  it('returns correct action by dismissSwitchPageOrderError', () => {
    expect(dismissSwitchPageOrderError()).to.have.property('type', HOME_SWITCH_PAGE_ORDER_DISMISS_ERROR);
  });

  // saga tests
  const generator = doSwitchPageOrder();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches HOME_SWITCH_PAGE_ORDER_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: HOME_SWITCH_PAGE_ORDER_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches HOME_SWITCH_PAGE_ORDER_FAILURE action when failed', () => {
    const generatorForError = doSwitchPageOrder();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: HOME_SWITCH_PAGE_ORDER_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type HOME_SWITCH_PAGE_ORDER_BEGIN correctly', () => {
    const prevState = { switchPageOrderPending: false };
    const state = reducer(
      prevState,
      { type: HOME_SWITCH_PAGE_ORDER_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.switchPageOrderPending).to.be.true;
  });

  it('handles action type HOME_SWITCH_PAGE_ORDER_SUCCESS correctly', () => {
    const prevState = { switchPageOrderPending: true };
    const state = reducer(
      prevState,
      { type: HOME_SWITCH_PAGE_ORDER_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.switchPageOrderPending).to.be.false;
  });

  it('handles action type HOME_SWITCH_PAGE_ORDER_FAILURE correctly', () => {
    const prevState = { switchPageOrderPending: true };
    const state = reducer(
      prevState,
      { type: HOME_SWITCH_PAGE_ORDER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.switchPageOrderPending).to.be.false;
    expect(state.switchPageOrderError).to.exist;
  });

  it('handles action type HOME_SWITCH_PAGE_ORDER_DISMISS_ERROR correctly', () => {
    const prevState = { switchPageOrderError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_SWITCH_PAGE_ORDER_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.switchPageOrderError).to.be.null;
  });
});