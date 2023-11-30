import React, { useEffect, useState } from "react";
import AdminApiService from '../../../service/AdminApiService';
import Sidebar from '../Sidebar'
import Nav from '../Nav'
import { formatDate } from "../../../utils/formatDate";
import { Link } from "react-router-dom";
import { formatCurrency } from '../../../utils/formatCurrency';
import { toast, ToastContainer } from "react-toastify";
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import UtilsApiService from "../../../service/UtilsApiService";

function ProductDetail() {
  // const { id } = props.match.params;
  const [toggle, setToggle] = useState(true);
  const Toggle = ()=>{
      setToggle(!toggle);
  }
  const { id } = useParams();
  const [variants, setVariants] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState(null);
  // const getVariants = async (id) => {
  //   try {
  //     const response = await AdminApiService.getVariantByProduct(id);
  //     setVariants(response.data);
  //     const productName = response.data.product.name;
  //     setSelectedProductName(productName);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  useEffect(()=>{
    AdminApiService.getVariantByProduct(id)
    .then(response => {
      setVariants(response.data);
      const productName = response.data[0].product.name;
      setSelectedProductName(productName);
    })
    .catch(error => console.log(error));
  },[])
  const deleteVariant = (id) => {
    AdminApiService.delVariantById(id)
      .then(response => {
        if (response.data.deleted) {
          // Xóa sản phẩm thành công, cập nhật danh sách sản phẩm
          const updateVariantAfterDel = variants.filter(variant => variant.id !== id);
          setVariants(updateVariantAfterDel);
          toast.success("Xóa thành công", { position: "top-right" });
        }
      })
      .catch(error => toast.error("Xóa thất bại", { position: "top-right" }));
  };
  const confirmDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        deleteVariant(id);
    }
  };
  //modal create variant
  const [showModal, setShowModal] = useState(false);
  const openModal = () =>{
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
  };
  //Modal update variant
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const openModalUpdate = () =>{
    setShowModalUpdate(true);
  }
  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };
  //create new variant
  const [variantRequest, setVariantRequest] = useState({
      name: '',
      stock: '',
      price: '',
      whosalePrice: '',
      description: '',
      image: '',
  })
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setVariantRequest((prevVariantRequest) => ({
      ...prevVariantRequest,
      [name]: value,
    }));
    if(event.target.files && event.target.files.length > 0 && name === 'image'){
      handleImageUpload(event,setVariantRequest);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {      
      const response = await AdminApiService.createVariant(id,variantRequest);
      console.log(response.data);
      toast.success("Thêm biến thể thành công", { position: "top-right" });
      // Xử lý kết quả thành công tại đây
       // Cập nhật lại danh sách biến thể
      //  const updatedVariants = setVariants((prevVariants) => [...prevVariants, response.data]);
           // Cập nhật lại danh sách biến thể
      setVariants((prevVariants) => {
      if (Array.isArray(prevVariants)) {
        return [...prevVariants, response.data];
      }
      return [response.data];
    });

       // Đóng modal
       closeModal();
    } catch (error) {
      console.error(error); 
      toast.error("Thêm biến thể thất bại" ,{ position: "top-right" });
      // Xử lý lỗi tại đây
    }
  };
  const handleImageUpload = async (event, setVariantRequest)=>{
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      await UtilsApiService.UploadImageImgur(formData)
        .then((response) => {
          const imagePath = response.data;
          setVariantRequest((prevVariantRequest) => ({
            ...prevVariantRequest,
            image: imagePath,
          }));
          toast.success('Upload ảnh thành công', { position: 'top-right' });
        })
        .catch((error) => {
          if (event.target) {
            event.target.value = null;
          }
          // Xử lý lỗi nếu có
          toast.error('Upload thất bại, ' + error.response.data.message, { position: 'top-right' });
        });
    }
  }
  const [error, setError] = useState('');
  const [variantData, setVariantData] = useState(
    {
      name: '',
      description: '',
      price: '',
      whosalePrice: '',
      stock: '',
      image: ''
    }
  );
  const [updatedVariantData, setUpdatedVariantData] = useState({});
  const getVariantById = async (id)=>{
    try {
      const response = await AdminApiService.getVariant(id)
      const variant = response.data;
      setVariantData(variant);
      openModalUpdate();
      console.log(response.data)
    } catch (error) {
      setError('Không tìm thấy biến thể');
    }
  }
  const handleUpdateChange = (event) =>{
    setUpdatedVariantData({
      ...updatedVariantData,
      [event.target.name]: event.target.value,
    });
    if(event.target.files && event.target.files.length > 0 && event.target.name === 'image'){
      handleImageUpload(event,setUpdatedVariantData);
    }
  }

  const handleUpdateSubmit = async (id,event)=>{
    event.preventDefault();
    try {
        // Kiểm tra nếu updatedVariantData không có sự thay đổi so với variantData
      // const response = await AdminApiService.updateVariant(id,updatedVariantData);
      const response = await AdminApiService.updateVariant(id, {
        ...variantData,
        ...updatedVariantData,
      });
      
      const updatedVariant = response.data;
      // setVariantData(updatedVariant);
      toast.success("Cập nhật biến thể thành công", { position: "top-right" });
  
       // Cập nhật danh sách biến thể
    setVariants((prevVariants) => {
      const updatedVariants = prevVariants.map((variant) => {
        if (variant.id === updatedVariant.id) {
          return updatedVariant;
        }
        return variant;
      });
      return updatedVariants;
    });
  
         // Đóng modal
         closeModalUpdate();
    } catch (error) {
      setError('Lỗi khi cập nhật biến thể');
      toast.error("Cập nhật thất bại", { position: "top-right" });
    }
  }

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
                    <button type="button" onClick={openModal} class="btn btn-primary">Thêm biến thể sản phẩm</button>
                </div>
                {variants && variants.length > 0 ? (
                    <div>
                      <table className='table caption-top bg-white rounded mt-2' style={{ verticalAlign: 'middle' }}>
                            <caption className='text-white fs-4'>Các biến thể của: {selectedProductName  }</caption>
                            <thead className="text-center">
                                <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Tên biến thể</th>
                                <th scope="col">Mô tả</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Giá sỉ</th>
                                <th scope="col">Đã bán</th>
                                <th scope="col">Tồn kho</th>
                                <th scope="col">Hình ảnh</th>
                                <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {variants.map((variant, index) => (
                                <tr key={variant.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{variant.name}</td>
                                    <td>{variant.description}</td>
                                    <td>{formatCurrency(variant.price,'VND')}</td>
                                    <td>{formatCurrency(variant.whosalePrice,'VND')}</td>
                                    <td>{variant.soldQuantity}</td>
                                    <td>{variant.stock }</td>
                                    <td className="w-25">
                                        <img className="img-fluid img-thumbnail" src={variant.image}  alt="productImgae" /></td>
                                    <td>
                                        <button class="btn btn-outline-primary" onClick={()=> getVariantById(variant.id)}><i class="bi bi-pencil-fill"></i></button>
                                        <button class="btn btn-outline-danger" onClick={() => confirmDelete(variant.id)}><i class="bi bi-trash3-fill"></i></button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            <tfo></tfo>
                        </table>
                        <Link to='/admin/products'>
                            <button type="button" class="btn btn-dark">Quay lại</button>
                        </Link>
                    </div>
                    ) : (
                    <p>Loading.....</p>
                    )}
                     {/* Modal */}
                     {showModal && (
                        <Modal className="" show={showModal} onHide={closeModal}>
                          <Modal.Header closeButton>
                            {selectedProductName && (
                            <Modal.Title>Thêm biến thể cho sản phẩm: {selectedProductName}</Modal.Title>
                          )}
                          </Modal.Header>
                          <Modal.Body>
                          <form onSubmit={handleSubmit} className='pad-bg' >
                              <div className="form-group">
                                <label htmlFor="name" className="form-label">Tên biến thể</label>
                                <input className="form-control" id="name" name="name"  value={variantRequest.name} onChange={handleInputChange} required />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="description" className="form-label">Mô tả biến thể</label>
                                <input  className="form-control" id="description" name="description" required value={variantRequest.description} onChange={handleInputChange} />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="price" className="form-label">Giá</label>
                                <input  className="form-control" id="price" name="price" required value={variantRequest.price} onChange={handleInputChange} />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="wholePrice" className="form-label">Giá sỉ</label>
                                <input  className="form-control" id="whosalePrice" name="whosalePrice" required value={variantRequest.whosalePrice} onChange={handleInputChange} />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="stock" className="form-label">Số lượng</label>
                                <input  className="form-control" id="stock" name="stock" required value={variantRequest.stock} onChange={handleInputChange} />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="image" className="form-label" >Hình ảnh</label>
                                {variantRequest.image && 
                                <img src={variantRequest.image} alt="image" width={'200px'} height={"200px"}/> }
                                <input
                                  type="file"
                                  className="form-control"
                                  id="image"
                                  name="image"
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            <button type="submit" className="btn btn-primary w-100">Thêm</button>
                            </form>
                          </Modal.Body>
                          <Modal.Footer>
                             <Button variant="secondary" onClick={closeModal}>
                              Đóng
                            </Button> 
                          </Modal.Footer>
                        </Modal>
                      )}
                      {/* Modal update variant */}
                      {/* Modal */}
                     {showModalUpdate && (
                        <Modal className="" show={showModalUpdate} onHide={closeModalUpdate}>
                          <Modal.Header closeButton>
                            {selectedProductName && (
                            <Modal.Title>Cập nhật biến thể: {}</Modal.Title>
                          )}
                          </Modal.Header>
                          <Modal.Body>
                          <form onSubmit={(event) => handleUpdateSubmit(variantData.id, event)} className='pad-bg' >
                              <div className="form-group">
                                <label htmlFor="name" className="form-label">Tên biến thể</label>
                                <input className="form-control" id="name" name="name"  value={updatedVariantData.name || variantData.name || ''} onChange={handleUpdateChange} required />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="description" className="form-label">Mô tả biến thể</label>
                                <input  className="form-control" id="description" name="description" required value={updatedVariantData.description ||variantData.description || ''} onChange={handleUpdateChange} />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="price" className="form-label">Giá</label>
                                <input  className="form-control" id="price" name="price" required value={updatedVariantData.price||variantData.price || ''} onChange={handleUpdateChange} />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="wholePrice" className="form-label">Giá sỉ</label>
                                <input  className="form-control" id="whosalePrice" name="whosalePrice" required value={updatedVariantData.whosalePrice||variantData.whosalePrice || ''} onChange={handleUpdateChange} />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="stock" className="form-label">Số lượng</label>
                                <input  className="form-control" id="stock" name="stock" required value={updatedVariantData.stock||variantData.stock|| ''} onChange={handleUpdateChange} />
                              </div>
                              <div className="mb-3">
                                <label htmlFor="image" className="form-label" >Hình ảnh</label>
                                {(updatedVariantData.image||variantData.image ) && 
                                <img src={updatedVariantData.image||variantData.image} alt="image" width={'200px'} height={"200px"}/> }
                                <input
                                  type="file"
                                  className="form-control"
                                  id="image"
                                  name="image"
                                  onChange={handleUpdateChange}
                                  required
                                />
                              </div>
                            <button type="submit" className="btn btn-primary w-100">Cập nhật</button>
                            </form>
                          </Modal.Body>
                          <Modal.Footer>
                          </Modal.Footer>
                        </Modal>
                      )}
              </div>
              <ToastContainer /> 
        </div>
    </div>
</div>
  )
}

export default ProductDetail