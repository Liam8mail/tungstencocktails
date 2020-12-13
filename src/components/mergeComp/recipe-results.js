import React, { Component } from "react";
import { drinks } from "./staticJSONsearchResults";

class RecipeResults extends Component {
  constructor(props){
    super(props);
    this.state = {
      isFetched: false,
      errorMsg: "",
      recipeListApiData: drinks
    };
  }
  async componentDidMount(){
    if (this.props.resultsURL.length > 1) {
      console.log("API key is present...");
      try {
        const testItem = {drinks:"None Found"};
        const API_URL = this.props.resultsURL;
        const response = await fetch(API_URL);
        const jsonResult = await response.json();
        console.log("jsonResult received:");
        console.log(jsonResult);
        if(jsonResult.drinks === testItem.drinks){
          console.log("Test case hit - blank results page");
          this.setState({ recipeListApiData: [] });
          // Otherwise it will fill it with data in the wrong format.
          // This way it is easy to identify empty results. 
        }
        else this.setState({ recipeListApiData: jsonResult.drinks });
        console.log("Mount attempt successful. Data Loaded:");
        console.log(this.state.recipeListApiData);
        this.setState({ isFetched: true });
      } catch (error) {
        this.setState({ isFetched: false });
        this.setState({ errorMsg: error });
      }
    } else {
      console.log("API key not present...");
      console.log("Mount attempt successful. Data Loaded:");
      console.log(this.state.recipeListApiData);
    }
  }

  render(){
    const returnToSearch = this.props.returnToSearch;
    const recipeList = this.state.recipeListApiData;
    const filters = this.props.filters;
    const makeInstructionsURL = this.props.makeInstructionsURL;

    return(
      <div>
        <button onClick={returnToSearch}>
          Return to Search
        </button>
        <h1>Cocktail Recipes</h1>
        <p>Number of cocktails found: {recipeList.length}<br />
          Active filters:
            {filters.sort(this.compareAbc).map(a => (
                <span
                  key={a.strIngredient1 + "filtRes"}
                >
                  <b>{"   "}{a.strIngredient1}</b>
                </span>
              ))}
            <br />
            To change your filters, return to <button onClick = {returnToSearch}>previous page </button>
        </p>
        
          {recipeList.map(a => (
            <button
              onClick={() => makeInstructionsURL(a.idDrink)}
              key={a.idDrink+"-recl"}
              className="orange"
            >
              <b>{a.strDrink}</b>
            </button>
          ))}
      </div>
    );
  }
}

export default RecipeResults;