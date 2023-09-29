import React, {useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, setCategoryFilter } from './actions';
import { fetchCategories } from '../categories/actions';
import TaskItem from './Item';  // Import the new TaskItem component

const TaskList = () => {
    const dispatch = useDispatch();
    // const tasks = useSelector(state => state.tasks.tasks) || [];
    const filteredTasks = useSelector(state => state.tasks.filteredTasks) || [];
    const categoryFilter = useSelector(state => state.tasks.categoryFilter) || "All";
    const categories = useSelector(state => state.categories.categories) || [];


    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="list-group mt-3">

            <select value={categoryFilter} onChange={(e) => dispatch(setCategoryFilter(e.target.value))}>
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
