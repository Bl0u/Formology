import "./App.css";
import Question from "./Components/NavbarButtons/Question";
import Form from "./Components/Form/Form";
import Navbar from "./Components/NavbarButtons/Navbar";
import React, { useState } from "react";
import { generateUniqueId } from "./Components/NavbarButtons/type.ts";

interface SectionContent {
  title: string;
  questions: {
    [key: string]: string; // id : string = id: text || radio || select
  };
}

function App() {
  const [sectionContent, setSectionContent] = useState<{
    [id: string]: SectionContent;
  }>({});
  const [currSectionId, setCurrSectionId] = useState<string | null>(null);
  const [btnName, setBtnName] = useState("Start Section");

  const handleClickAddText = () => {
    if (!currSectionId) return;

    setSectionContent((prev) => {
      const newContent = { ...prev };
      const currTextId = generateUniqueId();

      newContent[currSectionId] = {
        ...newContent[currSectionId],
        questions: {
          ...newContent[currSectionId].questions,
          [currTextId]: "text",
        },
      };

      return newContent;
    });
  };

  const handleClickAddRadio = () => {
    if (!currSectionId) return ;

    setSectionContent((prev) => {
      const newContent = {...prev} ;
      const currRadioId = generateUniqueId() ;
      newContent[currSectionId] = {
        ...newContent[currSectionId],
        questions: {
          ...newContent[currSectionId].questions,
          [currRadioId]: 'radio'
        }, 
      } ;

      return newContent ;
    })
  }

  const handleRemoveOption = (id: string) => {
    setSectionContent((prev) => {
      const newContent = { ...prev };
      Object.keys(newContent).forEach((sectionId) => {
        if (newContent[sectionId].questions[id]) {
          delete newContent[sectionId].questions[id];
        }
      });
      return newContent;
    });
  };

  const handleClickStartSection = () => {
    if (btnName === "Start Section") {
      const title = prompt("Please provide the section name:");
      if (!title) return;

      const existingSectionId = Object.keys(sectionContent).find(
        (id) => sectionContent[id].title === title
      );

      if (existingSectionId) {
        setCurrSectionId(existingSectionId);
      } else {
        const newSectionId = generateUniqueId();
        setCurrSectionId(newSectionId);
        setSectionContent((prev) => ({
          ...prev,
          [newSectionId]: {
            title: title,
            questions: {},
          },
        }));
      }

      setBtnName("End Section");
    } else {
      setBtnName("Start Section");
      setCurrSectionId(null);
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
        <button className="navbar-buttons" onClick={handleClickAddRadio}>
          Add Radio
        </button>
      </Navbar>
      <Form>
        {Object.entries(sectionContent).map(([sectionId, section]) => (
          <div key={sectionId}>
            <h3 className="section-title">{section.title}</h3>
            {Object.entries(section.questions).map(([questionId, type]) => (
              <Question
                key={questionId}
                id={questionId}
                type={type}
                removeOption={handleRemoveOption}
              />
            ))}
          </div>
        ))}
      </Form>
    </>
  );
}

export default App;