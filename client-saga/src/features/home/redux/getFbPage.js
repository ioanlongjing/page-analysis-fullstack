import { delay, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  HOME_GET_FB_PAGE_BEGIN,
  HOME_GET_FB_PAGE_SUCCESS,
  HOME_GET_FB_PAGE_FAILURE,
  HOME_GET_FB_PAGE_DISMISS_ERROR,
} from './constants';
import axios from 'axios';

export function getFbPage(id) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: HOME_GET_FB_PAGE_BEGIN,
    id
  };
}

export function dismissGetFbPageError() {
  return {
    type: HOME_GET_FB_PAGE_DISMISS_ERROR,
  };
}

export function getFbPageApi(id) {
  return axios({
    method: 'GET',
    url: 'http://localhost:3000/fb/page/' + id,
  })
}


// worker Saga: will be fired on HOME_SUBMIT_FB_ID_BEGIN actions
export function* doGetFbPage(action) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(getFbPageApi, action.id);
  } catch (err) {
    alert('cant find the page')
    yield put({
      type: HOME_GET_FB_PAGE_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: HOME_GET_FB_PAGE_SUCCESS,
    data: res.data.payload,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchGetFbPage() {
  yield takeLatest(HOME_GET_FB_PAGE_BEGIN, doGetFbPage);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case HOME_GET_FB_PAGE_BEGIN:
      return {
        ...state,
        getFbPagePending: true,
        getFbPageError: null,
      };

    case HOME_GET_FB_PAGE_SUCCESS:
      return {
        ...state,
        getFbPagePending: false,
        getFbPageError: null,
        fbPageDisplay: action.data
      };

    case HOME_GET_FB_PAGE_FAILURE:
      return {
        ...state,
        getFbPagePending: false,
        getFbPageError: action.data.error,
      };

    case HOME_GET_FB_PAGE_DISMISS_ERROR:
      return {
        ...state,
        getFbPageError: null,
      };

    default:
      return state;
  }
}
