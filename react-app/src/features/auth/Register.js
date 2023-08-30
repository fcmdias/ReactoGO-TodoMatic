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
            <h2 className="mb-3">Register</h2>
            {isLoading && <div className="alert alert-info">Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        className="form-control"
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        className="form-control"
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="email" 
                        className="form-control"
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;
