import React from 'react';

const Sidebar = ({ setSection }) => {
    return (
        <div className="list-group">
            <button className="list-group-item list-group-item-action" onClick={() => setSection('home')}>Home</button>
            <button className="list-group-item list-group-item-action" onClick={() => setSection('tasks')}>Tasks</button>
            <button className="list-group-item list-group-item-action" onClick={() => setSection('categories')}>Categories</button>
        </div>
    );
};

export default Sidebar;