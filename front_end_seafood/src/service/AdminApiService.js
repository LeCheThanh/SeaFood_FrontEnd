import axios from "axios";

const EMLOYEE_API_BASE_URL="http://localhost:8080/api/admin";
// const CREATE_EMPLOYEE="http://localhost:8080/api/createemployees";
class AdminApiService{
    loginAdmin(data){
        return axios.post(EMLOYEE_API_BASE_URL+'/auth/login',data);
    }
    countOrder(){
        return axios.get(EMLOYEE_API_BASE_URL+'/order/count')
    }
    countProduct(){
        return axios.get(EMLOYEE_API_BASE_URL+'/product/count')
    }
    countOrderShipping(){
        return axios.get(EMLOYEE_API_BASE_URL+'/order/count/shippingstate')
    }
    getLatestOrder(){
        return axios.get(EMLOYEE_API_BASE_URL+'/order/latest-order')
    }
    monthlySales(year, month){
        return axios.get(EMLOYEE_API_BASE_URL+'/order/monthly-sales',{
            params:{
                year: year,
                month: month
            }
        });
    }
    
}

export default new AdminApiService()