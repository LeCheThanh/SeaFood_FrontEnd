import React, { useState } from 'react'
import { loginUser } from '../redux/apiRequest';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";


function Login() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = (e) =>{
        e.preventDefault();
        const newUser = {
            email: email,
            password: password
        }
        loginUser(newUser, dispatch,navigate);
    }
  return (
    <div> <form onSubmit={handleLogin}>
    <div>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
    <button type="submit">Đăng nhập</button>
  </form>
  <ToastContainer></ToastContainer></div>
  )
}

export default Login