import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_SUBMIT_CHANGE_BEGIN,
  HOME_SUBMIT_CHANGE_SUCCESS,
  HOME_SUBMIT_CHANGE_FAILURE,
  HOME_SUBMIT_CHANGE_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  submitChange,
  dismissSubmitChangeError,
  doSubmitChange,
  reducer,
} from 'src/features/home/redux/submitChange';

describe('home/redux/submitChange', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by submitChange', () => {
    expect(submitChange()).to.have.property('type', HOME_SUBMIT_CHANGE_BEGIN);
  });

  it('returns correct action by dismissSubmitChangeError', () => {
    expect(dismissSubmitChangeError()).to.have.property('type', HOME_SUBMIT_CHANGE_DISMISS_ERROR);
  });

  // saga tests
  const generator = doSubmitChange();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches HOME_SUBMIT_CHANGE_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: HOME_SUBMIT_CHANGE_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches HOME_SUBMIT_CHANGE_FAILURE action when failed', () => {
    const generatorForError = doSubmitChange();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: HOME_SUBMIT_CHANGE_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type HOME_SUBMIT_CHANGE_BEGIN correctly', () => {
    const prevState = { submitChangePending: false };
    const state = reducer(
      prevState,
      { type: HOME_SUBMIT_CHANGE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.submitChangePending).to.be.true;
  });

  it('handles action type HOME_SUBMIT_CHANGE_SUCCESS correctly', () => {
    const prevState = { submitChangePending: true };
    const state = reducer(
      prevState,
      { type: HOME_SUBMIT_CHANGE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.submitChangePending).to.be.false;
  });

  it('handles action type HOME_SUBMIT_CHANGE_FAILURE correctly', () => {
    const prevState = { submitChangePending: true };
    const state = reducer(
      prevState,
      { type: HOME_SUBMIT_CHANGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.submitChangePending).to.be.false;
    expect(state.submitChangeError).to.exist;
  });

  it('handles action type HOME_SUBMIT_CHANGE_DISMISS_ERROR correctly', () => {
    const prevState = { submitChangeError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_SUBMIT_CHANGE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.submitChangeError).to.be.null;
  });
});