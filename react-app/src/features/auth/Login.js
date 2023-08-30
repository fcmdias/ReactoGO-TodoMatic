import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from './actions'; 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser(username, password));
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-3">Login</h2> 
            <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                    <input 
                        type="text" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        placeholder="Username"
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-3">
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="Password"
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
