import axios from "axios";

const USER_API_BASE_URL="http://localhost:8080/api";
// const CREATE_EMPLOYEE="http://localhost:8080/api/createemployees";
class UserApiService{
    register(data){
        return axios.post(USER_API_BASE_URL+'/user/register',data);
    }
    //auth
    getUser(token){
        return axios.get(USER_API_BASE_URL+'/user/info',{
            headers: {
                Authorization: `Bearer ${token}`
              }
        })
    }
    updateUser(token,data){
        return axios.put(USER_API_BASE_URL+'/user',data,{
            headers: {
                Authorization: `Bearer ${token}`
              }
        })
    }
    getTopSelling(){
        return axios.get(USER_API_BASE_URL+'/product/top-selling');
    }
    // wish list
    addToWishList(id,token){
        return axios.post(USER_API_BASE_URL+'/favorite/add?productId='+id,{},
        {
            headers: {
                Authorization: `Bearer ${token}` // Gửi chuỗi token trong header Authorization
              }
        });
    }
    getAllFavorite(token){
        return axios.get(USER_API_BASE_URL+'/favorite/all',{
            headers: {
                Authorization: `Bearer ${token}` // Gửi chuỗi token trong header Authorization
              }
        })
    }
    delFavorite(token,id){
        return axios.delete(USER_API_BASE_URL+'/favorite/delete?id='+id,{
            headers: {
                Authorization: `Bearer ${token}` // Gửi chuỗi token trong header Authorization
              }
        })
    }
    ///cart
    addToCart(data,token){
        return axios.post(USER_API_BASE_URL+'/cart/add',data,
        {
            headers: {
                Authorization: `Bearer ${token}` // Gửi chuỗi token trong header Authorization
              }
        });
    }
    getCart(token){
        return axios.get(USER_API_BASE_URL+'/cart/items',{
            headers: {
                Authorization: `Bearer ${token}`
              }
        })
    }
    getTotalPriceCart(token){
        return axios.get(USER_API_BASE_URL+'/cart/total',{
            headers: {
                Authorization: `Bearer ${token}`
              }
        })
    }
    delCartItem(token,id){
        return axios.delete(USER_API_BASE_URL+'/cart/remove/'+id,{
            headers: {
                Authorization: `Bearer ${token}` // Gửi chuỗi token trong header Authorization
              }
        })
    }
    updateCart(token,data){
        return axios.put(USER_API_BASE_URL+'/cart/update',data,{
            headers: {
                Authorization: `Bearer ${token}` // Gửi chuỗi token trong header Authorization
              }
        })
    }
    clearCart(token){
        return axios.delete(USER_API_BASE_URL+'/cart/clear',{
            headers: {
                Authorization: `Bearer ${token}`
              }
        })
    }
    //product
    getAllProduct(){
        return axios.get(USER_API_BASE_URL+'/product/products');
    }
    getProductsByCate(id){
        return axios.get(USER_API_BASE_URL+'/product/category/'+id);
    }
    getProductBySlug(slug){
        return axios.get(USER_API_BASE_URL+'/product/'+slug);
    }
    //categ
    getAllCate(){
        return axios.get(USER_API_BASE_URL+'/categories');
    }
    //order
    getOrderByUser(token){
        return axios.get(USER_API_BASE_URL+'/order/user',{
            headers: {
                Authorization: `Bearer ${token}`
              }
        })
    }
    createOrder(token,data){
        return axios.post(USER_API_BASE_URL+'/order/create',data,{
            headers: {
                Authorization: `Bearer ${token}`
              }
        })
    }
}

export default new UserApiService()