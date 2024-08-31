import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  categories: [],
  currentProduct: false,
};

const shoppingSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    landingProducts(state, action) {
      console.log("landingProducts - action = ", action);
      state.products = action.payload.products;
      state.categories = action.payload.categories;
    },
    productDetails(state, action) {
      console.log("productDetails - action = ", action);
      state.currentProduct = action.payload;
    },
  },
});

export const { landingProducts, productDetails } = shoppingSlice.actions;
export default shoppingSlice.reducer;
