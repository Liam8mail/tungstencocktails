import React, { Component } from "react";
import apiFetch from '../../services/apiService';
import { drinks } from "./staticJSONsearchResults";
import { loadRecipes, backButton, ingredientButtons, ingCheckButtons } from '../../util/imgPicker';
import TungstenLogo_s from '../../img/TungstenLogo_s.png';

class RecipeResults extends Component {
  constructor(props){
    super(props);
    this.state = {
      isFetched: false,
      errorMsg: "",
      recipeListApiData: drinks,
      status: "idle",
      loaded:false,
    };
    this.image = React.createRef();
  }

  handleImageLoaded = () => { // changes img source from placeholder once image has loaded
    if(!this.state.loaded){
      this.setState({ loaded: true});
    }
  }


  async componentDidMount(){
     const img = this.image.current;
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
        if(img && img.complete){
          this.handleImageLoaded();
        }
        
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

    const { userPantry, isAuthed } = this.props
    const { status, loaded } = this.state;
    

    
    return(
      
      <div>
        {backButton(returnToSearch)}
        <div style={{margin:'20px'}}>
          <span>Active Ingredients:</span><br/>
            {filters.sort(this.compareAbc).map((i,index) => {
                if (isAuthed && userPantry.some(e => e.strIngredient1 === i.strIngredient1)) // Checking ingredients against ingredients in pantry
                return ingCheckButtons(i.strIngredient1,i.strIngredient1+index,function(){}); //add in pantry icon
                return ingredientButtons(i.strIngredient1,i.strIngredient1+index,function(){}); // default icon
            })}
          </div>
        <h1>Cocktail Recipes</h1>
        <p style={{margin: '10px'}}>Number of cocktails found: {recipeList.length}</p><br />
          
            <br />
          {status === 'requesting' ? loadRecipes() : status !== 'idle' ? <></> :  <></>} {/* display loading gif while api data is being req*/ }
            {/* display recipes once api has been sucessfully loaded */ }
          {status === 'received' &&  recipeList.map((a,index) => ( 
            <button
              onClick={() => makeInstructionsURL(a.idDrink)}
              key={index+"-recl"}
              className="cocktails"
            >
              <img src={loaded? a.strDrinkThumb : TungstenLogo_s} key={a.idDrink+index} style={cocktail} alt='tungsten' ref={this.image} onLoad={this.handleImageLoaded}></img>
              <span className="IngredientsList">{a.strDrink}</span>
            </button>
          ))}

      </div>
    );
  }
}

export default RecipeResults;



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