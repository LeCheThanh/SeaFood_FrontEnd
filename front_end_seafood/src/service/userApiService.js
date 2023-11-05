import axios from "axios";

const EMLOYEE_API_BASE_URL="http://localhost:8080/api";
// const CREATE_EMPLOYEE="http://localhost:8080/api/createemployees";
class userApiService{
    register(data){
        return axios.post(EMLOYEE_API_BASE_URL+'/user/register',data);
    }
}

export default new userApiService()