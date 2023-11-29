import React, { useEffect, useState } from "react";
import AdminApiService from '../../../service/AdminApiService';
import Sidebar from '../Sidebar'
import Nav from '../Nav'
import { formatDate } from "../../../utils/formatDate";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import { formatCurrency } from '../../../utils/formatCurrency';   
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
    const deleteProduct = (id) => {
        AdminApiService.deleteProduct(id)
          .then(response => {
            if (response.data.deleted) {
              // Xóa sản phẩm thành công, cập nhật danh sách sản phẩm
              const updatedProducts = getAllProduct.filter(product => product.id !== id);
              setGellAllProduct(updatedProducts);
              toast.success("Xóa thành công", { position: "top-right" });
            }
          })
          .catch(error => toast.error("Xóa thất bại", { position: "top-right" }));
      };
      const confirmDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
          deleteProduct(id);
        }
      };
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const getVariants = async (id) => {
      try {
        const response = await AdminApiService.getVariantByProduct(id);
        setVariants(response.data);
        const product = getAllProduct.find((product) => product.id === id);
        setSelectedProduct(product);
        setShowModal(true);
      } catch (error) {
        console.log(error);
      }
    };

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  const hasVariants = variants.length > 0;
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
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Link to='/admin/product/add-product'>
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
                                            <img className="img-fluid img-thumbnail" src={product.image}  alt="productImgae" /></td>
                                        <td>{formatDate(product.createAt)}</td>
                                        <td>{formatDate(product.updateAt)}</td> 
                                        <td>
                                            <button class="btn btn-outline-primary" onClick={() => getVariants(product.id)}><i class="bi bi-eye-fill"></i></button>
                                            <button class="btn btn-outline-primary" onClick={() => (product.id)}><i class="bi bi-pencil-fill"></i></button>
                                            <button class="btn btn-outline-danger" onClick={() => confirmDelete(product.id)}><i class="bi bi-trash3-fill"></i></button>
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
                    {/* Modal */}
                      {showModal && (
                        <Modal className="" show={showModal} onHide={closeModal}>
                          <Modal.Header closeButton>
                            {selectedProduct && (
                            <Modal.Title>Biến thể của: {selectedProduct.name}</Modal.Title>
                          )}
                          </Modal.Header>
                          <Modal.Body>
                            {variants.length > 0?(
                            variants.map((variant) => (  
                              <div key={variant.id} className="text-center">
                                <p>Tên biến thể: {variant.name}</p>
                                <p>Giá: {formatCurrency(variant.price,'VND')}</p>
                                {/* Thông tin biến thể bổ sung */} 
                                {/* ... */}
                              </div> 
                            ))  
                          ):(
                            <div> Không có biến thể nào của sản phẩm</div>
                          )}  
                          </Modal.Body>
                          <Modal.Footer>
                          {variants.length > 0 &&(
                            /* <Button variant="secondary" onClick={closeModal}>
                              Đóng
                            </Button> */
                            <Link to={'/admin/product/product-detail/'+selectedProduct.id}>
                              <Button>Xem chi tiết</Button>
                              </Link>)}
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
export default Product