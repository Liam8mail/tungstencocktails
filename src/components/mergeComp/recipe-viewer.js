import React, { Component } from "react";

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
      errorMsg:""
    };
  }
  async componentDidMount(){
    try {
      const API_URL = this.props.recipeURL;
      const response = await fetch(API_URL);
      const jsonResult = await response.json();
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
    return(
      <div className="RecipeViewer">
          <div>
            <h1>Recipe: {drink.strDrink}</h1>
              <p>
                <button onClick={returnFromRecipe}>
                  Return to Previous
                </button>           
              </p>
            <h3>Ingredients:</h3>
              <ul>
                { drink.strIngredient1 !== null &&
                  <li> { drink.strIngredient1 } </li>
                }
                { drink.strIngredient2 !== null &&
                  <li> { drink.strIngredient2 } </li>
                }
                { drink.strIngredient3 !== null &&
                  <li> { drink.strIngredient3 } </li>
                }
                { drink.strIngredient4 !== null &&
                  <li> { drink.strIngredient4 } </li>
                }
                { drink.strIngredient5 !== null &&
                  <li> { drink.strIngredient5 } </li>
                }
                { drink.strIngredient6 !== null &&
                  <li> { drink.strIngredient6 } </li>
                }
                { drink.strIngredient7 !== null &&
                  <li> { drink.strIngredient7 } </li>
                }
              </ul>
            { drink.strGlass !== null &&
              <div>
                <h3>Type of glass:</h3>
                  <p>
                    { drink.strGlass }              
                  </p>
              </div>
            }
            <h3>Instructions:</h3>
              <p>
                { drink.strInstructions }
              </p>
          </div>
      </div>
    );
  }
}

export default RecipeViewer;