import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from './actions';

const TaskCreate = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [showForm, setShowForm] = useState(false);  // New state for toggling form visibility
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (taskTitle.trim()) {
            dispatch(addTask({ title: taskTitle }));
            setTaskTitle('');  // Clear the input field after submitting
            setShowForm(false);  // Hide the form after submitting
        }
    };

    return (
        <div className="mb-3">
            {showForm ? (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control"
                            value={taskTitle} 
                            onChange={e => setTaskTitle(e.target.value)}
                            placeholder="Enter new task..."
                        />
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Add Task</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            ) : (
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>Create a New Task</button>
            )}
        </div>
    );
};

export default TaskCreate;
