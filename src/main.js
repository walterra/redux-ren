import React from 'react';
import ReactDOM from 'react-dom';
import {
  connect,
  Provider
} from 'react-redux';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';
import thunk from 'redux-thunk';

const ren = function({ id, rootComponent, actions = {}, initialState = {} }) {
  // const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() || compose;

  const reducer = (state = initialState, action) => {
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
  };

  const store = createStore(
    reducer,
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
          // if the action returned another function, we pass it on to be handled by redux-thunk.
          // "dispatchActions" is passed on as an argument, so async actions can easily trigger
          // another action by directly calling it instead of using something like
          // dispatch({ type: 'ACTION_NAME' });
          dispatchActions[actionName] = () => dispatch(actions[actionName](dispatchActions));
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
    state => state,
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

ren.connect = connect;

export default ren;
