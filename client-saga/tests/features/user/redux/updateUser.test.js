import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  USER_UPDATE_USER_BEGIN,
  USER_UPDATE_USER_SUCCESS,
  USER_UPDATE_USER_FAILURE,
  USER_UPDATE_USER_DISMISS_ERROR,
} from 'src/features/user/redux/constants';

import {
  updateUser,
  dismissUpdateUserError,
  doUpdateUser,
  reducer,
} from 'src/features/user/redux/updateUser';

describe('user/redux/updateUser', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by updateUser', () => {
    expect(updateUser()).to.have.property('type', USER_UPDATE_USER_BEGIN);
  });

  it('returns correct action by dismissUpdateUserError', () => {
    expect(dismissUpdateUserError()).to.have.property('type', USER_UPDATE_USER_DISMISS_ERROR);
  });

  // saga tests
  const generator = doUpdateUser();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches USER_UPDATE_USER_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: USER_UPDATE_USER_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches USER_UPDATE_USER_FAILURE action when failed', () => {
    const generatorForError = doUpdateUser();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: USER_UPDATE_USER_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type USER_UPDATE_USER_BEGIN correctly', () => {
    const prevState = { updateUserPending: false };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_USER_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updateUserPending).to.be.true;
  });

  it('handles action type USER_UPDATE_USER_SUCCESS correctly', () => {
    const prevState = { updateUserPending: true };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_USER_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updateUserPending).to.be.false;
  });

  it('handles action type USER_UPDATE_USER_FAILURE correctly', () => {
    const prevState = { updateUserPending: true };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_USER_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updateUserPending).to.be.false;
    expect(state.updateUserError).to.exist;
  });

  it('handles action type USER_UPDATE_USER_DISMISS_ERROR correctly', () => {
    const prevState = { updateUserError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: USER_UPDATE_USER_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.updateUserError).to.be.null;
  });
});