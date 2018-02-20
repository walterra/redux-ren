# redux-ren

Write `react-redux` without boilerplate.

```JavaScript
  import React from 'react';
  import ren from 'redux-ren';

  const rootComponent = ({ count, increment, decrement }) => (
    <div>
      <p>Counter: {count}.</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );

  const add = (v) => (d, state) => ({ count: state.count + v });

  ren({
    id: 'app',
    rootComponent,
    actions: {
      increment: add(1),
      decrement: add(-1)
    },
    initialState: {
      count: 0
    }
  });
```

Consider this an experimental proof of concept.

`redux-ren` takes a functional stateless react component, enriches simple state modifier functions to become redux actions and sets everything up in the background so you end up with a working `react-redux` app.