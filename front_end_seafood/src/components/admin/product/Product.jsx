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
import UtilsApiService from "../../../service/UtilsApiService";
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
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const openModalUpdate = () =>{
    setShowModalUpdate(true);
  }
  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };
  const [productData,setProductData] = useState({});
  const [productRequest,setProductRequest] = useState({

  });
  const handleImageUpload = async (event, setVariantRequest)=>{
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      await UtilsApiService.UploadImageImgur(formData)
        .then((response) => {
          const imagePath = response.data;
          setProductRequest((prevProductRequest) => ({
            ...prevProductRequest,
            image: imagePath,
          }));
          toast.success('Upload ảnh thành công', { position: 'top-right' });
        })
        .catch((error) => {
          if (event.target) {
            event.target.value = null;
          }
          // Xử lý lỗi nếu có
          toast.error('Upload thất bại, ' + error.response.data.message, { position: 'top-right' });
        });
    }
  }
  const getDataProduct=async (id)=>{
    AdminApiService.getProductById(id)
    .then(response=>{
      const Data = response.data;
      setProductData(Data);
      openModalUpdate();
    })
    .catch(error=>console.log(error));
  }
  const handleInputChange = (event)=>{
    const { name, value } = event.target;
    setProductRequest((prevProductRequest) => ({
      ...prevProductRequest,
      [name]: value,
    }));
    if(event.target.files && event.target.files.length > 0 && name === 'image'){
      handleImageUpload(event,setProductRequest);
    }
  }
  const handleUpdateSubmit = async (id,event)=>{
    event.preventDefault();
    try {
        // Kiểm tra nếu updatedVariantData không có sự thay đổi so với variantData
      // const response = await AdminApiService.updateVariant(id,updatedVariantData);
      const response = await AdminApiService.updateProduct(id, {
        ...productData,
        ...productRequest,
      });
     
      const updatedProduct = response.data;
      // setVariantData(updatedVariant);
    toast.success("Cập nhật sản phẩm thành công", { position: "top-right" });
  
       // Cập nhật danh sách biến thể
    // setGellAllProduct((prevProducts) => {
    //   const updatedProducts = prevProducts.map((product) => {
    //     if (product.id === updatedProduct.id) {
    //       return updatedProduct;
    //     }
    //     return product;
    //   });
    //   return updatedProducts;
    // });
    setGellAllProduct((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        if (product.id === updatedProduct.id) {
          return {
            ...product,
            category: updatedProduct.category,
          };
        }
        return product;
      });
      return updatedProducts;
    });
         // Đóng modal
         closeModalUpdate();
         window.location.reload();
    } catch (error) {
      toast.error("Cập nhật thất bại", { position: "top-right" });
    }
  }
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    // Fetch categories data from the server
    const fetchCategories = async () => {
      try {
        const response = await AdminApiService.getCategories(); // Replace `getCategories` with the actual method to fetch categories
        setCategories(response.data); // Assuming the response contains the array of category objects
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };
    fetchCategories();
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
                                    <th scope="col">Slug</th>
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
                                        <td>{product.slug}</td> 
                                        <td className="w-25">
                                            <img className="w-25 img-fluid img-thumbnail" src={product.image}  alt="productImgae" /></td>
                                        <td>{formatDate(product.createAt)}</td>
                                        <td>{formatDate(product.updateAt)}</td> 
                                        <td>
                                            <button class="btn btn-outline-primary" onClick={() => getVariants(product.id)}><i class="bi bi-eye-fill"></i></button>
                                            <button class="btn btn-outline-primary" onClick={() => getDataProduct(product.id)}><i class="bi bi-pencil-fill"></i></button>
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
                            <Modal.Title>
                                   <h3>Biến thể của: {selectedProduct.name}</h3>
                              </Modal.Title>
                          )}
                          </Modal.Header>
                          <Modal.Body>
                            {variants.length > 0?(
                              <div className="card-group">
                              {variants.map((variant) => (
                                <div key={variant.id} className="card">
                                  
                                  <div className="card-body">
                                    <img src={variant.image} className="card-img-top img-fluid img-thumbnail w-50" alt="..." />
                                    <h5 className="card-title">{variant.name}</h5>
                                    <p className="card-text">Giá: {formatCurrency(variant.price, 'VND')}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ):(
                            <div> Không có biến thể nào của sản phẩm</div>
                          )}  
                          </Modal.Body>
                          <Modal.Footer>
                          {variants.length > 0 ?(
                            /* <Button variant="secondary" onClick={closeModal}>
                              Đóng
                            </Button> */
                            <Link to={'/admin/product/product-detail/'+selectedProduct.id}>
                              <Button>Xem chi tiết</Button>
                              </Link>) :
                              ( <Link to={'/admin/product/product-detail/'+selectedProduct.id}>
                              <Button>Thêm biến thể</Button>
                              </Link>)}
                          </Modal.Footer>
                        </Modal>
                      )}
                  </div>
                    {/* Modal update product */}
                      {/* Modal */}
                      {showModalUpdate && (
                        <Modal className="" show={showModalUpdate} onHide={closeModalUpdate}>
                          <Modal.Header closeButton>
                            {productData.name && (
                            <Modal.Title>Cập nhật sản phẩm: {productData.name}</Modal.Title>
                          )}
                          </Modal.Header>
                          <Modal.Body>
                          <form onSubmit={(event) => handleUpdateSubmit(productData.id, event)} className='pad-bg' >
                              <div className="form-group">
                                <label htmlFor="name" className="form-label">Tên sản phẩm</label>
                                <input className="form-control" id="name" name="name"  value={productRequest.name || productData.name} onChange={handleInputChange} required />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="description" className="form-label">Mô tả biến thể</label>
                                <input  className="form-control" id="description" name="description" required value={productRequest.description || productData.description} onChange={handleInputChange} />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="category" className="form-label">Danh mục</label>
                                <select className="form-control" id="category" name="category" value={productRequest.category || productData.category} onChange={handleInputChange} required>
                                <option value={productData.category && productData.category.name}>{productData.category && productData.category.name}</option>
                                    {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                                </div>
                              <div className="mb-3">
                                <label htmlFor="image" className="form-label" >Hình ảnh</label>
                                {(productRequest.image||productData.image ) && 
                                <img src={productRequest.image||productData.image} alt="image" width={'200px'} height={"200px"}/> }
                                <input
                                  type="file"
                                  className="form-control"
                                  id="image"
                                  name="image"
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            <button type="submit" className="btn btn-primary w-100">Cập nhật</button>
                            </form>
                          </Modal.Body>
                          <Modal.Footer>
                          </Modal.Footer>
                        </Modal>
                      )}
                  <ToastContainer />  
            </div>
        </div>
    </div>
  )
}
export default Product