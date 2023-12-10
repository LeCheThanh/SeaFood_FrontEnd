import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../images/13-1200x676.jpg';
import img2 from '../images/am-thuc-2-728_20221213142244.jpg';
import img3 from '../images/Thuy-san-va-hai-san-khac-nhau-nhu-the-nao.jpg';

function CarouselPage() {
  return (
    <Carousel>
    <Carousel.Item>
      <img style={{height:'90vh'}}
      className='d-block w-100'
            src={img1}
            alt='firstSlide'>
      </img>
      <Carousel.Caption>
        <h3></h3>
        <p></p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
    <img style={{height:'90vh'}}
            className='d-block w-100'
            src={img2}
            alt='secondSlide'>
      </img>
      <Carousel.Caption>
        <h3></h3>
        <p></p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
    <img className='d-block w-100'
    style={{height:'90vh'}}
            src={img3}
            alt='thirdSlide'>
      </img>
      <Carousel.Caption>
        <h3></h3>
        <p>
          
        </p>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
  )
}

export default CarouselPage