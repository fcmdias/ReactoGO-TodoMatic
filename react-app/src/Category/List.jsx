import React from 'react';
import Category from './Category';

const CategoryList = ({ categories, onDelete }) => {
  return (
    <div>
      <h2>Category List</h2>
      {!categories || categories.length === 0 ? (
        <p>No categories available.</p>
      ) : (
        <ul>
          {categories.map(category => (
            <Category
              key={category.id}
              category={category}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;
