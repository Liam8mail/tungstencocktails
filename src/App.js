import React, {useState, useEffect } from "react";
import { Route } from 'react-router-dom';
import Pantry from './components/Pantry';
import SearchCocktail from './components/mergeComp/SearchCocktail';
import LoginForm from './components/LoginForm';
import { getToken } from './services/authService';
import NavBar from "./components/SimpleNav";
import { ping } from './services/userService';
import './index.css';


function App (){

  
  const [onLineStatus, setOnlineStatus] = useState(false);


  useEffect(() => { // -- QUICK IMPLEMENTATION -- 
    if (getToken()) 
    setOnlineStatus(true);

  },[onLineStatus]);


    return (
      <div className="width" >
          <NavBar onLineStatus={onLineStatus} setOnlineStatus={setOnlineStatus}></NavBar>
            <Route path="/about"/>
            <Route path="/signup"/>
            <Route path="/somethingelse"/>
            <Route path="/search" render={(props) => (<SearchCocktail {...props} isAuthed={onLineStatus} />)} />
            { !onLineStatus && <Route path="/login" render={(props) => (<LoginForm {...props} isAuthed={setOnlineStatus} />)} />}
            { !onLineStatus && <Route path="/signup" render={(props) => (<LoginForm {...props} isAuthed={setOnlineStatus} />)} />}
            { onLineStatus &&   <Route path="/pantry" render={(props) => (<Pantry {...props} isAuthed={onLineStatus} />)}/>}
      </div>
    );
  }


export default App;

// const test = () => {
//   apiFetch("/lookup.php?iid=10");
// }

const pingSer = async() =>{
  await ping(); // loads server if unloaded  at init.
  //console.log(result);
}
pingSer();
