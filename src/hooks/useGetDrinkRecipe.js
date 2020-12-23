import { useEffect, useState } from 'react';
import apiFetch from '../services/apiService';
//import { getCancelToken } from '../services/httpService';


export default function useGetFavs(API_URL){

    const [status, setStatus] = useState('init');
    const [drink, setDrink] = useState();

    useEffect(() => {
      
        let isMounted = true;
        async function cocktailRecipe(){
          
          try{
            setStatus("requesting");
            const jsonResult = await apiFetch(API_URL);
            if (isMounted){
                if (jsonResult && jsonResult.drinks[0]){
                    setDrink(jsonResult.drinks[0]);
                    setStatus("received");
                    
                }
            }
  
          }catch(error){
            setStatus("error");
          }
          
        }
  
        cocktailRecipe();
  
        return ()=> {
          isMounted = false;
        }


    }, [API_URL]);

    return {
        status,
        drink

    }

}



