import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/actions';


const Sidebar = ({ setSection, currentSection }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const handleLogout = () => {
        // to make an API call to invalidate a session or token

        // Clear local storage or cookies
        localStorage.removeItem('userToken');

        // Update the Redux state
        dispatch(logoutUser());
        

        // Redirect or set section to login
        setSection('login');
    };


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

            {isAuthenticated ? (
                <button onClick={handleLogout}>
                    Logout
                </button>
            ) : (
                <>
                    <button 
                        className={`nav-link ${currentSection === 'login' && 'active'}`}
                        onClick={() => setSection('login')}>Login</button>
                    <button onClick={() => setSection('register')}>Register</button>
                </>
            )}
        </div>
    );
};

export default Sidebar;
