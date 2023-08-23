import React, {useState, useEffect} from 'react';
import './App.css';
import TaskList from './Task/List';
import TaskForm from './Task/Create';
import CategoryList from './Category/List';
import CategoryForm from './Category/Create';


function App() {

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/todo-api/categories');
      console.log(response)
      const data = await response.json();
      if (data != null) {
        setCategories(data);
      }
    } catch (error) {

      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await fetch('/todo-api/categories/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
      const data = await response.json();
      setCategories([...categories, data]);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  
  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/todo-api/categories/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedCategories = categories.filter(category => category.id !== id);
        setCategories(updatedCategories);
      } else {
        console.error('Error deleting category:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/todo-api/tasks');
      console.log(response)
      const data = await response.json();
      if (data != null) {
        setTasks(data);
      }
    } catch (error) {

      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const response = await fetch('/todo-api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await fetch(`/todo-api/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {completed: true},
      });
      if (response.ok) {
        const updatedTasks = tasks.map(task =>
          task.id === taskId ? { ...task, completed: true } : task
        );
        setTasks(updatedTasks);
      } else {
        console.error('Error completing task:', response.statusText);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/todo-api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
      } else {
        console.error('Error deleting task:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };



  const handleUpdateTaskCategories = async (taskId, selectedCategories) => {
    try {
      // Update the categories for the task
      await fetch(`/todo-api/tasks/${taskId}/categories`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: selectedCategories }),
      });
  
      // Update the UI by fetching tasks again
      fetchTasks();
    } catch (error) {
      console.error('Error updating task categories:', error);
    }
  };



  return (
    <div className="App">


      <div className='container'>
        <h1>Task Dashboard</h1>

        <div className="row">



        <div className="col-md-6">
          <h2>Tasks</h2>
          <TaskList
            tasks={tasks}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            categories = {categories}
            onUpdateTaskCategories={handleUpdateTaskCategories}
          />
          <TaskForm onAddTask={handleAddTask} />
        </div>



        <div className="col-md-6">
          <h2>Categories</h2>
          <CategoryList
            categories={categories}
            onDelete={handleDeleteCategory}
          />
          <CategoryForm onAddCategory={handleAddCategory} />
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
