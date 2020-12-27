import sAdd from '../img/sAdd.png';
import TungstenLogo from '../img/TungstenLogo-Final-01.png';
import TungstenText from '../img/TungstenText-01.png';
import TungstenLogo_s from '../img/TungstenLogo_s.png';
import searchIco from '../img/search-white.svg';
import loginWhite from '../img/user-white.svg';
import questionIcon from '../img/question-white.svg';
import pant from '../img/save-white.svg';
import heart from '../img/heart-white.svg';


// Place to manage urls for img elements etc. 

export default function imgPicker(ing,imgsize){ 
    if (ing === 'Midori') //doesn't exist in api database
    ing = 'Midori Melon Liqueur';

    const url = `https://www.thecocktaildb.com/images/ingredients/${ing}-Small.png`; //  (100x100 pixels)
    return  <img src={url} alt="tungsten" width={imgsize? imgsize:"80"} height={imgsize? imgsize:"80"} onError={handleOnError()} key={ing}></img>

}


export function ingImageUrl(ing){ 
    return `url(https://www.thecocktaildb.com/images/ingredients/${ing}-Small.png)`; //  (100x100 pixels)

}


export function ingredientButtons(i,index, buttonHandler,measure,imgsize){ return <button key={index} className="ingredientButtons" style={ingStyle}
          onClick={() => buttonHandler(i)}>{imgPicker(i,imgsize)}<br /><div style={{ingInfoStyle}}>{i}</div><br />{measure && <div style={{ingInfoStyle}}>{" Measure: "+measure}</div>}</button>
}

export function ingCheckButtons(i,index, buttonHandler,measure,imgsize){ return <button className="ingredientButtons" key={index} style={ingStyle}
          onClick={() => buttonHandler(i)}>{imgPicker(i,imgsize)}<img src={pantryIconUrl} alt="tungsten" style={ingCheckButtonStyle} key={`img${index}`}></img>
          <br /><div style={{ingInfoStyle}}>{i}</div><br />{measure && <div style={{ingInfoStyle}}>{" Measure: "+measure}</div>}</button>
}

export const logo = () => { return (<div style={{textAlign: 'center', marginTop: '100px'}}><img src={TungstenLogo} alt="tungsten" style={logoStyle}></img></div>)}


export const logoImg = TungstenLogo
export const logoText = TungstenText;

// Pantry Component
export const loadPantryUrl = "https://media.giphy.com/media/fxk77fLi2ZPQU6kHKx/giphy.gif"; // loading gif displayed when loading pantry ingredients


// Add Ingredient Component

export const loadUrl = "https://media.giphy.com/media/fxk77fLi2ZPQU6kHKx/giphy.gif" // loading gif displayed when searching ingredient in Pantry

export const loadIng = () => { return( <img src={loadUrl} alt="tungsten" style={imgStyle}  width="100" height="100"></img>)}

export const loadGen = () => { return( <img src={loadUrl} alt="tungsten" style={loadStyle} ></img>)}

export const addIng = () => { return <img style={sAddButton} src={sAdd} alt="tungsten" onError={handleOnError()}></img> } //Small add icon for returned ingredient in search in Pantry Note: change to Image Url

// loading display for the intial recipes
export const loadRecipes = () => { return <img src="https://media.giphy.com/media/fxk77fLi2ZPQU6kHKx/giphy.gif" alt="tungsten" style={loadStyle} width="10%"></img> }

export const noIngFound = () => { return <h2>Not Found :(</h2>} //Use Images?

export const ingError = () => { return <h2>Oops :(</h2>} //Use Images?

export const placeholder = TungstenLogo_s;
// Image error handle

const handleOnError = () => {

    //handle error --> 
}


// Log in form 

export const loggingWait = () => { return( <img src={loadUrl} alt="tungsten" style={imgStyle}></img>)} // displayed when submitting log in request // replaces form display

// menu/helper urls

export const backButtonUrl = "https://www.pngjoy.com/pngl/266/5094894_hamburger-menu-icon-white-back-icon-png-png.png";
export const backButton = (buttonHandler, backButtonText) => { return ( <button className="backButtonSty" onClick={() => buttonHandler()}><img src={backButtonUrl} alt="tungsten"/>{backButtonText}</button> )}

//const likeIconUrl = "https://icon-library.com/images/heart-icon-free/heart-icon-free-4.jpg";
export const likeIconUrl = heart;
export const likeNav = () => { return ( <img src={likeIconUrl} alt="tungsten" style={navIconActiveStyle} /> )}

const searchIconUrl = searchIco;
export const searchNav = () => { return ( <img src={searchIconUrl} alt="search icon" style={navIconActiveStyle} />)}

export const loginIcon = () => { return ( <img src={loginWhite} alt ="login icon" style={navIconActiveStyle} />)} ;

export const qMark = () => { return ( <img src={questionIcon} alt = "about icon" style={navIconActiveStyle} /> )};


//export const pantryIconUrl = "https://icon-library.com/images/chef-icon-png/chef-icon-png-4.jpg";
export const pantryIconUrl = pant;
export const pantryNav = (status) => { return ( <img src={pantryIconUrl} alt="tungsten" style={status? navIconActiveStyle : navIconUnactiveStyle }></img> )};


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
    
}


const sAddButton = {
    padding: '0 0 32px 0',
    width: '16px'
}

const navIconActiveStyle = {
    background: 'transparent',
    width: '20px',
    height:'20px',
    margin: '0 0 0 0px',
    fill: '#FFF',
    padding:'10px'
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
    outline:'none',
}

const ingInfoStyle = {
    display:'block',
    marginTop: '25px',
}


// const btntxt = {
//     height: "10px",
//     margin: "10px",
//     fontWeight: 'normal'
//   }

const ingCheckButtonStyle = {
    position: 'absolute',
    backgroundColor: 'transparent',
    background: 'transparent',
    
    width: '20px',
    margin: '0 0 85% 0px',
    outline:'none'
    
}

const logoStyle = {
    width: '30%',
    height: 'auto'
}















