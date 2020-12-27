
import React, {useEffect, useState} from 'react';
import { Route } from 'react-router-dom';
import '../style/style.css'
import useGetFavs from '../hooks/useGetFavs';
import {placeholder, likeIconUrl, loadUrl} from '../util/imgPicker';
import RecipeViewer from '../components/mergeComp/recipe-viewer';
import useGetPantry from "../hooks/useGetPantry";
import useFormInput from '../hooks/useFormInput';
import DropDown from './DropDown';


export default function Fav(props){
  
    const [display, setDisplay] = useState(props.setDisplay);
    const [loaded, setLoaded ] = useState(false);
    const [recipeURL, setRecipeURL] = useState();
    const [cocktails, setCocktails] = useState();
    const [isNonAlc, setIsNonAlc] = useState(false);
    const [categorys, setCategorys] = useState([]);


    const {isAuthed} = props;
    const {status: favsStatus, favs } = useGetFavs();
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


    useEffect(() => {
      if (!cocktails) return;

      const categoryList = [];
      let count = 0;
      cocktails.forEach(cocktail => {
          if (cocktail['strCategory']){
            if (!categoryList.some( i => i ===  cocktail['strCategory']))
             categoryList.push(cocktail['strCategory']);
        }
      })
      setCategorys(categoryList.sort().map(i => ({id: count++, title: i, selected: false}) ));
    },[cocktails]);


    const DropDownList = () => {
      
      if (!categorys) return <DropDown title="No Categories" single="Selected" multi="Selected" list={[]} toggleItem={toggleItem}></DropDown>;
      return(
        <DropDown title="Select Categories" single="Category" multi="Categories" list={categorys} toggleItem={toggleItem}></DropDown>
        )
      }
      
      const toggleItem = (id) => {
        const temp = [...categorys];
        temp[id].selected = !temp[id].selected;
        setCategorys(temp);
      }
   


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
      setCocktails(favs);
    }
    
    const returnFromRecipe = () => { // function to change active component to the cocktails which include chosen ingredients
      props.history.go(-1);
    }
    
    const filtList = cocktail => {
      return input.value ? cocktail.strDrink.toLowerCase().includes(input.value.toLowerCase()) :  cocktail
    }

    const filtAlc = cocktail => {
      return isNonAlc ? cocktail.strAlcoholic.includes('Non alcoholic') : cocktail;
    }

    const filtCat = cocktail => {
      return categorys.some(el =>  el['selected'] === true) ? categorys.some(el => el['title'] === cocktail['strCategory'] && el['selected'] === true) && cocktail : cocktail;
    }

    const handleAlcFilt = () =>{
      setIsNonAlc(!isNonAlc);
    }


    const Recipe = () => {
      return(
      <Route path={`${props.match.url}/:id`} render={(props) => (<RecipeViewer {...props} 
      updated={updated}
      favs={cocktails}
      isAuthed={isAuthed}
      userPantry={ingredients}
      returnFromRecipe={returnFromRecipe}
      backButtonText = {'Return to favourites'}
      recipeURL = {recipeURL} />)}>
      </Route>)
    }

  
    if (favsStatus === 'received' && !cocktails) setCocktails(favs);
    
    if (display === 'Favourites'){
      //cocktails.map(i => console.log(i.strCategory));
      try{
        if (!props.isAuthed) 
        return  <h1> Please Login </h1>
        
        switch(favsStatus){
              
          case 'init':
              return renderLoading(); // shows loading display
              
              case 'requesting':
                return renderLoading(); // shows loading display
  
              case 'received': 
              return <Route path="/fav/recipes">{renderFavs(favs, cocktails,loaded, placeholder, handleImageLoaded, image, 
                                                makeInstructionsURL, filtList, filtAlc, input, handleAlcFilt, isNonAlc, DropDownList, filtCat)}</Route>; 
         
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
      const renderFavs = (favs, cocktails,loaded, placeholder, handleImageLoaded, image, makeInstructionsURL, filtList, filtAlc, input, handleAlcFilt, isNonAlc, DropDownList, filtCat) => {
          //console.log(cocktails)
          const choice = cocktails ? cocktails : favs;
          if (choice.length > 0)
          return (<React.Fragment><div className="SearchFormForm" style={{marginTop: '64px'}}>
      
                  <div className="favsOptions">
                  <form>
                    <h4 style={{marginBottom: '12px'}}>Search Favourites </h4> 
                    <input {...input} type="search" placeholder="Search"/>
                  </form>
      
                    <div style={{position: 'absolute',left:'63%'}}>
                    <h4 style={{marginBottom: '12px'}}>Non-Alcoholic</h4>
                    <label className="switch" >
                      <input type="checkbox" onClick={handleAlcFilt} defaultChecked={isNonAlc}/>
                      <span className="slider round"></span>
                    </label>
                    </div>

                  <div style={{position: 'absolute',right:'63%', top:'0%'}}>
                  {/* <h4 style={{margin: '0 0 12px 0'}}>Category</h4> */}
                   {DropDownList()}
                </div>

                  </div>
                <p>Number of cocktails found: {choice.filter(filtList).filter(filtAlc).filter(filtCat).length}<br /></p>
              </div>
              <div className="fav-cocktails-list">
              {choice.filter(filtList).filter(filtAlc).filter(filtCat).sort((a,b) => sort(a.strDrink,b.strDrink)).map((i,index) => ( <button
                onClick={() => makeInstructionsURL(i)}
                key={index}
                className="cocktails"
                
              >
                <img src={likeIconUrl} alt="tungsten" style={favCheckButtonStyle}></img>
                <img src={loaded? i.strDrinkThumb : placeholder} key={i.idDrink+index} alt='tungsten' ref={image} onLoad={handleImageLoaded}></img>
                <div className="IngredientsList">{i.strDrink}</div>
              </button>  
              ))}
              </div><hr></hr>
          </React.Fragment>);
          else
          return <small style={{ position:'absolute', margin: '10% 0'}}> {'<empty>'} </small> 
      }


    function sort(a, b){
      if(a > b) return 1
    if(a < b) return -1
    return 0;
  }
  
 
const style = {
    textAlign: 'center',
    padding: '48px 0',
}



const favCheckButtonStyle = {
  position: 'relative',
  left: '65%',
  bottom:'-40%',
  float:'top',
  backgroundColor: 'transparent',
  background: 'transparent',
  width: '10%',
  outline:'none',
  
}











      