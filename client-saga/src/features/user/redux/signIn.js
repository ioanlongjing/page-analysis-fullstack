import { delay, takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import axios from 'axios';
import history from '../../../common/history';

import {
  USER_SIGN_IN_BEGIN,
  USER_SIGN_IN_SUCCESS,
  USER_SIGN_IN_FAILURE,
  USER_SIGN_IN_DISMISS_ERROR,
} from './constants';

export function signIn(email) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: USER_SIGN_IN_BEGIN,
    email
  };
}

export const signInApi = (email) => axios({
  method: 'POST',
  url: 'http://localhost:3000/signin',
  data: {
    email
  }
})

export function dismissSignInError() {
  return {
    type: USER_SIGN_IN_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on USER_SIGN_IN_BEGIN actions
export function* doSignIn(action) {
  const state = yield select()
  console.log(state)
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(signInApi, action.email);
  } catch (err) {
    yield put({
      type: USER_SIGN_IN_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: USER_SIGN_IN_SUCCESS,
    data: res.data.payload,
  });
  localStorage.setItem('userEmail', res.data.payload.email)
  history.push('/')
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchSignIn() {
  yield takeLatest(USER_SIGN_IN_BEGIN, doSignIn);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case USER_SIGN_IN_BEGIN:
      return {
        ...state,
        signInPending: true,
        signInError: null,
      };

    case USER_SIGN_IN_SUCCESS:
      return {
        ...state,
        signInPending: false,
        signInError: null,
        user: action.data
      };

    case USER_SIGN_IN_FAILURE:
      return {
        ...state,
        signInPending: false,
        signInError: action.data.error,
      };

    case USER_SIGN_IN_DISMISS_ERROR:
      return {
        ...state,
        signInError: null,
      };

    default:
      return state;
  }
}
