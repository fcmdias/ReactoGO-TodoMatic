import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from './actions';
import { fetchCategories } from '../categories/actions';
import TaskItem from './Item';  // Import the new TaskItem component

const TaskList = () => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks.tasks) || [];
    const categories = useSelector(state => state.categories.categories) || [];
    const [filter, setFilter] = useState("All");

    const filteredTasks = filter === "All" 
    ? tasks 
    : tasks.filter(task => task.categories.includes(filter));

    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="list-group mt-3">

            {/* Dropdown filter */}
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option key="All" value="All">
                    All
                </option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.title}
                    </option>
                ))}
            </select>


            {filteredTasks && filteredTasks.length > 0 ? filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} /> 
            )): 'No Tasks Available.'}
        </div>
    );
};

export default TaskList;
