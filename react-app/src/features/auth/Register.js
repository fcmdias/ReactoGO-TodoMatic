import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from './actions';

const Register = () => {

    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.auth.isLoading);
    const error = useSelector(state => state.auth.error);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        dispatch(registerUser(username, email, password));
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Register</h2>
            {isLoading && <div className="alert alert-info mb-4">Loading...</div>}
            {error && <div className="alert alert-danger mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <input 
                        id="username"
                        type="text" 
                        className="form-control" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>
                <div className="form-group mb-3">
                    <input 
                        id="email"
                        type="email" 
                        className="form-control"
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>
                <div className="form-group mb-3">
                    <input 
                        id="password"
                        type="password" 
                        className="form-control"
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>
                <div className="form-group mb-3">
                    <input 
                        id="confirmPassword"
                        type="password" 
                        className="form-control"
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                    />
                </div>
                <button type="submit" className="btn btn-outline-dark">Register</button>
            </form>
        </div>
    );
};

export default Register;
