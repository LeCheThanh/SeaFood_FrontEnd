import React, { useEffect, useState } from 'react';
import AdminApiService from '../../../service/AdminApiService';
import Sidebar from '../Sidebar';
import Nav from '../Nav';
import { formatDate } from '../../../utils/formatDate';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';

function Categories() {
  const [toggle, setToggle] = useState(true);
  const Toggle = () => {
    setToggle(!toggle);
  };
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    AdminApiService.getCategories()
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => console.log(error));
  }, []);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const ordersPerPage = 10; // Số lượng đơn hàng trên mỗi trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentCategories = categories.slice(indexOfFirstOrder, indexOfLastOrder);

  const deleteCategory = (id) => {
    AdminApiService.deleteCategory(id)
      .then(response => {
        if (response.data.deleted) {
          // Xóa sản phẩm thành công, cập nhật danh sách sản phẩm
          const updatedCategory = categories.filter(category => category.id !== id);
          setCategories(updatedCategory);
          toast.success("Xóa thành công", { position: "top-right" });
        }
      })
      .catch(error => toast.error("Xóa thất bại", { position: "top-right" }));
  };
  const confirmDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        deleteCategory(id);
    }
  };
  
  const [showModal, setShowModal] = useState(false);
  const openModal = () =>{
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
  }
  const [categoryData,setCategoryData] = useState({})
  const [categoryUpdate,setCategoryUpdate] = useState({
    name:'',
    description:''
  })
  const getDataCategory = async (id)=>{
    await AdminApiService.getCategoryById(id)
    .then(response=>{
        setCategoryData( response.data);
        openModal();
    })
    .catch(error=>console.log(error));
  }
  const handleInputChange = (event)=>{
    const { name, value } = event.target;
    setCategoryUpdate((prevCategoryUpdate) => ({
      ...prevCategoryUpdate,
      [name]: value,
    }));
  }
  const handleUpdateSubmit = async (id,event)=>{
    event.preventDefault();
    try {
      const response = await AdminApiService.updateCategory(id, {
        ...categoryData,
        ...categoryUpdate,
      });
      
      const updateCategory = response.data;
      // setVariantData(updatedVariant);
      toast.success("Cập nhật biến thể thành công", { position: "top-right" });
  
       // Cập nhật danh sách biến thể
       setCategories((prevCategories) => {
      const updatedCategories = prevCategories.map((category) => {
        if (category.id === updateCategory.id) {
          return updateCategory;
        }
        return category;    
      });
      return updatedCategories;
    });
  
         // Đóng modal
         closeModal();
    } catch (error) {
      toast.error("Cập nhật thất bại", { position: "top-right" });
    }
  }
  return (
    <div className="container-fluid bg-secondary min-vh-100">
      <div className="row">
        {toggle && (
          <div className="col-4 col-md-2 bg-white vh-100 position-fixed">
            <Sidebar />
          </div>
        )}
        {toggle && <div className="col-4 col-md-2"></div>}
        <div className="col">
          <div className="px3">
            <Nav Toggle={Toggle} />
            <div className="container-fluid">
              <div className="row g-3 my-2"></div>
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link to="/admin/category/add-category">
                <button type="button" className="btn btn-primary">
                  Thêm danh mục
                </button>
              </Link>
            </div>
            {categories && categories.length > 0 ? (
              <div>
                <table className="table caption-top bg-white rounded mt-2" style={{ verticalAlign: 'middle' }}>
                  <caption className="text-white fs-4">Danh sách danh mục</caption>
                  <thead className="text-center">
                    <tr>
                      <th scope="col">STT</th>
                      <th scope="col">Tên danh mục</th>
                      <th scope="col">Mô tả</th>
                      <th scope="col">Parent id</th>
                      <th scope="col">Slug</th>
                      <th scope="col">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {currentCategories.map((category, index) => (
                      <tr key={category.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{category.name}</td>
                        <td>{category.description}</td>
                        <td>{category.parentId}</td>
                        <td>{category.slug}</td>
                        <td>
                          <button className="btn btn-outline-primary" onClick={() => getDataCategory(category.id)}>
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button className="btn btn-outline-danger" onClick={() => confirmDelete(category.id)}>
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Hiển thị nút Previous */}
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {/* Hiển thị số trang */}
                {Array.from({ length: Math.ceil(categories.length / ordersPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    disabled={currentPage === index + 1}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Hiển thị nút Next */}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === Math.ceil(categories.length / ordersPerPage)}
                >
                  Next
                </button>
              </div>
            ) : (
              <p>Loading.....</p>
            )}
             {/* Modal */}
                {showModal && (
                        <Modal className="" show={showModal} onHide={closeModal}>
                          <Modal.Header closeButton>
                            {categoryData.name && (
                            <Modal.Title>Cập nhật danh mục: {categoryData.name}</Modal.Title>
                          )}
                          </Modal.Header>
                          <Modal.Body>
                          <form onSubmit={(event) => handleUpdateSubmit(categoryData.id, event)} className='pad-bg' >
                              <div className="form-group">
                                <label htmlFor="name" className="form-label">Tên danh mục</label>
                                <input className="form-control" id="name" name="name" required value={categoryUpdate.name||categoryData.name} onChange={handleInputChange} />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="description" className="form-label">Mô tả</label>
                                <input  className="form-control" id="description" name="description" required value={categoryUpdate.description||categoryData.description} onChange={handleInputChange} />
                              </div>    
                            <button type="submit" className="btn btn-primary w-100">Sửa</button>
                            </form>
                          </Modal.Body>
                          <Modal.Footer>
                             <Button variant="secondary" onClick={closeModal}>
                              Đóng
                            </Button> 
                          </Modal.Footer>
                        </Modal>
                      )}
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default Categories;