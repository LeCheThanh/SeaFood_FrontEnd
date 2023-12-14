import React, { useEffect, useState } from 'react'
import AdminApiService from '../../../service/AdminApiService';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Sidebar from '../Sidebar';
import Nav from '../Nav';
import { toast, ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';

function Orders() {
    const [toggle, setToggle] = useState(true);
    const Toggle = ()=>{
        setToggle(!toggle);
    }
    const [orders,setOrders] = useState([]);
    useEffect(()=>{
        AdminApiService.getAllOrder()
        .then(response => {
            setOrders(response.data);
            console.log(response.data);
        })
        .catch(error => console.log(error));
      },[])
      const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
      const [ordersPerPage] = useState(10); // Số lượng đơn hàng trên mỗi trang
      const indexOfLastOrder = currentPage * ordersPerPage;
      const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
      const currentProducts = orders.slice(indexOfFirstOrder, indexOfLastOrder);
      const handleUpdateState = async (id) =>{
        try{
            const response = await AdminApiService.updateOrderState(id);
            // Cập nhật trạng thái mới trong danh sách orders
            const updatedOrders = orders.map(order => {
            if (order.id === id) {
                return {
                ...order,
                orderState: response.data
                };
            }
            return order;
            });
            setOrders(updatedOrders);
            toast.success("Cập nhật trạng thái thành công!", { position: "top-right" })
        } catch (error) {
        // Xử lý lỗi
            console.error(error.response.data);
      }
    };
    const [showModal, setShowModal] = useState(false);

    const closeModal = () => {
        setShowModal(false);
    };
    const [orderDetails,setOrderDetails] = useState([]);
    // const handleOrderDetail = async(id)=>{
    //     try{
    //         const response = AdminApiService.getOrderDetailByOrder(id);
    //         console.log(response.data);
    //         setOrderDetails(response.data);
    //         setShowModal(true);

    //     }catch(error){
    //         console.error(error.response.data);
    //     }
    // }
    const [selectedOrder, setSelectedOrder] = useState(null);
    const handleOrderDetail=async (id)=>{
        AdminApiService.getOrderDetailByOrder(id)
        .then(response=>{
          const Data = response.data;
          const detail = orders.find((order) => order.id === id);
          setSelectedOrder(detail);
          setOrderDetails(Data);
          setShowModal(true);
        })
        .catch(error=>toast.error("Không có chi tiết", { position: "top-right" }));
      }
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
                    {orders && orders.length > 0 ? (
                        <div>
                          <table className='table caption-top bg-white rounded mt-2' style={{ verticalAlign: 'middle' }}>
                                <caption className='text-white fs-4'>Danh sách các đơn hàng</caption>
                                <thead className="text-center">
                                    <tr>
                                    <th scope='col'>STT</th>
                                    <th scope="col">Email khách hàng</th>
                                    <th scope="col">Tên người nhận</th>
                                    <th scope="col">Số điện thoại</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Phương thức thanh toán</th>
                                    <th scope="col">Tổng tiền</th>
                                    <th scope="col">Ngày tạo</th>
                                    <th scope="col">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {currentProducts.map((order, index) => (
                                    <tr key={order.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{order.receiverEmail}</td>
                                        <td>{order.receiverName}</td>
                                        <td>{order.receiverPhone}</td>
                                        <td>{order.receiverAddress}</td>
                                        <td>
                                        {Array.isArray(order.orderState) ?
                                        order.orderState.map((state) => (
                                            // <span key={state.id}>{state.state}</span>
                                            <span key={state.id}>
                                            {state.state === 'Đang giao' && (
                                              <button type='button' className="btn btn-primary">Đang giao</button>
                                            )}
                                            {state.state === 'Chờ xác nhận' && (
                                              <button type='button' className="btn btn-warning" onClick={()=>handleUpdateState(order.id)} >Chờ xác nhận</button>
                                            )}
                                             {state.state === 'Hoàn thành' && (
                                              <button type='button' className="btn btn-success">Đã hoàn thành</button>
                                            )}
                                          </span>
                                        )):(
                                            <button type='button' className="btn btn-primary">Đang giao</button>
                                        )}
                                        </td>
                                        <td>{order.payment}</td>
                                        <td>{formatCurrency(order.finalPrice, 'VND')}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        {/* <td>{formatDate(order.updateAt)}</td>  */}
                                        <td>
                                            <button class="btn btn-outline-primary" onClick={() => handleOrderDetail(order.id)}><i class="bi bi-eye-fill"></i></button>
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
                            {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }).map((_, index) => (
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
                            disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
                            >
                            Next
                            </button>
                        </div>
                        ) : (
                        <p>Loading.....</p>
                        )}
                        {/* Modal */}
                      {showModal && (
                        <Modal className="" show={showModal} onHide={closeModal}>
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
                                    <h5 className="card-title">Tên sản phẩm: {detail.productVariantName}</h5>
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
                            <Button variant="secondary" onClick={closeModal}>
                              Đóng
                            </Button> 
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

export default Orders