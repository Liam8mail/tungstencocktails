
import {apiUrl} from "../config.json"; // "apiUrl": "https://tungsten-server.herokuapp.com"

const apiEndpoint = `${apiUrl}/api/cocktail`;

export default async function apiFetch(url){
    try{
        const res = await fetch(apiEndpoint,{
            method: 'POST',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', 
            referrerPolicy: 'no-referrer', 
            body: JSON.stringify({ url:url })
          }); 
        return await res.json();
    }
    catch(ex){
        return ex;
    }
}

// put this code in your file or export this as default and import it. 
// change your all your fetch methods to apiFetch and delete all the await res.json
// change all your uri to include only /lookup.php?iid=${id} part of the url.
// example : 

//      const res = await apiFetch(`/lookup.php?iid=${id}`);
