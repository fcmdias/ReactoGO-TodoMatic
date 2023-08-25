import { combineReducers } from 'redux';
import taskReducer from '../../features/tasks/tasksSlice';
import categoryReducer from '../../features/categories/slice';

export default combineReducers({
    tasks: taskReducer,
    categories: categoryReducer,
});
