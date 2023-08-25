import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask } from './tasksActions';

const TaskList = () => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    return (
        <div>
            {tasks.map(task => (
                <div key={task.id}>
                    {task.title}
                    <button onClick={() => dispatch(deleteTask(task.id))}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
