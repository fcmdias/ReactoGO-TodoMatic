import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, updateTask, completeTask } from './actions';

const TaskItem = ({ task }) => {
    const dispatch = useDispatch();
    const allCategories = useSelector(state => state.categories.categories);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedCategories, setEditedCategories] = useState([...task.categories]);
    const [editedRecurrence, setEditedRecurrence] = useState(task.recurrence || 'none');
    const [customRecurrence, setCustomRecurrence] = useState(task.customRecurrence || '');

    const handleCategoryChange = (catId, isChecked) => {
        if (isChecked && !editedCategories.includes(catId)) {
            setEditedCategories(prev => [...prev, catId]);
        } else if (!isChecked && editedCategories.includes(catId)) {
            setEditedCategories(prev => prev.filter(id => id !== catId));
        }
    };

    const handleUpdate = () => {
        if (editedTitle.trim()) {
            const updatedTask = {
                ...task,
                title: editedTitle,
                categories: editedCategories,
                recurrence: editedRecurrence === 'custom' ? customRecurrence : editedRecurrence 
            };
            dispatch(updateTask(task.id, updatedTask));
            setIsEditing(false);
        }
    };

    const handleCompletion = () => {
        dispatch(completeTask(task.id));
    };

    return (
        <div className="list-group-item d-flex justify-content-between align-items-center">
            {isEditing ? (
                <>
                    <div>
                        <input 
                            type="text"
                            className="form-control mb-2"
                            value={editedTitle}
                            onChange={e => setEditedTitle(e.target.value)}
                        />
                        <div className="mb-2">
                            <select value={editedRecurrence} onChange={e => setEditedRecurrence(e.target.value)}>
                                <option value="none">No Recurrence</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                        {editedRecurrence === 'custom' && (
                            <div className="mb-2">
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={customRecurrence} 
                                    onChange={e => setCustomRecurrence(e.target.value)}
                                    placeholder="Enter custom interval..."
                                />
                            </div>
                        )}
                        {allCategories && allCategories.map(category => (
                            <div key={category.id} className="form-check">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    id={`category-${category.id}`}
                                    checked={editedCategories.includes(category.id)}
                                    onChange={e => handleCategoryChange(category.id, e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor={`category-${category.id}`}>
                                    {category.title}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div>
                        <button className="btn btn-outline-dark btn-sm me-2" onClick={handleUpdate}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => dispatch(deleteTask(task.id))}>Delete</button>
                </>
            ) : (
                <>
                    <div>
                        <small> {task.Creator.Username} </small>
                        <p>{task.title}</p>
                        <small className="text-muted">
                            {task.categories && task.categories
                                .map(catId => 
                                    allCategories ? allCategories.find(category => category.id === catId)?.title || 'Unknown' : 'Unknown'
                                )
                                .join(', ')
                            }
                            {task.recurrence && <span> (Recurs: {task.recurrence === 'custom' ? task.customRecurrence : task.recurrence})</span>}
                        </small>
                    </div>
                    <div>
                        {task.completed ? (
                            <span className="btn btn-outline-dark" style={{backgroundColor: 'transparent', cursor: 'default', borderColor: 'transparent', color: 'black'}}>Completed</span>
                        ) : (
                            <button className="btn btn-outline-dark btn-sm me-2" onClick={handleCompletion}>Complete</button>
                        )}
                        
                        <button className="btn btn-outline-dark btn-sm me-2" onClick={() => setIsEditing(true)}>Edit</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskItem;
