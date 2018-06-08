import { delay, takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import axios from 'axios';
import {
  USER_UPDATE_USER_BEGIN,
  USER_UPDATE_USER_SUCCESS,
  USER_UPDATE_USER_FAILURE,
  USER_UPDATE_USER_DISMISS_ERROR,
} from './constants';


export function updateUser(data) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: USER_UPDATE_USER_BEGIN,
    data
  };
}

export function dismissUpdateUserError() {
  return {
    type: USER_UPDATE_USER_DISMISS_ERROR,
  };
}

export function updateUserApi(data) {
  return axios({
    method: 'PUT',
    url: 'http://localhost:3000/updateUser',
    data
  })
}

// worker Saga: will be fired on USER_UPDATE_USER_BEGIN actions
export function* doUpdateUser() {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(delay, 20);
  } catch (err) {
    yield put({
      type: USER_UPDATE_USER_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: USER_UPDATE_USER_SUCCESS,
    data: res,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchUpdateUser() {
  yield takeLatest(USER_UPDATE_USER_BEGIN, doUpdateUser);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case USER_UPDATE_USER_BEGIN:
      return {
        ...state,
        updateUserPending: true,
        updateUserError: null,
      };

    case USER_UPDATE_USER_SUCCESS:
      return {
        ...state,
        updateUserPending: false,
        updateUserError: null,
      };

    case USER_UPDATE_USER_FAILURE:
      return {
        ...state,
        updateUserPending: false,
        updateUserError: action.data.error,
      };

    case USER_UPDATE_USER_DISMISS_ERROR:
      return {
        ...state,
        updateUserError: null,
      };

    default:
      return state;
  }
}
