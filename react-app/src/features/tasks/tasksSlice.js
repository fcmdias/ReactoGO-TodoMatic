
import { FETCH_TASKS, ADD_TASK, DELETE_TASK, UPDATE_TASK } from './tasksActions';

const initialState = {
    tasks: []
};

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_TASKS:
            return { ...state, tasks: action.payload };
        case ADD_TASK:
            return { ...state, tasks: [...state.tasks, action.payload] };
        case DELETE_TASK:
            return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
        case UPDATE_TASK:
            const updatedTasks = state.tasks.map(task =>
                task.id === action.payload.id ? action.payload : task
            );
            return { ...state, tasks: updatedTasks };
        default:
            return state;
    }
};

export default taskReducer;
