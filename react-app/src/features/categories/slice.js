
import { FETCH_CATEGORIES, ADD_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from './actions';

const initialState = {
    categories: []
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CATEGORIES:
            return { ...state, categories: action.payload };
        case ADD_CATEGORY:
            return { ...state, categories: [...state.categories, action.payload] };
        case DELETE_CATEGORY:
            return { ...state, categories: state.categories.filter(category => category.id !== action.payload) };
        case UPDATE_CATEGORY:
            const updatedCategories = state.categories.map(category =>
                category.id === action.payload.id ? action.payload : category
            );
            return { ...state, categories: updatedCategories };
        default:
            return state;
    }
};

export default categoryReducer;
