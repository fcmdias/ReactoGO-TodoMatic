import axios from 'axios';

const API_URL = "todo-api"; // replace with your API URL

export const FETCH_TASKS = 'FETCH_TASKS';
export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';

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
