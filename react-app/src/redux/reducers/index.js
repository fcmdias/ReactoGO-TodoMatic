import { combineReducers } from 'redux';
import taskReducer from '../../features/tasks/tasksSlice';

export default combineReducers({
    tasks: taskReducer
});
