import { LOGOUT_USER, REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE } from './actions';

const initialState = {
    // IMPORTANT 
    // TODO IMPORTANT: change this to false after development
    isAuthenticated: true,
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
        default:
            return state;
    }
};

export default authReducer;