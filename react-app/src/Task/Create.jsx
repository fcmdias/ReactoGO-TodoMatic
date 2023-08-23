import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = { title, completed };
    onAddTask(newTask);
    setTitle('');
    setCompleted(false);
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
            data-target="#taskForm"
            aria-expanded={formVisible}
          >
            {formVisible ? 'Cancel' : 'Create New Task'}
          </button>
        </div>
        <div className={`collapse ${formVisible ? 'show' : ''}`} id="taskForm">
          <div className="card-body">
            <form onSubmit={handleSubmit}>


              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="taskTitle">Title:</label>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="form-check">
                  <input
                      type="text"
                      className="form-control"
                      id="taskTitle"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>


              <div className="row">
                <div className="col-md-3">
                <div className="form-check">
                    <input
                      type="checkbox"
                      className="btn-check"
                      id="taskCompleted"
                      checked={completed}
                      onChange={(e) => setCompleted(e.target.checked)}
                    />
                    <label className="btn btn-outline-secondary btn-sm" htmlFor="taskCompleted">
                      Completed
                    </label>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-success">Create Task</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
