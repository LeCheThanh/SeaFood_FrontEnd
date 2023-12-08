import React, { useState } from 'react';
import AdminApiService from '../../service/AdminApiService';
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
 import './login.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await AdminApiService.loginAdmin({
        email: email,
        password: password
      });

      // Lưu token vào header
      if (response && response.data && response.data.token) {
        const token = response.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Kiểm tra phản hồi từ server và thực hiện các hành động tương ứng
    } else {
        throw new Error('Phản hồi không hợp lệ');
      }
      // Ví dụ: chuyển hướng đến trang quản trị

    } catch (error) {
      toast.error(error.response.data.message, { position: "top-right" });
    }
  };

  return (
    <div className='container-fluid min-vh-100 main-bg '>
    {/* <h4>Đăng nhập quản trị viên</h4>
    <div className='row justify-content-center mt-5'>
      <div className='col-lg-4 col-md-6 col-sm-6'>
        <div className='card-shadow'>
        </div>
        <div className='card-body'>
          {errorMessage && <p>{errorMessage}</p>}
          <form onSubmit={handleLogin}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Mật khẩu:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Đăng nhập</button>
          </form> 
          <ToastContainer />
          </div>
      </div>
    </div> */}
    <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-4 col-md-6 col-sm-6">
        <div class="card shadow mt-5">
          <div class="card-title text-center border-bottom">
            <h2 class="p-3">Login Admin</h2>
          </div>
          <div class="card-body">
            <form onSubmit={handleLogin}>
              <div class="mb-4">
                <label for="username" class="form-label">Email</label>
                <input type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='form-control'
                 />
              </div>
              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input   type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='form-control'
                />
              </div>
              <div class="d-grid">
                <button type="submit" class="btn text-light main-bg">Đăng nhập</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer />
  </div>
    </div>
  );
};

export default AdminLogin;