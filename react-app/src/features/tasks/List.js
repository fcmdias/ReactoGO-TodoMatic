import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from './actions';
import TaskItem from './TaskItem';  // Import the new TaskItem component

const TaskList = () => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    return (
        <div className="list-group mt-3">
            {tasks.map(task => (
                <TaskItem key={task.id} task={task} />  // Use TaskItem component here
            ))}
        </div>
    );
};

export default TaskList;