import axios from "axios";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import UserApiService from "../service/UserApiService";
import { toast, ToastContainer } from "react-toastify";
import { addToCartFailed, addToCartStart, addToCartSuccess, 
    getCartStart,getCartFailed,getCartSuccess,
    deleteItemFailed,deleteItemStart,deleteItemSuccess } from "./cartSlice";

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

        await localStorage.removeItem('persist:root');
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