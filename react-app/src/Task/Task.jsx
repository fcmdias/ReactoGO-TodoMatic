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
    <li className="list-group-item d-flex justify-content-between align-items-start" key={task.id}>
      <div className="col-9">
        <span>{task.title} - {task.completed ? 'Completed' : 'Pending'}</span>
        <div className="mt-2">
          {categories && categories.length > 0 && (
            <div>
              <strong>Categories:</strong>
              {categories.map(category => (
                <label className="mr-2" key={category.id}>
                  <input
                    type="checkbox"
                    value={category.id}
                    checked={checkedCategories.includes(category.id)}
                    onChange={() => handleCheckboxChange(category.id)}
                    className="btn-check"
                  />
                  <button
                    className={`btn btn-sm ${checkedCategories.includes(category.id) ? 'btn-dark' : 'btn-outline-secondary'}`}
                    onClick={() => handleCheckboxChange(category.id)}
                  >
                    {category.title}
                  </button>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="col-3">
        {!task.completed && (
          <button className="btn btn-success mb-2" onClick={() => onComplete(task.id)}>
            Complete
          </button>
        )}
        <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  );

};

export default Task;
