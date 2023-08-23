import React from 'react';

const Category = ({ category, onDelete }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center" key={category.id}>
      {category.title}
      <button className="btn btn-danger" onClick={() => onDelete(category.id)}>Delete</button>
    </li>
  );
};

export default Category;
