import { delay, takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
  HOME_ADD_FB_PAGE_BEGIN,
  HOME_ADD_FB_PAGE_SUCCESS,
  HOME_ADD_FB_PAGE_FAILURE,
  HOME_ADD_FB_PAGE_DISMISS_ERROR,
} from './constants';
import axios from 'axios';

export function addFbPage() {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: HOME_ADD_FB_PAGE_BEGIN,
  };
}

export function dismissAddFbPageError() {
  return {
    type: HOME_ADD_FB_PAGE_DISMISS_ERROR,
  };
}

export function saveFbPage(data) {
  return axios({
    method: 'POST',
    url: 'http://localhost:3000/fb/page',
    data
  })
}


// worker Saga: will be fired on HOME_ADD_FB_PAGE_BEGIN actions
export function* doAddFbPage() {
  const getfbPageDisplay = state => state.home.fbPageDisplay
  const getPages = state => state.home.pages
  const fbPage = yield select(getfbPageDisplay)
  const pages = yield select (getPages)
  fbPage.userEmail = localStorage.getItem('userEmail')
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(saveFbPage, fbPage);
  } catch (err) {
    alert('page exists?')
    yield put({
      type: HOME_ADD_FB_PAGE_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: HOME_ADD_FB_PAGE_SUCCESS,
    data: [...pages, fbPage]
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchAddFbPage() {
  yield takeLatest(HOME_ADD_FB_PAGE_BEGIN, doAddFbPage);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case HOME_ADD_FB_PAGE_BEGIN:
      return {
        ...state,
        addFbPagePending: true,
        addFbPageError: null,
      };

    case HOME_ADD_FB_PAGE_SUCCESS:
      return {
        ...state,
        addFbPagePending: false,
        addFbPageError: null,
        fbPageDisplay: {},
        pages: action.data
      };

    case HOME_ADD_FB_PAGE_FAILURE:
      return {
        ...state,
        addFbPagePending: false,
        addFbPageError: action.data.error,
      };

    case HOME_ADD_FB_PAGE_DISMISS_ERROR:
      return {
        ...state,
        addFbPageError: null,
      };

    default:
      return state;
  }
}
