import { useEffect, useState } from 'react';
import { getUserObject } from '../services/authService';
import { updatePantry } from '../services/userService';
import { getCancelToken } from '../services/httpService';


export default function useUpdateUser(){

    const [user, setUser] = useState();
    
    
    useEffect(() => {
        
        const source = getCancelToken();
        let isMounted = true;
        
        async function updateUser(){
            try{
                let currentUser = getUserObject();
                if(!isMounted || !currentUser || typeof currentUser === 'undefined') return setUser(null);
                currentUser = await updatePantry(currentUser, { cancelToken: source.token });
                console.log(currentUser);
            }
            catch(err){
                setUser(null);
            }

        }
        updateUser();
        
        return () => {
            isMounted = false;
            source.cancel("canceled");
        };

    },);

    return {
        user
    }

}