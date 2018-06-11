import {
  HOME_SET_REORDER,
} from '../../../../src/features/home/redux/constants';

import {
  setReorder,
  reducer,
} from '../../../../src/features/home/redux/setReorder';

describe('home/redux/setReorder', () => {
  it('returns correct action by setReorder', () => {
    expect(setReorder()).toHaveProperty('type', HOME_SET_REORDER);
  });

  it('handles action type HOME_SET_REORDER correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SET_REORDER }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
