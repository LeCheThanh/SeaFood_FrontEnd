import React, { useEffect, useState } from "react";
import AdminApiService from '../../../service/AdminApiService';
import Sidebar from '../Sidebar'
import Nav from '../Nav'
import { formatDate } from "../../../utils/formatDate";
import { Link } from "react-router-dom";
function Product() {
    const [toggle, setToggle] = useState(true);
    const Toggle = ()=>{
        setToggle(!toggle);
    }
    const [getAllProduct, setGellAllProduct] = useState([]);
      useEffect(()=>{
        AdminApiService.getAllProduct()
        .then(response => {
            setGellAllProduct(response.data);
            console.log(response.data);
        })
        .catch(error => console.log(error));
      },[])
      const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
      const [ordersPerPage] = useState(10); // Số lượng đơn hàng trên mỗi trang
      const indexOfLastOrder = currentPage * ordersPerPage;
      const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
      const currentProducts = getAllProduct.slice(indexOfFirstOrder, indexOfLastOrder);
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
                    <Link to='/admin/add-product'>
                    <button type="button" class="btn btn-primary">Thêm sản phẩm</button>
                    </Link>
                    </div>
                    {getAllProduct && getAllProduct.length > 0 ? (
                        <div>
                          <table className='table caption-top bg-white rounded mt-2' style={{ verticalAlign: 'middle' }}>
                                <caption className='text-white fs-4'>Danh sách sản phẩm</caption>
                                <thead className="text-center">
                                    <tr>
                                    <th scope="col">STT</th>
                                    <th scope="col">Tên sản phẩm</th>
                                    <th scope="col">Mô tả</th>
                                    <th scope="col">Danh mục</th>
                                    <th scope="col">Ảnh</th>
                                    <th scope="col">Ngày tạo</th>
                                    <th scope="col">Ngày cập nhật</th>
                                    <th scope="col">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {currentProducts.map((product, index) => (
                                    <tr key={product.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>{product.category.name}</td>
                                        <td className="w-25">
                                            <img className="img-fluid img-thumbnail" src={product.image} alt="productImgae" /></td>
                                        <td>{formatDate(product.createAt)}</td>
                                        <td>{formatDate(product.updateAt)}</td> 
                                        <td>
                                            <button class="btn btn-outline-primary" onClick={() => product.id}><i class="bi bi-eye-fill"></i></button>
                                            <button class="btn btn-outline-primary" onClick={() => product.id}><i class="bi bi-pencil-fill"></i></button>
                                            <button class="btn btn-outline-danger" onClick={() => product.id}><i class="bi bi-trash3-fill"></i></button>
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
                            {Array.from({ length: Math.ceil(getAllProduct.length / ordersPerPage) }).map((_, index) => (
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
                            disabled={currentPage === Math.ceil(getAllProduct.length / ordersPerPage)}
                            >
                            Next
                            </button>
                        </div>
                        ) : (
                        <p>Loading.....</p>
                        )}
                    
                </div>
            </div>
        </div>
    </div>
  )
}
export default Product