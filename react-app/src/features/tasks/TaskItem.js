// src/components/TaskItem.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from './actions'; // Assuming updateTask is an available action

const TaskItem = ({ task }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);

    const handleUpdate = () => {
        if (editedTitle.trim()) {
            task.title = editedTitle
            dispatch(updateTask(task.id, task));
            setIsEditing(false);
        }
    };

    return (
        <div className="list-group-item d-flex justify-content-between align-items-center">
            {isEditing ? (
                <>
                    <input 
                        type="text"
                        className="form-control"
                        value={editedTitle}
                        onChange={e => setEditedTitle(e.target.value)}
                    />
                    <div>
                        <button className="btn btn-success btn-sm me-2" onClick={handleUpdate}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </>
            ) : (
                <>
                    {task.title}
                    <div>
                        <button className="btn btn-info btn-sm me-2" onClick={() => setIsEditing(true)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => dispatch(deleteTask(task.id))}>Delete</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskItem;
