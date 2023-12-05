import React, { useState,useEffect } from 'react'
import AdminApiService from '../../../service/AdminApiService';
import Sidebar from '../Sidebar'
import Nav from '../Nav'
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
function CreateUser() {
    const [toggle, setToggle] = useState(true);
    const Toggle = ()=>{
        setToggle(!toggle);
    }
    const[userRequest,setUserRequest] = useState({
        email:'',
        password:'',
        wholeSale:false,
        roles: []
    });
    const [listRole,setListRole] = useState([]);
    useEffect(()=>{
        const fetchCategories = async () => {
            try {
              const response = await AdminApiService.getAllRole();
              setListRole(response.data); 
            } catch (error) {
              console.error(error);
            }
          };
          fetchCategories();
        }, []);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        if (name === 'roles') {
          if (checked) {
            setUserRequest((prevUserRequest) => ({
              ...prevUserRequest,
              roles: [...prevUserRequest.roles, value],
            }));
          } else {
            setUserRequest((prevUserRequest) => ({
              ...prevUserRequest,
              roles: prevUserRequest.roles.filter((role) => role !== value),
            }));
          }
        } else if (name === 'wholeSale') {
          setUserRequest((prevUserRequest) => ({
            ...prevUserRequest,
            wholeSale: checked,
          }));
        } else {
          setUserRequest((prevUserRequest) => ({
            ...prevUserRequest,
            [name]: value,
          }));
        }
       
      };
      
      console.log(userRequest);
      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response =  await AdminApiService.createUser(userRequest);
          console.log(response.data);
          toast.success("Thêm user thành công", { position: "top-right" });
          setTimeout(() => {
            window.location.href = '/admin/users';
          }, 2000); 
        } catch (error) {
          console.error(error);
          toast.error(error.response.data, { position: "top-right" });
          // Xử lý lỗi từ server
        }
      };
  return (
    <div className='container-fluid bg-secondary min-vh-100'>
    <div className='row'>
       {toggle && <div className='col-4 col-md-2 bg-white vh-100 position-fixed'>
            <Sidebar></Sidebar>
        </div>}
        {toggle && <div className='col-4 col-md-2'></div>}
        <div className='col'>
            <div className='px3'>
                <Nav Toggle={Toggle}></Nav>
                <div className='container-fluid'>
                    <div className='row g-3 my-2'>
                    </div>
                </div>
              <div className='container col-sm-8 col-sm-offset-2 bg-white rounded'>
                <h3 className='text-center'>Thêm user</h3>
                <form onSubmit={handleSubmit} className='pad-bg' >
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input className="form-control" id="email" name="email"  value={userRequest.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">password</label>
                      <input  className="form-control" id="password" type='password' name="password" required value={userRequest.password} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="wholeSale" className="form-label">Mua sỉ</label>
                      <input className='m-3' type="checkbox" id="wholeSale" name="wholeSale" value={userRequest.wholeSale} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="roles" className="form-label">Chọn quyền</label>
                                {listRole && listRole.map((role) => (
                                    <div key={role.id}>
                                        <label>
                                        <input
                                        name='roles'
                                            type="checkbox"
                                            value={role.name}
                                            onChange={handleChange}
                                        />
                                        {role.name}
                                        </label>
                                    </div>
                                    ))}
                    </div>
                  <button type="submit" className="btn btn-primary w-100">Thêm</button>
                  <div className='mt-3'>
                  <Link to='/admin/users'>
                            <button type="button" class="btn btn-dark">Quay lại</button>
                  </Link>
                  </div>
                </form>
                <ToastContainer /> {/* Đây là nơi hiển thị toast */}
                </div>
            </div>
            <div className='row px-3 justify-content-center'>
            <hr />
          </div>
        </div>
    </div>
    
</div>
  )
}

export default CreateUser