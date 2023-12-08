import React, { useEffect, useState } from 'react'
import AdminApiService from '../../../service/AdminApiService';
import Sidebar from '../Sidebar';
import Nav from '../Nav';
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatCurrency } from '../../../utils/formatCurrency';
import { Button, Modal } from 'react-bootstrap';


function Users() {
    const [toggle, setToggle] = useState(true);
    const Toggle = ()=>{
        setToggle(!toggle);
    }
    const[users,setUsers] = useState([]);
    useEffect(()=>{
        AdminApiService.getAllUser()
        .then(response => {
            setUsers(response.data);
            console.log(response.data);
        })
        .catch(error => console.log(error));
      },[])
    const updateWholeSale = true;
    const recallWholeSale = false;
    const handleUpdateWholeSale = async (id,request)=>{
        try{
            const response = await AdminApiService.updateWholeSale(id,request);
            toast.success("Cập nhật trạng thái thành công!", { position: "top-right" })
            const updatedUser = response.data;
            setUsers(prevUsers => {
              const updatedUsers = prevUsers.map(user => {
                if (user.id === updatedUser.id) {
                  return updatedUser;
                }
                return user;
              });
              return updatedUsers;
            });
                 
        }catch(error){
            toast.error("Cập nhật trạng thái thất bại!", { position: "top-right" })
        }
    }
    const confirmUpdate = (id,request)=>{
        if (window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái user này?")) {
            handleUpdateWholeSale(id,request)
          }
    }
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
    const [userData, setUserData]= useState({});
    const getUser = async(id)=>{
        try{
            const response = await AdminApiService.getUserById(id);
            setUserData(response.data);
            openModal();
        }catch(error){
            console.log(error);
        }
    }
    const [showModal, setShowModal] = useState(false);
    const openModal = () =>{
        setShowModal(true);
        }
    const closeModal = () => {
        setShowModal(false);
        };

    const [selectedRoles, setSelectedRoles] = useState(userData.roles || []);
    console.log(userData.roles)
    const handleRoleChange = (event) => {
        const roleName = event.target.value;
        const isChecked = event.target.checked;
      
        setSelectedRoles((prevSelectedRoles) => {
          if (isChecked) {
            return [...prevSelectedRoles, roleName];
          } else {
            return prevSelectedRoles.filter((role) => role !== roleName);
          }
        });
      };
    
      const handleUpdateRoles = (email, event) => {
        event.preventDefault();
        // Ví dụ:
        AdminApiService.updateRole(email, selectedRoles)
          .then((response) => {
            const newRoles = response.data.roles;
            const updatedUsers = users.map((user) => {
                if (user.email === email) {
                  return {
                    ...user,
                    roles: newRoles
                  };
                }
                console.log(selectedRoles);
                return user;
              });
            setUsers(updatedUsers);
            toast.success("Cập nhật quyền thành công!", { position: "top-right" })
            closeModal();
          })
          .catch((error) => {
            // Xử lý lỗi (nếu có)
          });
      };
      const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
      const [ordersPerPage] = useState(10); // Số lượng đơn hàng trên mỗi trang
      const indexOfLastOrder = currentPage * ordersPerPage;
      const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
      const currentUsers = users.slice(indexOfFirstOrder, indexOfLastOrder);
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
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Link to='/admin/user/create'>
                    <button type="button" class="btn btn-primary">Thêm người dùng</button>
                    </Link>
                    </div>
                    {users && users.length > 0 ? (
                        <div>
                          <table className='table caption-top bg-white rounded mt-2' style={{ verticalAlign: 'middle' }}>
                                <caption className='text-white fs-4'>Danh sách tài khoản</caption>
                                <thead className="text-center">
                                    <tr>
                                    <th scope='col'>STT</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Tên đầy đủ</th>
                                    <th scope="col">Provider</th>
                                    <th scope="col">Tổng mua</th>
                                    <th scope="col">Mua sỉ</th>
                                    <th scope="col">Rank</th>
                                    <th scope="col">Roles</th>
                                    <th scope="col">Giảm giá</th>
                                    <th scope="col">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {currentUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{user.email}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.provider}</td>
                                        <td>{formatCurrency(user.totalPurchaseAmount,'VND')}</td>
                                        <td>{user.wholeSale  ? (
                                            <button type="button" class="btn btn-outline-success" onClick={()=>confirmUpdate(user.id,recallWholeSale)}>
                                                <i class="bi bi-check-circle"></i>
                                            </button>
                                        ):(
                                            <button type="button" class="btn btn-outline-danger" onClick={()=>confirmUpdate(user.id,updateWholeSale)}>
                                                    <i class="bi bi-x-circle"></i>
                                            </button>
                                        )}   
                                            </td>
                                        <td>
                                            {user.rank}
                                        </td>
                                        <td>
                                            {user.roles.length > 0 ? (user.roles.map((role,index) => (
                                            <span key={role.id}>
                                                {role.name}
                                                {index < user.roles.length - 1 && ', '}
                                                </span>)
                                                )):(
                                                    <span>User</span>
                                                )
                                        }</td>
                                        <td>{user.discountRate}%</td>
                                        <td>
                                            <button class="btn btn-outline-primary" onClick={() => getUser(user.id)}><i class="bi bi-pencil-fill"></i></button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Hiển thị nút Previous */}
                            <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            >
                            Previous
                            </button>

                            {/* Hiển thị số trang */}
                            {Array.from({ length: Math.ceil(users.length / ordersPerPage) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                disabled={currentPage === index + 1}
                            >
                                {index + 1}
                            </button>
                            ))}

                            {/* Hiển thị nút Next */}
                            <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === Math.ceil(users.length / ordersPerPage)}
                            >
                            Next
                            </button>
                        </div>
                        ) : (
                        <p>Loading.....</p>
                        )}
                        {showModal && (
                        <Modal className="" show={showModal} onHide={closeModal}>
                          <Modal.Header closeButton>
                            {userData.email && (
                            <Modal.Title>Cập nhật quyền cho user có email: {userData.email}</Modal.Title>
                          )}
                          </Modal.Header>
                          <Modal.Body>
                          <form onSubmit={(event) => handleUpdateRoles(userData.email, event)} className='pad-bg'>
                                <h3>Chọn quyền:</h3>
                                {listRole && listRole.map((role) => (
                                    <div key={role.id}>
                                        <label>
                                        <input
                                            type="checkbox"
                                            value={role.name}
                                            defaultChecked={userData.roles.some((userRole) => userRole.name === role.name)}
                                            onChange={handleRoleChange}
                                        />
                                        {role.name}
                                        </label>
                                    </div>
                                    ))}
                                <br />
                                <button type="submit" className="btn btn-primary w-100">Cập nhật</button>
                            </form>
                          </Modal.Body>
                          <Modal.Footer>
                          </Modal.Footer>
                        </Modal>
                      )}
                      
                  </div>
                  <ToastContainer />  
            </div>
        </div>
    </div>
  )
}

export default Users