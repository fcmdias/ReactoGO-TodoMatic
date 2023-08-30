import axios from 'axios';
import Cookies from 'js-cookie';


const API_URL = "users-api";

export const LOGOUT_USER = 'LOGOUT_USER';

export const logoutUser = () => {
    Cookies.remove('auth_token');
    return { type: LOGOUT_USER };
};

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const registerUser = (username, email, password) => {
    return async dispatch => {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                username: username,
                email: email,
                password: password
            });

            if (response.status === 200) {
                dispatch({
                    type: 'REGISTER_SUCCESS',
                    payload: {
                        data: response.data
                    }
                });
            } else {
                dispatch({
                    type: 'REGISTER_FAILURE',
                    payload: new Error('Failed to complete task.')
                });
            }
        } catch (error) {
            dispatch({
                type: 'REGISTER_FAILURE',
                payload: error
            });
        }
    };
};



export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const loginUser = (username, password) => async dispatch => {
    dispatch({ type: LOGIN_REQUEST });

    try {
        const response = await fetch(`${API_URL}/login`, {  // Assuming /login is your API endpoint for logging in
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Could not log in.');
        }

        dispatch({ type: LOGIN_SUCCESS, payload: data.token });
        Cookies.set('auth_token', data.token, { expires: 7 }); // Token will expire in 7 days. Adjust as per your requirements.
    } catch (error) {
        dispatch({ type: LOGIN_FAILURE, payload: error.message });
    }
};

export const loginSuccessAction = (token) => ({
    type: LOGIN_SUCCESS,
    payload: token
});