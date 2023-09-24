import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from './actions';

const TaskCreate = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [recurrence, setRecurrence] = useState('none');
    const [customRecurrence, setCustomRecurrence] = useState('');
    const [showForm, setShowForm] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (taskTitle.trim()) {
            dispatch(addTask({
                title: taskTitle,
                recurrence: recurrence === 'custom' ? customRecurrence : recurrence
            }));
            setTaskTitle('');
            setRecurrence('none');
            setCustomRecurrence('');
            setShowForm(false);
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
                    <div className="mb-3">
                        <select value={recurrence} onChange={e => setRecurrence(e.target.value)}>
                            <option value="none">No Recurrence</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    {recurrence === 'custom' && (
                        <div className="mb-3">
                            <input 
                                type="text" 
                                className="form-control"
                                value={customRecurrence} 
                                onChange={e => setCustomRecurrence(e.target.value)}
                                placeholder="Enter custom interval..."
                            />
                        </div>
                    )}
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
