import { LOGOUT_USER, REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from './actions';

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    token: null,
    user: null,
    error: null
};

const authReducer = (state = initialState, action) => {
    switch(action.type) {
        // ... other casess
        case LOGOUT_USER:
            return {
                ...state,
                isAuthenticated: false,
                token: null,
                user: null
            };
        case REGISTER_REQUEST:
            return { ...state, isLoading: true, error: null };
        case REGISTER_SUCCESS:
            return { ...state, isLoading: false, user: action.payload };
        case REGISTER_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        case LOGIN_REQUEST:
            return { ...state, isLoading: true, error: null };
        case LOGIN_SUCCESS:
            return { ...state, token: action.payload, isLoading: false, isAuthenticated: true };
        case LOGIN_FAILURE:
            return { ...state, error: action.payload, isLoading: false };
        default:
            return state;
    }
};

export default authReducer;