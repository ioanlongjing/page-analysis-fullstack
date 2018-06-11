import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_GET_ALL_FB_PAGES_BEGIN,
  HOME_GET_ALL_FB_PAGES_SUCCESS,
  HOME_GET_ALL_FB_PAGES_FAILURE,
  HOME_GET_ALL_FB_PAGES_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  getAllFbPages,
  dismissGetAllFbPagesError,
  doGetAllFbPages,
  reducer,
} from 'src/features/home/redux/getAllFbPages';

describe('home/redux/getAllFbPages', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by getAllFbPages', () => {
    expect(getAllFbPages()).to.have.property('type', HOME_GET_ALL_FB_PAGES_BEGIN);
  });

  it('returns correct action by dismissGetAllFbPagesError', () => {
    expect(dismissGetAllFbPagesError()).to.have.property('type', HOME_GET_ALL_FB_PAGES_DISMISS_ERROR);
  });

  // saga tests
  const generator = doGetAllFbPages();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches HOME_GET_ALL_FB_PAGES_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: HOME_GET_ALL_FB_PAGES_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches HOME_GET_ALL_FB_PAGES_FAILURE action when failed', () => {
    const generatorForError = doGetAllFbPages();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: HOME_GET_ALL_FB_PAGES_FAILURE,
      data: { error: err },
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type HOME_GET_ALL_FB_PAGES_BEGIN correctly', () => {
    const prevState = { getAllFbPagesPending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_ALL_FB_PAGES_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getAllFbPagesPending).to.be.true;
  });

  it('handles action type HOME_GET_ALL_FB_PAGES_SUCCESS correctly', () => {
    const prevState = { getAllFbPagesPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_ALL_FB_PAGES_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getAllFbPagesPending).to.be.false;
  });

  it('handles action type HOME_GET_ALL_FB_PAGES_FAILURE correctly', () => {
    const prevState = { getAllFbPagesPending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_ALL_FB_PAGES_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getAllFbPagesPending).to.be.false;
    expect(state.getAllFbPagesError).to.exist;
  });

  it('handles action type HOME_GET_ALL_FB_PAGES_DISMISS_ERROR correctly', () => {
    const prevState = { getAllFbPagesError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_ALL_FB_PAGES_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.getAllFbPagesError).to.be.null;
  });
});