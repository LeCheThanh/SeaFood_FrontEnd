import React, {useState} from 'react'
import { toast, ToastContainer } from "react-toastify";
import AdminApiService from '../../../service/AdminApiService';
import Sidebar from '../Sidebar'
import Nav from '../Nav'
import { Link } from "react-router-dom";

function CreateCategory() {
    const [toggle, setToggle] = useState(true);
    const Toggle = ()=>{
        setToggle(!toggle);
    }
    const [category, setCategory] = useState({
        name:'', 
        description:'',

    })
    const handleChange = (event)=>{
        const { name, value } = event.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
              [name]: value,
          }));
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          // if (product.image) {
          //   // Gọi hàm handleImageChange để tải lên hình ảnh và cập nhật đường dẫn trong product
          //   await handleImageChange(event, setProduct);
          // }
          
          const response = await AdminApiService.createCategory(category);
          console.log(response.data);
          toast.success("Thêm danh mục thành công", { position: "top-right" });
          setTimeout(() => {
            window.location.href = '/admin/categories';
          }, 2000); 
          // Xử lý kết quả thành công tại đây
    
        } catch (error) {
          console.error(error); 
          toast.error("Thêm danh mục thất bại" ,{ position: "top-right" });
          // Xử lý lỗi tại đây
        }
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
              <div className='container col-sm-8 col-sm-offset-2 bg-white rounded'>
                <h3 className='text-center'>Thêm danh mục</h3>
                <form onSubmit={handleSubmit} className='pad-bg' >
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Tên danh mục</label>
                      <input className="form-control" id="name" name="name"  value={category.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Mô tả</label>
                      <input  className="form-control" id="description" name="description" required value={category.description} onChange={handleChange} />
                    </div>
                  <button type="submit" className="btn btn-primary w-100">Thêm</button>
                  <div className='mt-3'>
                  <Link to='/admin/categories'>
                            <button type="button" class="btn btn-dark">Quay lại</button>
                  </Link>
                  </div>
                </form>
                <ToastContainer /> {/* Đây là nơi hiển thị toast */}
                </div>
            </div>
            <div className='row px-3 justify-content-center'>
            <hr />
          </div>
        </div>
    </div>
    
</div>

  )
}

export default CreateCategory