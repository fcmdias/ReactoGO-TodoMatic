import { combineReducers } from 'redux';
import taskReducer from '../../features/tasks/slice';
import categoryReducer from '../../features/categories/slice';
import authReducer from '../../features/auth/slice';

export default combineReducers({
    tasks: taskReducer,
    categories: categoryReducer,
    auth: authReducer,
});
