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
        <div className="list-group">
        {(!categories || categories.length === 0) ? (
            <div className="list-group-item">No categories available.</div>
            ) : (
            categories.map(category => (
                <div key={category.id} className="list-group-item d-flex justify-content-between">
                    <span>{category.title}</span>
                    <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => dispatch(deleteCategory(category.id))}
                    >
                        Delete
                    </button>
                </div>
            ))
        )}


        </div>
    );
};

export default CategoryList;