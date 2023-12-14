import React from 'react'
import NavBar from './NavBarPage';
import Footer from './Footer';

function NotFound() {
  return (
    <div>
        <NavBar></NavBar>
        <div className='w-100' 
        style={{backgroundColor:'rgba(255, 255, 255, 0.982)',height:'80vh', color: 'black', textAlign:'center',display: 'flex', alignItems: 'center',justifyContent: 'center' ,fontSize:'30px',fontWeight:'bold'}}>
            <h1>404</h1>
        </div>
        <div className='footer'>
            <Footer></Footer>
        </div>
    </div>
  )
}

export default NotFound