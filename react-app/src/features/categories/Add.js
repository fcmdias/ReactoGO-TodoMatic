// src/components/AddCategory.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCategory } from './actions';

const CategoryCreate = () => {
    const [categoryTitle, setCategoryTitle] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (categoryTitle.trim()) {
            dispatch(addCategory({ title: categoryTitle }));
            setCategoryTitle('');  // Clear the input field after submitting
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={categoryTitle} 
                    onChange={e => setCategoryTitle(e.target.value)}
                    placeholder="Enter new category..."
                />
                <button type="submit">Add Category</button>
            </form>
        </div>
    );
};

export default CategoryCreate;
