import useGetPantry from '../hooks/useGetPantry';
import React, {useState} from 'react';
import '../style/style.css'
import AddIngredient from './AddIngredient';
import imgPicker, {loadPantryUrl} from '../util/imgPicker';
import { getUserObject } from '../services/authService';
import { updateUserPantry } from '../services/userService';

export default function Pantry(props){
    
    const  [pantry, setPantry] = useState();
    const  [selected, setSelected] = useState([]);
    const {status, ingredients} = useGetPantry(); // possible to add a refresh button to recall database values using dependancy prop

    const addIngredients = async(ingredient) => { // called from AddIngredient modal ok clicked
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
    
    const removeIngredients = async() => {
        try{
            let newPantry = ingredients.filter(i => !selected.some(e => e.idIngredient === i.idIngredient)); //removing selected ingredients from pantry on delete
            setPantry(newPantry);
           
            let cachedIng = [...ingredients]; 
            ingredients.length = 0;

            newPantry.forEach(e => { ingredients.push(e); }); // all other methods where unreliable
            const cachedSelected = [...selected];
            selected.length = 0;
            
            if (!await updateDB(newPantry)){
                cachedSelected.forEach(e => ingredients.push(e));
                setSelected(cachedSelected);
                setPantry(cachedIng); // set to original
                // Note display some friendly error
            }
        }
        catch(err){
            console.log(err);
        }

    }
    
    try{
        if (!props.isAuthed) // will never be called because we are removing function by logged in status condition instead
        return  <h1> Please Login </h1>
        
        switch(status){
            
            case 'init':
            return renderLoading(addIngredients); // shows loading display

            case 'requesting':
            return renderLoading(addIngredients);

            case 'received': 
            return renderPantry(pantry, addIngredients, selected, setSelected, ingredients, removeIngredients); //if ingredients recieved from database then we can render them.
       
            case 'invalid token': // Need to test 
            return  <h1> Please Login </h1>

            case 'error': // Tested
            throw new Error();

            default:
            return <><h1 style={style}>No items</h1><AddIngredient update={addIngredients}/></>

            }
        }catch(err){
                console.log(err);
                return <><h1 style={style}>Oops :(</h1><AddIngredient update={addIngredients}/></>
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


    // responsibe for rendering the list of ingredients
    const renderPantry = (pantry, updatePantry,selected, setSelected, ingredients, removeIngredients) => {
        let choice = pantry === undefined? ingredients : pantry; // pantry will always be undefined at init. we want to use database ingredients from useGetPantry. 
        if (choice.length > 0) // if we have something to show
        return (<React.Fragment><div style={{textAlign:'center', marginTop:'32px'}}><strong className='pantry-header'>
                Ingredients</strong><button style={buttonRemoveStyle(selected)} onClick={()=>removeIngredients()}></button>
                </div>
                <div  style={style}>
                <ul className="ingredient-list" style={{marginTop: '24px'}}> {choice.sort((a,b) => sortIng(a.strIngredient,b.strIngredient)).map(i => 
                <button key={i.idIngredient} style={buttonStyle(i, selected)} onMouseOver={e => buttonHovered(e,i,selected)} onMouseLeave={e => buttonUnhovered(e,i,selected)}  
                onClick={(e) => onSelect(i,selected,setSelected,e)}>{imgPicker(i.strIngredient)}<h4 style={btntxt}>{i.strIngredient}</h4></button>)} {/* handling selected ingredients -> onselect */}
                </ul> <AddIngredient update={updatePantry}/></div></React.Fragment>
                );

        return <><AddIngredient update={updatePantry}/><h1 style={style}>No items :(</h1></> 
}



    const renderLoading = updatePantry => {
        return( <>
            <h1 style={style}> </h1>
            <img src={loadPantryUrl} alt="tungsten" style={imgStyle}></img><AddIngredient update={updatePantry}/>
            </>)
}

    function sortIng(a, b){ //simple sorting that may be handled by default but i coded it for future mods.
        if(a > b) return 1
        if(a < b) return -1
        return 0;
    }

    
    function onSelect(ing, selected, setSelected){ // adds, removes selected items from list.
        const index = selected.findIndex(i => i.idIngredient === ing.idIngredient);
        
        let newSelection = [...selected] // copying array

        if (index === -1) // notFound;
            newSelection = [...selected, ing]
        else
            newSelection.splice(index,1); // removing ingredient from array if deselected
        setSelected(newSelection); // updating state
        //console.log(selected);

    }



    // Quick styling


    function buttonStyle(i, selected){
        //console.log(selected.includes(i));
        return selected.includes(i) ? ingstyleSel : ingStyle
}

    function buttonHovered({currentTarget: button},i,selected) {
        if (selected.includes(i)) return;
    
    button.style.background = 'linear-gradient(130deg, white 50%, hsla(120, 60%, 70%, 0.2)100%)'
}


    function buttonUnhovered({currentTarget: button},i,selected) { //styling  selected ingredients.
        if (selected.includes(i)) return;
        button.style.border = ingStyle.border;
        button.style.padding = ingStyle.padding;
        button.style.background = ingStyle.background;
}


    function buttonRemoveStyle(selected){ 
        if (selected && !selected.length > 0){
            return {

                backgroundColor: "transparent",
                width: '40px',
                marginRight: '80px',
                height: '40px',
                border: 'none',
                borderWidth : '1px',
                float: 'right',
                opacity: '0',
            }
        }else{
            return {

                background: `url('https://icon-library.com/images/trash-bin-icon/trash-bin-icon-7.jpg') no-repeat`,
                backgroundSize: 'contain',
                marginRight: '80px',
                width: '40px',
                height: '40px',
                border: 'none',
                borderWidth : '1px',
                float: 'right',
                opacity: '100',
            }
        }
       
    }



    
const style = {
    textAlign: 'center',
    padding: '48px 0',
}

const ingStyle = {
    backgroundColor: 'transparent',
    background: 'transparent',
    margin: "5px",
    borderRadius: '2%',
    border: 'none',
    fontSize: '12px',
    padding: '8px',
    outline:'none'
}

const ingstyleSel =  {
    backgroundColor: 'transparent',
    background: 'linear-gradient(20deg, white 50%, hsla(180, 60%, 70%, 0.2)100%)',
    margin: "5px",
    borderRadius: '2%',
    border: '',
    borderWidth: '1px',
    fontSize: '12px',
    padding: '7px',
    outline:'none'
}



const btntxt = {
    height: "10px",
    margin: "10px",
    fontWeight: 'normal'
  }

const imgStyle = {
    display:'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
}












      