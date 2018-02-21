# redux-ren

Write `react-redux` without actions boilerplate.

Consider this an experimental proof of concept.

`redux-ren` takes a functional stateless react component, enriches simple state modifier functions to become redux actions and sets everything up in the background so you end up with a working `react-redux+thunk` app.

The following is a rewrite of the original redux counter example using `redux-ren`. While this is one blob of JavaScript, the Counter component and the actions are completely independent and could be moved to individual files.

```JavaScript
import ren from 'redux-ren';
import React from 'react';
import PropTypes from 'prop-types';

const Counter = (props) => (
  <p>
    Clicked: {props.value} times
      {' '}
    <button onClick={props.increment}>
      +
      </button>
    {' '}
    <button onClick={props.decrement}>
      -
      </button>
    {' '}
    <button onClick={props.incrementIfOdd}>
      Increment if odd
      </button>
    {' '}
    <button onClick={props.incrementAsync}>
      Increment async
      </button>
  </p>
);

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  incrementAsync: PropTypes.func.isRequired
};

// because these two actions increment "value" based on
// the existing state, we need to use (p, state) -
// "p" is just a dummy in this case because there's no payload
// for the action so we can get "state" as the second argument.
// the functions return an object with your intended state change.
// internally this will be handled then using
// const newState = { ...state, { value: state.value + 1 } };
const increment = (p, state) => ({ value: state.value + 1 });
const decrement = (p, state) => ({ value: state.value - 1 });

// the two following actions demonstrate how to use the thunk middleware.
// the outer function gets passed "actions" which are the actions we
// defined here wrapped with dispatchers. just calling "increment()"
// from above wouldn't have any effect, whereas "actions.increment()"
// correctly triggers the action tied to our react/redux setup.
// the inner function is a classic thunk. because we can access
// "actions" we don't really need dispatch, but calling
// dispatch({ type: 'increment' }) would work as well.
// in this case it's just there because we need "getState"
// as a second argument.
const incrementIfOdd = (actions) => (dispatch, getState) => {
  if (getState().value % 2 !== 0) {
    actions.increment();
  }
};

// this is another async action. In this case we can omit "(dispatch, getState)"
// altogether because we just want to trigger another action.
const incrementAsync = (actions) => () => {
  setTimeout(actions.increment, 1000);
};

const actions = { increment, decrement, incrementIfOdd, incrementAsync };
ren({ id: 'app', rootComponent: Counter, actions, initialState: { value: 0 } });
```
