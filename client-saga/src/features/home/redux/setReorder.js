// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  HOME_SET_REORDER,
} from './constants';

export function setReorder(pages, startIndex, endIndex) {
  const result = Array.from(pages);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return {
    type: HOME_SET_REORDER,
    pages: result
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_SET_REORDER:
      return {
        ...state,
        pages: action.pages
      };

    default:
      return state;
  }
}
