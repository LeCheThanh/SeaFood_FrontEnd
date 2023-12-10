import React from 'react';
import Header from './Header';
import './styles.css'
import img from '../images/tau_2.jpg'
import img2 from '../images/xu-ly-hai-san-truoc-khi-bao-quan-va-cach-bao-quan-hai-san-avt-1200x676.jpg';
import img3 from '../images/20210701_ZaWNLvrIitzEfF8McdJGngDu.jpg'
import Footer from './Footer';
import img4 from '../images/free-shipping.png';
import img5 from '../images/help-desk.png';
import img6 from '../images/root-cause.png';
import img7 from '../images/reputation-management.png';
import SwiperPage from './SwiperPage';

function Home() {
  return (
    <div>
     <Header></Header>
     <div className='container' style={{marginBottom:'5rem'}}>
      <div className='justify-content-center' style={{display:'flex', margin: '20px'}}>
        <h2 className='title-home'>CHÍNH SÁCH</h2>
      </div>
      <div class="row row-cols-1 row-cols-md-4 g-4">
          <div class="col-lg-3 col-md-6 pb-3 d-flex justify-content-center shadow-sm">
            <div class="card border-0">
              <img className='poly img-thumbnail border-0'src={img4}  alt="..." style={{height: 'inherit',marginLeft:'20%'}}/>
              <div class="card-body text-center">
                <h6 class="card-title">Miễn phí vận chuyển</h6>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 pb-3 d-flex justify-content-center shadow-sm">
            <div class="card border-0">
              <img src={img5} className='poly img-thumbnail border-0' alt="..." style={{height: 'inherit'}}/>
              <div class="card-body text-center">
                <h6 class="card-title">Hỗ trợ 24/7</h6>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 pb-3 d-flex justify-content-center shadow-sm">
            <div class="card border-0">
              <img src={img6} className='poly img-thumbnail border-0' alt="..."style={{height: 'inherit', marginLeft:'30%'}}/>
              <div class="card-body text-center">
                <h6 class="card-title">Nguồn gốc rõ ràng, minh bạch</h6>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 pb-3 d-flex justify-content-center shadow-sm">
            <div class="card border-0">
              <img src={img7} className='poly img-thumbnail border-0' alt="..."style={{height: 'inherit',marginLeft:'20%'}}/>
              <div class="card-body text-center">
                <h6 class="card-title">Cam kết dịch vụ uy tín</h6>
              </div>
            </div>
          </div>
      </div>
      <div className='justify-content-center' style={{display:'flex', margin: '20px'}}>
        <h2 className='title-home text-center'>Chúng tôi tự hào giới thiệu đến bạn trải nghiệm mua sắm hải sản trực tuyến đáng tin cậy và chất lượng, với sự tươi ngon và an toàn đảm bảo.</h2>
      </div>
      <div class="row row-cols-1 row-cols-md-3 g-4 shadow">
          <div class="col">
            <div class="card h-100 border-0">
              <img src={img} className="card-img-top img-thumbnail" alt="..." style={{height: 'inherit'}}/>
              <div class="card-body text-center">
                <h5 class="card-title">NGUỒN HẢI SẢN TỪ BIỂN KHƠI</h5>
                <p class="card-text">Hải sản chúng tôi phân phối được đánh bắt trực tiếp từ biển khơi.</p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card h-100 border-0">
              <img src={img2} className="card-img-top img-thumbnail" alt="..." style={{height: 'inherit'}}/>
              <div class="card-body text-center">
                <h5 class="card-title">BẢO QUẢN HỢP LÝ, AN TOÀN</h5>
                <p class="card-text">Ướp cá bằng đá lạnh để giữ được sự tươi ngon, không dùng chất phụ gia.</p>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card h-100 border-0">
              <img src={img3} className="card-img-top img-thumbnail" alt="..."style={{height: 'inherit'}}/>
              <div class="card-body text-center">
                <h5 class="card-title">GIÁ CẢ CẠNH TRANH</h5>
                <p class="card-text">Chúng tôi thu mua trực tiếp từ ngư dân, giá cả hợp lý cho người tiêu dùng.</p>
              </div>
            </div>
          </div>
      </div>
      <div className='justify-content-center' style={{display:'flex', margin: '20px'}}>
        <h2 className='title-home text-center'>TOP 10 SẢN PHẨM BÁN CHẠY</h2>
      </div>
      <div className='container shadow'>
      <SwiperPage></SwiperPage>
      </div>
     </div>
     <div className='footer'>
        <Footer></Footer>
     </div>
    </div>
  );
}

export default Home;  