import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './nav.css';
import {logOutUser} from '../redux/apiRequest';
import UserApiService from '../service/UserApiService';
function NavBarPage() {
  const user = useSelector((state)=>state.auth.login?.currentUser);
  const popoverCart = (
    <Popover id="cart-popover">
      {user ?(
      <Popover.Body>
        <p>sản phẩm 1</p>
      </Popover.Body>
      ):(
        <Popover.Body>
        <p>Chưa đăng nhập</p>
      </Popover.Body>
      )}
    </Popover>
  );
  const [productCount, setProductCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = ()=>{
    logOutUser(dispatch,navigate);
    navigate('/login');
  }
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    fetchFavorites();
  }, []);
  const fetchFavorites = async () => {
    try {
      const response = await UserApiService.getAllFavorite(user.token);
      setFavorites(response.data);
      setProductCount(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };
 
  const popover = (
    <Popover id="wishlist-popover">
  {user ? (
    favorites?.length > 0 ? (
      favorites.slice(0, 3).map((favorite, index) => (
        <Popover.Body key={favorite.id}>
          <div className="row-12 d-flex align-items-center">
            <img
              src={favorite.product.image}
              style={{ width: '100px', height: '100px', marginRight: '10px' }}
              className="img-fluid"
              alt={favorite.product.name}
            />
            <p className="card-text">{favorite.product.name}</p>
          </div>
          {index === 2 && favorites.length > 3 && (
            <>
            <hr></hr>
            <p className="text-muted">Còn thêm {favorites.length - 3} sản phẩm nữa</p>
            </>
          )}
        </Popover.Body>
      ))
    ) : (
      <Popover.Body>
        <p>không có sản phẩm2</p>
      </Popover.Body>
    )
  ) : (
    <Popover.Body>
      <p>Chưa đăng nhập</p>
    </Popover.Body>
  )}
</Popover>
  );
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
        <Link to="/products" className="nav-link">SẢN PHẨM</Link>
        <Link to="/cards" className="nav-link">CHÍNH SÁCH</Link>
        <Link to="/about" className="nav-link">GIỚI THIỆU</Link>
        </Nav>
            <Nav style={{gap:'0.5rem', alignItems:'center'}}>
            <form class="d-flex" role="search">
               <input class="form-control me-2 rounded" type="search" placeholder="tìm kiếm...." aria-label="Search" />
            </form>
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
              <NavDropdown.Item href="#action/3.1">Xem thông tin tài khoản</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4" onClick={handleLogout}>
               Đăng xuất
              </NavDropdown.Item>
              </NavDropdown>
              </>
            )
            }
              <OverlayTrigger trigger="hover" placement="bottom" overlay={popoverCart}>
              <div className="cart-icon">
              <i class="bi bi-cart-fill"></i>
              {productCount > 0 && <span className="wishlist-count">{productCount}</span>}
            </div>
            </OverlayTrigger>

            <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
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