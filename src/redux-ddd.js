/**
 * The list of components that we connected via @Connect or directly using
 * the connectComponent function. We will call these callbacks when we execute
 * the bindStore for the component.
 */
const registeredConnects = [];

/**
 * The list of action listeners, for each registered component that implements
 * an onAction method.
 */
const actionListeners = [];

/**
 * The singleton Redux store instance. We update it using the bindStore function.
 * That will enable all the connected components to be tied to the store.
 */
let $store = null;

/**
 * Custom marker for a component, to indicate that the connection to the store
 * has been set up.
 */
const REDUX_CONNECTED_MARKER = '__$reduxConnected$__';

/**
 * Marker for the component to make sure it is bound to the store before the
 * actual connection takes place.
 */
const REDUX_BOUND_MARKER = '__$reduxBound$__';

/**
 * Helper function to register a connected component to the Redux store.
 *
 * @param {Function} connectFn The connect function to call once the store is bound.
 */
function registerConnect(connectFn) {
  registeredConnects.push(connectFn);
  if ($store) {
    // If we already have the store set, call the connect function immediately.
    // We need to do this in order to allow new class instances bound via @Connect
    // to actually be bound to the store.
    connectFn.call();
  }
}

/**
 * Reinitialize the store and the bound components from scratch.
 */
export function resetStoreAndBoundComponents() {
  $store = null;
  registeredConnects.length = 0;
  actionListeners.length = 0;
}

/**
 * Simple middleware that allows the connected components to
 * react to actions. We execute the listeners after we complete
 * the dispatch of the current action, to avoid broken sequences
 * of events.
 */
export const actionListenerMiddleware = (/* store */) => next => action => {
  const result = next(action);
  actionListeners.forEach(listener => listener(action));
  return result;
};

/**
 * Binds the Redux store to the registered connected components.
 *
 * @param {Store} store The Redux store
 * @param {Object} [connectedComponents] The connected components, i.e., the
 * components that have been called the connectComponent function for.
 */
export function bindStore(store, connectedComponents = []) {
  if (connectedComponents == null) {
    throw new Error(`Invalid components passed to bindStore: ${connectedComponents}`);
  }
  $store = store;
  if (connectedComponents.length == null) {
    connectedComponents = [connectedComponents];
  }
  connectedComponents.forEach(component => {
    if (!component[REDUX_CONNECTED_MARKER]) {
      const proto = Object.getPrototypeOf(component);
      const desc = proto != null ? proto.constructor.name : 'Unknown';
      throw new Error(`Component not redux-connected: ${desc}`);
    }
    component[REDUX_BOUND_MARKER] = true;
  });
  registeredConnects.forEach(connectFn => connectFn.call());
}

/*
 * TODO: In case we will need to implement solutions with volatile components
 *       and multple active Redux stores.
 */
// export function unbind(connectedComponents = []) {
//   ...
// }

/**
 * Connects a component (i.e., an object) to the Redux store.
 *
 * @param {Object} component The component to connect to the store. The component
 * needs to implement an `onStateUpdate` function.
 * @param {Function} mapStateToProps Function of form (state) => obj, where
 * obj is an object containing the new values of the target fields mapped
 * on the Redux state.
 * @param {String} componentId Component identifier for debugging purposes.
 * @returns {Object} The component connected to the store.
 */
export function connectComponent(component, mapStateToProps, componentId = '<unknown>') {
  if (component == null || typeof component !== 'object') {
    throw new Error('Attempt to redux-connect an invalid component');
  }
  if (component[REDUX_CONNECTED_MARKER]) {
    throw new Error('Component already redux-connected!');
  }
  if (mapStateToProps != null && !(typeof mapStateToProps === 'function')) {
    throw new Error(`Invalid mapStateToProps in ${componentId}`);
  }
  registerConnect(() => {
    if (!component[REDUX_BOUND_MARKER]) {
      throw new Error(`Redux store not bound to the connected component: ${componentId}`);
    }
    // Bind the onAction action listener
    if (typeof component.onAction === 'function') {
      actionListeners.push(component.onAction.bind(component));
    }
    // Bind the onStateUpdate callback
    if (typeof component.onStateUpdate === 'function') {
      $store.subscribe(() => {
        if (!mapStateToProps) {
          // Component just connected, without any state mapping
          return;
        }
        const newProps = mapStateToProps($store.getState());
        if (!(typeof newProps === 'object')) {
          throw new Error(`The mapStateToProps in ${componentId} must return an object`);
        }
        let updateComponent = false;
        const oldProps = {};
        Object.keys(newProps).forEach(key => {
          const currentPropValue = component[key];
          oldProps[key] = currentPropValue;
          const newPropValue = newProps[key];
          if (currentPropValue !== newPropValue) {
            updateComponent = true;
          }
          // Setting the field allows us to retrieve the previous state.
          // Moreover, it is explicit and declared in the @Connect itself.
          component[key] = newPropValue;
        });
        if (updateComponent) {
          component.onStateUpdate.call(component, oldProps);
        }
      });
    }
    // Bind the dispatch function directly, and the $store
    component.dispatch = $store.dispatch.bind($store);
  });
  // Mark the component as connected
  component[REDUX_CONNECTED_MARKER] = true;
  return component;
}

/**
 * Decorator for ES6 classes. It will connect automagically every instance of
 * the class to the Redux store when bindStore is called
 * @param {Function} mapStateToProps Function same as in the connectComponent
 */
export function Connect(mapStateToProps) {
  return target => {
    // Make sure we apply the decorator to a function (and hopefully that is a class)
    if (!(typeof target === 'function')) {
      throw new Error('@Connect annotation is only valid on classes');
    }
    // This is going to be the new class constructor.
    function proxyConstructor(...args) {
      // Call the original constructor first
      target.call(this, args);
      // Then connect the instance of the class
      connectComponent(this, mapStateToProps, target.name);
    }
    proxyConstructor.prototype = Object.create(target.prototype);
    proxyConstructor.prototype.constructor = proxyConstructor;
    return proxyConstructor;
  };
}
