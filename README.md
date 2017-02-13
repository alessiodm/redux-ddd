redux-ddd
=========

Redux extension inspired by Domain Driven Design principles.

It could be an alternative to `redux-thunk` and `redux-saga` in certain scenarios.

## Installation

Just use `npm` to install `redux-ddd`:

```shell
$> npm install --save redux-ddd
```

## Basic Usage

Here is an example of the basic usage of the framework.
First of all, a simple component (i.e., a service in this case) connected to the store:

```javascript
import { Connect } from '../redux/util';
...

@Connect(state => ({
  isLoggedIn: state.auth.isLoggedIn,
}))
class ProfileService {

  // The onStateUpdate is called every time the state we are
  // observing gets updated.
  onStateUpdate(prev) {
    if (this.isLoggedIn && !prev.isLoggedIn) {
      this.fetchProfile();
    }
  }

  // The onAction listener is called every time an action is
  // dispatched in the Redux store. It can be helpful when we
  // have logic with side-effects.
  onAction(action) {
    switch (action.type) {
      case ActionType.SUBMIT_FEEDBACK_INIT:
        this.submitFeedback(action.feedbackMsg);
        break;
      default:
        return;
    }
  }

  submitFeedback(feedbackMsg) {
    return AjaxCalls.submitFeedback(feedbackMsg)
            .then(() => this.dispatch(Actions.submitFeedbackSuccess()))
            .catch(err => this.dispatch(Actions.submitFeedbackFailed(err)));
  }

  fetchProfile() { ... }
}

// The service is a singleton
export default new ProfileService();
```

Then, in the initialization of the Redux based applications:

```javascript
import { bindStore, actionListenerMiddleware } from './redux/util';
...
import ProfileService from './services/ProfileService';
...

const store = createStore(
  rootReducer,
  applyMiddleware([
      actionListenerMiddleware,
      ...
  ])
);

bindStore(store, [
  ProfileService,
  ...
]);
```

## Design Considerations

[...]

## API Documentation

[...]

