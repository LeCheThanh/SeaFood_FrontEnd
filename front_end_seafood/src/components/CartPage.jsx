import React, {useState, useEffect } from 'react'
import Footer from './Footer';
import NavBarPage from './NavBarPage';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCart,deleteItem } from '../redux/apiRequest';
import UserApiService from '../service/UserApiService';
import { formatCurrency } from '../utils/formatCurrency';
import { toast, ToastContainer } from "react-toastify";
import './cart.css'

function CartPage() {
    const user = useSelector((state)=>state.auth.login?.currentUser);
    const items = useSelector((state)=>state.cart.getCart?.data);
    const [cartItems, setCartItems] = useState([]);
    const [totalCart,setTotalCart] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        if(user){
          fetchCart();
          fetchTotal();
        }
        else{
        navigate('/');
        }
      }, []);
      const fetchTotal = async () =>{
        const response = await UserApiService.getTotalPriceCart(token);
        setTotalCart(response.data);
       }
       const token = user?.token;
       const dispatch = useDispatch();
       const fetchCart = () => {
        getCart(dispatch, token)
          .then((data) => {
            console.log(data);
            setCartItems(data);
          })
          .catch((error) => {
            // Xử lý lỗi nếu có
          });
      };
      const [newQuantity, setNewQuantity] = useState(0);
      const handleUpdateCartItem = async (cartItemId) => {
        const cartItem = cartItems.find((item) => item.id === cartItemId);
        const updateRequest = {
          cartItemId: cartItemId,
          newQuantity: cartItem.quantity,
        };
      
        try {
          console.log(updateRequest);
          const response = await UserApiService.updateCart(token,updateRequest);
          fetchCart();
          fetchTotal();
        } catch (error) {
          console.error(error);
        }
      };
      const handleQuantityChange = (cartItemId, quantity) => {
        // Find the index of the cart item
        const index = cartItems.findIndex((item) => item.id === cartItemId);
        // Create a new array with the updated item
        const newCartItems = [...cartItems];
        newCartItems[index] = {
          ...newCartItems[index],
          quantity: quantity,
        };
        // Update the state with the new cart items array
        setCartItems(newCartItems);
        // Update the newQuantity state if needed
        setNewQuantity(quantity);
      };
      const handleCartItemDelete = async(id)=>{
        await deleteItem(dispatch,token,id);
        fetchCart();
        fetchTotal();
       }
       const handleClearCart = async ()=>{
        try{
            await UserApiService.clearCart(token);
            toast.success('Xóa toàn bộ giỏ hàng thành công!', { position: "top-right" });
            fetchCart();
            fetchTotal();
        }catch(err){
            console.log(err);
        }
       }
  return (
    <div>
        <NavBarPage></NavBarPage>
        <div className='w-100' style={{backgroundColor:'rgba(3, 194, 252, 0.982)',height:'30vh', color: 'white', textAlign:'center',display: 'flex', alignItems: 'center',justifyContent: 'center' ,fontSize:'30px',fontWeight:'bold'}}>
            Trang giỏ hàng
        </div>
     <div class="container my-5">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb p-3 bg-body-tertiary rounded-3">
            <Link to={'/'} class="breadcrumb-item">Home</Link>
            <li class="breadcrumb-item active" aria-current="page">Cart</li>
            </ol>
        </nav>
        </div>
      
        { user ? (
        <div class="container mt-4 shadow" style={{marginBottom: '100px'}}>
            <Link to='/'>Quay lại</Link>
            {cartItems?.length>0?(
            <div class="row">
                <div class="col-md-6 card-cart-container">
                {cartItems && cartItems?.map((cart, index) => (
                    <div class="card mb-3" key={cart.id}>
                        <div class="row no-gutters ">
                          <Link to={`/product/${cart.product.slug}`}>
                            <div class="col-md-4 position-relative">
                            <img src={cart.productVariant.image} class="card-img-top" alt="Abalone" style={{width:'110px',height:'110px'}}/>
                            </div>
                            </Link>
                            <div class="col-md-8">
                            <div class="card-body ">
                                <div class="row">
                                <div class="col-8">
                                    <h5 class="card-title">{cart.productVariant.name}</h5>
                                    <p>/{cart.product.name}</p>
                                    <p class="card-text">giá: {formatCurrency(cart.productVariant.price,'VND')}</p>
                                    <p class="card-text">giá sỉ: {formatCurrency(cart.productVariant.whosalePrice,'VND')}</p>
                                </div>
                                <div class="col-4">
                                <div class="">
                                    <button class="btn btn-danger btn-sm position-absolute bottom-0 end-0" onClick={()=>handleCartItemDelete(cart.id)}>
                                    <i class="bi bi-trash"></i>
                                    </button>
                                    <input
                                        min="1"
                                        type="number"
                                        className="form-control mb-2"
                                        value={cart.quantity}
                                        onChange={(e) => {
                                            const quantity = parseInt(e.target.value, 10);
                                            if (!isNaN(quantity) && quantity >= 1) {
                                            handleQuantityChange(cart.id, quantity);
                                            }
                                        }}
                                        />
                                </div>
                                <span class="d-block mt-2">{formatCurrency(cart.total,'VND')}</span>
                                </div>
                                </div>
                            </div>
                            </div>
                           <div className='col-12 text-center'>
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => handleUpdateCartItem(cart.id)}
                                >
                                Cập nhật
                                </button>
                           </div>
                     
                        </div>
                        </div>
                       
                           ))}
                      </div>
                        <div class="col-md-6">
                    <p class="h4">Tổng giỏ hàng: {formatCurrency(totalCart,'VND')}</p>
                    <div class="row">
                        <div class="col-6">    
                        <button 
                        type="submit" 
                        class="btn btn-outline-danger w-100"
                        onClick={()=>handleClearCart()}>Xóa toàn bộ giỏ hàng</button>       
                        </div>
                        <div class="col-6 text-right">
                        <Link to='/checkout' className='' >
                            <button type="button" class="btn btn-primary w-100">Đến trang thanh toán</button>
                        </Link>
                        </div>
                    </div>
                    </div>
                    </div>
                    ):(
                        <p>Không có sản phẩm nào trong giỏ hàng</p>
                    )}
                    </div>
                    ):(
                        <div class="container mt-4 shadow" style={{marginBottom: '100px'}}>
                        <p>Phải đăng nhập</p>
                        </div>
                    )}

        <ToastContainer></ToastContainer>
        <div className='footer'>
      <Footer></Footer>
      </div>
    </div>
  )
}

export default CartPage