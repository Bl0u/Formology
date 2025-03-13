import "./App.css";
import Question from "./Components/NavbarButtons/Question";
import Section from "./Components/NavbarButtons/Section";
import Form from "./Components/Form/Form";
import Navbar from "./Components/NavbarButtons/Navbar";
import React, { useState } from "react";

function App() {
  const [addTextQuestion, setTextQuestion] = useState(0);
  const handleClickAddText = () => {
    setTextQuestion((prev) => prev + 1);
    console.log(addTextQuestion);
  };
  const handleClickStartSection = () => {
    console.log('niggas');
    
  }
  return (
    <>
      <Navbar>
        <button className="navbar-buttons" onClick={handleClickStartSection}>Start Section</button>
        <button className='navbar-buttons' onClick={handleClickAddText}>Add Text</button>
      </Navbar>
      <Form>
        {Array(addTextQuestion)
          .fill(null)
          .map((_, index) => (
            <Question key={index} question="how old are you" type="text" />
          ))}
      </Form>
    </>
  );
}

export default App;
