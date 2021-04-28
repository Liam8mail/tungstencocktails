import React from "react";
import Modal from "react-modal";
import { useState } from "react";
import useFormInput from "../hooks/useFormInput";
import useGetIngredient from "../hooks/useGetIngredient";
import '../style/style.css';
import imgPicker, {
  loadUrl,
  ingError,
  noIngFound,
} from "../util/imgPicker";

export default function AddIngredient(props) {
  Modal.setAppElement(document.getElementById("root"));

  const [isOpen, setIsOpen] = useState(false); // modal state
  const [query, setQuery] = useState("***"); // text for search
  const input = useFormInput(""); // input form logic
  const { status, ingredient: ing } = useGetIngredient(query); // hook for returning searching cocktail db

  const open = () => {
    setIsOpen(true);
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed. model info => https://www.npmjs.com/package/react-modal
    // subtitle.style.color = '#f00';
  }

  const close = () => {
    setIsOpen(false);
  };

  const submit = (input) => {
    setQuery(input.value); // state will trigger useGetIngredient to retrive ingredient from cocktail db
  };

  const loading = () =>{
    return <img src={loadUrl} alt="tungsten" style={ingStyle}  width="80" height="80"></img>
  }

  const displayResult = () => {
    try {
      switch (status) { 
        case "init":
          return <h2> </h2>; //initial state -> nothing to show

        case "requesting":
          return loading(); // imgPicker

        case "received":
          if (ing !== null)
            return (
              <div>
                <h1> </h1>
               
                <button key={ing.idIngredient} className="ingredientButtons" style={ingStyle} 
                onClick={() => props.update(ing)}>{imgPicker(ing.strIngredient)}<br /><span className="ingredientsList">{ing.strIngredient}</span><br /></button>
                
              </div>
            );
          else return noIngFound();

        case "error":
          throw new Error();

        default:
          return <h2> </h2>;
      }
    } catch (err) {
      //console.log(err);
      return ingError();
    }
  };

  return (
    <div >
      <button onClick={open} className="pantryPlus">
        {" "}
        &nbsp;+&nbsp;{" "}
      </button>{" "}
      {/* button for adding ingredient  --> currently put it in mobile style*/}
      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={close}
        //style={customStyles}
        className="modal"
        overlayClassName="Overlay"
      > 
      <div>
        {/* <button onClick={close} style={{ float:'right' }} className="signIn">
          close
        </button>{" "} */}
        {/* Modal content */}
        <div style={{textAlign:'center'}}>
        <h2 style = {{margin: '8% 0'}}>Add Ingredient</h2>
        <input {...input} id="InputText" type="search" autoComplete="false" />
        <button className="signIn" onClick={() => submit(input)} style={{ display:'block', margin:'1rem auto' }}>
          search
        </button>
        <div style={{marginBottom: '8%'}}>{displayResult()}</div>
        </div>
        </div>
      </Modal>
    </div>
  );
}

const ingStyle = {
    backgroundColor: 'transparent',
    background: 'transparent',
    outline:'none',
    width:'120px'
}

