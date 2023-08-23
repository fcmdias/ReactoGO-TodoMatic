import React from 'react';
import Task from './Task';

const TaskList = ({ tasks, onComplete, onDelete, categories, onUpdateTaskCategories }) => {


  const example = {id: "1232", title: "example", completed: false, categories:[]}
  return (
    <div className="container">
      <ul className="list-group">
        <Task
          key={example.id}
          task={example}
          onComplete={onComplete}
          onDelete={onDelete}
          categories={categories}
          onUpdateTaskCategories={onUpdateTaskCategories}
        />
      </ul>
        
        
        

      
      {!tasks || tasks.length === 0 ? (
        <p>No tasks available.</p>
        ) : (
          <ul className="list-group">
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
