import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AdminApiService from '../../service/AdminApiService';
import Sidebar from './Sidebar'
import Nav from './Nav'
import { formatCurrency } from '../../utils/formatCurrency';
import EventCreationForm from '../EventForm';
function Dashboard() {
    const [toggle, setToggle] = useState(true);
    const Toggle = ()=>{
        setToggle(!toggle);
    }
    const [productCount, setProductCount] = useState(null);
    useEffect(() => {
        AdminApiService.countProduct()
        .then(response => {
          setProductCount(response.data);
          console.log(response.data);
        })
        .catch(error => console.log(error));
      }, []);
      const [orderCount, setOrderCount] = useState(null);
      useEffect(()=>{
        AdminApiService.countOrder()
        .then(response => {
            setOrderCount(response.data);
        })
        .catch(error => console.log(error));
      },[])
      const [orderShippingCount, setOrderShippingCount] = useState(null);
      useEffect(()=>{
        AdminApiService.countOrderShipping()
        .then(response => {
            setOrderShippingCount(response.data);
        })
        .catch(error => console.log(error));
      },[])

      const [monthlySales, setMonthlySales] = useState(null);
      useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
    
        AdminApiService.monthlySales(currentYear,currentMonth)
          .then(response => {
            setMonthlySales(response.data);
          })
          .catch(error => {
            console.log(error);
          });
      }, []);
      const [orderLatest, setOrderLatest] = useState([]);
      useEffect(()=>{
        AdminApiService.getLatestOrder()
        .then(response => {
            setOrderLatest(response.data);
            console.log(response.data);
        })
        .catch(error => console.log(error));
      },[])

    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [ordersPerPage] = useState(10); // Số lượng đơn hàng trên mỗi trang
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orderLatest.slice(indexOfFirstOrder, indexOfLastOrder);

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
                            <div className='col-md-3 p-1'>
                                <div className='p-3 bg-white shadow-sm d-flex justify-conten-around align-item-center rounded'>
                                    <div>
                                        <h3 className='fs-2'>{productCount}</h3>
                                        <p className='fs-5'>Sản phẩm</p>
                                    </div>
                                    <i className='bi bi-cart-plus p-3 fs-1'></i>
                                </div>
                            </div>
                            <div className='col-md-3 p-1'>
                                <div className='p-3 bg-white shadow-sm d-flex justify-conten-around align-item-center rounded'>
                                    <div>
                                        <h3 className='fs-2'>{orderCount}</h3>
                                        <p className='fs-5'>Đơn đã thanh toán</p>
                                    </div>
                                    <i className='bi bi-journal-check p-3 fs-1'></i>
                                </div>
                            </div>
                            <div className='col-md-3 p-1'>
                                <div className='p-3 bg-white shadow-sm d-flex justify-conten-around align-item-center rounded'>
                                    <div>
                                        <h3 className='fs-2'>{orderShippingCount}</h3>
                                        <p className='fs-5'>Đơn đang giao</p>
                                    </div>
                                    <i className='bi bi-truck p-3 fs-1'></i>
                                </div>
                            </div>
                            <div className='col-md-3 p-1'>
                                <div className='p-3 bg-white shadow-sm d-flex justify-conten-around align-item-center rounded'>
                                    <div>
                                        <h3 className='fs-2'>{formatCurrency(monthlySales,'VND')}</h3>
                                        <p className='fs-5'>Thống kê tháng này</p>
                                    </div>
                                    <i className='bi bi-graph-up-arrow p-3 fs-1'></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    {orderLatest && orderLatest.length > 0 ? (
                        <div>
                            <table className='table caption-top bg-white rounded mt-2'>
                            <caption className='text-white fs-4'>Recent Orders</caption>
                            <thead>
                                <tr>
                                <th scope="col">Code</th>
                                <th scope="col">Email khách hàng</th>
                                <th scope="col">Tên người nhận</th>
                                <th scope="col">Số điện thoại</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Phương thức thanh toán</th>
                                <th scope="col">Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.map((order) => (
                                <tr key={order.id}>
                                    <th scope="row">{order.code}</th>
                                    <td>{order.receiverEmail}</td>
                                    <td>{order.receiverName}</td>
                                    <td>{order.receiverPhone}</td>
                                    <td>{order.receiverAddress}</td>
                                    <td>
                                    {order.orderState.map((state) => (
                                        <span key={state.id}>{state.state}</span>
                                    ))}
                                    </td>
                                    <td>{order.payment}</td>
                                    <td>{formatCurrency(order.finalPrice, 'VND')}</td>
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
                            {Array.from({ length: Math.ceil(orderLatest.length / ordersPerPage) }).map((_, index) => (
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
                            disabled={currentPage === Math.ceil(orderLatest.length / ordersPerPage)}
                            >
                            Next
                            </button>
                        </div>
                        ) : (
                        <p>Loading.....</p>
                        )}
                        <EventCreationForm></EventCreationForm>
                </div>
            </div>
        </div>
    </div>
  )
}
export default Dashboard