import {createSlice, current } from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        addToCart:{
            isFetching:false,
            error:false
        },
        getCart:{
            data:[],
            isFetching:false,
            error:false
        },
        deleteItem:{
            isFetching:false,
            error:false
        }
    },
    reducers:{
        addToCartStart: (state)=>{
            state.addToCart.isFetching = true;
        },
        addToCartSuccess: (state) =>{
            state.addToCart.isFetching = false;
            state.addToCart.error=false;
        },
        addToCartFailed: (state) =>{
            state.addToCart.isFetching= false;
            state.addToCart.error =true;
        },
        getCartStart: (state) => {
            state.getCart = {
                ...state.getCart,
                isFetching: true
            };
        },
        getCartSuccess: (state, action) => {
            state.getCart = {
                ...state.getCart,
                isFetching: false,
                data: action.payload,
                error: false
            };
        },
        getCartFailed: (state) => {
            state.getCart = {
                ...state.getCart,
                isFetching: false,
                error: true
            };
        },
        deleteItemStart: (state) => {
            state.deleteItem = {
                ...state.deleteItem,
                isFetching: true
            };
        },
        deleteItemSuccess: (state, action) => {
            state.deleteItem = {
                ...state.deleteItem,
                isFetching: false,
                error: false
            };
            state.getCart.data = state.getCart.data.filter(
                (item) => item.id !== action.payload
              );
        },
        deleteItemFailed: (state) => {
            state.deleteItem = {
                ...state.deleteItem,
                isFetching: false,
                error: true
            };
        }

    }
})
export const {
    addToCartStart,
  addToCartSuccess,
  addToCartFailed,
  getCartStart,
  getCartSuccess,
  getCartFailed,
  deleteItemStart,
  deleteItemSuccess,
  deleteItemFailed
} = cartSlice.actions;

export default cartSlice.reducer;