import axios, { AxiosError } from "axios";

interface getUser {
  email: string,
  password: string,
  token: string,
}

export const HOST = 'http://localhost:3000/auth';

const $axios = axios.create({
  baseURL: HOST,
  withCredentials: true,
})

$axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;  
})

$axios.interceptors.response.use((config) => {
  return config;
}, async (error: AxiosError) => {
  const response = error.config;
  if(error.response?.status === 401 && error.config && response && !error.config.isRetry) {
    response.isRetry = true;
    try {
      const response = await axios.get<getUser>(`${HOST}/refresh`, {withCredentials: true});
      localStorage.setItem('token', response.data.token);
      return $axios.request(response);
    } catch(e) {
      if(e instanceof Error) {
        console.log('Пользователь не авторизован');
      }
    }
  }
  throw error;
})

export default $axios;