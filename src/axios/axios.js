import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Secret-Key': 'IfiuH/ko+rh/gekRvY4Va0s+=uucP3xwIfo0e8YTN1INF',
    'Connection': 'keep-alive',
  },
  withCredentials: true,
  timeout: 15000,
});



export default axiosInstance;