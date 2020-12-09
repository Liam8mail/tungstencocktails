import useGetPantry from '../hooks/usePantry';
import {useState} from 'react';
import '../index.css';
import AddIngredient from './AddIngredient';
import imgPicker, {loadPantryUrl} from '../util/imgPicker';
import { getUserObject } from '../services/authService';
import { updateUserPantry } from '../services/userService';


export default function Pantry(props){
    
    const  [pantry, setPantry] = useState();
    
    const {status, ingredients} = useGetPantry(); // possible to add a refresh button to recall database values using dependancy prop

    const updatePantry = async(ingredient) => { // called from AddIngredient
        try{
            if (ingredients.some(i => i.idIngredient === ingredient.idIngredient)) return; //if ingredient is already in pantry; Note show some message
            let newPantry = [...ingredients,ingredient]; //has to be mutable
            setPantry(newPantry); //  optimistic update
            ingredients.push(ingredient); //update for next input, has to be unmutable
            
            if (!await updateDB(newPantry)){
                ingredients.pop() // revert if error updating db
                setPantry(ingredients); // set to original
                // Note display some friendly error
            }
        }
        catch(err){
            console.log(err);
        }
    }
    

    try{
        if (!props.isAuthed) // will never be calle because we are removing function by logged in status condition instead
        return  <h1> Please Login </h1>
        
        switch(status){
            
            case 'init':
            return renderLoading(updatePantry);

            case 'requesting':
            return renderLoading(updatePantry);

            case 'received': 
            return renderPantry(updatePantry,ingredients,pantry);
       
            case 'invalid token': // Need to test 
            return  <h1> Please Login </h1>

            case 'error': // Tested
            throw new Error();

            default:
            return <><h1 style={style}>No items</h1><AddIngredient update={updatePantry}/></>

            }
        }catch(err){
                console.log(err);
                return <><h1 style={style}>Oops :(</h1><AddIngredient update={updatePantry}/></>
        }

}
        

const updateDB = async newPantry => {
    
    try{
        let currentUser = getUserObject(); //user from token
        if(!currentUser || typeof currentUser === 'undefined') throw new Error('Invalid User');
        await updateUserPantry(currentUser, newPantry.map(i => i.idIngredient)); // auth protected server route
        //await updateUserPantry(currentUser, null); //error callback test -> sending invalid update to db -> uncomment for optimistic update revert test
        return true;
    }
    catch(err){
        if (err.response.data)
        console.log(err.response.data); //server comment
        else
        console.log(err);
        return false; //return false to revert display change in updatePantry Function
    }   
}



    const renderPantry = (updatePantry,ingredients,pantry) => {
        let choice = pantry === undefined? ingredients : pantry; // pantry will always be undefined at init. we want to use database ingredients from useGetPantry. 
        if (choice.length > 0) // if we have something to show
        return (<><h1 className="ingredient-text" style={style}>
                Ingredients<ul> {choice.sort((a,b) => sortIng(a.strIngredient,b.strIngredient)).map(i => <button key={i.idIngredient} style={ingstyle} >
            <span style={btntxt}>{i.strIngredient}</span>{imgPicker(i.strType, i.strIngredient)}</button>)}</ul> </h1><AddIngredient update={updatePantry}/></>);

        return <><AddIngredient update={updatePantry}/><h1 style={style}><AddIngredient update={updatePantry}/>No items :(</h1></> 
}



    const renderLoading = updatePantry => {
        return( <>
            <h1 style={style}> </h1>
            <img src={loadPantryUrl} alt="tungsten" style={imgStyle}></img><AddIngredient update={updatePantry}/>
            </>)
}

    function sortIng(a, b){
        if(a > b) return 1
        if(a < b) return -1
        return 0;
    }
    

    
const style = {
    textAlign: 'center',
}

const ingstyle = {
    backgroundColor: 'transparent',
    margin: "5px",
    borderRadius: '10%',
    border: 'none'
}
const btntxt = {
    height: "100px",
    margin: "5px",
}

const imgStyle = {
    display:'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
}




















      