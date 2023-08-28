import { LOGOUT_USER } from './actions';

const initialState = {
    // IMPORTANT 
    // TODO IMPORTANT: change this to false after development
    isAuthenticated: true,
    token: null,
    user: null
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
        default:
            return state;
    }
};

export default authReducer;
