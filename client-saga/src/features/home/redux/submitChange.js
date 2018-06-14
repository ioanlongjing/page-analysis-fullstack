import { delay, takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
  HOME_SUBMIT_CHANGE_BEGIN,
  HOME_SUBMIT_CHANGE_SUCCESS,
  HOME_SUBMIT_CHANGE_FAILURE,
  HOME_SUBMIT_CHANGE_DISMISS_ERROR,
} from './constants';
import axios from 'axios';
import {getAllFbPages} from './getAllFbPages';

export function submitChange(newAnnotations, newOrders) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: HOME_SUBMIT_CHANGE_BEGIN,
    newOrders,
    newAnnotations
  };
}

export function updatefbPagesApi(pages) {
  return axios({
    method: 'PUT',
    url: 'http://localhost:3000/db/fb/pages',
    data: pages
  })
}

export function dismissSubmitChangeError() {
  return {
    type: HOME_SUBMIT_CHANGE_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on HOME_SUBMIT_CHANGE_BEGIN actions
export function* doSubmitChange(action) {
  const newAnnotations = action.newAnnotations
  const newOrders = action.newOrders
  const getUserEmail = state => state.user.user.email
  const getPages = state => state.home.pages
  const userEmail = yield select(getUserEmail)
  const pages = yield select (getPages)
  const submitPages = []
  for (let annotation in newAnnotations) {
    if (newAnnotations[annotation].length > 0) {
      submitPages.push({
        userEmail,
        id: annotation,
        annotation: newAnnotations[annotation]
      })
    }
  }
  for (let order in newOrders) {
    if (Number.isInteger(parseInt(newOrders[order]))) {
      submitPages.push({
        userEmail,
        id: order,
        order: newOrders[order]
      })
    } else {
      console.log('wtf')
    }
  }
  console.log(submitPages)
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(updatefbPagesApi, submitPages);
  } catch (err) {
    yield put({
      type: HOME_SUBMIT_CHANGE_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: HOME_SUBMIT_CHANGE_SUCCESS,
    data: res,
  });

  yield put(getAllFbPages())
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchSubmitChange() {
  yield takeLatest(HOME_SUBMIT_CHANGE_BEGIN, doSubmitChange);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case HOME_SUBMIT_CHANGE_BEGIN:
      return {
        ...state,
        submitChangePending: true,
        submitChangeError: null,
      };

    case HOME_SUBMIT_CHANGE_SUCCESS:
      return {
        ...state,
        submitChangePending: false,
        submitChangeError: null,
      };

    case HOME_SUBMIT_CHANGE_FAILURE:
      return {
        ...state,
        submitChangePending: false,
        submitChangeError: action.data.error,
      };

    case HOME_SUBMIT_CHANGE_DISMISS_ERROR:
      return {
        ...state,
        submitChangeError: null,
      };

    default:
      return state;
  }
}
