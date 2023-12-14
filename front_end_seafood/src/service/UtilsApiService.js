import axios from "axios";

const UTILS_API_BASE_URL="http://localhost:8080/api";
// const CREATE_EMPLOYEE="http://localhost:8080/api/createemployees";
class UtilsApiService{
    UploadImage(formData){
        return axios.post(UTILS_API_BASE_URL+'/upload',formData);
    }
    UploadImageImgur(formData){
        return axios.post(UTILS_API_BASE_URL+'/imgur/upload',formData);
    }
    
}

export default new UtilsApiService()