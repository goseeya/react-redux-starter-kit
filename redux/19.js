const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if(state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
      case 'TOGGLE_TODO':
        return state.map(t => todo(t, action));
      default:
      return state;
  }
};

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibilityFilter
});


const { Component } = React;

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return <span>{children}</span>;
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
      >
      {children}
      </a>
  );
};

class FilterLink extends Component {
  componentDidMount() {
    const {store} =this.context;
    this.unsubscribe = store.subscribe(() =>
  this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  render() {
    const props = this.props;
    const {store} =this.context;

    const state = store.getState();

    return (
      <Link
        active = {
          props.filter ===
          state.visibilityFilter
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VILISBILITY_FILTER',
            filter: props.filter
          })
        }
        >
        {props.children}
      </Link>
      );
    )
  }
}

FilterLink.contextTypes = {
  store: React.PropTypes.object
};

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
    >
      All
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'

    >
      Active
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'

    >
      Completed
    </FilterLink>
  </p>
)


const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
   onClick={onClick}
  style={{
    textDecoration:
      completed ?
      'line-through' :
      'none'
  }}
  >
  {text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
    )}
  </ul>
);
let nextTodoId = 0;
const AddTodo = (props, {store}) => {
  let input;
  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        })
        onAddClick(input.value);
        input.value = '';
      }}>
      AddTodo
      </button>
    </div>
  )
};

AddTodo.contextTypes = {
  store: React.PropTypes.object
}

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }

}

const mapStateToProps = (state) => {
  return {
    getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id)=>{
      dispatch({
        type: 'TOGGLE_TODO',
        id
      })
    }
  };
};

const {connect} = ReactRedux;
//import {conneect} from'react-redux';
//
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

const TodoApp = () => (
    <div>
      <AddTodo />
      <VisibleTodoList />
        <Footer/>
        </div>
      );

      const { Provider } = ReactRedux;

//import {Provider} from 'react-redux';

const { createStore } = Redux;


ReactDOM.render(
  <Provider store={createStore(todoApp)>
    <TodoApp } />
  </Provider>,
  document.getElementById('root')
);

store.subscribe(render);
render();



const testAddTodo = () => {
  const stateBefore = [];
  cosnt action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  };
  const stateAfrer = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

const testToggleTodo = () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Learn Rdux',
      completed: false
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: false
    }
  ];
  const action = {
    type: 'TOGGLE_TODO',
    id:1
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Rdux',
      completed: false
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: true
    }
  ];
  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();
console.log('All tests passed');
