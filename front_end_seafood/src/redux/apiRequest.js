import axios from "axios";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import UserApiService from "../service/UserApiService";
import { toast, ToastContainer } from "react-toastify";

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