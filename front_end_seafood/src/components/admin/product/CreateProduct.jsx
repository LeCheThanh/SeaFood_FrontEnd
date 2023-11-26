import React, { useState,useEffect } from 'react'
import { toast, ToastContainer } from "react-toastify";
import AdminApiService from '../../../service/AdminApiService';
import Sidebar from '../Sidebar'
import Nav from '../Nav'
import { Link } from "react-router-dom";
import { handleImageChange } from '../../../utils/handleImageChange';

function CreateProduct() {
  const [toggle, setToggle] = useState(true);
  const Toggle = ()=>{
      setToggle(!toggle);
  }
    const [product, setProduct] = useState({
    product:{
        name: '',
        description: '',
        image: '',
        category: '',
    },
    productVariantRequest: {
        // Khởi tạo các trường của productVariantRequest
        variantName: [],
        variantQuantity: [],
        variantPrice: [],
        variantWhosalePrice: [],
        variantDescription: [],
        variantImage: [],
      },
      });
      
      const handleChange = (event) => {
        const { name, value } = event.target;
      
        setProduct((prevProduct) => ({
          ...prevProduct,
          product: {
            ...prevProduct.product,
            [name]: value,
          },
        }));
        if (event.target.files && event.target.files.length > 0) {
          handleImageChange(event, setProduct);
        }
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          // if (product.image) {
          //   // Gọi hàm handleImageChange để tải lên hình ảnh và cập nhật đường dẫn trong product
          //   await handleImageChange(event, setProduct);
          // }
          console.log(product.image);
          const response = await AdminApiService.addProduct(product);
          console.log(response.data);
          toast.success("Thêm sản phẩm thành công", { position: "top-right" });
          setTimeout(() => {
            window.location.href = '/admin/product';
          }, 2000); 
          // Xử lý kết quả thành công tại đây
    
        } catch (error) {
          console.error(error); 
          toast.error("Thêm sản phẩm thất bại" ,{ position: "top-right" });
          // Xử lý lỗi tại đây
        }
      };
      const [categories, setCategories] = useState([]);
      useEffect(() => {
        // Fetch categories data from the server
        const fetchCategories = async () => {
          try {
            const response = await AdminApiService.getCategories(); // Replace `getCategories` with the actual method to fetch categories
            setCategories(response.data); // Assuming the response contains the array of category objects
          } catch (error) {
            console.error(error);
            // Handle error
          }
        };
      
        fetchCategories();
      }, []);
  return (
    <div className='container-fluid bg-secondary min-vh-100'>
    <div className='row'>
       {toggle && <div className='col-4 col-md-2 bg-white vh-100 position-fixed'>
            <Sidebar></Sidebar>
        </div>}
        {toggle && <div className='col-4 col-md-2'></div>}
        <div className='col'>
            <div className='px3'>
                <Nav Toggle={Toggle}></Nav>
                <div className='container-fluid'>
                    <div className='row g-3 my-2'>
                    </div>
                </div>
            <div>
                <form onSubmit={handleSubmit} >
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Tên sản phẩm</label>
                      <input className="form-control" id="name" name="name"  value={product.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Mô tả</label>
                      <input  className="form-control" id="description" name="description" required value={product.description} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label" >Hình ảnh</label>
                      {product.image && <img src={product.image} alt="Product" width={'200px'} height={"200px"}/> }
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        name="image"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="category" className="form-label">Danh mục</label>
                      <select className="form-control" id="category" name="category" value={product.category} onChange={handleChange} required>
                          <option value="">Chọn danh mục</option>
                          {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                      </select>
                      </div>
                  <button type="submit" className="btn btn-primary w-100">Thêm</button>
                </form>
                <ToastContainer /> {/* Đây là nơi hiển thị toast */}
          </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default CreateProduct