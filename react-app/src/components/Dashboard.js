import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import TaskList from '../features/tasks/List';
import TaskCreate from '../features/tasks/Add';
import CategoryCreate from '../features/categories/Add';
import CategoryList from '../features/categories/List';
import { useSelector } from 'react-redux';


const Dashboard = () => {
    const [section, setSection] = useState('');
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            setSection('tasks');
        } else {
            setSection('login');
        }
    }, [isAuthenticated]);


    const renderSection = () => {
        switch (section) {
            case 'login':
                return <Login />;
            case 'register':
                return <Register />;

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