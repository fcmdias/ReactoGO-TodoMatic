import React, { useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import { useDispatch } from 'react-redux';
import { loginSuccessAction } from './features/auth/actions'; 
import Cookies from 'js-cookie';


function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
        dispatch(loginSuccessAction(token));
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
