import { createStore, applyMiddleware } from 'redux';
import {
  Connect,
  bindStore,
  actionListenerMiddleware,
  resetStoreAndBoundComponents,
} from '../src/redux-ddd';

describe('@Connect', () => {
  let store = null;
  let TestClass = null;

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

    @Connect(state => ({
      val: state.a,
    }))
    class SpecClass {
      constructor() {
        // So the first reset call we shouldn't be called...
        this.val = 4;
      }
      onStateUpdate = () => {
        // NOP: Just spy
      };
      onAction = () => {}
    }

    TestClass = SpecClass;
  });

  it('throws an error in case is applied to an object', () => {
    expect(() => {
      Connect()({ a: 'b' });
    }).toThrowError('@Connect annotation is only valid on classes');
  });

  it('binds to the store even when the store is created afterwards', () => {
    const testInstance = new TestClass();
    spyOn(testInstance, 'onStateUpdate');
    spyOn(testInstance, 'onAction');
    bindStore(store, [testInstance]);
    expect(testInstance.onStateUpdate).not.toHaveBeenCalled();
    expect(testInstance.onAction).not.toHaveBeenCalled();
    store.dispatch({ type: 'RESET' });
    expect(testInstance.onStateUpdate).not.toHaveBeenCalled();
    expect(testInstance.onAction).toHaveBeenCalled();
    store.dispatch({ type: 'SET', value: 10 });
    expect(testInstance.onStateUpdate).toHaveBeenCalled();
  });
});
