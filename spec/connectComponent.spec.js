import { createStore, applyMiddleware } from 'redux';
import {
  bindStore,
  connectComponent,
  actionListenerMiddleware,
  resetStoreAndBoundComponents,
} from '../src/redux-ddd';

const INIT_VAL = 5;
const SET = 'SET';
const RESET = 'RESET';

class SpecClass {
  constructor() {
    // So the first reset call we shouldn't be called...
    this.val = INIT_VAL;
  }
  onStateUpdate = () => {
    // NOP: Just spy
  };
  onAction = () => {}
}

describe('connectComponent', () => {
  let store = null;

  beforeEach(() => {
    resetStoreAndBoundComponents();

    store = createStore(
      (state = { a: INIT_VAL }, action) => {
        switch (action.type) {
          case RESET: return Object.assign({}, state, { a: INIT_VAL });
          case SET: return Object.assign({}, state, { a: action.value });
          default: return state;
        }
      },
      applyMiddleware(actionListenerMiddleware),
    );
  });

  it('throws an error in case the component is not bound to the store', () => {
    expect(() => {
      connectComponent(new SpecClass(), () => {}, 'mycomp');
      bindStore(store, []);
    }).toThrowError('Redux store not bound to the connected component: mycomp');
  });

  it('throws an error in case the component is already connected', () => {
    expect(() => {
      const testInstance = new SpecClass();
      connectComponent(testInstance, state => ({ val: state.a }), 'mycomp');
      connectComponent(testInstance);
    }).toThrowError('Component already redux-connected!');
  });

  it('binds to the store properly', () => {
    const testInstance = new SpecClass();
    connectComponent(testInstance, state => ({ val: state.a }), 'mycomp');
    spyOn(testInstance, 'onStateUpdate');
    spyOn(testInstance, 'onAction');
    bindStore(store, [testInstance]);
    expect(testInstance.onStateUpdate).not.toHaveBeenCalled();
    expect(testInstance.onAction).not.toHaveBeenCalled();
    store.dispatch({ type: RESET });
    expect(testInstance.onStateUpdate).not.toHaveBeenCalled();
    expect(testInstance.onAction).toHaveBeenCalled();
    store.dispatch({ type: SET, value: 10 });
    expect(testInstance.onStateUpdate).toHaveBeenCalled();
  });

  it('returns the connected component back', () => {
    resetStoreAndBoundComponents();
    const comp = connectComponent(new SpecClass(), state => ({ val: state.a }), 'xxx');
    bindStore(store, [comp]);
    expect(comp).not.toBe(null);
    expect(comp).not.toBe(undefined);
    expect(comp['__$reduxConnected$__']).toBe(true);
    expect(comp['__$reduxBound$__']).toBe(true);
  });
});
