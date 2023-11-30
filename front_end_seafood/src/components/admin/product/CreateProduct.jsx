import React, { useState,useEffect } from 'react'
import { toast, ToastContainer } from "react-toastify";
import AdminApiService from '../../../service/AdminApiService';
import Sidebar from '../Sidebar'
import Nav from '../Nav'
import { Link } from "react-router-dom";
import { handleImageChange } from '../../../utils/handleImageChange';
import { handleVariantImageChange } from '../../../utils/handleVariantImageChange';
import './style.css'
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
        variantName: [''],
        variantQuantity: [''],
        variantPrice: [''],
        variantWhosalePrice: [''],
        variantDescription: [''],
        variantImage: [''],
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
  
        if (event.target.files && event.target.files.length > 0 && name === 'image') {
          handleImageChange(event, setProduct);
        }
     
      };
      // const handleChangeVariant = (event) => {
      //   const { name, value } = event.target;
      //   setProduct((prevProduct) => ({
      //     ...prevProduct,
      //     productVariantRequest: {
      //       ...prevProduct.productVariantRequest,
      //       [name]: value,
      //     },
      //   }));
      // };
      const handleChangeVariant = (event, index) => {
        const { name, value } = event.target;
        if (name === 'variantImage') {
          handleVariantImageChange(event, setProduct, index);
        } else {
          setProduct((prevProduct) => {
            const variantValues = [...prevProduct.productVariantRequest[name]];
            variantValues[index] = value;
      
            return {
              ...prevProduct,
              productVariantRequest: {
                ...prevProduct.productVariantRequest,
                [name]: variantValues,
              },
            };
          });
        }
      };
      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          // if (product.image) {
          //   // Gọi hàm handleImageChange để tải lên hình ảnh và cập nhật đường dẫn trong product
          //   await handleImageChange(event, setProduct);
          // }
          
          const response = await AdminApiService.addProduct(product);
          console.log(response.data);
          toast.success("Thêm sản phẩm thành công", { position: "top-right" });
          setTimeout(() => {
            window.location.href = '/admin/products';
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

      //them form
      const [forms, setForms] = useState([]);

      const addForm = () => {
        setForms([...forms, {}]);
      };
    
      const removeForm = (index) => {
        const updatedForms = [...forms];
        updatedForms.splice(index, 1);
        setForms(updatedForms);
      };
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
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                      {/* Thêm nút form variant */}
                <button type='button' className="btn btn-primary" onClick={addForm}>
                  Thêm biến thể
                </button>
                </div>
              <div className='container col-sm-8 col-sm-offset-2 bg-white rounded'>
                <h3 className='text-center'>Thêm sản phẩm</h3>
                <form onSubmit={handleSubmit} className='pad-bg' >
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Tên sản phẩm</label>
                      <input className="form-control" id="name" name="name"  value={product.product.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Mô tả</label>
                      <input  className="form-control" id="description" name="description" required value={product.product.description} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label" >Hình ảnh</label>
                      {product.product.image && <img src={product.product.image} alt="Product" width={'200px'} height={"200px"}/> }
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
                      <select className="form-control" id="category" name="category" value={product.product.category} onChange={handleChange} required>
                          <option value="">Chọn danh mục</option>
                          {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                      </select>
                      </div>
                  <button type="submit" className="btn btn-primary w-100">Thêm</button>
                  <div className='mt-3'>
                  <Link to='/admin/products'>
                            <button type="button" class="btn btn-dark">Quay lại</button>
                  </Link>
                  </div>
                </form>
                <ToastContainer /> {/* Đây là nơi hiển thị toast */}
                </div>
            </div>
            <div className='row px-3 justify-content-center'>
            <hr />
             {/* Hiển thị danh sách các form */}
            {forms.map((form, index) => (
                  <div key={index} className='col-sm-4 col-sm-offset-2 bg-white rounded pad-bg m-1' style={{padding:'10px'}}>
                    {/* Nội dung của form */}
                      {/* ... */}
                    {/* Thêm nút để xóa form */}
                    <div className=' d-grid gap-2 d-md-flex justify-content-md-end'>
                      <button type='button' className='btn btn-outline-danger' onClick={() => removeForm(index)}>
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                    {/* Ví dụ: */}
                    <h4 className='text-center'>Biến thể {index+1}</h4>
                    <div className='mb-3'>
                      <label htmlFor='variantName' className='form-label'>
                        Tên biến thể
                      </label>
                      <input
                        className='form-control'
                        id='variantName'
                        name='variantName'
                        value={product.productVariantRequest.variantName[index]}
                        onChange={(event) => handleChangeVariant(event, index)}
                        required
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='variantPrice' className='form-label'>
                        Giá biến thể
                      </label>
                      <input
                        className='form-control'
                        id='variantPrice'
                        name='variantPrice'
                        value={product.productVariantRequest.variantPrice[index]}
                        onChange={(event) => handleChangeVariant(event, index)}
                        required
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='variantWhosalePrice' className='form-label'>
                        Giá mua sỉ
                      </label>
                      <input
                        className='form-control'
                        id='variantWhosalePrice'
                        name='variantWhosalePrice'
                        value={product.productVariantRequest.variantWhosalePrice[index]}
                        onChange={(event) => handleChangeVariant(event, index)}
                        required
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='variantDescription' className='form-label'>
                        Mô tả biến thể
                      </label>
                      <input
                        className='form-control'
                        id='variantDescription'
                        name='variantDescription'
                        value={product.productVariantRequest.variantDescription[index]}
                        onChange={(event) => handleChangeVariant(event, index)}
                        required
                      />
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='variantQuantity' className='form-label'>
                        Số lượng
                      </label>
                      <input
                        className='form-control'
                        id='variantQuantity'
                        name='variantQuantity'
                        value={product.productVariantRequest.variantQuantity[index]}
                        onChange={(event) => handleChangeVariant(event, index)}
                        required
                      />
                    </div>
                    <div className='mb-3'>
                    {product.productVariantRequest.variantImage[index] && 
                    <img src={product.productVariantRequest.variantImage[index]} alt='Variant Image' width={'200px'} height={"200px"} />}
                      <label htmlFor='variantImage' className='form-label'>
                        Hình ảnh
                      </label>
                      <input
                        className='form-control'
                        id='variantImage'
                        name='variantImage'
                        type='file'
                        onChange={(event) => handleChangeVariant(event, index)}
                        required
                      />
                    </div>
                  </div>
                ))}
      
          </div>
        </div>
    </div>
    
</div>

  )
}

export default CreateProduct