import React, { useEffect } from 'react';
import { fetchUsers } from './actions';
import { useDispatch, useSelector } from 'react-redux';


const  UserList = () =>{
  const dispatch = useDispatch();
  const userData = useSelector(state => state.users) || [];


  useEffect(() => {
    dispatch(fetchUsers());
}, [dispatch]);

  return (
    <div>
      {userData.loading && <p>Loading...</p>}
      {userData.error && <p>{userData.error}</p>}
      {userData.users && (
        <ul>
          {userData.users.map(user => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
