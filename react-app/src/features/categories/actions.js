import axios from 'axios';

const API_URL = "todo-api"; // replace with your API URL

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
export const ADD_CATEGORY = 'ADD_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';

export const fetchCategories = () => async dispatch => {
    const response = await axios.get(`${API_URL}/categories`);
    dispatch({ type: FETCH_CATEGORIES, payload: response.data });
};

export const addCategory = (category) => async dispatch => {
    const response = await axios.post(`${API_URL}/categories/create`, category);
    dispatch({ type: ADD_CATEGORY, payload: response.data });
};

export const deleteCategory = (id) => async dispatch => {
    await axios.delete(`${API_URL}/categories/${id}`);
    dispatch({ type: DELETE_CATEGORY, payload: id });
};

export const updateCategory = (id, category) => async dispatch => {
    const response = await axios.put(`${API_URL}/categories/${id}`, category);
    dispatch({ type: UPDATE_CATEGORY, payload: response.data });
};
