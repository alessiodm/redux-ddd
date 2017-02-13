import { createStore } from 'redux';
import {
  bindStore,
  connectComponent,
  resetStoreAndBoundComponents,
} from '../src/redux-ddd';

let store = null;

describe('bindStore', () => {

  beforeEach(() => {
    resetStoreAndBoundComponents();
    store = createStore(
      (state = { a: 4 }) => state,
    );
  });

  it('throws an error in case is applied to a non-connected object', () => {
    expect(() => {
      bindStore(store, {});
    }).toThrowError('Component not redux-connected: Object');
  });

  it('binds the object without errors if the object is connected', () => {
    connectComponent({}, null);
  });

});
