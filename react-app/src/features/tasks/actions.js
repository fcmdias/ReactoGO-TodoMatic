import axios from 'axios';

const API_URL = "todo-api";

export const FETCH_TASKS = 'FETCH_TASKS';
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const COMPLETE_TASK_SUCCESS = 'COMPLETE_TASK_SUCCESS';

export const fetchTasks = () => async dispatch => {
    const response = await axios.get(`${API_URL}/tasks`);
    dispatch({ type: FETCH_TASKS, payload: response.data });
};

export const addTask = (task) => async dispatch => {
    const response = await axios.post(`${API_URL}/tasks/create`, task);
    dispatch({ type: ADD_TASK, payload: response.data });
};

export const deleteTask = (id) => async dispatch => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    dispatch({ type: DELETE_TASK, payload: id });
};

export const updateTask = (id, task) => async dispatch => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, task);
    dispatch({ type: UPDATE_TASK, payload: response.data });
};

export const completeTask = (id) => {
    return async dispatch => {
        try {
            const response = await axios.patch(`${API_URL}/tasks/${id}/complete`, {
                completed: true
            });

            if (response.status === 200) {
                dispatch({
                    type: 'COMPLETE_TASK_SUCCESS',
                    payload: {
                        id: id,
                        updatedTask: response.data
                    }
                });
            } else {
                dispatch({
                    type: 'COMPLETE_TASK_FAILURE',
                    payload: new Error('Failed to complete task.')
                });
            }
        } catch (error) {
            dispatch({
                type: 'COMPLETE_TASK_FAILURE',
                payload: error
            });
        }
    };
};