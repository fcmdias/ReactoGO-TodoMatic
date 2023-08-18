import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = { title, completed };
    onAddTask(newTask);
    setTitle('');
    setCompleted(false);
  };

  return (
    <div>
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <label>
          Completed:
          <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
        </label>
        <br />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
