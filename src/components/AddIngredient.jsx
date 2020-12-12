import React from "react";
import Modal from "react-modal";
import { useState } from "react";
import useFormInput from "../hooks/useFormInput";
import useGetIngredient from "../hooks/useGetIngredient";
import imgPicker, {
  loadIng,
  addIng,
  ingError,
  noIngFound
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
    setQuery(input.value);
  };

  const displayResult = () => {
    try {
      switch (status) {
        case "init":
          return <h2> </h2>;

        case "requesting":
          return loadIng(); // imgPicker

        case "received":
          if (ing !== null)
            return (
              <>
                <h1> </h1>
                <button
                  key={ing.idIngredient}
                  style={ingstyle}
                  onClick={() => props.update(ing)}
                >
                  <span style={btntxt}>{ing.strIngredient}</span>
                  {imgPicker(ing.strType, ing.strIngredient)}
                  {addIng()}
                </button>
              </>
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
    <div className="width">
      <button onClick={open} style={addsty}>
        {" "}
        &nbsp;+&nbsp;{" "}
      </button>{" "}
      {/* button for adding ingredient  --> currently put it in mobile style*/}
      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={close}
        style={customStyles}
      >
        <button onClick={close} style={{ margin: "0px 0px 0px 200px" }}>
          close
        </button>{" "}
        {/* Modal content */}
        <h2>Add Ingredient</h2>
        <input {...input} id="InputText" style={{ padding: "4px" }} />
        <button onClick={() => submit(input)} style={{ fontSize: "16px" }}>
          search
        </button>
        <div style={{ textAlign: "center" }}>{displayResult()}</div>
      </Modal>
    </div>
  );
}

const customStyles = {
  //modal style

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.75)"
  },

  content: {
    top: "40%",
    left: "30%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const addsty = {
  // Button

  backgroundColor: "#4CAF50",
  border: "none",
  color: "white",
  padding: "0px",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "64px",
  borderRadius: "50%",
  position: "fixed",
  bottom: "20%",
  right: "50%"
};

const ingstyle = {
  backgroundColor: "transparent",
  margin: "5px",
  borderRadius: "10%",
  border: "none"
};

const btntxt = {
  height: "100px",
  margin: "5px",
  fontSize: "16px"
};
