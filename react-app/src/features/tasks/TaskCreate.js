// src/components/AddTask.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from './tasksActions';

const TaskCreate = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (taskTitle.trim()) {
            dispatch(addTask({ title: taskTitle }));
            setTaskTitle('');  // Clear the input field after submitting
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={taskTitle} 
                    onChange={e => setTaskTitle(e.target.value)}
                    placeholder="Enter new task..."
                />
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default TaskCreate;
