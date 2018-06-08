import { delay, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  EXAMPLES_SIGN_IN_BEGIN,
  EXAMPLES_SIGN_IN_SUCCESS,
  EXAMPLES_SIGN_IN_FAILURE,
  EXAMPLES_SIGN_IN_DISMISS_ERROR,
} from './constants';

export function signIn() {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: EXAMPLES_SIGN_IN_BEGIN,
  };
}

export function dismissSignInError() {
  return {
    type: EXAMPLES_SIGN_IN_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on EXAMPLES_SIGN_IN_BEGIN actions
export function* doSignIn() {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(delay, 20);
  } catch (err) {
    yield put({
      type: EXAMPLES_SIGN_IN_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: EXAMPLES_SIGN_IN_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchSignIn() {
  yield takeLatest(EXAMPLES_SIGN_IN_BEGIN, doSignIn);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case EXAMPLES_SIGN_IN_BEGIN:
      return {
        ...state,
        signInPending: true,
        signInError: null,
      };

    case EXAMPLES_SIGN_IN_SUCCESS:
      return {
        ...state,
        signInPending: false,
        signInError: null,
      };

    case EXAMPLES_SIGN_IN_FAILURE:
      return {
        ...state,
        signInPending: false,
        signInError: action.data.error,
      };

    case EXAMPLES_SIGN_IN_DISMISS_ERROR:
      return {
        ...state,
        signInError: null,
      };

    default:
      return state;
  }
}
