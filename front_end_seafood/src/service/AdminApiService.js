import axios from "axios";

const EMLOYEE_API_BASE_URL="http://localhost:8080/api/admin";
// const CREATE_EMPLOYEE="http://localhost:8080/api/createemployees";
class AdminApiService{
    loginAdmin(data){
        return axios.post(EMLOYEE_API_BASE_URL+'/auth/login',data);
    }
}

export default new AdminApiService()