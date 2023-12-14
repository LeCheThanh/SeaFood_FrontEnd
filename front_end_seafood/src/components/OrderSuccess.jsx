import React from 'react'
import NavBar from './NavBarPage';
import Footer from './Footer';
function OrderSuccess() {
  return (
    <div>
        <NavBar></NavBar>
        <div className='w-100' style={{backgroundColor:'rgba(255, 255, 255, 0.982)',height:'30vh', color: 'white', textAlign:'center',display: 'flex', alignItems: 'center',justifyContent: 'center' ,fontSize:'30px',fontWeight:'bold'}}>

        </div>
        <div
            className='w-100'
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.982)',
                height: '30vh',
                color: 'white',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                fontWeight: 'bold'
            }}
            >
            <div style={{ margin: 'auto', color:'black' }}>
                Cảm ơn bạn đã tin tưởng và đặt hàng tại web
                Hãy kiểm tra email và theo dõi đơn hàng tại website nhé
            </div>
            </div>
        <div className='footer'>
            <Footer></Footer>
        </div>
    </div>
  )
}

export default OrderSuccess