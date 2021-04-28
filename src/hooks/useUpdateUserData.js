import { useEffect, useState } from 'react';
import { getUserObject } from '../services/authService';
import { updateUserFavs, updateUserPantry } from '../services/userService';
import { getCancelToken } from '../services/httpService';

// Hook for retrieving user details from jwt token and updating users pantry// not used at the moment
export default function useUpdateUserPantry(props){

    const [user, setUser] = useState();
    const [status, setStatus] = useState();
    setStatus('init');
    
    useEffect(() => {
        
        const source = getCancelToken();
        let isMounted = true;
        async function updateUser(){
            try{
                setStatus('requesting');
                let currentUser = getUserObject();
                if(!isMounted || !currentUser || typeof currentUser === 'undefined') return setUser(null);

                if(props.type === 'pantry')
                currentUser = await updateUserPantry(currentUser, props.data,  { cancelToken: source.token });

                if(props.type === 'favs')
                currentUser = await updateUserFavs(currentUser, props.data,  { cancelToken: source.token });

                setStatus('received');
                console.log(currentUser);
            }
            catch(err){
                setStatus('error');
                console.log(err);
            }

        }
        updateUser();
        
        return () => {
            isMounted = false;
            source.cancel("canceled"); //cancel request on unmount
        };

    },[props]);

    return {
        user,
        status
    }

}