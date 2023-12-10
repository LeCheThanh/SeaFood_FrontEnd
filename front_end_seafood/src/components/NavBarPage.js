import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector } from 'react-redux';
import { OverlayTrigger, Popover } from 'react-bootstrap';
function NavBarPage() {
  const user = useSelector((state)=>state.auth.login.currentUser);
  const [showWishlist, setShowWishlist] = useState(false);
  const popover = (
    <Popover id="wishlist-popover">
      <Popover.Body>
        <p>sản phẩm 1</p>
      </Popover.Body>
    </Popover>
  );
  return (
    <div>
    
    <Navbar className='container mt-3' style={{borderRadius: '16px 16px 16px 16px',background: 'rgba(255, 255, 255, 0.9 )'}} variant='' expand="lg" fixed='top'>
    <Container>
        <Navbar.Brand className='border-0' href="/" style={{borderRadius: '12px 12px 12px 12px',backgroundColor:'rgba(3, 194, 252, 0.982)',color:'#fff'}}>
          <span style={{padding: '16px'}}>Phan Thiet SeaFood</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className='icons' style={{justifyContent:'end'}}>
        <Nav className="me-auto justify-content-center">
        <Nav.Link href="/products">SẢN PHẨM</Nav.Link>
        <Nav.Link href="/card">CHÍNH SÁCH</Nav.Link>
        <Nav.Link href="/card">GIỚI THIỆU</Nav.Link>
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
               <NavDropdown title={<i class="bi bi-person-fill"></i>} id="basic-nav-dropdown">
               { user.fullName === 'Null claim' ?( <NavDropdown.Item >Hello, {user.email}</NavDropdown.Item>):
               (
                <NavDropdown.Item >Hello, {user.fullName}</NavDropdown.Item>
               )
                }
               <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.1">Xem thông tin tài khoản</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">
               Đăng xuất
              </NavDropdown.Item>
              </NavDropdown>
              </>
            )
            }
            <i class="bi bi-cart-fill"></i>
            <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
              <i className="bi bi-heart-fill"></i>
          </OverlayTrigger>
            </Nav>
        </Navbar.Collapse>
        
    </Container>
    </Navbar>
</div>
  )
}

export default NavBarPage