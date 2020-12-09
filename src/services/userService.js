import http from './httpService';
import {apiUrl} from '../config.json';

const apiUserEndpoint = `${apiUrl}/api/users/`;
//const apiLoginEndpoint = `${apiUrl}/api/auth/`;


export function createAccount(user) {

    return http.post(`${apiUserEndpoint}signup`,user);
};

export function getUser(user) {

    return http.get(`${apiUserEndpoint}me`,user)
};

export function remove(user) {

    return http.delete(`${apiUserEndpoint}${user}`);
};

export function updateUserPantry(user,pantry) {
    
    return http.put(`${apiUserEndpoint}pantry/:${user._id}`, {'pantry': pantry});
};


