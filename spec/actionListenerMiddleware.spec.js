import { createStore, applyMiddleware } from 'redux';
import {
  bindStore,
  connectComponent,
  actionListenerMiddleware,
  resetStoreAndBoundComponents,
} from '../src/redux-ddd';

let store = null;

describe('The action listener middleware', () => {

  beforeEach(() => {
    resetStoreAndBoundComponents();
    store = createStore(
      (state = { a: 4 }, action) => {
        switch (action.type) {
          case 'RESET': return Object.assign({}, state, { a: 4 });
          case 'SET': return Object.assign({}, state, { a: action.value });
          default: return state;
        }
      },
      applyMiddleware(actionListenerMiddleware),
    );
  });

  it('preserves all the events and their causality', () => {
    const component1 = {
      onStateUpdate: () => {
        component1.toSpy(component1.val);
      },
      toSpy: (/* val */) => {},
    };

    const component2 = {
      onAction: action => {
        switch (action.type) {
          case 'SET': return component2.dispatch({ type: 'RESET' });
          default: return null;
        }
      },
    };

    connectComponent(component1, state => ({ val: state.a }));
    connectComponent(component2, () => {});

    bindStore(store, [
      component1,
      component2,
    ]);

    spyOn(component1, 'toSpy');

    store.dispatch({ type: 'SET', value: 3 });
    store.dispatch({ type: 'SET', value: 5 });

    expect(component1.toSpy).toHaveBeenCalled();
    expect(component1.toSpy.calls.argsFor(0)).toEqual([3]);
    expect(component1.toSpy.calls.argsFor(1)).toEqual([4]);
    expect(component1.toSpy.calls.argsFor(2)).toEqual([5]);
    expect(component1.toSpy.calls.argsFor(3)).toEqual([4]);
  });

});
