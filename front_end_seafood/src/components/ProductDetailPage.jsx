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
   
        <div className='footer'>
      <Footer></Footer>
      </div>
    </div>
  )
}

export default ProductDetailPage