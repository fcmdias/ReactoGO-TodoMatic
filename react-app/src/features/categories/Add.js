import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCategory } from './actions';

const CategoryCreate = () => {
    const [categoryTitle, setCategoryTitle] = useState('');
    const [showForm, setShowForm] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (categoryTitle.trim()) {
            dispatch(addCategory({ title: categoryTitle }));
            setCategoryTitle('');  // Clear the input field after submitting
            setShowForm(false);    // Hide the form after submission
        }
    };

    if (!showForm) {
        return (
            <button onClick={() => setShowForm(true)} className="btn btn-dark mt-2">
                Create New Category
            </button>
        );
    }

    return (
        <div className="mt-3">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control"
                        value={categoryTitle} 
                        onChange={e => setCategoryTitle(e.target.value)}
                        placeholder="Enter new category..."
                    />
                </div>
                <button type="submit" className="btn btn-dark me-2">Add Category</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </form>
        </div>
    );
};

export default CategoryCreate;
