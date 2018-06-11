import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_ADD_FB_PAGE_BEGIN,
  HOME_ADD_FB_PAGE_SUCCESS,
  HOME_ADD_FB_PAGE_FAILURE,
  HOME_ADD_FB_PAGE_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  addFbPage,
  dismissAddFbPageError,
  doAddFbPage,
  reducer,
} from 'src/features/home/redux/addFbPage';

describe('home/redux/addFbPage', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by addFbPage', () => {
    expect(addFbPage()).to.have.property('type', HOME_ADD_FB_PAGE_BEGIN);
  });

  it('returns correct action by dismissAddFbPageError', () => {
    expect(dismissAddFbPageError()).to.have.property('type', HOME_ADD_FB_PAGE_DISMISS_ERROR);
  });

  // saga tests
  const generator = doAddFbPage();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches HOME_ADD_FB_PAGE_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: HOME_ADD_FB_PAGE_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches HOME_ADD_FB_PAGE_FAILURE action when failed', () => {
    const generatorForError = doAddFbPage();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: HOME_ADD_FB_PAGE_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type HOME_ADD_FB_PAGE_BEGIN correctly', () => {
    const prevState = { addFbPagePending: false };
    const state = reducer(
      prevState,
      { type: HOME_ADD_FB_PAGE_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addFbPagePending).to.be.true;
  });

  it('handles action type HOME_ADD_FB_PAGE_SUCCESS correctly', () => {
    const prevState = { addFbPagePending: true };
    const state = reducer(
      prevState,
      { type: HOME_ADD_FB_PAGE_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addFbPagePending).to.be.false;
  });

  it('handles action type HOME_ADD_FB_PAGE_FAILURE correctly', () => {
    const prevState = { addFbPagePending: true };
    const state = reducer(
      prevState,
      { type: HOME_ADD_FB_PAGE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addFbPagePending).to.be.false;
    expect(state.addFbPageError).to.exist;
  });

  it('handles action type HOME_ADD_FB_PAGE_DISMISS_ERROR correctly', () => {
    const prevState = { addFbPageError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_ADD_FB_PAGE_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.addFbPageError).to.be.null;
  });
});