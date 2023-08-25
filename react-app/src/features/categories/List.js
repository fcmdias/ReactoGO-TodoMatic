import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, deleteCategory } from './actions';

const CategoryList = () => {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.categories.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div>
            {categories.map(category => (
                <div key={category.id}>
                    {category.title}
                    <button onClick={() => dispatch(deleteCategory(category.id))}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default CategoryList;
