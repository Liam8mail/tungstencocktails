import http from "./httpService";
import {apiUrl} from "../config.json";
import decode from 'jwt-decode';

const apiEndpoint = apiUrl + "/api/auth";

export async function login(details) {
   
    const { data } = await http.post(`${apiEndpoint}/login`, details); //data  will be jwt key;
    localStorage.setItem( "token" , data);
    return data;
  
}

export function logout() {
    localStorage.removeItem("token");
}


export function getUserObject() {
    try{
        return decode(getToken());
    }
    catch(ex){
        return;
    }
}

export function getToken() {
    try{
        return localStorage.getItem("token");
    }
    catch(ex){

        console.log(ex);
    }
}





