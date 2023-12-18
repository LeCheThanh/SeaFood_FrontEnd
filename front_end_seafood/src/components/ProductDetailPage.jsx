import React, { useEffect, useState } from 'react'
import NavBar from './NavBarPage';
import Footer from './Footer';
import { Link, useParams } from "react-router-dom";
import UserApiService from '../service/UserApiService';
import AdminApiService from '../service/AdminApiService';
import { formatCurrency } from '../utils/formatCurrency';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import { addToCart } from '../redux/apiRequest';
import userimg from '../images/user1.jpg'
import StarRatingInput from './StarRatingInput';

function ProductDetailPage() {
    const { slug } = useParams();
    const [product,setProduct] = useState({})
    const [variants,setVariants] = useState([])
    useEffect(()=>{
            fetchProduct();
    },[])
    const id = product?.id;
    useEffect(() => {
        if (id) {
          fetchVariant();
          fetchReviews(id);
          fetchRating(id);
          fetchCount(id);
        }
      }, [id]);
      
    const fetchProduct = async()=>{
        try{
            const response = await UserApiService.getProductBySlug(slug);
            setProduct(response.data);

        }catch(err){
            console.log(err);
        }
    }
    const fetchVariant = async () => {
        try {
          const response = await AdminApiService.getVariantByProduct(id);
          setVariants(response.data);
        } catch (error) {
          console.log(error);
        }
    }
    const [selectedVariant, setSelectedVariant] = useState('');

    const [quantity, setQuantity] = useState(1);
    const handleVariantClick = (variant) => {
        setSelectedVariant(variant);
        setCartItemRequest((prevState) => ({
          ...prevState,
          productVariantId: variant.id,
          productId: variant.product.id
        }));
      };
      const [cartItemRequest, setCartItemRequest] = useState({
        quantity: 1,
        productId:'',
        productVariantId: '',
      });

      //quantitychange
      const handleQuantityChange = (event) => {
        setQuantity(parseInt(event.target.value, 10));
        const quantity = event.target.value;
        setCartItemRequest((prevState) => ({
        ...prevState,
        quantity: parseInt(quantity)
      }));
      };
      const user = useSelector((state)=>state.auth.login?.currentUser);
      const token = user?.token;
      const dispatch = useDispatch();
      const handleSubmitAddToCart = (e)=>{
        e.preventDefault();
        if(!user){
            toast.error("vui lòng đăng nhập để thêm vào giỏ hàng", { position: "top-right" });
          }
        else if(cartItemRequest.productId =='' || cartItemRequest.productVariantId ==''){
            toast.error("vui lòng chọn biến thể", { position: "top-right" });
        }
        addToCart(dispatch,cartItemRequest,token);
      }
      const [activeTab, setActiveTab] = useState('review');
      const handleTabSelect = (tab) => {
        setActiveTab(tab);
      };
      const fetchReviews = async (id)=>{
        try{
            const response = await UserApiService.getReviews(id);
            setReviews(response.data);
        }catch(err)
        {
          console.log(err);
        }
      }
      const[reviews, setReviews]= useState([{}])
      const StarRating = ({ rating }) => {
        // Tạo một mảng của sao dựa trên điểm rating
        let stars = [];
        for (let i = 0; i < 5; i++) {
          if (i < rating) {
            stars.push(<span key={i} className="text-warning">&#9733;</span>); // Sao đầy
          } else {
            stars.push(<span key={i} className="text-muted">&#9733;</span>); // Sao rỗng
          }
        }
      
        return <div>{stars}</div>;
      };
      const[totalRating,setTotalRating] = useState('');
      const[count,setCount]=useState('');
      const fetchRating = async (id)=>{
        try{
          const response = await UserApiService.getTotalRating(id);
          setTotalRating(response.data);

        }catch(error){
          console.log(error);
        }

      }
      const fetchCount = async (id)=>{
        try{
          const response = await UserApiService.getCount(id);
          setCount(response.data);

        }catch(error){
          console.log(error);
        }

      }
      const [reviewRequest,setReviewRequest] = useState({
        product: '',
        rating: '',
        content: '',
    
      })
      const handleRatingSelect = (selectedRating) => {
        setReviewRequest(prevState => ({
          ...prevState,
          rating: selectedRating
        }));
      };
    
      const handleContentChange = (event) => {
        setReviewRequest(prevState => ({
          ...prevState,
          content: event.target.value,
          product: product
        }));
      };
    
      const [resetKey, setResetKey] = useState(0);
      const handleSubmit = async (event) => {
        event.preventDefault();
        try{
          const response = await UserApiService.postReview(reviewRequest,token);
          console.log('request '+id);
          console.log('request ',reviewRequest);
          toast.success("Đánh giá thành công!", { position: "top-right" });
          fetchReviews(id);
          fetchRating(id);
          fetchCount(id);
          setResetKey(prevKey => prevKey + 1);
          setReviewRequest({
            ...reviewRequest,
            rating: '',
            content: ''
          });

        }catch(err){
          console.log(err)
          toast.error(err.response?.data, { position: "top-right" });
        }
  
      };
  return (
    <div>
           <NavBar></NavBar>
      <div className='w-100' style={{backgroundColor:'rgba(3, 194, 252, 0.982)',height:'30vh', color: 'white', textAlign:'center',display: 'flex', alignItems: 'center',justifyContent: 'center' ,fontSize:'30px',fontWeight:'bold'}}>
            Trang chi tiết sản phẩm
        </div>
     <div class="container my-5">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb p-3 bg-body-tertiary rounded-3">
            <Link to={'/'} class="breadcrumb-item">Home</Link>
            <Link to={'/products'} class="breadcrumb-item">Product</Link>
            <li class="breadcrumb-item active" aria-current="page">ProductDetail</li>
            </ol>
        </nav>
        </div>
        

        <div class="container mt-5 shadow" style={{marginBottom:'50px'}}>
        <form onSubmit={handleSubmitAddToCart}>
        {product && (
        <div class="row">
            <div class="col-md-6">
                <img  src={selectedVariant ? selectedVariant.image : product.image} 
                    alt={`Hình ảnh của ${selectedVariant ? selectedVariant.name : product.name}`} 
                    class="img-fluid" style={{width:'500px',height:'500px'}}/>
            </div>
            <div class="col-md-6">
                <h2>{product.name}</h2>
                <p>Mô tả: {product.description}</p>
                {selectedVariant ? (
                <div>
                     <p class="lead">Giá: {formatCurrency(selectedVariant.price,'VND')}</p>
                     <p>Giá sỉ: {formatCurrency(selectedVariant.whosalePrice,'VND')}</p>
                </div>
                ):(<></>) }
                <input
                type="number"
                min={1}
                value={quantity}
                onChange={handleQuantityChange}
                className="rounded border py-2 px-3"
                style={{ width: '20%', fontSize: '14px' }}
                />

                <div class="my-3">
                    <h5>Chọn biến thể:</h5>
                    <div class="d-flex">
                    {variants?.length > 0 ? (
                <ul className="list-group list-group-horizontal">
                  {variants.map((variant) => ( 
                    <li
                      key={variant.id}
                      className={`list-group-item border-1 rounded ${variant === selectedVariant ? 'selected-variant' : ''}`}
                      onClick={() => handleVariantClick(variant)}
                      style={{ fontSize: '15px', marginRight: '5px', padding: '5px' }}
                    >
                      {variant.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div>Không có biến thể nào của sản phẩm</div>
                
              )}
                      
                    </div>
                </div>
                
                <div class="my-3">
                    <button class="btn btn-primary" type="submit">Thêm vào giỏ hàng</button>
                    <button class="btn btn-outline-secondary">Thêm vào wishlist</button>
                </div>

           
                <ul class="list-unstyled">
                    <li>Mã Sản Phẩm: {product.slug}</li>
                    <li>Danh mục:  {product.category?.name}</li>
                  
                </ul>
            </div>
          </div>
         )}
         </form>
         <ToastContainer></ToastContainer>
        </div>
        <div class="container mt-5 shadow box-review" style={{marginBottom:'50px'}}>
        <div className="nav nav-tabs">
            <a
              className={`nav-link ${activeTab === 'review' ? 'active' : ''}`}
              onClick={() => handleTabSelect('review')}
            >
              Đánh giá
            </a>
            <a
              className={`nav-link ${activeTab === 'write-review' ? 'active' : ''}`}
              onClick={() => handleTabSelect('write-review')}
            >
              Viết đánh giá
            </a>
          </div>
          <div className="tab-content">
           
            <div
              className={`tab-pane ${activeTab === 'review' ? 'active' : ''}`}
              id="review"
            >
              
              {reviews && reviews?.length>0 ?(
                <div className="container mt-3 tab-review">
                <p>Tổng đánh giá <small>({count})</small>: <StarRating rating={totalRating} /></p>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {/* Đánh giá 1 */}
                  {reviews?.map((review)=>(
                  <div className="col-md-12" key={review.id}>
                    <div className="card">
                      <div className="card-body">
                        <div className="media">
                          <img className="align-self-start mr-3 rounded-circle" src={userimg} style={{height:'100px',width:'100px'}} alt="Avatar người dùng" />
                          <div className="media-body">
                            <h5 className="mt-0">{review.user?.fullName ? review.user?.fullName : review.user?.email}</h5>
                            <StarRating rating={review.rating} />
                            <p>{review.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                    {/* Đánh giá 2 */}       
                  </div>
                </div>
                   ):(
                    <p>Sản phẩm chưa có đánh giá nào</p>
                  )}
            </div>
         
            <div
              className={`tab-pane ${activeTab === 'write-review' ? 'active' : ''}`}
              id="write-review"
            >
                <form onSubmit={handleSubmit}>
                <h2>Viết Đánh Giá</h2>
                <div className="form-group">
                  <label htmlFor="rating">Đánh giá của bạn:</label>
                  <h2>

                  <StarRatingInput  key={resetKey} onRatingSelect={handleRatingSelect} />
                  </h2>
                </div>
                <div className="form-group">
                  <label htmlFor="reviewContent">Nội dung đánh giá:</label>
                  <textarea
                    className="form-control"
                    id="reviewContent"
                    rows="3"
                    value={reviewRequest.content}
                    onChange={handleContentChange}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Gửi Đánh Giá</button>
              </form>
            </div>
          </div>
        </div>
   
        <div className='footer'>
      <Footer></Footer>
      </div>
    </div>
  )
}

export default ProductDetailPage