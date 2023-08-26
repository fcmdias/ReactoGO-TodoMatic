import React from 'react';

const Sidebar = ({ setSection, currentSection }) => {
    return (
        <div className="nav nav-pills flex-column">
            <button 
                className={`nav-link ${currentSection === 'home' ? 'active' : ''}`} 
                onClick={() => setSection('home')}
            >
                Home
            </button>
        
        
            <button 
                className={`nav-link ${currentSection === 'tasks' && 'active'}`}
                onClick={() => setSection('tasks')}
            >
                Tasks
            </button>
        
        
            <button 
                className={`nav-link ${currentSection === 'categories' && 'active'}`}
                onClick={() => setSection('categories')}
            >
                Categories
            </button>
        </div>
    );
};

export default Sidebar;
