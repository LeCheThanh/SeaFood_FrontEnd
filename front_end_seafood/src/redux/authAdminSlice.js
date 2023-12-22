import {createSlice} from "@reduxjs/toolkit"

const authAdminSlice = createSlice({
    name:"authAdmin",
    initialState:{
        loginAdmin:{
            currentUser:null,
            isFetching:false,
            error:false
        },
        logoutAdmin:{
            isFetching:false,
            error:false
        },
    },
    reducers:{
        loginAdminStart: (state)=>{
            state.loginAdmin.isFetching = true;
        },
        loginAdminSuccess: (state,action) =>{
            state.loginAdmin.isFetching = false;
            state.loginAdmin.currentUser= action.payload;
            state.loginAdmin.error=false;
        },
        loginAdminFailed: (state) =>{
        state.loginAdmin.isFetching= false;
        state.loginAdmin.error =true;
        },
        logoutAdminStart: (state)=>{
            state.logoutAdmin.isFetching = true;
        },
        logoutAdminSuccess: (state) =>{
            state.logoutAdmin.isFetching = false;
            state.loginAdmin.currentUser= null;
            state.logoutAdmin.error=false;
        },
        logoutAdminFailed: (state) =>{
        state.logoutAdmin.isFetching= false;
        state.logoutAdmin.error =true;
        }
    }})

export const {
    loginAdminStart,
    loginAdminFailed,
    loginAdminSuccess,
    logoutAdminStart,
    logoutAdminSuccess,
    logoutAdminFailed
} = authAdminSlice.actions;

export default authAdminSlice.reducer;