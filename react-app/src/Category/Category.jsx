import React from 'react';

const Category = ({ category, onDelete }) => {
  return (
    <li key={category.id}>
      {category.title}
      <button onClick={() => onDelete(category.id)}>Delete</button>
    </li>
  );
};

export default Category;
