import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/actions';

const Sidebar = ({ setSection, currentSection }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const handleLogout = () => {
        // TODO: make an API call to invalidate a session or token

        // Update the Redux state
        dispatch(logoutUser());

        // Redirect or set section to login
        setSection('login');
    };

    return (
        <div className="nav nav-pills flex-column p-3">
        
            <button 
                className={`btn ${currentSection === 'tasks' ? 'btn-primary' : 'btn-outline-primary'} w-100 mb-2`}
                onClick={() => setSection('tasks')}
            >
                Tasks
            </button>

            <button 
                className={`btn ${currentSection === 'categories' ? 'btn-primary' : 'btn-outline-primary'} w-100 mb-2`}
                onClick={() => setSection('categories')}
            >
                Categories
            </button>

            <hr className="my-3" />

            {isAuthenticated ? (
                <button 
                    className="btn btn-outline-danger w-100"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            ) : (
                <>
                    <button 
                        className={`btn ${currentSection === 'login' ? 'btn-primary' : 'btn-outline-primary'} w-100 mb-2`}
                        onClick={() => setSection('login')}
                    >
                        Login
                    </button>
                    <button 
                        className={`btn ${currentSection === 'register' ? 'btn-primary' : 'btn-outline-primary'} w-100 mb-2`}
                        onClick={() => setSection('register')}
                    >
                        Register
                    </button>
                </>
            )}
        </div>
    );
};

export default Sidebar;
