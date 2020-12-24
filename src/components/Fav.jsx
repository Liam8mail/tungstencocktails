
import React, {useEffect, useState} from 'react';
import { Route } from 'react-router-dom';
import '../style/style.css'
import useGetFavs from '../hooks/useGetFavs';
import {placeholder, likeIconUrl, loadUrl} from '../util/imgPicker';
import RecipeViewer from '../components/mergeComp/recipe-viewer';
import useGetPantry from "../hooks/useGetPantry";
import useFormInput from '../hooks/useFormInput';


export default function Fav(props){
  
    const [display, setDisplay] = useState(props.setDisplay);
    const [loaded, setLoaded ] = useState(false);
    const [recipeURL, setRecipeURL] = useState();

    const {status: favsStatus, favs: cocktails } = useGetFavs();
    const {status: pantryStatus, ingredients } = useGetPantry();
    const image = React.createRef();
    const input = useFormInput('');
    

    const handleImageLoaded = () => { // changes img source from placeholder once image has loaded
        if(!loaded){
          setLoaded(true);
        }
    }

    useEffect(()=>{
      if (props.location.pathname === '/fav/recipes'){
        setDisplay('Favourites');
      }
    },[setDisplay,props.location.pathname])


    
    const makeInstructionsURL = (i) =>  {
      
      if (pantryStatus === 'received'){
        if(i.idDrink){
          let recipeEARL = "/lookup.php?i=";
          recipeEARL += i.idDrink;
          setRecipeURL(recipeEARL);
          props.history.push(`${props.match.url}/${i.strDrink}`);
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
      props.history.go(-1);
    }
    
    const filtList = cocktail => {
      return input.value ? cocktail.strDrink.toLowerCase().includes(input.value.toLowerCase()) :  cocktail
    }


    const Recipe = () => {
      return(
      <Route path={`${props.match.url}/:id`} render={(props) => (<RecipeViewer {...props} 
      updated={updated}
      favs={cocktails}
      isAuthed={props.isAuthed}
      userPantry={ingredients}
      returnFromRecipe={returnFromRecipe}
      backButtonText = {'Return to favourites'}
      recipeURL = {recipeURL} />)}>
      </Route>)
    }
    
    if (display === 'Favourites'){
      try{
          if (!props.isAuthed) 
          return  <h1> Please Login </h1>
          
          switch(favsStatus){
              
              case 'init':
              return renderLoading(); // shows loading display
  
              case 'requesting':
              return renderLoading(); // shows loading display
  
              case 'received': 
              return <Route path="/fav/recipes">{renderFavs(cocktails,loaded, placeholder, handleImageLoaded, image, makeInstructionsURL, filtList, input)}</Route>; 
         
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
      return pantryStatus !== 'received' ? renderLoading() : Recipe();
    }
    
}
    const renderLoading = () => {
      return <img src={loadUrl} alt="tungsten" style={{width:'10%', paddingTop:'200px'}}></img>
    }

    // responsibe for rendering favs
    const renderFavs = (cocktails,loaded, placeholder, handleImageLoaded, image, makeInstructionsURL, filtList, input) => {
        //console.log(cocktails)
        
        if (cocktails.length > 0)
        return (<React.Fragment><div className="SearchFormForm">
              <form>
                <h4 style={{margin: '0 0 12px 0'}}>Search Favourites: </h4> 
                <input {...input} type="search" placeholder="Search"/>
              </form>
              <p>Number of cocktails found: {cocktails.filter(filtList).length}<br /></p>
            </div>
            {cocktails.filter(filtList).sort((a,b) => sort(a.strDrink,b.strDrink)).map((i,index) => ( <button
              onClick={() => makeInstructionsURL(i)}
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
        return <small style={{ marginTop: '420px'}}> empthy </small> 
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
    borderRadius: '13px',
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
  margin: '0 10% -60% 90%',
  outline:'none'
  
}











      