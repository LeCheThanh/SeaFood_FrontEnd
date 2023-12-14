import React, { useEffect, useState } from 'react'
import NavBar from './NavBarPage';
import Footer from './Footer';
import { Link } from "react-router-dom";
import UserApiService from '../service/UserApiService';
import './products.css';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import { addToCart, getCart  } from '../redux/apiRequest';
import AdminApiService from '../service/AdminApiService'
import { Button, Modal, Form } from 'react-bootstrap';
import { formatCurrency } from '../utils/formatCurrency';

function ProductPage() {
  const [products,setProducts] = useState([]);
  useEffect(()=>{
    fetchProducts();
    fetchCategories();
  },[])
  const fetchProducts = async ()=>{
    try{
      const response = await UserApiService.getAllProduct();
      setProducts(response.data);
    
    }catch(err){
      console.log(err);
    }
  }
  const [variants, setVariants] = useState([]);
  
  const [showModal, setShowModal] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value, 10));
    const quantity = event.target.value;
    setCartItemRequest((prevState) => ({
    ...prevState,
    quantity: parseInt(quantity)
  }));
  };

const handleVariantClick = (variant) => {
  setSelectedVariant(variant);
  setCartItemRequest((prevState) => ({
    ...prevState,
    productVariantId: variant.id,
    productId: variant.product.id
  }));
};

  const closeModal = () => {
    setShowModal(false);
  const hasVariants = variants.length > 0;
  setQuantity(1);

  };
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    setSelectedVariant(variants[0]);
    setQuantity(1);
    setCartItemRequest({
      productVariantId: variants[0]?.id,
      productId: variants[0]?.product.id,
      quantity: 1
  });
  }, [selectedProduct, variants]);
  const getVariants = async (id) => {
    try {
      const response = await AdminApiService.getVariantByProduct(id);
      setVariants(response.data);
      const product = products.find((product) => product.id === id);
      setSelectedProduct(product);
      setShowModal(true);

    } catch (error) {
      console.log(error);
    }
  };
  const user = useSelector((state)=>state.auth.login?.currentUser);
  const token = user?.token;
  const handleAddToWL = async(id)=>{
    try{
      const response = await UserApiService.addToWishList(id,token);
      toast.success("Thêm vào danh sách yêu thích thành công", { position: "top-right" });
      window.location.reload();
    }catch(err){
      console.log(err);
      if(user){
        toast.error(err.response.data, { position: "top-right" });
      }
      else
      toast.error("vui lòng đăng nhập để thêm vào danh sách yêu thích", { position: "top-right" });
    }
  }
  const [cartItemRequest, setCartItemRequest] = useState({
    quantity: 1,
    productId:'',
    productVariantId: '',
  });
  const productId = (e)=>{
    setCartItemRequest((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }
  const dispatch = useDispatch();
  const handleSubmitAddToCart = (e)=>{
    e.preventDefault();
    console.log("Submitting:", cartItemRequest);
    addToCart(dispatch,cartItemRequest,token);
    
    if(!user){
      toast.error("vui lòng đăng nhập để thêm vào giỏ hàng", { position: "top-right" });
    }
  }
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [ordersPerPage] = useState(9); // Số lượng đơn hàng trên mỗi trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentProducts = products.slice(indexOfFirstOrder, indexOfLastOrder);
  
  const [categories,setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const fetchCategories = async()=>{
    try{
        const response = await UserApiService.getAllCate();
        setCategories(response.data);
    }catch(err){
      console.log(err);
    }
  }
  const handleGetProductByCate = async(id)=>{
    try{
      const response  = await UserApiService.getProductsByCate(id);
      setProducts(response.data);
      setActiveCategory(id);
    }catch(err){
      console.log(err);
    }
  }
  const handleGetAll = ()=>{
    setActiveCategory(null);
    fetchProducts();
  }
  return (
    
    <div>
      <NavBar></NavBar>
      <div>
      <div className='w-100' style={{backgroundColor:'rgba(3, 194, 252, 0.982)',height:'30vh', color: 'white', textAlign:'center',display: 'flex', alignItems: 'center',justifyContent: 'center' ,fontSize:'30px',fontWeight:'bold'}}>
            Trang sản phẩm
        </div>
     <div class="container my-5">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb p-3 bg-body-tertiary rounded-3">
            <Link to={'/'} class="breadcrumb-item">Home</Link>
            <li class="breadcrumb-item active" aria-current="page">Product</li>
            </ol>
        </nav>
        </div>

        <div class="container-fluid">
        <div class="row">
            <div class="col-md-3">
                {categories && categories?.length >0 ?(
                <div class="list-group">
                  <Link onClick={handleGetAll}  className={`list-group-item list-group-item-action ${activeCategory === null ? 'active' : ''}`}>
                        Tất Cả Sản Phẩm
                  </Link>
                  {categories.map((category)=>(
                  <Link  className={`list-group-item list-group-item-action ${activeCategory === category.id ? 'active' : ''}`}  onClick={()=>{handleGetProductByCate(category.id)}}>
                      {category.name}
                  </Link>
                  ))}
                </div>
                ):(
                  <div>Không tồn tại category</div>
                )}
            </div>
            {products && products.length > 0 ? (
            <div className="col-md-9">
                   
                  <div className="row">
                      {currentProducts.map((product) => (
                          <div className="col-md-4 mb-4" key={product.id}>
                          <div className="card h-100 shadow-sm product-card">
                          <Link to={`/product/${product.slug}`} style={{textDecoration:'none'}}>
                              <img className="card-img-top" src={product.image || "https://via.placeholder.com/150"} alt={`Sản phẩm ${product.name}`} style={{ height: '200px', objectFit: 'cover' }} />
                          </Link>
                              <div className="card-body">
                                  <h5 className="card-title">{product.name}</h5>
                                  <p className="card-text">{product.description}</p>
                                  <hr />
                                  <div className="d-flex justify-content-center align-items-center">
                                  <button style={{marginRight: '10px',fontSize: '20px'}} className="btn btn-outline-primary border-0" onClick={() =>getVariants(product.id)}>
                                    <i className="bi bi-cart-plus"></i>
                                  </button>

                                <button style={{marginLeft: '10px',fontSize: '20px'}} className="btn btn-outline-danger border-0" onClick={()=>handleAddToWL(product.id)}>
                                  <i className="bi bi-heart-fill"></i>
                                </button> 
                                  </div>
                              </div>
                           
                          </div>
                      </div>
                      ))}
                  </div>
           

              <nav aria-label="Page navigation">
                  <ul className="pagination">

                      {/* Nút Trước */}
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                              Previous
                          </button>
                      </li>

                      {/* Hiển thị số trang */}
                      {Array.from({ length: Math.ceil(products.length / ordersPerPage) }).map((_, index) => (
                          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                  {index + 1}
                              </button>
                          </li>
                      ))}

                      {/* Nút Tiếp theo */}
                      <li className={`page-item ${currentPage === Math.ceil(products.length / ordersPerPage) ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(products.length / ordersPerPage)}>
                              Next
                          </button>
                      </li>

                  </ul>
              </nav>
              
            </div>
               ) : (
                <div className="col-md-9">
                <p>Không có sản phẩm nào.</p>
                </div>
            )}
        </div>
        {showModal && (
        <Modal className="" show={showModal} onHide={closeModal}>
        <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  {selectedVariant && (
                    <Form onSubmit={handleSubmitAddToCart}>
                      <div className="container">
                        <div className="row">
                      <div className="col">
                        <img className="img-thumbnail" src={selectedVariant.image} alt="" style={{ width: '200px', height: '200px' }} />
                      </div>
                      <div className="col">
                        <>
                          <h6>{selectedVariant.product.name}</h6>
                          <p>Mô tả: {selectedVariant.product.description}</p>
                          <p>Giá: {formatCurrency(selectedVariant.price, 'VND')}</p>              
                          {variants?.length > 0 ? (
                            <ul className="list-group list-group-horizontal">
                              {variants.map((variant) => ( 
                                <li
                                  key={variant.id}
                                  className={`list-group-item border-1 rounded ${variant === selectedVariant ? 'selected-variant' : ''}`}
                                  onClick={() => handleVariantClick(variant)}
                                  style={{ fontSize: '15px', marginRight: '5px', padding: '5px' }}
                                >
                                  {variant.name}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div>Không có biến thể nào của sản phẩm</div>
                          )}
                        </>
                        <Form.Group controlId="quantity" className='mt-2'>
                          <Form.Label>Số lượng:</Form.Label>
                          <Form.Control
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={handleQuantityChange}
                            className='rounded'
                          />
                        </Form.Group>
                      </div>
                      </div>
                    </div>
                    <Button type="submit">Thêm vào giỏ hàng</Button>
                  </Form>
                )}
              </Modal.Body>
                  </Modal>
          )}
    </div>
    <ToastContainer/>
      </div>
      <div className='footer'>
      <Footer></Footer>
      </div>
    </div>
  )
}

export default ProductPage