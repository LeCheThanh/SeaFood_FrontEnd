import React,{useEffect, useState} from 'react';
import Header from './Header';
import Footer from './Footer';
import './styles.css'
import img from '../images/tau_2.jpg'
import img2 from '../images/xu-ly-hai-san-truoc-khi-bao-quan-va-cach-bao-quan-hai-san-avt-1200x676.jpg';
import img3 from '../images/20210701_ZaWNLvrIitzEfF8McdJGngDu.jpg'
import img4 from '../images/free-shipping.png';
import img5 from '../images/help-desk.png';
import img6 from '../images/root-cause.png';
import img7 from '../images/reputation-management.png';
import SwiperPage from './SwiperPage';
import UserApiService from '../service/UserApiService';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import ProductDiscount from './ProductDiscount';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Ensure Swiper's CSS is imported

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch the products from the API and set the products state
    const fetch = async ()=>{
      try{
        const response = await axios.get('http://localhost:8080/api/events/active');
        setEvents(response.data);
        console.log(response.data)
      }catch(err){
        console.log(err);
      }
    }
    fetch();
    // Set up an interval to update the time left every second
    // const intervalId = setInterval(() => {
    //   setEvents(currentEvents => currentEvents.map(event => ({
    //     ...event,
    //     timeLeft: calculateTimeLeft(event.endTime),
    //   })));
    // }, 1000);

    // // Clear the interval when the component is unmounted
    // return () => clearInterval(intervalId);
  }, []);
 
  // const [timeLeft, setTimeLeft] = useState('');

  // function calculateTimeLeft(endTime) {
  //   const difference = +new Date(endTime) - +new Date();
  //   // Initialize with default object structure
  //   let timeLeft = {
  //     days: 0,
  //     hours: 0,
  //     minutes: 0,
  //     seconds: 0,
  //   };
  
  //   if (difference > 0) {
  //     timeLeft = {
  //       days: Math.floor(difference / (1000 * 60 * 60 * 24)),
  //       hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
  //       minutes: Math.floor((difference / 1000 / 60) % 60),
  //       seconds: Math.floor((difference / 1000) % 60),
  //     };
  //   }
  
  //   return timeLeft;
  // }

  // // Renders the time left as a string
  // const renderTimeLeft = (timeLeft) => {
  //   // Ensure timeLeft is an object and has keys before mapping
  //   if (timeLeft && typeof timeLeft === 'object' && Object.keys(timeLeft).length) {
  //     return Object.keys(timeLeft).map(interval => {
  //       if (!timeLeft[interval]) return '';
  //       return `${timeLeft[interval]} ${interval} `;
  //     }).join('');
  //   }
  //   return 'Event ended or time data unavailable'; // Or any other fallback message
  // };

  return (
    <div>
     <Header></Header>
     {events.map((event) => (
            <div key={event.id} className='container shadow'>
              <div className='justify-content-center' style={{display:'flex', margin: '20px'}}>
                 <h2 className='title-home'>{event.name} - Discounts!</h2>
                 {/* <h2 className='title-home'>{renderTimeLeft(event.timeLeft)}</h2> */}
            </div>
            <Swiper
              spaceBetween={50} // Adjust the space between slides
              slidesPerView={4} // Adjust the number of slides per view
              // ... other swiper settings you might want to use
            >
              {event.productVariants.map((variant) => (
                <SwiperSlide key={variant.id}>
                  <ProductDiscount
                    productVariant={variant}
                    discountRate={event.discountRate}
                    endTime={event.endTime} // Passed endTime from event
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
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
     <ToastContainer></ToastContainer>
    </div>
  );
}

export default Home;  