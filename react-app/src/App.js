import React, { useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import { useDispatch } from 'react-redux';
import { loginSuccessAction, logoutUser } from './features/auth/actions'; 
import Cookies from 'js-cookie';


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const isTokenExpired = (token) => {
      try {
          const { exp } = JSON.parse(atob(token.split('.')[1]));
          return exp < (Date.now() / 1000); // Convert current time to Unix timestamp
      } catch (e) {
          return true; // If there's an error, consider the token invalid
      }
  }
    const token = Cookies.get('auth_token');
    if (token) {
      if (isTokenExpired(token)) {
        dispatch(logoutUser);
      } else {
        dispatch(loginSuccessAction(token));
      }
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
