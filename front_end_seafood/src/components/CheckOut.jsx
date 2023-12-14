import React, {useState, useEffect} from 'react'
import Footer from './Footer';
import {Link, useNavigate} from 'react-router-dom';
import NavBarPage from './NavBarPage';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from '../redux/apiRequest';
import UserApiService from '../service/UserApiService';
import { formatCurrency } from '../utils/formatCurrency';
import { toast, ToastContainer } from "react-toastify";

function CheckOut() {
    const user = useSelector((state)=>state.auth.login?.currentUser);
    const items = useSelector((state)=>state.cart.getCart?.data);
    const [cartItems, setCartItems] = useState([]);
    const [totalCart,setTotalCart] = useState('');
    const navigate = useNavigate();
    const [userData,setUserData] = useState({});
    useEffect(() => {
        if(user){
          fetchCart();
          fetchTotal();
          fetchUser();
        }
        else{
        navigate('/');
        }
      }, []);
      const fetchUser = async ()=>{
        try{
            const response = await UserApiService.getUser(token)
            setUserData(response.data);
            console.log(response.data)

        }catch(err){
            console.log(err);
        }
    }
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
      const discountRank = ({userData})=>{
        let discount = '';

        if (userData.rank === 'Platinum') {
          discount = '20%';
        } else if (userData.rank === 'Gold') {
            discount = '15%';
        } else if (userData.rank === 'Silver') {
            discount = '10%';
        }else{
            discount = '5%';
        }
        return discount;
    }
    const discount = discountRank({ userData });
    const discountValue = parseInt(discount)
    const discountAmount = (discountValue / 100) * totalCart; 
    const discountedTotal = totalCart - discountAmount; 
    const [orderRequest,setOrderRequest]=useState({
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        receiverEmail: '',
        note: '',
        payment: ''
    })
    const [paymentMethod, setPaymentMethod] = useState('cash');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setOrderRequest((prevOrderRequest) => ({
            ...prevOrderRequest,
            [name]: value,
        }));
    };
    
    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
        setOrderRequest((prevOrderRequest) => ({
            ...prevOrderRequest,
            payment: event.target.value,
        }));
    };
    const handleSubmitOrder = async (event) => {
        event.preventDefault();
        try {
            const response = await UserApiService.createOrder(token, orderRequest);
            console.log(orderRequest);
            toast.success('Đặt hàng thành công!', { position: "top-right" });
            // Xử lý phản hồi sau khi gửi đơn hàng
            setTimeout(()=>{
                navigate('/order/success',3000);
            })
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        if (userData) {
            setOrderRequest({
                receiverName: userData.fullName || '',
                receiverPhone: userData.phone || '',
                receiverAddress: userData.address || '',
                receiverEmail: userData.email || '',
                note: '',
                payment: paymentMethod
            });
        }
    }, [userData, paymentMethod]);
  return (
    <div>
        <NavBarPage></NavBarPage>
        <div className='w-100' style={{backgroundColor:'rgba(3, 194, 252, 0.982)',height:'30vh', color: 'white', textAlign:'center',display: 'flex', alignItems: 'center',justifyContent: 'center' ,fontSize:'30px',fontWeight:'bold'}}>
            Trang thanh toán
        </div>
     <div class="container my-5">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb p-3 bg-body-tertiary rounded-3">
            <Link to={'/'} class="breadcrumb-item">Home</Link>
            <li class="breadcrumb-item active" aria-current="page">CheckOut</li>
            </ol>
        </nav>
        </div>
        <div className="container mt-5" style={{marginBottom: '50px'}}>
            <div className="row">
                {/* Cột Thông Tin Người Dùng */}
                <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center">Thông Tin Thanh Toán</h3>
                            <div className="form-group text-center">
                                <span>

                                    {userData.wholeSale ? "Bạn là khách hành mua sỉ nên được giá ưu đãi" : ""}
                                    </span>
                            </div>
                            <form onSubmit={handleSubmitOrder}>
                                <div className="form-group">
                                    <label htmlFor="fullName">Tên</label>
                                    <input type="text" className="form-control" name='receiverName' id="fullName" placeholder="Nhập tên" value={orderRequest.receiverName||userData.fullName}required  onChange={handleInputChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Số Điện Thoại</label>
                                    <input type="text" className="form-control" name='receiverPhone' id="phone" placeholder="Nhập số điện thoại" required value={orderRequest.receiverPhone||userData.phone} onChange={handleInputChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" className="form-control" name='receiverEmail' id="email" placeholder="Nhập email" required value={orderRequest.receiverEmail||userData.email}  onChange={handleInputChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Địa Chỉ</label>
                                    <input type="text" className="form-control" id="address" name='receiverAddress' placeholder="Nhập địa chỉ" required value={orderRequest.receiverAddress||userData.address}  onChange={handleInputChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="note">Ghi chú</label>
                                    <input type="text" className="form-control" id="note" name='note' placeholder="Ghi chú" required value={orderRequest.note || ''}  onChange={handleInputChange}/>
                                </div>
                                
                                <div className="form-group">
                                    <label>Phương thức thanh toán</label>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="paymentMethod" id="cash" value="cash" checked={paymentMethod === 'cash'} onChange={handlePaymentMethodChange} />
                                        <label className="form-check-label" htmlFor="cash">
                                            Tiền mặt
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="paymentMethod" id="momo" value="momo" checked={paymentMethod === 'momo'} onChange={handlePaymentMethodChange} />
                                        <label className="form-check-label" htmlFor="momo">
                                            Momo
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="paymentMethod" id="vnpay" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={handlePaymentMethodChange} />
                                        <label className="form-check-label" htmlFor="vnpay">
                                            VNPay
                                        </label>
                                        <button type="submit" className="btn btn-success">Thanh Toán</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Cột Giỏ Hàng */}
                <div className="col-md-6 mb-4">
                {cartItems && cartItems.length > 0 && (
                    <div className="card border-0 shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center">Giỏ Hàng Của Bạn</h3>
                            <ul className="list-group list-group-flush">
                                {cartItems.map((cartItem) => (
                                    <li key={cartItem.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <img src={cartItem.productVariant.image} alt={cartItem.productVariant.name} style={{ width: '100px', height: '100px', marginRight: '10px' }}/>
                                            <div>
                                                <h6 className="my-0">{cartItem.productVariant.name}</h6>
                                                <small className="text-body-secondary">{cartItem.productVariant.description}</small>
                                            </div>
                                        </div>
                                        <span className="text-body-secondary">{formatCurrency(cartItem.productVariant.price,'VND')}</span>
                                        <small className="text-body-secondary">{formatCurrency(cartItem.productVariant.whosalePrice,'VND')}</small>
                                    </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Tổng Cộng</span>
                                    <strong>{formatCurrency(totalCart,'VND')}</strong>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Giảm giá</span>
                                    <strong>{discount}</strong>
                                </li>   
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Thành tiền</span>
                                    <strong>{formatCurrency(discountedTotal,'VND')}</strong>
                                </li>   
                            </ul>
                            <div className="text-center mt-4">
                                <button className="btn btn-success">Thanh Toán</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
        <ToastContainer></ToastContainer>
        <div className='footer'>
      <Footer></Footer>
      </div>

    </div>
  )
}

export default CheckOut