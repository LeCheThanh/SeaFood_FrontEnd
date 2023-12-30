import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import './discount.css'
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import { addToCart } from '../redux/apiRequest';

function ProductDiscount({ productVariant, discountRate, endTime }) {
  const [timeLeft, setTimeLeft] = useState('');
  const user = useSelector((state)=>state.auth.login?.currentUser);
  const token = user?.token;
  const dispatch = useDispatch();
  const [cartItemRequest, setCartItemRequest] = useState({
    quantity: 1,
    productId:'',
    productVariantId: '',
  });
  const handleSubmitAddToCart = (e)=>{
    e.preventDefault();
    console.log("Submitting:", cartItemRequest);
    addToCart(dispatch,cartItemRequest,token);

    if(!user){
      toast.error("vui lòng đăng nhập để thêm vào giỏ hàng", { position: "top-right" });
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    setCartItemRequest({
        quantity: 1, // hoặc số lượng mà người dùng chọn
        productId: productVariant.product.id,
        productVariantId: productVariant.id,
      });
    return () => clearInterval(interval);
  }, [productVariant],[endTime]);

  function calculateTimeLeft() {
    const eventEndTime = new Date(endTime);
    const now = new Date();
    const difference = eventEndTime - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return {};
  }

  
  const timeLeftString = Object.keys(timeLeft).map(interval => {
    if (!timeLeft[interval]) {
      return '';
    }
    return `${timeLeft[interval]} ${interval} `;
  }).join('');

  const originalPrice = productVariant.price;
  const discountPrice = originalPrice - (originalPrice * discountRate / 100);

  return (
    <div className=" discount-card card mb-3 border-0" >
      <img src={productVariant.image} alt={productVariant.name} className="card-img-top" style={{height: '200px',objectFit: 'cover'}} />
      <div className="card-body">
        <h5 className="card-title">{productVariant.product.name}/ {productVariant.name}</h5>
        <p className="card-text">
          Giá: <s>{originalPrice.toLocaleString()} VND</s>
        </p>
        <p className="card-text text-danger">
          Giá giảm: {discountPrice.toLocaleString()} VND
        </p>
        <div className="d-flex justify-content-between">
          <small className='text-danger'>đã bán: {productVariant.soldQuantity}</small>
          <small className='text-primary text-end'>còn lại: {productVariant.stock}</small>
        </div>
        <div className="card-footer">
          <small className="text-muted">Thời gian còn lại: {timeLeftString}</small>
        </div>
        <button onClick={handleSubmitAddToCart} className="btn btn-outline-primary w-100">
            Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}

export default ProductDiscount;
