import "../CSS/RadioQuestion.css";
import { useEffect, useRef, useState } from "react";
import { BaseQuestionProps, QuestionFormat } from "./type.ts"; // Ensure this import path is correct
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch.tsx";
import { Trash2 } from "lucide-react";
import { useAuth } from "../Auth/Context/AuthContext.tsx";

export default function RadioQuestion(props: BaseQuestionProps) {
  const [radioQuestion, setQuestion] = useState<QuestionFormat>(
    {} as QuestionFormat
  );
  const questionRef = useRef<HTMLDivElement | null>(null); // Properly typed ref for the div
  const { isReview } = useAuth();
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // Scroll into view when the component mounts
  useEffect(() => {
    questionRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [radioQuestion]);

  // Update global state when radioQuestion changes
  useEffect(() => {
    if (props.updateSectionsGlobalState) {
      props.updateSectionsGlobalState(radioQuestion);
    }
  }, [radioQuestion]);

  // Initialize question details from props
  useEffect(() => {
    setQuestion(props?.questionDetails ?? ({} as QuestionFormat));
  }, [props.questionDetails]);

  // Add a new empty choice
  const addChoice = () => {
    setQuestion((currQuestion) => ({
      ...currQuestion,
      values: [...(currQuestion.values || []), ""],
    }));
  };

  // Update a specific choice
  const updateChoice = (index: number, value: string) => {
    setQuestion((prev) => {
      const newValues = [...(prev.values ?? [])];
      newValues[index] = value;
      return { ...prev, values: newValues };
    });
  };

  // Remove a specific choice
  const removeChoice = (index: number) => {
    setQuestion((prev) => ({
      ...prev,
      values: prev?.values?.filter((_, i) => i !== index),
    }));
  };

  // Update the question text
  const updateQuestion = (value: string) => {
    setQuestion((prev) => ({
      ...prev,
      question: value,
    }));
  };

  // Handle choice selection
  const handleChoiceChange = (choice: string) => {
    setQuestion((prev) => ({
      ...prev,
      answer: choice,
    }));
  };


  return (
    <>
      {isReview ? (
        <div className="question" ref={questionRef}>
          <textarea
            className="textareaQuestion"
            onChange={(e) => updateQuestion(e.target.value)}
            value={radioQuestion.question ?? ""}
            rows={1}
            cols={40}
            placeholder="Enter Question Here"
          ></textarea>
          <br />
          {radioQuestion.values?.map((choice, index) => (
            <div key={index} className="choice-container">
              <div className="input-checkbox-container">
                <input
                  className="radioButton"
                  type="radio"
                  name={radioQuestion.questionId}
                  value={choice}
                  checked={selectedChoice === choice}
                  onChange={() => {
                    setSelectedChoice(choice);
                    handleChoiceChange(choice);
                  }}
                  disabled={!choice}
                />
                <span className="option-label">{choice}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="question" ref={questionRef}>
          <ToggleSwitch label="move-me" questionId={radioQuestion?.questionId} />
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
            onChange={(e) => updateQuestion(e.target.value)}
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
                  className="radioButton"
                  type="radio"
                  name={radioQuestion.questionId}
                  value={choice}
                  
                  disabled

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
          <button className="add-choice-button" onClick={addChoice}>
            Add Choice
          </button>
        </div>
      )}
    </>
  );
}