import React, { Component } from "react";
import apiFetch from '../../services/apiService';
import {loadGen, ingredientButtons, backButtonUrl, ingCheckButtons} from '../../util/imgPicker';



class RecipeViewer extends Component {
  constructor(props){
    super(props);
    this.state = {
      isFetched: false,
      recipeInstructionsApiData: {
        drinks: [{
            strDrink: "",
            strGlass: "",
            strIngredient1: "",
            strIngredient2: "",
            strIngredient3: "",
            strIngredient4: "",
            strIngredient5: "",
            strIngredient6: "",
            strIngredient7: "",
            strIngredient8: "",
            strInstructions: "",
          }]
      },
      errorMsg:"",
      status: "idle",
    };
  }
  async componentDidMount(){
    try {
      this.setState({status: "requesting"});

      const API_URL = this.props.recipeURL;
      const jsonResult = await apiFetch(API_URL);
      

      this.setState({status: "received"});
      console.log(this.state.status);
      // console.log("jsonResult received:");
      // console.log(jsonResult);
      this.setState({ recipeInstructionsApiData: jsonResult });
      this.setState({ isFetched: true });
      // console.log("Mount attempt successful. Data Loaded:");
      // console.log(this.state.recipeInstructionsApiData);
    } catch (error) {
      this.setState({ isFetched: false });
      //console.log("mount attempt failed");
      this.setState({ errorMsg: error });
      //console.log(this.state.errorMsg);
    }
  }

 

  render(){


    const returnFromRecipe = this.props.returnFromRecipe;
    //console.log("API fetched yet? = "+this.state.isFetched);
    const drink = this.state.recipeInstructionsApiData.drinks[0];
    const userPantry = this.props.userPantry;
    const isAuthed = this.props.isAuthed;
    const status = this.state.status;
    
    const ingredientNames = []; // getting ingredient values from drink props // small amount of data to process 
    if (status === 'received'){
        for (const prop in drink){
          if (drink && prop.match(/^strIngredient/) && drink[prop] !== ''  && drink[prop] !== null && !ingredientNames.some(i => i === drink[prop])){
            ingredientNames.push(drink[prop]);
          }
        }
    }


    if (status === 'received')
    return(
      <div className="RecipeViewer">
          <div>
          <div style={{minHeight:'360px', marginTop:'24px'}}><img src= {drink.strDrinkThumb} alt="tungsten" style={imgStyle}/></div>
            <h1 style={{padding: '0 0 12px 0'}}>Recipe: {drink.strDrink}</h1>
            <h3>Ingredients:</h3>
            {ingredientNames.sort(this.compareAbc).map((i,index) => { //Quick Merge -- // Checking ingredients against ingredients in pantry
                if (isAuthed && userPantry && userPantry.some(e => e.strIngredient.toLowerCase() === i.toLowerCase())) // cocktail api has some issues with consistency in naming 
                return ingCheckButtons(i,i+index,function(){}); //displays pantry icon beside ing that user has
                return ingredientButtons(i,i+index,function(){});//displays reg ing
                
            })}
            { drink.strGlass !== null &&
              <div>
                <h3>Type of glass:</h3>
                  <p>
                    { drink.strGlass }
                    { !drink.strGlass && 'any' }          
                  </p>
              </div>
            }
            <h3 style = {{margin: '5% 0 0 0 '}}>Instructions:</h3>
              <p className="font" style = {{ margin:'0 10%'}}>
                { styleInstruction(drink.strInstructions) }
              </p>
          </div>
          <p>
            <button onClick={returnFromRecipe} style={backSty}>
            <img src={backButtonUrl} alt="tungsten" width='50' height='auto'></img>
            </button>           
          </p>
      </div>
    );
    else if (status === 'requesting')
    return(
      loadGen()
    )
    else return(
      <button onClick={returnFromRecipe} style={backSty}>
      <img src={backButtonUrl} alt="tungsten" width='50' height='auto'></img>
      </button>           
    )
  }
}

export default RecipeViewer;


const imgStyle = {
  display:'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '33%',
  borderRadius: '30px'
}


function styleInstruction(instructions){ // mapping instructions to single lines. //cause errors react key errors etc atm <p> elements stacked

  const lines = instructions.split('.');
  return(<p style={{lineHeight: '200%', whitSpace: 'pre-wrap'}}>{lines.map((i,index )=> (
    <p key={index}>{i}</p>
 ))}</p>
    
  )
}


const backSty = {
  // Button
  border: "none",
  padding: "0px",
  background: 'transparent',
  textDecoration: "none",
  display: "inline-block",
  position: "fixed",
  bottom: "84%",
  right: "90%"
};
