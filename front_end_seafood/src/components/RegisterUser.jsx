import React, { useState } from "react";
import userApiService from "../service/UserApiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast styles
import 'bootstrap/dist/css/bootstrap.min.css';
const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword:"",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Gửi yêu cầu đăng ký lên server
    userApiService.register(formData)
      .then((response) => {
        // Xử lý phản hồi thành công từ server
        setMessage(response.data);
        // Hiển thị toast thành công
        toast.success(response.data, { position: "top-right" });
       // Chờ 5 giây rồi thực hiện chuyển hướng
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000); 
      })
      .catch((error) => {
        // Xử lý lỗi từ server
        setMessage(error.response.data);
           // Hiển thị toast lỗi
           toast.error(error.response.data, { position: "top-right" });
      });
  };
  return (
    <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center">Đăng ký</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input className="form-control" id="email" name="email"  value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Mật khẩu</label>
                <input type="password" className="form-control" id="password" name="password" required value={formData.password} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label" >Xác nhận mật khẩu</label>
                <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary w-100">Đăng ký</button>
            </form>
            <div className="mt-3">
              <p className="text-center">Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer /> {/* Đây là nơi hiển thị toast */}
  </div>
  );
};

export default Register;