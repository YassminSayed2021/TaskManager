import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authslice";
import{apiSlice} from "./slices/apiSlice";

const store = configureStore({
    reducer:{
        [apiSlice.reducerPath]: apiSlice.reducer,  // Your API reducer
        auth: authReducer // Your auth reducer
    },
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware().concat(apiSlice.middleware),     // Combine default middleware with apiSlice middleware

        devTools:true,
});

export default store;