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
  let pages = [];
  let dateArray =[]
  let columnArray = []
  try {
    res = yield call(getAllFbPagesApi);
  } catch (err) {
    yield put({
      type: HOME_GET_ALL_FB_PAGES_FAILURE,
      data: { error: err },
    });
    return;
  }


  let rawPages = res.data.payload
  for(let page in rawPages) {
    for (let pageDate in rawPages[page].likeHistory) {
      dateArray.push(pageDate)
    }
  }
  dateArray = [ ...new Set(dateArray)]
  dateArray.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a) - new Date(b);
  });

  for (var i = 0; i <= dateArray.length - 1; i++) {
    if (dateArray[i]) {
      columnArray.push(dateArray[i])
    }
  }

  for (let page in rawPages) {
    let likeHistoryArray = []
    if (rawPages[page].id) {
      for (let j = 0; j <= dateArray.length - 1; j++) {
        if (!rawPages[page].likeHistory[dateArray[j]]) {
          likeHistoryArray.push({
            date: dateArray[j],
            count: 'x'
          })
        } else {
          likeHistoryArray.push({
            date: dateArray[j],
            count: rawPages[page].likeHistory[dateArray[j]]
          })
        }
      }
      rawPages[page].likeHistoryArray = likeHistoryArray
    }
  }
  rawPages.sort(function(a,b) {return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);} ); 


  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: HOME_GET_ALL_FB_PAGES_SUCCESS,
    data: {
      pages: rawPages,
      columns: columnArray
    }
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
        pages: action.data.pages,
        columns: action.data.columns
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
