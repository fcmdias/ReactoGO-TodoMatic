import axios from 'axios';

const API_URL = "users-api";

export const LOGOUT_USER = 'LOGOUT_USER';

export const logoutUser = () => ({
    type: LOGOUT_USER
});

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