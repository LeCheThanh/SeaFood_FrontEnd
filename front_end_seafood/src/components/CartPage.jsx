import React, {useState, useEffect } from 'react'
import Footer from './Footer';
import NavBarPage from './NavBarPage';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../redux/apiRequest';
import UserApiService from '../service/UserApiService';
import { formatCurrency } from '../utils/formatCurrency';

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
            {cartItems?.length>0?(
            <div class="row">
                <div class="col-md-6">
                {cartItems && cartItems?.map((cart, index) => (
                    <div class="card mb-3">
                        <div class="row no-gutters ">
                            <div class="col-md-4 position-relative">
                            <img src="https://i.imgur.com/qA6jkFf.jpg" class="card-img-top" alt="Abalone" style={{width:'110px',height:'110px'}}/>
                            </div>
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
                                    <button class="btn btn-danger btn-sm position-absolute bottom-0 end-0">
                                    <i class="bi bi-trash"></i>
                                    </button>
                                    <input type="number" class="form-control mb-2" value={cart.quantity} />
                                </div>
                                <span class="d-block mt-2">{formatCurrency(cart.total,'VND')}</span>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                           ))}
                        <Link to='/'>Quay lại</Link>
                </div>
                        <div class="col-md-6">
                    <p class="h4">Tổng giỏ hàng: {formatCurrency(totalCart,'VND')}</p>
                    <div class="row">
                        <div class="col-6">
                        <form>
                            <button type="submit" class="btn btn-outline-primary w-100">Cập nhật</button>
                        </form>
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


        <Footer></Footer>
    </div>
  )
}

export default CartPage