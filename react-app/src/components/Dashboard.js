import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TaskList from '../features/tasks/List';
import TaskCreate from '../features/tasks/Add';
import CategoryCreate from '../features/categories/Add';
import CategoryList from '../features/categories/List';

const Dashboard = () => {
    const [section, setSection] = useState('home');

    const renderSection = () => {
        switch (section) {
            case 'tasks':
                return (
                    <div>
                        <TaskList />
                        <TaskCreate />
                    </div>
                );
            case 'categories':
                return (
                    <div>
                        <CategoryList />
                        <CategoryCreate />
                    </div>
                );
            case 'home':
            default:
                return <h2>Welcome to the Dashboard</h2>;
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-3">
                    <Sidebar setSection={setSection} currentSection={section} />
                </div>
                <div className="col-md-9">
                    {renderSection()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;