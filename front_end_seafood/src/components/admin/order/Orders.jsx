import React, { useEffect, useState } from 'react'
import AdminApiService from '../../../service/AdminApiService';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Sidebar from '../Sidebar';
import Nav from '../Nav';
import { toast, ToastContainer } from "react-toastify";

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
                                    <th scope="col">Code</th>
                                    <th scope="col">Email khách hàng</th>
                                    <th scope="col">Tên người nhận</th>
                                    <th scope="col">Số điện thoại</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Phương thức thanh toán</th>
                                    <th scope="col">Tổng tiền</th>
                                    <th scope="col">Ngày tạo</th>
                          
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {currentProducts.map((order, index) => (
                                    <tr key={order.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{order.code}</td>
                                        <td>{order.receiverEmail}</td>
                                        <td>{order.receiverName}</td>
                                        <td>{order.receiverPhone}</td>
                                        <td>{order.receiverAddress}</td>
                                        <td>
                                        {/* {order.orderState.map((state) => (
                                            <span key={state.id}>{state.state}</span>
                                        ))} */}
                                        </td>
                                        <td>{order.paymentMethod}</td>
                                        <td>{formatCurrency(order.finalPrice, 'VND')}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        {/* <td>{formatDate(order.updateAt)}</td>  */}
                        
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
                  </div>
                  <ToastContainer />  
            </div>
        </div>
    </div>
  )
}

export default Orders