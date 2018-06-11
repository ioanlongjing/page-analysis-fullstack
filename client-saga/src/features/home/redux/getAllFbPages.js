import { delay, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  HOME_GET_ALL_FB_PAGES_BEGIN,
  HOME_GET_ALL_FB_PAGES_SUCCESS,
  HOME_GET_ALL_FB_PAGES_FAILURE,
  HOME_GET_ALL_FB_PAGES_DISMISS_ERROR,
} from './constants';
import axios from 'axios';

export function getAllFbPages() {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: HOME_GET_ALL_FB_PAGES_BEGIN,
  };
}

export function getAllFbPagesApi() {
  return axios({
    method: 'GET',
    url: 'http://localhost:3000/db/fb/pages/listAll/' + localStorage.getItem('userEmail')
  })
}

export function dismissGetAllFbPagesError() {
  return {
    type: HOME_GET_ALL_FB_PAGES_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on HOME_GET_ALL_FB_PAGES_BEGIN actions
export function* doGetAllFbPages() {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(getAllFbPagesApi);
  } catch (err) {
    yield put({
      type: HOME_GET_ALL_FB_PAGES_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: HOME_GET_ALL_FB_PAGES_SUCCESS,
    data: res.data.payload,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchGetAllFbPages() {
  yield takeLatest(HOME_GET_ALL_FB_PAGES_BEGIN, doGetAllFbPages);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case HOME_GET_ALL_FB_PAGES_BEGIN:
      return {
        ...state,
        getAllFbPagesPending: true,
        getAllFbPagesError: null,
      };

    case HOME_GET_ALL_FB_PAGES_SUCCESS:
      return {
        ...state,
        getAllFbPagesPending: false,
        getAllFbPagesError: null,
        pages: action.data
      };

    case HOME_GET_ALL_FB_PAGES_FAILURE:
      return {
        ...state,
        getAllFbPagesPending: false,
        getAllFbPagesError: action.data.error,
      };

    case HOME_GET_ALL_FB_PAGES_DISMISS_ERROR:
      return {
        ...state,
        getAllFbPagesError: null,
      };

    default:
      return state;
  }
}
