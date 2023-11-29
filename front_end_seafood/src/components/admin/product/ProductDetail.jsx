import React, { useEffect, useState } from "react";
import AdminApiService from '../../../service/AdminApiService';
import Sidebar from '../Sidebar'
import Nav from '../Nav'
import { formatDate } from "../../../utils/formatDate";
import { Link } from "react-router-dom";
import { formatCurrency } from '../../../utils/formatCurrency';
import { toast, ToastContainer } from "react-toastify";
import { useParams } from 'react-router-dom';

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
          const updateVariant = variants.filter(variant => variant.id !== id);
          setVariants(updateVariant);
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
                                        <button class="btn btn-outline-primary" onClick={() => (variant.id)}><i class="bi bi-pencil-fill"></i></button>
                                        <button class="btn btn-outline-danger" onClick={() => confirmDelete(variant.id)}><i class="bi bi-trash3-fill"></i></button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    ) : (
                    <p>Loading.....</p>
                    )}
              </div>
              <ToastContainer />  
        </div>
    </div>
</div>
  )
}

export default ProductDetail