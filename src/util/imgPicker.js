import sAdd from '../img/sAdd.png';
import TungstenLogo from '../img/TungstenLogo.png';

// Place to manage urls for img elements etc. 

export default function imgPicker(ing){ 
    const url = `https://www.thecocktaildb.com/images/ingredients/${ing}-Small.png`; //  (100x100 pixels)
    return  <img src={url} alt="tungsten" width="50" height="50" onError={handleOnError()} key={ing}></img>

}


export function ingredientButtons(i,index, buttonHandler,measure){ return <button key={index} style={ingStyle}
          onClick={() => buttonHandler(i)}>{imgPicker(i)}<h4 style={btntxt}>{i}</h4>{measure!==undefined && <h4 style={btntxt}>{measure}</h4>}</button>
}

export function ingCheckButtons(i,index, buttonHandler,measure){ return <button key={index} style={ingStyle}
          onClick={() => buttonHandler(i)}><div style={{marginLeft:'10px'}}>{imgPicker(i)}<img src={pantryIconUrl} alt="tungsten" style={ingCheckButtonStyle}></img></div><h4 style={btntxt}>{i}</h4>
          {measure!==undefined && <h4 style={btntxt}>{measure}</h4>}</button>
}

export const logo = () => { return (<div style={{textAlign: 'center', marginTop: '100px'}}><img src={TungstenLogo} alt="tungsten" style={logoStyle}></img></div>)}


export function ingImageUrl(ing){ 
    return `url(https://www.thecocktaildb.com/images/ingredients/${ing}-Small.png)`; //  (100x100 pixels)

}

// Pantry Component
export const loadPantryUrl = "https://media.giphy.com/media/LUeU77YRMp5b0hgd5R/giphy.gif"; // loading gif displayed when loading pantry ingredients


// Add Ingredient Component

export const loadIngredientUrl = "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" // loading gif displayed when searching ingredient in Pantry

export const loadIng = () => { return( <img src={loadIngredientUrl} alt="tungsten" style={imgStyle}  width="100" height="100"></img>)}

export const loadGen = () => { return( <img src={loadIngredientUrl} alt="tungsten" style={loadStyle}></img>)}

export const addIng = () => { return <img style={sAddButton} src={sAdd} alt="tungsten" onError={handleOnError()}></img> } //Small add icon for returned ingredient in search in Pantry Note: change to Image Url

export const noIngFound = () => { return <h2>Not Found :(</h2>} //Use Images?

export const ingError = () => { return <h2>Oops :(</h2>} //Use Images?


// Image error handle

const handleOnError = () => {

    //handle error --> 
}


// Log in form 

export const loggingWait = () => { return( <img src={loadIngredientUrl} alt="tungsten" style={imgStyle}></img>)} // displayed when submitting log in request // replaces form display

// menu/helper urls

export const backButtonUrl = "https://icon-library.com/images/back-button-icon-png/back-button-icon-png-26.jpg";

const likeIconUrl = "https://icon-library.com/images/heart-icon-free/heart-icon-free-4.jpg";
export const likeNav = () => { return ( <img src={likeIconUrl} alt="tungsten" style={navIconActiveStyle}></img> )}

const searchIconUrl = "https://icon-library.com/images/search-icon-ios/search-icon-ios-18.jpg";
export const searchNav = () => { return ( <img src={searchIconUrl} alt="tungsten" style={navIconActiveStyle}></img> )}

export const pantryIconUrl = "https://icon-library.com/images/chef-icon-png/chef-icon-png-4.jpg";
export const pantryNav = (status) => { return ( <img src={pantryIconUrl} alt="tungsten" style={status? navIconActiveStyle : navIconUnactiveStyle }></img> )}


const imgStyle = {
    display:'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
}


const loadStyle = {
    display:'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '25%',
}


const sAddButton = {
    padding: '0 0 32px 0',
    width: '16px'
}

const navIconActiveStyle = {
    background: 'transparent',
    width: '25px',
    margin: '0 0 0 20px',
}

const navIconUnactiveStyle = {
    background: 'transparent',
    width: '25px',
    margin: '0 0 0 20px',
    opacity: '0.2',
}


const ingStyle = {
    backgroundColor: 'transparent',
    background: 'transparent',
    margin: "5px",
    border: 'none',
    fontSize: '12px',
    padding: '8px',
    outline:'none'
}


const btntxt = {
    height: "10px",
    margin: "10px",
    fontWeight: 'normal'
  }

const ingCheckButtonStyle = {
    background: 'transparent',
    width: '20px',
    margin: '0 0 25px 0px',
    
}

const logoStyle = {
    width: '30%',
    height: 'auto'
}















