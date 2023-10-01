import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, setCategoryFilter } from './actions';
import { fetchCategories } from '../categories/actions';
import TaskItem from './Item';

const TaskList = () => {
    const dispatch = useDispatch();
    const filteredTasks = useSelector(state => state.tasks.filteredTasks) || [];
    const categoryFilter = useSelector(state => state.tasks.categoryFilter) || "All";
    const categories = useSelector(state => state.categories.categories) || [];

    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="list-group mt-3">
            <button
                className={`btn ${categoryFilter === 'All' ? 'btn-dark' : 'btn-outline-dark'} w-100 mb-2`}
                onClick={() => dispatch(setCategoryFilter('All'))}
            >
                All
            </button>
            {categories.map(category => (
                <button 
                    key={category.id} 
                    className={`btn ${categoryFilter === category.id ? 'btn-dark' : 'btn-outline-dark'} w-100 mb-2`}
                    onClick={() => dispatch(setCategoryFilter(category.id))}
                >
                    {category.title}
                </button>
            ))}

            {filteredTasks && filteredTasks.length > 0 ? filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} /> 
            )): 'No Tasks Available.'}
        </div>
    );
};

export default TaskList;
