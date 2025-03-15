import "./App.css";
import Question from "./Components/NavbarButtons/Question";
import Section from "./Components/NavbarButtons/Section";
import Form from "./Components/Form/Form";
import Navbar from "./Components/NavbarButtons/Navbar";
import React, { startTransition, use, useState, useEffect } from "react";

function App() {
  const [addTextQuestion, setTextQuestion] = useState(0);
  const [isSectionStarted, setSectionsStatus] = useState(0);
  const [sectionContent, setSectionContent] = useState<{
    [key: string]: string[];
  }>({});
  const [currSectionTitle, setCurrSectionTitle] = useState<string>("");
  const [btnName, setBtnName] = useState("Start Section");

  const handleClickAddText = () => {
    if (!isSectionStarted) return ;
    setSectionContent((prev) => {
      const newContent = { ...prev };
      if (!newContent[currSectionTitle]) {
        newContent[currSectionTitle] = [];
      }
      newContent[currSectionTitle] = [...newContent[currSectionTitle], "text"];
      // console.log('Updated sectionContent:', newContent);
      return newContent;
    });
  };
  const handleClickStartSection = () => {
    if (btnName === "Start Section") {
      const title = prompt("Please provide the section name:");
      if (!title) return ;
      setCurrSectionTitle(title);
      setBtnName("End Section");
      setSectionsStatus(1);
    } else if (btnName === "End Section") {
      setBtnName("Start Section");
      setSectionsStatus(0);
    }
  };
  return (
    <>
      <Navbar>
        <button className="navbar-buttons" onClick={handleClickStartSection}>
          {btnName}
        </button>
        <button className="navbar-buttons" onClick={handleClickAddText}>
          Add Text
        </button>
      </Navbar>
      <Form>
        {Object.entries(sectionContent).map(([key, values], index) => (
          <div key={index}>
            <h3 className="hope">{key}</h3>
            {values.map((type, subIndex) => (
              <Question key={subIndex} question="how old are you" type={type} />
            ))}
          </div>
        ))}
      </Form>
    </>
  );
}

export default App;
