import React, { Component } from "react";
import apiFetch from '../../services/apiService';
import { loadRecipes, backButton, ingredientButtons, ingCheckButtons } from '../../util/imgPicker';
import TungstenLogo_s from '../../img/TungstenLogo_s.png';

class RecipeResults extends Component {
  constructor(props){
    super(props);
    this.state = {
      errorMsg: "", // To store error mounting API
      recipeListApiData: "", // This is default / dummy API data (see import above). It should get replaced below. // has been removed
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
   
      try {
        this.setState({status: "requesting"});
        const testItem = {drinks:"None Found"};
        const API_URL = this.props.resultsURL;
        //console.log(API_URL);
        
        // const jsonResult = await response.json();
        const jsonResult = await apiFetch(API_URL); // fetching data from server
        //console.log("jsonResult received:");
        //console.log(jsonResult);
        if(jsonResult.drinks === testItem.drinks){ //used in the dev stage
          //console.log("Test case hit - blank results page");
          this.setState({ recipeListApiData: [] });
          // Otherwise it will fill it with data in the wrong format.
          // This way it is easy to identify empty results. 
        }
        else this.setState({ recipeListApiData: jsonResult.drinks });
        //console.log("Mount attempt successful. Data Loaded:");
        //console.log(this.state.recipeListApiData);
        if(img && img.complete)
          this.handleImageLoaded(); // changes the load state which will render the cocktail image 

        this.setState({status: "received"});

        window.scrollTo({
          top: window.innerHeight*0.33,
          behavior: 'smooth'
        });
        
      
      } catch (error) {
        //console.log(error);
        this.setState({ status: error });
        this.setState({ errorMsg: error });
      }
   
  }

  render(){
   
    const { userPantry, isAuthed, backButtonText, returnToSearch, filters, makeInstructionsURL } = this.props
    const { status, loaded, recipeListApiData: recipeList } = this.state;
    

    
    return(
      
      <div className="recResultsAll">
        {backButton(returnToSearch,backButtonText)}
        <div>
          <h4>Active Ingredients:</h4><br />
            {filters.sort(this.compareAbc).map((i,index) => {
                if (isAuthed && userPantry.some(e => e.strIngredient1 === i.strIngredient1)) // Checking ingredients against ingredients in pantry
                return ingCheckButtons(i.strIngredient1,i.strIngredient1+index,function(){},undefined,"60"); //add in pantry icon
                return ingredientButtons(i.strIngredient1,i.strIngredient1+index,function(){},undefined,"60"); // default icon
            })}
          </div>
        <h1>Cocktail Recipes</h1>
          
          {status === 'requesting' ? loadRecipes() : status === 'idle' && <></> } {/* display loading gif while api data is being req*/ }
            {/* display recipes once api has been sucessfully loaded */ }
          {status === 'received' &&  
          <>
          <p>Number of cocktails found: {recipeList.length}</p>
          {recipeList.map((a,index) => (
            
            <button
              onClick={() => makeInstructionsURL(a.idDrink)} // display loading gif while api data is being req // 
              key={index+"-recl"}
              className="cocktails"
            >
              <img src={loaded? a.strDrinkThumb : TungstenLogo_s} key={a.idDrink+index} alt='tungsten' ref={this.image} onLoad={this.handleImageLoaded} /><br /> {/* display cocktail image */ }
              <span className="IngredientsList">{a.strDrink}</span> {/* display cocktail name */ }
            </button>
          ))}
            </>
          }
          {status === 'error' && <></>}
      </div>
    );
  }
}

export default RecipeResults;
