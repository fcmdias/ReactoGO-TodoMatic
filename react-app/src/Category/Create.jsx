import React, { useState } from 'react';

const CategoryForm = ({ onAddCategory }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCategory = { title };
    onAddCategory(newCategory);
    setTitle('');
  };

  return (
    <div>
      <h2>Create New Category</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <br />
        <button type="submit">Create Category</button>
      </form>
    </div>
  );
};

export default CategoryForm;
