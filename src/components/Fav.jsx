
import React, {useState} from 'react';
import '../style/style.css'
import useGetFavs from '../hooks/useGetFavs';
import {placeholder, likeIconUrl} from '../util/imgPicker';
import RecipeViewer from '../components/mergeComp/recipe-viewer';
import useGetPantry from "../hooks/useGetPantry";


export default function Fav(props){
   
  
    const [display, setDisplay] = useState('Favourites');
    const {status: favsStatus, favs: cocktails } = useGetFavs();
    const {status: pantryStatus, ingredients } = useGetPantry();
    const [loaded, setLoaded ] = useState(false);
    const [recipeURL, setRecipeURL] = useState();
    const image = React.createRef();
   
    const handleImageLoaded = () => { // changes img source from placeholder once image has loaded
        if(!loaded){
          setLoaded(true);
        }
    }

    const makeInstructionsURL = (idDrink) =>  {

      if (pantryStatus === 'received'){
        if(idDrink){
          let recipeEARL = "/lookup.php?i=";
          recipeEARL += idDrink;
          setRecipeURL(recipeEARL);
          setDisplay("recipe-viewer");
        }
        else{
          console.log("received drink ID is null"); 
        }
      }
        
    }
    const updated = (favs) => { // function to update fav component according to recipeViewer changes 
      cocktails.length = 0;
      favs.forEach(e => cocktails.push(e));
    }

    const returnFromRecipe = () => { // function to change active component to the cocktails which include chosen ingredients

      setDisplay("Favourites");
    }
    
    if (display === 'Favourites' && pantryStatus === 'received'){
      try{
          if (!props.isAuthed) 
          return  <h1> Please Login </h1>
          
          switch(favsStatus){
              
              case 'init':
              return pantryStatus !== 'received' ? renderLoading() : <></>; // shows loading display
  
              case 'requesting':
              return pantryStatus !== 'received' ? renderLoading() : <></>; // shows loading display
  
  
              case 'received': 
              return renderFavs(cocktails,loaded, placeholder, handleImageLoaded, image, makeInstructionsURL); 
         
              case 'invalid token': // Need to test 
              return  <h1> Please Login </h1>
  
              case 'error': // Tested
              throw new Error();
  
              default:
              return <><small style={style}>your favs is empty</small></>
  
              }
          }catch(err){
                  console.log(err);
                  return <><h1 style={style}>Oops :(</h1></>
          }
  
    }else if(display === "recipe-viewer"){
      
      return <RecipeViewer
      updated={updated}
      favs={cocktails}
      isAuthed={props.isAuthed}
      userPantry={ingredients}
      returnFromRecipe={returnFromRecipe}
      backButtonText = {'Return to favourites'}
      recipeURL = {recipeURL}>
      </RecipeViewer>
    }
    else{
      return pantryStatus !== 'received' ? renderLoading() : <></>;// shows loading display
  
    }

}
    const renderLoading = () => {
      return <img src="https://media.giphy.com/media/fxk77fLi2ZPQU6kHKx/giphy.gif" alt="tungsten" style={{width:'10%', paddingTop:'200px'}}></img>
    }

    // responsibe for rendering favs
    const renderFavs = (cocktails,loaded, placeholder, handleImageLoaded, image, makeInstructionsURL) => {
        //console.log(cocktails)
        if (cocktails.length > 0)
        return (<React.Fragment>
            {cocktails.sort((a,b) => sort(a.strDrink,b.strDrink)).map((i,index) => ( <button
              onClick={() => makeInstructionsURL(i.idDrink)}
              key={index}
              className="cocktails"
              style={{margin: '1.5%'}}
            >
              <img src={likeIconUrl} alt="tungsten" style={favCheckButtonStyle}></img>
              <img src={loaded? i.strDrinkThumb : placeholder} key={i.idDrink+index} style={cocktail} alt='tungsten' ref={image} onLoad={handleImageLoaded}></img>
              <span className="IngredientsList">{i.strDrink}</span>
            </button>  
            ))}
        </React.Fragment>);
        else
        return <></> 
}


function sort(a, b){
    if(a > b) return 1
    if(a < b) return -1
    return 0;
}




const cocktail = {
    display:'block',
    marginBottom:'20px',
    marginTop:'40px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '120%',
    borderRadius: '33px',
    alt: 'tungsten'
    }



    
const style = {
    textAlign: 'center',
    padding: '48px 0',
}



const favCheckButtonStyle = {
  position: 'relative',
  backgroundColor: 'transparent',
  background: 'transparent',
  width: '12px',
  margin: '0 10% -65% 80%',
  outline:'none'
  
}











      