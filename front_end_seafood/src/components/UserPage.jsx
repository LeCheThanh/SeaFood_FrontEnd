import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import NavBar from './NavBarPage';
import Footer from './Footer';
import UserApiService from '../service/UserApiService';
import { useSelector } from 'react-redux';
import userimg from '../images/user1.jpg'
import { Button, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import AdminApiService from '../service/AdminApiService';

function UserPage() {
    const user = useSelector((state)=>state.auth.login?.currentUser);
    const token = user?.token;
    const [userData,setUserData] = useState({});
    const navigate = useNavigate();
    useEffect(()=>{
        if(user){
            fetchUser();
            fetchOrderByUser();
        }else{
            navigate('/login')
        }
       
    },[])
    const fetchUser = async ()=>{
        try{
            const response = await UserApiService.getUser(token)
            setUserData(response.data);
            console.log(response.data)

        }catch(err){
            console.log(err);
        }
    }
    const [activeTab, setActiveTab] = useState('home');
    const [userRequest, setUserRequest] = useState({
        fullName:'',
        phone:'',
        address:'',
    })
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserRequest((prevUserRequest) => ({
          ...prevUserRequest,
          [name]: value,
        }));
    };
      const updateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await UserApiService.updateUser(token, {
                ...userData,
                ...userRequest,
              });;
            if (response) {
                // Xử lý sau khi cập nhật thành công
                console.log("Cập nhật thành công", response);
                toast.success("Cập nhật người dùng thành công", { position: "top-right" });
                fetchUser();
                closeModal();
            }
        } catch (err) {
            toast.error("Có lỗi xảy ra!", { position: "top-right" });
            console.log(err);
        }
    };
    const [showModal, setShowModal] = useState(false);
    const openModal = () =>{
      setShowModal(true);
    }
    const closeModal = () => {
      setShowModal(false);
    }

    const [showModalDetail, setShowModalDetail] = useState(false);
    const [orders,setOrders]=useState([]);
    const closeModalDetail = () => {
        setShowModalDetail(false);
      }
    const fetchOrderByUser = async()=>{
        try{
            const response =await UserApiService.getOrderByUser(token);
            setOrders(response.data);
        }catch(err){
            console.log(err);
        }
    }
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [ordersPerPage] = useState(5); // Số lượng đơn hàng trên mỗi trang
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentProducts = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const [orderDetails,setOrderDetails] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const handleOrderDetail=async (id)=>{
        AdminApiService.getOrderDetailByOrder(id)
        .then(response=>{
          const Data = response.data;
          const detail = orders.find((order) => order.id === id);
          setSelectedOrder(detail);
          setOrderDetails(Data);
          setShowModalDetail(true);
        })
        .catch(error=>toast.error("Không có chi tiết", { position: "top-right" }));
      }
    const discountRank = ({userData})=>{
        let discount = '';

        if (userData.rank === 'Platinum') {
          discount = '20%';
        } else if (userData.rank === 'Gold') {
            discount = '15%';
        } else if (userData.rank === 'Silver') {
            discount = '10%';
        }else{
            discount = '0%';
        }
        return discount;
    }
    const discount = discountRank({ userData });
  return (
    <div>
        <NavBar></NavBar>
      <div className='w-100' style={{backgroundColor:'rgba(3, 194, 252, 0.982)',height:'30vh', color: 'white', textAlign:'center',display: 'flex', alignItems: 'center',justifyContent: 'center' ,fontSize:'30px',fontWeight:'bold'}}>
            Trang người dùng
        </div>
     <div class="container my-5">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb p-3 bg-body-tertiary rounded-3">
            <Link to={'/'} class="breadcrumb-item">Home</Link>
            <li class="breadcrumb-item active" aria-current="page">User</li>
            </ol>
        </nav>
        </div>
         <div class="container mt-5 " style={{marginBottom:'50px'}}>
         {userData &&(
            <div class="row">
                <div class="col-md-4 shadow">
                    <div class="text-center">
                        
                        <img src={userimg} alt="Hình Ảnh Người Dùng" class="img-fluid rounded-circle" style={{width: "200px" ,height: "200px"}}/>
                        <h3>{userData.fullName}</h3>
                        <p>Rank: {userData.rank}</p>
                        <p>
                        Loại: {userData.wholeSale ? "Khách mua sỉ" : "Khách bình thường"}
                        </p>
                        <p>
                        % giảm theo Rank: {discount}
                        </p>
                    </div>
                </div>
                <div class="col-md-8">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class={`nav-link ${activeTab === 'home' ? 'active' : ''}`} id="home-tab" onClick={() => setActiveTab('home')} role="tab">Thông Tin Cơ Bản</a>
                        </li>
                        <li class="nav-item">
                            <a class={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} id="profile-tab" onClick={() => setActiveTab('profile')} role="tab">Đơn Hàng</a>
                        </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class={`tab-pane fade  ${activeTab === 'home' ? 'show active' : ''}`} id="home" role="tabpanel" aria-labelledby="home-tab">
                            <p><strong>Email:</strong> {userData.email}</p>
                            <p><strong>Số Điện Thoại:</strong> {userData.phone}</p>
                            <p><strong>Địa chỉ:</strong> {userData.address}</p>
                            <button className='btn btn-outline-primary' onClick={openModal}>Sửa thông tin</button>
                </div>
                <div class={`tab-pane fade ${activeTab === 'profile' ? 'show active' : ''}`} id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    {/* Nội dung tab Đơn Hàng */}
                   {orders && orders.length > 0 ? (
                        <div>
                          <table className='table caption-top bg-white rounded mt-2' style={{ verticalAlign: 'middle' }}>
                                <caption className='text-white fs-4'>Danh sách các đơn hàng</caption>
                                <thead className="text-center">
                                    <tr>
                                    <th scope='col'>STT</th>
                                    <th scope="col">Mã đơn</th> 
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Phương thức</th>
                                    <th scope="col">Tổng</th>
                                    <th scope="col">Ngày tạo</th>
                                    <th scope="col">action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {currentProducts.map((order, index) => (
                                    <tr key={order.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{order.code}</td>
                                        <td>
                                        {Array.isArray(order.orderState) ?
                                        order.orderState.map((state) => (
                                            // <span key={state.id}>{state.state}</span>
                                            <span key={state.id}>
                                            {state.state === 'Đang giao' && (
                                              <button type='button' className="btn btn-primary">Đang giao</button>
                                            )}
                                            {state.state === 'Chờ xác nhận' && (
                                              <button type='button' className="btn btn-warning" onClick={()=>(order.id)} >Chờ xác nhận</button>
                                            )}
                                             {state.state === 'Hoàn thành' && (
                                              <button type='button' className="btn btn-success">Đã hoàn thành</button>
                                            )}
                                          </span>
                                        )):(
                                            <button type='button' className="btn btn-primary">Đang giao</button>
                                        )}
                                        </td>
                                        <td>{order.paymentMethod}</td>
                                        <td>{formatCurrency(order.finalPrice, 'VND')}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>
                                            <button class="btn btn-outline-primary" onClick={() => handleOrderDetail(order.id)}><i class="bi bi-eye-fill"></i></button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            <nav aria-label="Page navigation">
                                <ul className="pagination">

                                    {/* Nút Trước */}
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                            Previous
                                        </button>
                                    </li>

                                    {/* Hiển thị số trang */}
                                    {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }).map((_, index) => (
                                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}

                                    {/* Nút Tiếp theo */}
                                    <li className={`page-item ${currentPage === Math.ceil(orders.length / ordersPerPage) ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}>
                                            Next
                                        </button>
                                    </li>

                                </ul>
                        </nav>
                        </div>
                        ) : (
                        <p>Loading.....</p>
                        )}
                    
                </div>
            </div>
            {/* MODAL */}
            {showModal && (
                        <Modal className="" show={showModal} onHide={closeModal}>
                          <Modal.Header closeButton>
                            {userData && (
                            <Modal.Title>Cập nhật thông tin của: {user.fullName}</Modal.Title>
                          )}
                          </Modal.Header>
                          <Modal.Body>
                          <form onSubmit={updateUser} className='pad-bg' >
                              <div className="form-group">
                                <label htmlFor="fullName" className="form-label">Họ và tên</label>
                                <input className="form-control" id="fullName" name="fullName" required value={userRequest.fullName||userData.fullName} onChange={handleInputChange} />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="address" className="form-label">Địa chỉ</label>
                                <input  className="form-control" id="address" name="address" required value={userRequest.address||userData.address} onChange={handleInputChange} />
                              </div>   
                              <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                <input  className="form-control" id="phone" name="phone" required value={userRequest.phone||userData.phone} onChange={handleInputChange} />
                              </div>     
                            <button type="submit" className="btn btn-primary w-100">Sửa</button>
                            </form>
                          </Modal.Body>
                          <Modal.Footer>
                             <Button variant="secondary" onClick={closeModal}>
                              Đóng
                            </Button> 
                          </Modal.Footer>
                        </Modal>
                      )}

                      {/* MODAL ORDERDETAIL */}
                      {showModalDetail && (
                        <Modal className="" show={showModalDetail} onHide={closeModalDetail}>
                          <Modal.Header closeButton>
                            {selectedOrder && (
                            <Modal.Title>
                                   <h3>Chi tiết của đơn hàng: {selectedOrder.code}</h3>
                              </Modal.Title>
                            )}
                          </Modal.Header>
                          <Modal.Body>
                            {orderDetails.length > 0?(
                              <div className="card-group">
                              {orderDetails.map((detail) => (
                                <div key={detail.id} className="card">
                                  <div className="card-body">
                                    <h5 className="card-title"> {detail.productName}/{detail.productVariantName}</h5>
                                    <p className="card-text">Số lượng: {detail.quantity}</p>
                                    <p className="card-text">Giá: {formatCurrency(detail.price,'VND')}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ):(
                            <div> Không có chi tiết nào của đơn hàng</div>
                          )}  
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={closeModalDetail}>
                              Đóng
                            </Button> 
                          </Modal.Footer>
                        </Modal>
                      )}
            </div>
        </div>
        )}
    </div>
    <ToastContainer></ToastContainer>
    <div className='footer'>
      <Footer></Footer>
      </div>
    </div>
  )
}

export default UserPage