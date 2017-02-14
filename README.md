redux-ddd
=========

[Redux](https://github.com/reactjs/redux) bindings inspired by [Domain Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design) principles.

Along the lines of [`react-redux`](https://en.wikipedia.org/wiki/Domain-driven_design), `redux-ddd` provides Redux bindings for generic domain-specific components.

When dealing with asynchronicity and side-effects, `redux-ddd` enables an alternative approach to popular libraries such as [`redux-thunk`](https://github.com/gaearon/redux-thunk) and [`redux-saga`](https://github.com/redux-saga/redux-saga).

[![build status](https://img.shields.io/travis/alessiodm/redux-ddd/master.svg?style=flat-square)](https://travis-ci.org/alessiodm/redux-ddd)
[![npm version](https://img.shields.io/npm/v/redux-ddd.svg?style=flat-square)](https://www.npmjs.com/package/redux-ddd)
[![npm downloads](https://img.shields.io/npm/dm/redux-ddd.svg?style=flat-square)](https://www.npmjs.com/package/redux-ddd)

## Installation

```bash
npm install --save redux-ddd
```

## Basic Usage

The `redux-ddd` library provides a `@Connect` decorator that extends the semantic of self-defined custom methods `onStateUpdate` and `onAction`. The former will be called every time the observed state updates, the latter will be called when an action is dispatched to the store.

The `@Connect`ed components are augmented with the Redux store `dispatch` function, and with the custom mapping of the state they need.

Take a look at the [quick-start](docs/quickstart.md) by example to have an immedate feeling on how the code would look like.

## Documentation

- [Quick Start (by Example)](docs/quickstart.md)
- [Design Considerations](docs/design.md)
- [API](docs/api.md)

