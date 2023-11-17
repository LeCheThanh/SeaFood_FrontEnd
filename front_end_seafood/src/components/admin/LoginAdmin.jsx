import React, { useState } from 'react';
import AdminApiService from '../../service/AdminApiService';
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';

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
    <div>
      <ToastContainer />
      <h1>Đăng nhập quản trị viên</h1>
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
    </div>
  );
};

export default AdminLogin;