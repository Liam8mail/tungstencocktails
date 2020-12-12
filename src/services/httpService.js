/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { getToken } from './authService';


axios.defaults.headers.common['x-auth-token'] = getToken(); // header for storing token

axios.interceptors.request.use(req => {


  req.headers.common['x-auth-token'] = getToken();
  return req;

}, error =>{
  const expectedError = (error.response && error.response.status >=400 && error.response.status <500);
  if(!expectedError){
    alert('An unexpected error occured'); //go to friendly page
  }
  return Promise.reject(error); 
});


axios.interceptors.response.use(null, error =>{
  const expectedError = (error.response && error.response.status >=400 && error.response.status <500);

  if(!expectedError){
    alert('An unexpected error occured'); //go to friendly page
  }
  return Promise.reject(error);
});

export function getCancelToken(){
  return axios.CancelToken.source(); // for async effect clean up calls

}

export default {

  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
}