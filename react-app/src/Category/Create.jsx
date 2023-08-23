import React, { useState } from 'react';

const CategoryForm = ({ onAddCategory }) => {
  const [title, setTitle] = useState('');
  const [formVisible, setFormVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCategory = { title };
    onAddCategory(newCategory);
    setTitle('');
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <button
            className="btn btn-dark"
            onClick={() => setFormVisible(!formVisible)}
            type="button"
            data-toggle="collapse"
            data-target="#categoryForm"
            aria-expanded={formVisible}
          >
            {formVisible ? 'Cancel' : 'Create New Category'}
          </button>
        </div>
        <div className={`collapse ${formVisible ? 'show' : ''}`} id="categoryForm">
          <div className="card-body">
            <form onSubmit={handleSubmit}>

            <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="categoryTitle">Title:</label>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="form-check">
                  <input
                      type="text"
                      className="form-control"
                      id="categoryTitle"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-success">Create Category</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
