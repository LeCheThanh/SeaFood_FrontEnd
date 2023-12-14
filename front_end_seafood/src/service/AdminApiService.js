import axios from "axios";

const ADMIN_API_BASE_URL="http://localhost:8080/api/admin";
// const CREATE_EMPLOYEE="http://localhost:8080/api/createemployees";
class AdminApiService{
    loginAdmin(data){
        return axios.post(ADMIN_API_BASE_URL+'/auth/login',data);
    }
    countOrder(){
        return axios.get(ADMIN_API_BASE_URL+'/order/count');
    }
    countOrderShipping(){
        return axios.get(ADMIN_API_BASE_URL+'/order/count/shippingstate');
    }
    getLatestOrder(){
        return axios.get(ADMIN_API_BASE_URL+'/order/latest-order');
    }
    monthlySales(year, month){
        return axios.get(ADMIN_API_BASE_URL+'/order/monthly-sales',{
            params:{
                year: year,
                month: month
            }
        });
    }
    //Product
    countProduct(){
        return axios.get(ADMIN_API_BASE_URL+'/product/count');
    }
    getAllProduct(){
        return axios.get(ADMIN_API_BASE_URL+'/products');
    }
    addProduct(product){
        return axios.post(ADMIN_API_BASE_URL+'/product',product);
    }
    deleteProduct(id){
        return axios.delete(ADMIN_API_BASE_URL+'/product/'+id);
        //     params:{
        //         id: id
        //     }
        // })
    }
    getProductById(id){
        return axios.get(ADMIN_API_BASE_URL+'/product/'+id);
    }
    updateProduct(id,product){
        return axios.put(ADMIN_API_BASE_URL+'/product/'+id,product);
    }
    //variant Product
    getVariantByProduct(id){
        return axios.get(ADMIN_API_BASE_URL+'/product/'+id+'/variant');
    }
     //variant Product
     delVariantById(id){
        return axios.delete(ADMIN_API_BASE_URL+'/product/variant/'+id);
    }
    createVariant(id,variant){
        return axios.post(ADMIN_API_BASE_URL+'/product/'+id+'/variant',variant);
    }
    updateVariant(id,variant){
        return axios.put(ADMIN_API_BASE_URL+'/product/variant/'+id,variant);
    }
    getVariant(id){
        return axios.get(ADMIN_API_BASE_URL+'/product/variant/'+id);
    }

    //category
    getCategories(){
        return axios.get(ADMIN_API_BASE_URL+'/categories');
    }
    deleteCategory(id){
        return axios.delete(ADMIN_API_BASE_URL+'/category/'+id);
    }
    createCategory(category){
        return axios.post(ADMIN_API_BASE_URL+'/category',category);
    }
    getCategoryById(id){
        return axios.get(ADMIN_API_BASE_URL+'/category/'+id)
    }
    updateCategory(id,category){
        return axios.put(ADMIN_API_BASE_URL+'/category/'+id,category)
    }
    //Order
    getAllOrder(){
        // mean orders?
        return axios.get(ADMIN_API_BASE_URL+'/order/all');
    }
    updateOrderState(id){
        return axios.put(ADMIN_API_BASE_URL+'/order/'+id+'/update-state');
    }
    getOrderDetailByOrder(id){
        return axios.get(ADMIN_API_BASE_URL+'/order/detail/'+id);
    }
    //User
    getAllUser(){
        return axios.get(ADMIN_API_BASE_URL+'/users');
    }
    updateWholeSale(id,request){
        return axios.post(ADMIN_API_BASE_URL+'/user/'+id,null,{
            params: {newStatus : request},
        });
    }
    createUser(data){
        return axios.post(ADMIN_API_BASE_URL+'/user',data);
    }
    //roles
    getAllRole(){
        return axios.get(ADMIN_API_BASE_URL+'/roles');
    }
    updateRole(email,roleName){
        return axios.put(ADMIN_API_BASE_URL+'/user/'+email+'/roles',roleName);
    }
    getUserById(id){
        return axios.get(ADMIN_API_BASE_URL+'/user/'+id);
    }
    //thong ke theo product
    statistics(){
        return axios.get(ADMIN_API_BASE_URL+'/statistics');
    }
    getOrderByMethod(year, month, method){
        return axios.get(ADMIN_API_BASE_URL+'/order/method',{
            params:{
                year: year,
                month: month,
                method: method
            }
        });
    }
    //auth
    

}

export default new AdminApiService()