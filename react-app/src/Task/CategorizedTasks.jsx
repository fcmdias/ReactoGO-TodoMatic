import React from 'react';
import TaskList from '../Task/List';

const CategorizedTasks = ({ tasks, categories, handleCompleteTask, handleDeleteTask, handleUpdateTaskCategories }) => {  
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.title}</h2>
          <TaskList
            tasks={tasks.filter(task => task.categories.includes(category.id))}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            categories={categories}
            onUpdateTaskCategories={handleUpdateTaskCategories}
            />
        </div>
      ))}
      </div>
  );
};

export default CategorizedTasks;
