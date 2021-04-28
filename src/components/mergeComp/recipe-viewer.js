import React, { useState, useEffect } from "react";
import { getUserObject } from '../../services/authService';
import { updateUserFavs } from '../../services/userService';
import useGetFavs from '../../hooks/useGetFavs';
import useGetDrinkRecipe from '../../hooks/useGetDrinkRecipe';
import {ingredientButtons, backButton, ingCheckButtons, likeIconUrl, loadRecipes} from '../../util/imgPicker';
import TungstenLogo_s from '../../img/TungstenLogo_s.png';
import '../../style/style.css'; // CSS



// NB: the state item drinks, inside recipeInstructionsApiData, hsa been filled with blank data in a format that matches the actual JSON data we hope to render.
    // this dummy data helps to correctly render the real JSON results, even if their is a delay before the JSON data can be read and the component needs to re-render with the new data.

function RecipeViewer (props) {
  
      const [loaded, setLoaded ] = useState(false);
      const image = React.createRef();
      const { isAuthed, userPantry, returnFromRecipe, backButtonText, recipeURL: API_URL} = props; // returnFromRecipe references a function in App.js which changes the active component back to the cocktails listed according to the chosen ingredients.
      const {drink, status } = useGetDrinkRecipe(API_URL);
      const [fav, setFav] = useState();
      const {status: favsStatus, favs } = useGetFavs();

      
  
  // function ScrollToTopOnMount() {
  //   useEffect(() => {
  //     window.scrollTo({
  //       top: window.innerHeight*0.33,
  //       behavior: 'smooth'
  //     });
  //   }, []);
  
  //   return null;
  // }

  const handleImageLoaded = () => { // changes img source from placeholder once image has loaded
    if(!loaded){
      setLoaded(true);
    }
  }
  
  useEffect(() => {
    
    if (isAuthed && favsStatus === 'received' && status === 'received'){
      setFav(favs.some(i => i.idDrink === drink.idDrink));
    }
  },[favsStatus,status,favs,drink, isAuthed])

  const toggleFav = async() => {
   
    const { idDrink, strDrink, strDrinkThumb, strAlcoholic, strCategory } = drink;
    const cocktail = { idDrink, strDrink, strDrinkThumb, strAlcoholic, strCategory }
    
    
    if (favs.some(i => i.idDrink === drink.idDrink)){
      const index = favs.findIndex(i => i.idDrink === cocktail.idDrink);
      favs.splice(index,1);
      updateFavProp(favs)
      setFav(false);
     if(!await updateDatabase(favs)){
       setFav(true);
       favs.push(cocktail);
       updateFavProp(favs)
      }
    }
    //ADD
    else{
      setFav(true);
      favs.push(cocktail);
      updateFavProp(favs)
      if(!await updateDatabase(favs)){
        setFav(false);
        favs.pop(cocktail);
        updateFavProp(favs)
      }
    }
    
  }
  const updateFavProp = favs => {
    if (props.updated) props.updated(favs);
  }

  const updateDatabase = async newFavs =>{
    try{
      let currentUser = getUserObject(); //user from token
      if(!currentUser || typeof currentUser === 'undefined') throw new Error('Invalid User');
      await updateUserFavs(currentUser, newFavs); // auth protected server route
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


  const handleLike = () => { //props -> updates favourites list
    toggleFav();
  }

 
  const ingredientNames = []; // getting ingredient values from drink props for rendering images // small amount of data to process // 
  if (status === 'received'){
      for (const prop in drink){
        if (drink && prop.match(/^strIngredient/) && drink[prop] !== ''  && drink[prop] !== null && !ingredientNames.some(i => i === drink[prop])){ //checking prop is stringredient
          const measurement = drink[`strMeasure${prop.slice(-1)}`]; //getting corresponding measurement using number values at end of prop name
          measurement != null ? ingredientNames.push({name : drink[prop], measure : measurement}) : ingredientNames.push({name : drink[prop]});  // pushing info as object  
        }
      }
      //console.log(ingredientNames);
  }

  const favIcon = () => { return <><button onClick={handleLike} style={{background: 'transparent', border: 'none'}}><img src={likeIconUrl} alt = "tungsten" style={ fav? favIconStyle : unFavIconStyle}></img></button></>}
  
    return(
      <div className="RecipeViewer">
      {backButton(returnFromRecipe, backButtonText)}    
      {(status === 'idle' || status === 'requesting')  && loadRecipes()}   
      {status === 'received' && <React.Fragment> {/* display details once api has been sucessfully loaded */ } 
        

          <div className="recipeImage" >
            <h1>{drink.strDrink}</h1><br />
            <>
            {isAuthed && favsStatus === 'received' && favIcon()}
            <img src= {loaded? drink.strDrinkThumb : TungstenLogo_s} alt="tungsten" style={imgStyle} ref={image} onLoad={handleImageLoaded}/>
            </>
            <h3>Glass</h3><div style={{color:'whitesmoke'}}><p >
                { drink.strGlass }
                { (!drink.strGlass || drink.strGlass === null) && 'any' }
                </p>
                </div>
          </div>
            <h3>Ingredients</h3><br />
            <div className="recipeview-inglist">
            {ingredientNames.sort().map((i,index) => {// Checking ingredients against ingredients in pantry
                if (isAuthed && userPantry && userPantry.some(e => e.strIngredient.toLowerCase() === i.name.toLowerCase())) // cocktail api has some issues with consistency in naming 
                return ingCheckButtons(i.name,i.name+index,function(){},i.measure,"60"); //displays pantry icon beside ing that user has
                return ingredientButtons(i.name,i.name+index,function(){},i.measure,"60");//displays reg ing
            })}
            </div>
            <h3>Instructions</h3>
            <div style={{textAlign:'center', float: 'center'}}>
                { styleInstruction(drink.strInstructions) }
            </div><hr></hr>
            </React.Fragment>
            } 
      </div>
    );
    
  }


export default RecipeViewer;


function styleInstruction(instructions){ // mapping instructions to single lines.

  const lines = instructions.split(/\.\s|\.$|\d\./);
  return(<p style={{lineHeight: '200%', whitSpace: 'pre-wrap', color:'white', padding:' 0 32px', maxWidth:'600px', margin: 'auto'}}>
  
    {lines.map((i,index )=> (
    i !== '' && <span key={index}><li className="recipe-text">{i}</li><br></br></span>
 ))}</p>
    
  )
}


const imgStyle = {
  display:'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '30px'
}

const favIconStyle = {
  position: 'relative',
  backgroundColor: 'transparent',
  background: 'transparent',
  width: '28px',
  margin: '0 -400% -105% 0%',
  outline:'none'
}

const unFavIconStyle = {
  position: 'relative',
  backgroundColor: 'transparent',
  background: 'transparent',
  width: '28px',
  margin: '0 -400% -105% 0%',
  outline:'none',
  opacity: '50%',

}
