import { delay, takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
  HOME_SWITCH_PAGE_ORDER_BEGIN,
  HOME_SWITCH_PAGE_ORDER_SUCCESS,
  HOME_SWITCH_PAGE_ORDER_FAILURE,
  HOME_SWITCH_PAGE_ORDER_DISMISS_ERROR,
} from './constants';
import axios from 'axios';

export function switchPageOrder(source, destination) {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: HOME_SWITCH_PAGE_ORDER_BEGIN,
    source,
    destination
  };
}

export function dismissSwitchPageOrderError() {
  return {
    type: HOME_SWITCH_PAGE_ORDER_DISMISS_ERROR,
  };
}

export function updatefbPagesApi(pages) {
  return axios({
    method: 'PUT',
    url: 'http://localhost:3000/db/fb/pages',
    data: pages
  })
}

// worker Saga: will be fired on HOME_SWITCH_PAGE_ORDER_BEGIN actions
export function* doSwitchPageOrder(action) {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  let pages;
  try {
    const getUserEmail = state => state.user.user.email
    const getPages = state => state.home.pages
    const userEmail = yield select(getUserEmail)
    pages = yield select (getPages)
    const sourcePage = {
      userEmail: localStorage.getItem('userEmail'),
      id: pages[action.source].id,
      order: pages[action.destination].order
    }

    const destinationPage = {
      userEmail: localStorage.getItem('userEmail'),
      id: pages[action.destination].id,
      order: pages[action.source].order
    }

    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(updatefbPagesApi, [destinationPage, sourcePage]);
  } catch (err) {
    yield put({
      type: HOME_SWITCH_PAGE_ORDER_FAILURE,
      data: { error: err },
    });
    return;
  }

  // update local after update online
  const tempOrder = pages[action.source].order
  pages[action.source].order = pages[action.destination].order
  pages[action.destination].order = tempOrder

  const result = Array.from(pages);
  const [removed] = result.splice(action.source, 1);
  result.splice(action.destination, 0, removed);
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: HOME_SWITCH_PAGE_ORDER_SUCCESS,
    data: result
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchSwitchPageOrder() {
  yield takeLatest(HOME_SWITCH_PAGE_ORDER_BEGIN, doSwitchPageOrder);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case HOME_SWITCH_PAGE_ORDER_BEGIN:
      return {
        ...state,
        switchPageOrderPending: true,
        switchPageOrderError: null,
      };

    case HOME_SWITCH_PAGE_ORDER_SUCCESS:
      return {
        ...state,
        switchPageOrderPending: false,
        switchPageOrderError: null,
        pages: action.data
      };

    case HOME_SWITCH_PAGE_ORDER_FAILURE:
      return {
        ...state,
        switchPageOrderPending: false,
        switchPageOrderError: action.data.error,
      };

    case HOME_SWITCH_PAGE_ORDER_DISMISS_ERROR:
      return {
        ...state,
        switchPageOrderError: null,
      };

    default:
      return state;
  }
}
