import React, { useState } from 'react';
import UtilsApiService from '../service/UtilsApiService';
import { toast, ToastContainer } from "react-toastify";

export function handleImageChange(event, setProduct) {
  const file = event.target.files[0]; // Lấy file từ sự kiện onchange
  if(file){
    const formData = new FormData();
    formData.append('image', file);
  
    UtilsApiService.UploadImageImgur(formData)
      .then(response => {
          const imagePath = response.data;
          setProduct(prevProduct => ({
            ...prevProduct,
            image: imagePath
          }));
        toast.success("Upload ảnh thành công", { position: "top-right" });
      })
      .catch((error) => {
        if (event.target) {
          event.target.value = null;
        }
        // Xử lý lỗi nếu có
        toast.error("Upload thất bại, "+ error.response.data.message, { position: "top-right" });
      })
    }   
}