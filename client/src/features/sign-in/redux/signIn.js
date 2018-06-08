import {
  SIGN_IN_SIGN_IN_BEGIN,
  SIGN_IN_SIGN_IN_SUCCESS,
  SIGN_IN_SIGN_IN_FAILURE,
  SIGN_IN_SIGN_IN_DISMISS_ERROR,
} from './constants';
import axios from 'axios';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function signIn(email) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: SIGN_IN_SIGN_IN_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const doRequest = axios({
        method: 'POST',
        url: 'http://localhost:3000/signin',
        data: {
          email
        }
      })
      doRequest.then(
        (res) => {
          dispatch({
            type: SIGN_IN_SIGN_IN_SUCCESS,
            data: res,
          });
          localStorage.setItem('userEmail', res.data.payload.email)
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: SIGN_IN_SIGN_IN_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissSignInError() {
  return {
    type: SIGN_IN_SIGN_IN_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case SIGN_IN_SIGN_IN_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        signInPending: true,
        signInError: null,
      };

    case SIGN_IN_SIGN_IN_SUCCESS:
      // The request is success
      return {
        ...state,
        signInPending: false,
        signInError: null,
        user: action.data.data.payload
      };

    case SIGN_IN_SIGN_IN_FAILURE:
      // The request is failed
      return {
        ...state,
        signInPending: false,
        signInError: action.data.error,
      };

    case SIGN_IN_SIGN_IN_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        signInError: null,
      };

    default:
      return state;
  }
}
