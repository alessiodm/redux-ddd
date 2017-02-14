## Motivations

Keep the simplicity of `redux-thunk`, with a better and more modular separation of concerns.

Obtain complex scenarios like `redux-saga` ones, but via custom component-specific logic and avoiding overgeneralization over business logic.

## Design

Using an analogy with `react-redux`, the `@Connect` decorator just wraps the `connectComponent` that is the analogous of the `connect` in `react-redux`. The `mapStateToProps` is passed to the `@Connect`, but then there is no `mapDispatchToProps`: the `dispatch` function is passed to the components that can invoke it in case of component-specific events (e.g., WebSocket message, timers, etc.).

The `onAction` interceptor/listener can be used to implement asynchronous actions with the simplicity of `redux-thunk`, but separating where the side-effects resides in a domain/component specific way.
