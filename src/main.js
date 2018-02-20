import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

export default function({ id, rootComponent, actions = {}, initialState = {} }) {
  // const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() || compose;

  const store = createStore(
    (state = initialState, action) => {
      if (
        typeof actions !== 'undefined' &&
        typeof actions[action.type] !== 'undefined'
      ) {
        let actionResult;
        if (typeof action.payload !== 'undefined') {
          actionResult = actions[action.type](action.payload, state);
        } else {
          actionResult = actions[action.type](undefined, state);
        }
        return { ...state, ...actionResult };
      }

      return state;
    },
    compose(applyMiddleware(thunk))
  );

  const mapDispatchToProps = (dispatch) => {
    const dispatchActions = {};

    const syncActions = {};

    Object.keys(actions).forEach((actionName) => {
      try {
        const actionTestResult = actions[actionName]({}, initialState);
        if (typeof actionTestResult === 'object') {
          syncActions[actionName] = actions[actionName];
        } else if (typeof actionTestResult === 'function') {
          dispatchActions[actionName] = actions[actionName];
        }
      } catch (e) {
        throw new Error('error calling action: ' + e);
      }
    });

    Object.keys(syncActions).forEach((actionName) => {
      if (syncActions[actionName].length === 0) {
        dispatchActions[actionName] = () => dispatch({ type: actionName });
      } else {
        dispatchActions[actionName] = (args) => {
          if (typeof args !== 'undefined') {
            dispatch({ type: actionName, payload: { ...args } });
          } else {
            dispatch({ type: actionName });
          }
        };
      }
    });

    return dispatchActions;
  };

  const ReduxComponent = connect(
    (state) => {
      return state;
    },
    mapDispatchToProps
  )(rootComponent);

  ReactDOM.render(
    <Provider store={store}>
      <ReduxComponent />
    </Provider>,
    document.getElementById(id)
  );

  return { ReduxComponent, store };
}
