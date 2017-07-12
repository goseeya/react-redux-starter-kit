const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const { createStore } = Redux;
//var createStore = Redux.createDtore;
//import { createStre } from 'redux';

const store = createStore(counter);//initial state

// console.log(store.getState());
//
// store.dispatch({ type: 'INCREMENT'});//wzroslo o 1
// console.log(store.getState());
//

const render = () => {
  document.body.innerText = store.getState();
}

store.subscribe(render);
render();

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT'});
})
