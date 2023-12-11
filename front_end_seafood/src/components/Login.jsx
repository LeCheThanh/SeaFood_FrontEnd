import React, { useEffect, useState } from 'react'
import { loginUser } from '../redux/apiRequest';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';

function Login() {
    const user = useSelector((state)=>state.auth.login?.currentUser);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
      if(user){
        navigate("/");
      }
    })
    const handleLogin = (e) =>{
        e.preventDefault();
        const newUser = {
            email: email,
            password: password
        }
        loginUser(newUser, dispatch,navigate);
    }
  return (
  <div className="container mt-5">
  <div className="row justify-content-center">
    <div className="col-md-6">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center">Đăng nhập</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input className="form-control" id="email" name="email"  
               value={email}
               onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mật khẩu</label>
              <input type="password" className="form-control" id="password" name="password" required 
             value={password}
             onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
          </form>
          <div className="mt-3">
            <p className="text-center">Chưa có tài khoản? <Link to="/register">Đăng kí</Link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ToastContainer /> {/* Đây là nơi hiển thị toast */}
</div>
  )
}

export default Login