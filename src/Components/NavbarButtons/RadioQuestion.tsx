import "../CSS/RadioQuestion.css"
import { useEffect, useRef, useState } from "react";
import { BaseQuestionProps, QuestionFormat } from "./type.ts"; // Ensure this import path is correct
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch.tsx";
import { Trash2 } from "lucide-react";

export default function RadioQuestion(props: BaseQuestionProps) {
  const [radioQuestion, setQuestion] = useState<QuestionFormat>(
    {} as QuestionFormat
  );
  const questionRef = useRef(null) ;


  useEffect(() => {
    questionRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });

  }, [radioQuestion])
  
  useEffect(() => {
    if (props.updateSectionsGlobalState) {
      props.updateSectionsGlobalState(radioQuestion);
    }  }, [radioQuestion]);

  useEffect(() => {
    setQuestion(props?.questionDetails ?? {} as QuestionFormat);
  }, [props.questionDetails]);



  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // Function to add a new empty choice without selecting it automatically
  const addChoice = () => {
    // Proper way to add a new empty choice
    setQuestion((currQuestion) => ({
      ...currQuestion,
      values: [...(currQuestion.values || []), ""],
    }));
  };

  // Function to update a specific choice
  const updateChoice = (index: number, value: string) => {
    setQuestion((prev) => {
      const newValues = [...(prev.values ?? [])];
      newValues[index] = value;
      const newQuestion = { ...prev, values: newValues };
      return newQuestion;
    });
  };

  const removeChoice = (index: number) => {
    setQuestion((prev) => {
      return { ...prev, values: prev?.values?.filter((_, i) => i !== index) };
    });

  };

  const updateQuestion = (value: string) => {
    setQuestion((prev) => {
      let newQuestionValue = prev.question ?? ""; // this is teh quetion type of string
      newQuestionValue = value; // this should hold the new value of the question currently typed
      return { ...prev, question: newQuestionValue };
    });
  };
  const handleChoiceChange = (choice: string) => {
    setQuestion((prev) => ({
      ...prev,
      answer: choice,
    }));
  };

  return (
    <div className="question" ref={questionRef}>
      <ToggleSwitch
          label="move-me"
          questionId={radioQuestion?.questionId}
        />
        <button className="TrashButton">
          <Trash2
            className="trashPosition"
            onClick={() => {
              if (props.removeOption) {
                props.removeOption(radioQuestion?.questionId);
              }
            }}
            size={18}
            color="#f44336"
          />
        </button>
      {/* Question Textarea */}
      <textarea
        className="textareaQuestion"
        onChange={(e) => {
          setQuestion((prev) => {
            const newQuestion = { ...prev };
            newQuestion.question = e.target.value;
            return newQuestion;
          });
        }}
        value={radioQuestion.question ?? ""}
        rows={1}
        cols={40}
        placeholder="Enter Question Here"
      ></textarea>
      <br />

      {/* Loop through choices dynamically */}
      {radioQuestion.values?.map((choice, index) => (
        <div key={index} className="choice-container">
          <div className="input-checkbox-container">
            <input
              className="inputChoices"
              type="text"
              value={choice}
              onChange={(e) => updateChoice(index, e.target.value)}
              placeholder={`Enter option number ${index + 1}`}
            />
            <input
            disabled
              className="radioButton"
              type="radio"
              name={radioQuestion.questionId}
              value={choice}
              checked={selectedChoice === choice}
              onChange={() => {
                setSelectedChoice(choice);
                handleChoiceChange(choice);
              }}
              // disabled={!choice}
            />
          </div>

          <button
            onClick={() => removeChoice(index)}
            className="remove-choice"
          >
            ✖
          </button>
        </div>
      ))}
      <br />
      <button className="add-choice-button" onClick={addChoice}>Add Choice</button>
    </div>
  );
}
