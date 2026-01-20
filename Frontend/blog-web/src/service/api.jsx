import axios from "axios";
import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from "../constants/config";
import { getAccessToken, getType } from "../utils/common-utils.js";

const API_URL = "http://localhost:8000";

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => processResponse(response),
  (error) => Promise.reject(processError(error))
);

// Success handler
const processResponse = (response) => {
  if (response?.status === 200 || response?.status === 201) {
    return { isSuccess: true, data: response.data };
  }
  return {
    isFailure: true,
    status: response?.status,
    msg: response?.statusText,
    code: response?.status,
  };
};

// Error handler
const processError = (error) => {
  if (error.response) {
    if (error.response.status === 403) sessionStorage.clear();
    return {
      isError: true,
      msg: error.response.data?.message || API_NOTIFICATION_MESSAGES.responseFailure,
      code: error.response.status,
    };
  }
  if (error.request) {
    return {
      isError: true,
      msg: API_NOTIFICATION_MESSAGES.requestFailure,
      code: "",
    };
  }
  return {
    isError: true,
    msg: API_NOTIFICATION_MESSAGES.networkError,
    code: "",
  };
};

// API methods
const API = {};

Object.keys(SERVICE_URLS).forEach((key) => {
  const value = SERVICE_URLS[key];

  API[key] = (body = {}, showUploadProgress, showDownloadProgress, customHeaders = {}) => {
    const isFormData = body instanceof FormData;
    const url = typeof value.url === "function" ? value.url(body.id || body.postId) : value.url;
    const dataToSend = body.data || body;

    return axiosInstance({
      method: value.method,
      url,
      data: value.method !== "GET" ? dataToSend : undefined,
      responseType: value.responseType,
      headers: {
        ...customHeaders,
        TYPE: getType(value, body),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      onUploadProgress: (progressEvent) => {
        if (showUploadProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          showUploadProgress(percent);
        }
      },
      onDownloadProgress: (progressEvent) => {
        if (showDownloadProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          showDownloadProgress(percent);
        }
      },
    });
  };
});

export { API };
