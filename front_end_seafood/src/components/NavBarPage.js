import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link,useLocation, useNavigate } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './nav.css';
import {getCart, logOutUser, deleteItem} from '../redux/apiRequest';
import UserApiService from '../service/UserApiService';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-toastify';
function NavBarPage() {


  const user = useSelector((state)=>state.auth.login?.currentUser);
  const items = useSelector((state)=>state.cart.getCart?.data);
  const [productCount, setProductCount] = useState(0);
  const [productCountCart, setProductCountCart] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = ()=>{
    logOutUser(dispatch,navigate);
    navigate('/login');
  }


  const token = user?.token;
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalCart,setTotalCart] = useState('');
 
  useEffect(() => {
    if(user){
      fetchFavorites();
      fetchCart();
      fetchTotal();
    }
  }, []);
 
 const fetchTotal = async () =>{
  const response = await UserApiService.getTotalPriceCart(token);
  setTotalCart(response.data);
 }
 const fetchCart = () => {
  getCart(dispatch, token)
    .then((data) => {
      console.log(data);
      setCartItems(data);
      setProductCountCart(data?.length);
    })
    .catch((error) => {
      // Xử lý lỗi nếu có
    });
};
  const fetchFavorites = async () => {
    try {
      const response = await UserApiService.getAllFavorite(token);
      setFavorites(response.data);
      setProductCount(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };

// ...

 const handleDeleteFavorite = (id)=>{
  // const response = UserApiService.delFavorite(token,id);
  UserApiService.delFavorite(token, id)
      .then((response) => {
        fetchFavorites();
        toast.success('Xóa ra khỏi danh sách yêu thích thành công!', { position: "top-right" });
      })
      .catch((error) => {
        console.error('Failed to delete favorite:', error);
      });
 }
 const handleCartItemDelete = (id)=>{
  deleteItem(dispatch,token,id);
  fetchCart(items);
  fetchTotal(items?.length);
 }
 const popoverCart = (
  <Popover>
    {user ? (
      cartItems?.length > 0 ? (
        <Popover.Body>
         <div className="popover-content" id='cart-popover'>
          {cartItems && cartItems?.map((cart, index) => (
            <div className="" key={cart.id}>
             <div className="">
                <div class="container">
                <div class="card shopping-cart shadow-sm">
                  <div class="card-body">

                  <div class="row mb-3">
                    <div class="col-4">
                      {/* <img src="path-to-your-image" class="img-fluid rounded-start" alt="Product Name"/> */}
                      <img 
                    src={cart.productVariant.image} 
                    className="img-fluid rounded-start" 
                    alt={cart.productVariant.name} 
                  />
              </div>
              <div class="col-8">
                <h5 class="card-title">Tên: {cart.productVariant.name}</h5>
                <p class="card-text">SL: x{cart.quantity} {formatCurrency(cart.productVariant.price,'VND')} </p>
                <p class="card-text">Tổng: {formatCurrency(cart.total,'VND')}</p>
                <button class="btn btn-danger btn-sm" onClick={()=>{handleCartItemDelete(cart.id)}}>
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
            </div>
          </div>
              </div>
            </div>
            ))}
           
          </div>
          <div class="card-footer">
              <h5>Tổng tiền: {formatCurrency(totalCart,'VND')}</h5>
              <Link to='/cart'>
              <button class="btn btn-primary btn-block rounded" style={{width:'100%'}}>Xem giỏ hàng</button>
              </Link>
            </div>
        </Popover.Body>
      ) : (
        <Popover.Body>
          <p>Không có sản phẩm</p>
        </Popover.Body>
      )
    ) : (
      <Popover.Body>
        <p>Chưa đăng nhập</p>
      </Popover.Body>
    )}
  </Popover>
);
const popover = (
  <Popover id="wishlist-popover">
    {user ? (
      favorites?.length > 0 ? (
        <Popover.Body>
         <div className="popover-content">
          {favorites.map((favorite, index) => (
            <div className="popover-item" key={favorite.id}>
              <div className="row-12 d-flex align-items-center">
                <img
                  src={favorite.product.image}
                  style={{ width: '100px', height: '100px', marginRight: '10px' }}
                  className="img-fluid"
                  alt={favorite.product.name}
                />
                <div className="product-info">
                  <p className="card-text">{favorite.product.name}</p>
                  <button
                    className="btn btn-danger"
                    style={{ fontSize: '10px'}}
                    onClick={() =>handleDeleteFavorite(favorite.product.id)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        </Popover.Body>
      ) : (
        <Popover.Body>
          <p>Không có sản phẩm</p>
        </Popover.Body>
      )
    ) : (
      <Popover.Body>
        <p>Chưa đăng nhập</p>
      </Popover.Body>
    )}
  </Popover>
);
  ////////////////////////////////

  //////////////////////////////////////

  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Function to perform the search
    const performSearch = async () => {
      if (keyword.trim() === '') {
        setProducts([]);
        setMessage('');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/product/search?keyword=${keyword}`);
        const data = await response.json();

        if (response.ok) {
          setProducts(data);
          setMessage('');
        } else {
          setMessage(data.message);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        setMessage('Error fetching data');
        setProducts([]);
      }
    };

    // Debouncing - Adding a delay before making the API call
    const timerId = setTimeout(() => {
      performSearch();
    }, 500); // 500ms delay
    return () => clearTimeout(timerId);
  }, [keyword]); // Effect runs whenever the 'keyword' state changes


  ////////////////////////////////
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div>
    
    <Navbar className='container mt-3' style={{borderRadius: '16px 16px 16px 16px',background: 'rgba(255, 255, 255, 0.9 )'}} variant='' expand="lg" fixed='top'>
    <Container>
    <LinkContainer to='/' className='border-0' style={{borderRadius: '12px 12px 12px 12px',backgroundColor:'rgba(3, 194, 252, 0.982)',color:'#fff'}} >
        <Navbar.Brand  >
          <span style={{padding: '16px'}}>Phan Thiet SeaFood</span>
        </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className='icons' style={{justifyContent:'end'}}>
        <Nav className="me-auto justify-content-center">
        <Link to="/products" className={`nav-link ${currentPath === '/products' ? 'active' : ''}`}>
          SẢN PHẨM
        </Link>
        <Link to="/cards" className={`nav-link ${currentPath === '/cards' ? 'active' : ''}`}>
          CHÍNH SÁCH
        </Link>
        <Link to="/about" className={`nav-link ${currentPath === '/about' ? 'active' : ''}`}>
          GIỚI THIỆU
        </Link>
        </Nav>
            <Nav style={{gap:'0.5rem', alignItems:'center'}}>
               <div className="search-container">
                  <input
                    className='form-control me-2 rounded'
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="tìm kiếm..."
                  />
                  <ul className="search-results">
                  {message && <p>{message}</p>}
                    {products.map((product, index) => (
                      <li key={index}>
                      <Link to={`/product/${product.slug}`} style={{color: 'black',textDecoration:'none'}}>
                        <div className="row no-gutters">
                          <div className="col-md-6">
                            <img src={product.image} alt={product.name} />
                          </div>
                          <div className="col-md-6">
                            <div className="card-body">
                              <h6 className="card-text">{product.name}</h6>
                              <p className="card-text">{product.description}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                    ))}
                  </ul>
                </div>
      {!user  ? (
            <>
            <NavDropdown title={<i class="bi bi-person-fill"></i>} id="basic-nav-dropdown">
            <NavDropdown.Item>
              <Link to='/login' style={{textDecoration: 'none', color:'black'}}>
                  Đăng nhập
              </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
              <Link to='/register' style={{textDecoration: 'none', color:'black'}}>
                  Đăng kí
              </Link>
              </NavDropdown.Item>
            </NavDropdown>
            </>
            ) : (
              <>
               <NavDropdown title={<i class="bi bi-person-fill"></i>} id="basic-nav-dropdown" className='user-icon'>
               { user.fullName === 'Null claim' ?( <NavDropdown.Item >Hello, {user.email}</NavDropdown.Item>):
               (
                <NavDropdown.Item >Hello, {user.fullName}</NavDropdown.Item>
               )
                }
               <NavDropdown.Divider />

              <NavDropdown.Item >
              <Link to='/user/info' style={{textDecoration: 'none', color:'black'}}>
                Xem thông tin tài khoản
              </Link>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>
               Đăng xuất
              </NavDropdown.Item>
              </NavDropdown>
              </>
            )
            }
              <OverlayTrigger trigger="click" placement="bottom" overlay={popoverCart} rootClose>
              <div className="cart-icon">
              <i class="bi bi-cart-fill"></i>
              {productCountCart > 0 && <span className="wishlist-count">{productCountCart}</span>}
            </div>
            </OverlayTrigger>


            <OverlayTrigger trigger={['click']} 
            placement="bottom" overlay={popover} 
            rootClose
            >
              <div className="wishlist-icon">
              <i className="bi bi-heart-fill"></i>
              {productCount > 0 && <span className="wishlist-count">{productCount}</span>}
            </div>
            </OverlayTrigger>
            </Nav>
        </Navbar.Collapse>
        
    </Container>
    </Navbar>
</div>
  )
}

export default NavBarPage