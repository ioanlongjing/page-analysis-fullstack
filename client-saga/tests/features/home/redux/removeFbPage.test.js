import {
  HOME_REMOVE_FB_PAGE,
} from '../../../../src/features/home/redux/constants';

import {
  removeFbPage,
  reducer,
} from '../../../../src/features/home/redux/removeFbPage';

describe('home/redux/removeFbPage', () => {
  it('returns correct action by removeFbPage', () => {
    expect(removeFbPage()).toHaveProperty('type', HOME_REMOVE_FB_PAGE);
  });

  it('handles action type HOME_REMOVE_FB_PAGE correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_REMOVE_FB_PAGE }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
