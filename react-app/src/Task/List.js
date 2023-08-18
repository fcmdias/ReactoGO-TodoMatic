import React from 'react';
import Task from './Task';

const TaskList = ({ tasks, onComplete, onDelete, categories, onUpdateTaskCategories }) => {
  return (
    <div>
      <h2>Task List</h2>
      {!tasks || tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <Task
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
              categories={categories}
              onUpdateTaskCategories={onUpdateTaskCategories}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
