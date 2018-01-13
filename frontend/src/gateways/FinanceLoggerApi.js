/* eslint-disable */

import axios from "axios";
const axiosConfig = {
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
};

const FinanceLoggerApi = axios.create(axiosConfig);

export default FinanceLoggerApi;