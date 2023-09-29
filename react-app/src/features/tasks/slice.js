
import { FETCH_TASKS, ADD_TASK, DELETE_TASK, UPDATE_TASK, COMPLETE_TASK_SUCCESS, SET_CATEGORY_FILTER } from './actions';

const initialState = {
    tasks: [],
    filteredTasks: [],
    categoryFilter: "All"
};

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_TASKS:

            var filteredTasks = state.categoryFilter === "All" 
            ? action.payload
            : action.payload.filter(task => task.categories.includes(state.categoryFilter));
            return { ...state, tasks: action.payload, filteredTasks: filteredTasks };
        case SET_CATEGORY_FILTER:

            var newFilteredTasks = action.payload === "All" 
            ? state.tasks
            : state.tasks.filter(task => task.categories.includes(action.payload));
            return { ...state, categoryFilter: action.payload, filteredTasks: newFilteredTasks };
        case ADD_TASK:
            return { ...state, tasks: [...state.tasks, action.payload], filteredTasks: [...state.filteredTasks, action.payload] };
        case DELETE_TASK:
            return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
        case UPDATE_TASK:
            const updatedTasks = state.tasks.map(task =>
                task.id === action.payload.id ? action.payload : task
            );
            return { ...state, tasks: updatedTasks };
        case COMPLETE_TASK_SUCCESS:  // Handling the new action
            const completedTasks = state.tasks.map(task => 
                task.id === action.payload.id ? (
                    { ...task, completed: true }
                ) : task
            );
            const completedFilteredTasks = state.filteredTasks.map(task => 
                task.id === action.payload.id ? (
                    { ...task, completed: true }
                ) : task
            );
            return { ...state, tasks: completedTasks, filteredTasks: completedFilteredTasks };
        default:
            return state;
    }
};

export default taskReducer;
