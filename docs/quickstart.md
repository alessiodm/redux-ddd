## Quick Start (by Example)

Sometimes an example is better than a thousand words :)

Here is a simple component (i.e., a service in this case) connected to the store:

```javascript
import { Connect } from 'redux-ddd';
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

The initialization of the Redux based application is:

```javascript
import { bindStore, actionListenerMiddleware } from 'redux-ddd';
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
