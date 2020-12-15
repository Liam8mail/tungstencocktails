import React, { Component } from "react";
import apiFetch from '../../services/apiService';
import {loadGen, ingredientButtons, backButtonUrl} from '../../util/imgPicker';

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
      // const response = await fetch(API_URL);
      // const jsonResult = await response.json();
      const jsonResult = await apiFetch(API_URL);


      this.setState({status: "received"});
      console.log("jsonResult received:");
      console.log(jsonResult);
      this.setState({ recipeInstructionsApiData: jsonResult });
      this.setState({ isFetched: true });
      console.log("Mount attempt successful. Data Loaded:");
      console.log(this.state.recipeInstructionsApiData);
    } catch (error) {
      this.setState({ isFetched: false });
      console.log("mount attempt failed");
      this.setState({ errorMsg: error });
      console.log(this.state.errorMsg);
    }
  }

 

  render(){
    const returnFromRecipe = this.props.returnFromRecipe;
    console.log("API fetched yet? = "+this.state.isFetched);
    const drink = this.state.recipeInstructionsApiData.drinks[0];
   

    
    const ingredientNames = []; // getting ingredient values from drink props
      for (const prop in drink){
        if (drink && prop.match(/^strIngredient/) && drink[prop] !== ''  && drink[prop] !== null){
          ingredientNames.push(drink[prop]);
        }
      }


    if (this.state.status === 'received' || this.state.status === 'idle')
    return(
      <div className="RecipeViewer">
          <div>
          <div style={{minHeight:'400px'}}><img src= {drink.strDrinkThumb} alt="tungsten" style={imgStyle}/></div>
            <h1 style={{padding: '0 0 12px 0'}}>Recipe: {drink.strDrink}</h1>
            <h3>Ingredients:</h3>
            { ingredientNames.map(i => ingredientButtons(i,i,function(){}))}
            { drink.strGlass !== null &&
              <div>
                <h3>Type of glass:</h3>
                  <p>
                    { drink.strGlass }              
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
    else if (this.state.status === 'requesting')
    return(
      loadGen()
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


function styleInstruction(instructions){

  const lines = instructions.split('.');
  return(
    lines.map(i => (
      <p>{i}</p>
    ))
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
