// src/services/axiosBaseQuery.ts

import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../types/api";

const axiosBaseQuery =
  (): BaseQueryFn<AxiosRequestConfig, unknown, unknown> =>
  async (args, api, extraOptions) => {
    try {
      const result = await axios(args);
      return { data: result.data as ApiResponse<any> };
    } catch (axiosError: any) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
