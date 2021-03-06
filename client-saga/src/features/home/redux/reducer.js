import initialState from './initialState';
import { reducer as getFbPageReducer } from './getFbPage';
import { reducer as removeFbPageReducer } from './removeFbPage';
import { reducer as addFbPageReducer } from './addFbPage';
import { reducer as getAllFbPagesReducer } from './getAllFbPages';
import { reducer as setReorderReducer } from './setReorder';
import { reducer as switchPageOrderReducer } from './switchPageOrder';
import { reducer as submitChangeReducer } from './submitChange';

const reducers = [
  getFbPageReducer,
  removeFbPageReducer,
  addFbPageReducer,
  getAllFbPagesReducer,
  setReorderReducer,
  switchPageOrderReducer,
  submitChangeReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
