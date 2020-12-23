import { useEffect, useState } from 'react';
import { getUserObject } from '../services/authService';
import { getUser } from '../services/userService';
import { getCancelToken } from '../services/httpService';
// import  apiFetch  from '../services/apiService';

// Quick Implementation responsible for getting the favs from users in database. // basically the same as useGetPantry

export default function useGetFavs(props){

    const [status, setStatus] = useState('init');
    const [favs, setFavs] = useState();
    
    if (props)
    console.log(props);
    useEffect(() => {
        let isMounted = true;
        const source = getCancelToken(); // we need to cancel the request if user the component unmounts. 

            async function requestUserFavs(){
                try {
                    
                    setStatus('requesting');
                    let currentUser = getUserObject();
                    if(!isMounted || !currentUser || typeof currentUser === 'undefined') return setStatus('invalid token');

                    currentUser = await getUser(currentUser, { cancelToken: source.token}); 
                    
                    if(isMounted){
                        const cocktails = currentUser.data.favs.filter(i => checkItem(i));
                        setFavs(cocktails);
                        setStatus('received');
                    }
                }
                catch(ex){
                    setStatus('error');
                    return ex;
                }
            }
            
            requestUserFavs();
        
        return () => {
            setStatus('idle');
            isMounted = false;
            source.cancel("canceled");
        };

    },[props]);

    return {
        status,
        favs
    }
}

function checkItem(i) {
    return i !== undefined; //checking items just in case there are blanks
}

