import UtilsApiService from '../service/UtilsApiService';
import { toast, ToastContainer } from "react-toastify";

export function handleVariantImageChange(event, setProduct, index) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
  
      UtilsApiService.UploadImageImgur(formData)
        .then((response) => {
          const imagePath = response.data;
          setProduct((prevProduct) => {
            const variantImages = [...prevProduct.productVariantRequest.variantImage];
            variantImages[index] = imagePath;
  
            return {
              ...prevProduct,
              productVariantRequest: {
                ...prevProduct.productVariantRequest,
                variantImage: variantImages,
              },
            };
          });
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