import axios from "axios";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import UserApiService from "../service/UserApiService";
import { toast, ToastContainer } from "react-toastify";
import { addToCartFailed, addToCartStart, addToCartSuccess, 
    getCartStart,getCartFailed,getCartSuccess,
    deleteItemFailed,deleteItemStart,deleteItemSuccess } from "./cartSlice";
import AdminApiService from "../service/AdminApiService";
import { loginAdminFailed, loginAdminStart, loginAdminSuccess, logoutAdminFailed,logoutAdminStart,logoutAdminSuccess } from "./authAdminSlice";

export const loginUser = async (user,dispatch,navigate)=>{
    dispatch(loginStart());
    try{
        const response =  await axios.post("http://localhost:8080/api/user/login",user);
        dispatch(loginSuccess(response.data));
        navigate("/")

    }catch(err){
        dispatch(loginFailed());
        toast.error(err.response.data.message, { position: "top-right" });
    }
};
export const registerUser = async (user,dispatch,navigate)=> {
    dispatch(registerStart());
    try{
        const response = await UserApiService.register(user);
        dispatch(registerSuccess()); 
        toast.success(response.data, { position: "top-right" });
        setTimeout(() => {
            navigate('/login');
          }, 2000);
    }catch(err){
        dispatch(registerFailed());
        toast.error(err.response.data, { position: "top-right" });
    }
};
export const logOutUser = async(dispatch,navigate)=>{
    dispatch(logoutStart());
    try{
        const persistRoot = localStorage.getItem('persist:root');
        if (persistRoot) {
          // Parse JSON của state
          let persistObj = JSON.parse(persistRoot);
      
          // Cập nhật phần auth (đặt thành object trống hoặc loại bỏ key auth)
          if (persistObj.auth) {
            persistObj.auth = {}; // Thiết lập lại auth hoặc xóa hoàn toàn
            // persistObj.auth = undefined; // Nếu bạn muốn xóa key auth
          }
      
          // Stringify object và lưu lại vào localStorage
          localStorage.setItem('persist:root', JSON.stringify(persistObj));
          
          // Thông báo cho Redux Persist biết đã có sự thay đổi
          // Bạn sẽ cần trigger một action để rehydrate state nếu cần thiết
        }
        dispatch(logoutSuccess());
    }catch(err){
        dispatch(logoutFailed());
    }

}
export const addToCart = async(dispatch,data,token)=>{
    dispatch(addToCartStart());
    try{
        console.log("Making API call with:", data);
        //  const response = await UserApiService.addToCart(data,token);
        const response = await axios.post("http://localhost:8080/api/cart/add",data,{
            headers: {
                Authorization: `Bearer ${token}` // Gửi chuỗi token trong header Authorization
              }
        })
         dispatch(addToCartSuccess());
         setTimeout(() => {
            window.location.reload();
          }, 2000);
         toast.success(response.data, { position: "top-right" });

    }catch(err){
        dispatch(addToCartFailed());
        toast.error(err.response?.data, { position: "top-right" });
    }
}
export const getCart = async(dispatch,token)=>{
    dispatch(getCartStart());
    try{
        const response = await UserApiService.getCart(token);
        return response.data;
        dispatch(getCartSuccess(response.data));
        
    }catch(err){
        dispatch(getCartFailed());
        console.log(err);
    }
}
export const deleteItem = async(dispatch,token,id)=>{
    dispatch(deleteItemStart());
    try{
        const response = await UserApiService.delCartItem(token,id);
        toast.success('Xóa ra khỏi giỏ hàng thành công!', { position: "top-right" });
        dispatch(deleteItemSuccess());

    }catch(err){
        dispatch(deleteItemFailed());
        console.log(err);
    }
}
export const loginAdmin = async (data,dispatch,navigate)=>{
    dispatch(loginAdminStart());
    try{
        const response =  await AdminApiService.loginAdmin(data);
        dispatch(loginAdminSuccess(response.data));
        toast.success("Đăng nhập thành công", { position: "top-right" });
        setTimeout(()=>{
          navigate('/admin',2000)
        })

    }catch(err){
        dispatch(loginAdminFailed());
        toast.error(err.response.data.message, { position: "top-right" });
    }
};
export const logOutAdmin = async(dispatch,navigate)=>{
    dispatch(logoutAdminStart());
    try{

        const persistRoot = localStorage.getItem('persist:root');
        if (persistRoot) {
          let persistObj = JSON.parse(persistRoot);
          if (persistObj.authAdmin) {
            persistObj.authAdmin = {};
          }
          localStorage.setItem('persist:root', JSON.stringify(persistObj)); 
        }
        dispatch(logoutAdminSuccess());
        navigate('/admin/login');
    }catch(err){
        dispatch(logoutAdminFailed());
    }

}