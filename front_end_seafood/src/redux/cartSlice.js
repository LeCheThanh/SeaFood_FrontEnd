import {createSlice} from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        addToCart:{
            data:null,
            isFetching:false,
            error:false
        }
    },
    reducers:{
        addToCartStart: (state)=>{
            state.addToCart.isFetching = true;
        },
        addToCartSuccess: (state,action) =>{
            state.addToCart.isFetching = false;
            state.addToCart.data= action.payload;
            state.addToCart.error=false;
        },
        addToCartFailed: (state) =>{
        state.addToCart.isFetching= false;
        state.addToCart.error =true;
        }
    }
})
export const {
    addToCartStart,
  addToCartSuccess,
  addToCartFailed
} = cartSlice.actions;

export default cartSlice.reducer;