import React from 'react';
import './App.css';
import TaskList from './features/tasks/TasksList';
import TaskCreate from './features/tasks/TaskCreate';

function App() {
  return (
    <div className="App">
      <h1>Tasks</h1>
      <TaskCreate/>
      <TaskList />
    </div>
  );
}

export default App;
