import React, { Component } from "react";
import apiFetch from '../../services/apiService';
import { drinks } from "./staticJSONsearchResults";
import { loadGen, backButtonUrl, ingredientButtons, ingCheckButtons } from '../../util/imgPicker';

class RecipeResults extends Component {
  constructor(props){
    super(props);
    this.state = {
      isFetched: false,
      errorMsg: "",
      recipeListApiData: drinks,
      status: "idle",
    };
  }
  async componentDidMount(){
    //if (this.props.resultsURL.length > 1) {
      //console.log("API key is present...");
      try {
        this.setState({status: "requesting"});
        const testItem = {drinks:"None Found"};
        const API_URL = this.props.resultsURL;
        //console.log(API_URL);
        
        // const jsonResult = await response.json();
        const jsonResult = await apiFetch(API_URL);
        //console.log("jsonResult received:");
        this.setState({status: "received"});
        //console.log(jsonResult);
        if(jsonResult.drinks === testItem.drinks){
          //console.log("Test case hit - blank results page");
          this.setState({ recipeListApiData: [] });
          // Otherwise it will fill it with data in the wrong format.
          // This way it is easy to identify empty results. 
        }
        else this.setState({ recipeListApiData: jsonResult.drinks });
        //console.log("Mount attempt successful. Data Loaded:");
        //console.log(this.state.recipeListApiData);
        this.setState({ isFetched: true });
      } catch (error) {
        //console.log(error);
        this.setState({ isFetched: false });
        this.setState({ errorMsg: error });
      }
    // } else {
    //   console.log("API key not present...");
    //   console.log("Mount attempt successful. Data Loaded:");
    //   console.log(this.state.recipeListApiData);
    // }
  }

  render(){
    const returnToSearch = this.props.returnToSearch;
    const recipeList = this.state.recipeListApiData;
    const filters = this.props.filters;
    const makeInstructionsURL = this.props.makeInstructionsURL;
    const userPantry = this.props.userPantry;
    const status = this.state.status;
    const isAuthed = this.props.isAuthed;

    if (status === 'received')
    return(
      
      <div>
        <button style= {backSty} onClick={returnToSearch}>
        <img src={backButtonUrl} alt="tungsten" width='50' height='auto'></img>
        </button>
        <div style={{margin:'20px'}}>
          <span>Active Ingredients:</span><br/>
            {filters.sort(this.compareAbc).map((i,index) => {
                if (isAuthed && userPantry.some(e => e.strIngredient1 === i.strIngredient1)) // Checking ingredients against ingredients in pantry
                return ingCheckButtons(i.strIngredient1,i.strIngredient1+index,function(){});
                return ingredientButtons(i.strIngredient1,i.strIngredient1+index,function(){});
            })}
          </div>
        <h1>Cocktail Recipes</h1>
        <p style={{margin: '10px'}}>Number of cocktails found: {recipeList.length}</p><br />
          
            <br />
          {recipeList.map((a,index) => (
            <button
              onClick={() => makeInstructionsURL(a.idDrink)}
              key={index+"-recl"}
              className="cocktails"
            >
              <img src={a.strDrinkThumb} key={a.idDrink+index} style={cocktail} alt='tungsten'></img><b style={{maxWidth: '10px', textAlign: 'center',margin: '30px' }}>{a.strDrink}</b>
            </button>
          ))}
      </div>
    );
    else if (status === 'requesting')
    return(
      loadGen()
    )
    else return(
      <div>
        <button style= {backSty} onClick={returnToSearch}>
        <img src={backButtonUrl} alt="tungsten" width='50' height='auto'></img>
        </button>
      </div>
    )
  }
}

export default RecipeResults;


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

const ingStyle = {
  backgroundColor: 'transparent',
  background: 'transparent',
  margin: "0px",
  borderRadius: '0%',
  border: 'none',
  fontSize: '12px',
  padding: '8px',
  outline:'none'
}

const btntxt = {
  height: "10px",
  margin: "10px, 0",
  fontWeight: 'normal',

}

const cocktail = {
  display:'block',
  marginBottom:'20px',
  marginTop:'40px',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: '100px',
  borderRadius: '30px',
  alt: 'tungsten'
}