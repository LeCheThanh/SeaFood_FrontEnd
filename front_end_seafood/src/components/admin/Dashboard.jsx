import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AdminApiService from '../../service/AdminApiService';
import Sidebar from './Sidebar'
import Nav from './Nav'
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
                                        <p className='fs-5'>Products</p>
                                    </div>
                                    <i className='bi bi-cart-plus p-3 fs-1'></i>
                                </div>
                            </div>
                            <div className='col-md-3 p-1'>
                                <div className='p-3 bg-white shadow-sm d-flex justify-conten-around align-item-center rounded'>
                                    <div>
                                        <h3 className='fs-2'>2230</h3>
                                        <p className='fs-5'>Sales</p>
                                    </div>
                                    <i className='bi bi-currency-dollar p-3 fs-1'></i>
                                </div>
                            </div>
                            <div className='col-md-3 p-1'>
                                <div className='p-3 bg-white shadow-sm d-flex justify-conten-around align-item-center rounded'>
                                    <div>
                                        <h3 className='fs-2'>122</h3>
                                        <p className='fs-5'>Delivery</p>
                                    </div>
                                    <i className='bi bi-truck p-3 fs-1'></i>
                                </div>
                            </div>
                            <div className='col-md-3 p-1'>
                                <div className='p-3 bg-white shadow-sm d-flex justify-conten-around align-item-center rounded'>
                                    <div>
                                        <h3 className='fs-2'>20%</h3>
                                        <p className='fs-5'>cc</p>
                                    </div>
                                    <i className='bi bi-graph-up-arrow p-3 fs-1'></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className='table caption-top bg-white rounded mt-2'>
                        <caption className='text-white fs-4'>
                            Recent Orders
                        </caption>
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">First</th>
                            <th scope="col">Last</th>
                            <th scope="col">Handle</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            </tr>
                            <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                            </tr>
                            <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                            </tr>
                        </tbody>
                        </table>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard