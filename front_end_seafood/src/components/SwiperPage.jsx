import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import UserApiService from '../service/UserApiService';
import AdminApiService from '../service/AdminApiService';
import { Button, Modal, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { formatCurrency } from '../utils/formatCurrency';
import './swiper.css'
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import { addToCart, getCart  } from '../redux/apiRequest';

function SwiperPage() {
  const [topSelling, setTopSelling] = useState([]);
  useEffect(()=>{
    UserApiService.getTopSelling()
    .then(response => {
      setTopSelling(response.data);
        console.log(response.data);
    })
    .catch(error => console.log(error));
  },[])
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
      const product = topSelling.find((product) => product.id === id);
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
    // e.preventDefault();
    console.log("Submitting:", cartItemRequest);
    addToCart(dispatch,cartItemRequest,token);
    
    if(!user){
      toast.error("vui lòng đăng nhập để thêm vào giỏ hàng", { position: "top-right" });
    }
  }
  return (
    <div>

    <Swiper
      spaceBetween={50}
      slidesPerView={4}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
       {topSelling.map(product => (
      <SwiperSlide key={product.id}>
        <div className="card shadow border-0" style={{ width: '18rem', padding: '20px' }}>
          <img src={product.image} className="card-img-top" alt={product.title} style={{ height: '250px'}}/>
          <div className="card-body text-center">
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">{product.price}</p>
            <hr />
            
            <button style={{marginRight: '10px',fontSize: '20px'}} className="btn btn-outline-primary border-0" onClick={() => getVariants(product.id)}>
                <i className="bi bi-cart-plus"></i>
              </button>

            <button style={{marginLeft: '10px',fontSize: '20px'}} className="btn btn-outline-danger border-0" onClick={()=>handleAddToWL(product.id)}>
              <i className="bi bi-heart-fill"></i>
            </button>
          </div>
        </div>
      </SwiperSlide>
    ))}
    </Swiper>
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
  <ToastContainer/>
    </div>
  )
}

export default SwiperPage