import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = "http://localhost:8800/api";
//const API_URI = import.meta.env.VITE_APP_BASE_URL;

const baseQuery = fetchBaseQuery({ baseUrl: API_URI });

export const apiSlice = createApi({
    baseQuery,  // The base query function (uses fetchBaseQuery)
    tagTypes: [], // Optional tags for invalidating and refetching data (not defined yet)
    endpoints:(builder)=>({}), // Empty for now (will define endpoints later)
});

