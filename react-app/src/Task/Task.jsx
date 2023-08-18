import React, { useState } from 'react';

const Task = ({ task, onComplete, onDelete, categories, onUpdateTaskCategories }) => {


  const [checkedCategories, setCheckedCategories] = useState(task.categories);

  const handleCheckboxChange = async (categoryId) => {
    try {

      const updatedCheckedCategories = checkedCategories.includes(categoryId)
          ? checkedCategories.filter(id => id !== categoryId)
          : [...checkedCategories, categoryId];


      const response = await fetch(`/todo-api/tasks/${task.id}/categories`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: updatedCheckedCategories }),
      }); 


      if (!response.ok) {
        // Handle API error
        console.log(response)
        return;
      }

      setCheckedCategories(updatedCheckedCategories)
    } catch (error) {
      // Handle error
      console.log(error)
    }

  };


  return (
    <li key={task.id}>
      {task.title} - {task.completed ? 'Completed' : 'Pending'}
      {!task.completed && (
        <>
          <button onClick={() => onComplete(task.id)}>Complete</button>
        </>
      )}
      <button onClick={() => onDelete(task.id)}>Delete</button>
      <div>
        Categories:
        {categories.map(category => (
          <label key={category.id}>
            <input
              type="checkbox"
              value={category.id}
              checked={checkedCategories.includes(category.id)}
              onChange={() => handleCheckboxChange(category.id)}
            />
            {category.title}
          </label>
        ))}
      </div>
    </li>
  );
};

export default Task;
