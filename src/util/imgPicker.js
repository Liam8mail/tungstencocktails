import sAdd from '../img/sAdd.png';



export default function imgPicker(type, ing){ 
    const url = `https://www.thecocktaildb.com/images/ingredients/${ing}-Small.png`; //  (100x100 pixels)
    return  <img src={url} alt="tungsten" width="50" height="50" onError={handleOnError()}></img>

}

export function ingImageUrl(type, ing){ 
    return `url(https://www.thecocktaildb.com/images/ingredients/${ing}-Small.png)`; //  (100x100 pixels)

}

// Pantry Component
export const loadPantryUrl = "https://media.giphy.com/media/LUeU77YRMp5b0hgd5R/giphy.gif"; // loading gif displayed when loading pantry ingredients


// Add Ingredient Component

const loadIngredientUrl = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" // loading gif displayed when searching ingredient in Pantry

export const loadIng = () => { return( <img src={loadIngredientUrl} alt="tungsten" style={imgStyle}></img>)}

export const addIng = () => { return <img style={sAddButton} src={sAdd} alt="tungsten" onError={handleOnError()}></img> } //Small add icon for returned ingredient in search in Pantry Note: change to Image Url

export const noIngFound = () => { return <h2>Not Found :(</h2>} //Use Images?

export const ingError = () => { return <h2>Oops :(</h2>} //Use Images?


// Image error handle

const handleOnError = () => {

    //handle error --> 
}


// Log in form 

export const loggingWait = () => { return( <img src={loadIngredientUrl} alt="tungsten" style={imgStyle}></img>)} // displayed when submitting log in request // replaces form display



const imgStyle = {
    display:'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
}


const sAddButton = {
    padding: '0 0 32px 0',
    width: '16px'
}

// const addsty = {

//     backgroundColor: '#4CAF50',
//     border: 'none',
//     color: 'white',
//     padding: '0px',
//     textDecoration: 'none',
//     display: 'inline-block',
//     fontSize: '48px',
//     margin: '4px 0 0 400px',
//     borderRadius: '50%',

// }

















