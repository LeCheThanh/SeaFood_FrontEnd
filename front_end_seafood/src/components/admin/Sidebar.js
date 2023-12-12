import React,{useState,useEffect} from 'react'
import './style.css'
import { Link, useNavigate  } from "react-router-dom";
import UserApiService from '../../service/UserApiService';
import axios from 'axios';

function Sidebar() {
    const [name,setName]=useState('');
    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchUser = async () => {
          try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await UserApiService.getUser();
            setName(response.data.fullName);
            console.log(response);
          } catch (error) {
            // Xử lý lỗi
          }
        };
      
        fetchUser();
      }, []); // Dependency array trống để chỉ chạy một lần khi component được tạo
      const navigate = useNavigate(); 
        const handleLogout = () => {
          // Xóa token khỏi lưu trữ
          localStorage.removeItem('token');
      
          // Điều hướng đến trang đăng nhập
          navigate('/admin/login')
        }
      
  return (
    
    <div className='bg-white sidebar'>
        <div className='m-2'>
            <i className='bi bi-bootstrap-fill me-2 fs-4'></i>
            <span className='brand-name fs-4'>PTseaFood</span>
        </div>
        <hr className='text-dark' />
          
      
        
        <div className='list-group list-group-flush'>
        {name && (
            <>
                <div className='list-group-item list-group-item py-2'>
                <span>Hello, {name}</span>
                </div>
            </>
            )}
            <Link className='list-group-item list-group-item py-2' to='/admin/dashboard'>
                <i className='bi bi-speedometer2 fs-5 me-3'></i>
                <span>Dashboard</span>
            </Link>
        
            <Link className='list-group-item list-group-item py-2' to='/admin/products'>
                <i className='bi bi-table fs-5 me-3'></i>
                <span>Products</span>
            </Link>
            <Link className='list-group-item list-group-item py-2' to='/admin/categories'>
                <i className='bi bi-list-ul fs-5 me-3'></i>
                <span>Categories</span>
            </Link>
            <Link className='list-group-item list-group-item py-2' to='/admin/orders'>
                <i className='bi bi-receipt fs-5 me-3'></i>
                <span>Orders</span>
            </Link>
            <Link className='list-group-item list-group-item py-2' to='/admin/users'>
                <i className='bi bi-people-fill fs-5 me-3'></i>
                <span>Users</span>
            </Link>
            <Link className='list-group-item list-group-item py-2' to='/admin/revenue'>
                <i className='bi bi-graph-up-arrow fs-5 me-3'></i>
                <span>Revenue</span>
            </Link>
            <a className='list-group-item list-group-item py-2' onClick={handleLogout}>
                <i className='bi bi-power fs-5 me-3'></i>
                <span>Logout</span>
            </a>
        </div>
    </div>
  )
}

export default Sidebar