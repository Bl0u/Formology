import { BaseQuestionProps, QuestionFormat } from "./type";
import "../CSS/CheckBox.css";
import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch.tsx";
import { useAuth } from "../Auth/Context/AuthContext.tsx";

export default function SelectOption(props: BaseQuestionProps) {
  const [checkboxQuestion, setQuestion] = useState<QuestionFormat>(
    {} as QuestionFormat
  );
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]); // State for selected checkboxes
  const questionRef = useRef<HTMLDivElement | null>(null); // Properly typed ref for the div
  const { isReview } = useAuth();

  // Update global state when checkboxQuestion changes
  useEffect(() => {
    if (props.updateSectionsGlobalState) {
      props.updateSectionsGlobalState(checkboxQuestion);
    }
  }, [checkboxQuestion]);

  // Initialize question details from props
  useEffect(() => {
    setQuestion(props?.questionDetails ?? ({} as QuestionFormat));
  }, [props.questionDetails]);

  // Scroll into view when the component mounts or checkboxQuestion updates
  useEffect(() => {
    questionRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [checkboxQuestion]);

  // Add a new empty option
  const addOption = () => {
    setQuestion((prev) => ({
      ...prev,
      values: [...(prev.values || []), ""],
    }));
  };

  // Remove a specific option
  const removeChoice = (index: number) => {
    setQuestion((prev) => ({
      ...prev,
      values: prev.values?.filter((_, i) => i !== index),
    }));
    // Also remove the choice from selectedChoices if it exists
    setSelectedChoices((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // Update a specific option
  const updateChoice = (index: number, value: string) => {
    setQuestion((prev) => {
      const newValues = [...(prev.values || [])];
      newValues[index] = value;
      return { ...prev, values: newValues };
    });
  };

  // Update the question text
  const updateQuestion = (value: string) => {
    setQuestion((prev) => ({
      ...prev,
      question: value,
    }));
  };

  // Handle checkbox selection
  const toggleCheckbox = (choice: string) => {
    setSelectedChoices((prev) => {
      if (prev.includes(choice)) {
        // If the choice is already selected, remove it
        return prev.filter((item) => item !== choice);
      } else {
        // Otherwise, add it to the selected choices
        return [...prev, choice];
      }
    });
  };

  const updateAnswer = (value: string) => {
    setQuestion((prev) => {
      return {
        ...prev,
        answer: [...(prev.answer ?? []), value],
      };
    });
  };
  return (
    <>
      {isReview ? (
        <div ref={questionRef} className="input-container question">
          <textarea
            className="textareaQuestion"
            onChange={(e) => updateQuestion(e.target.value)}
            value={checkboxQuestion.question ?? ""}
            rows={1}
            cols={40}
            placeholder="Enter Question Here"
          ></textarea>
          <br />
          {checkboxQuestion.values?.map((option, index) => (
            <div key={index} className="choice-container">
              <div className="input-checkbox-container">
                <input
                  className="checkBoxButton"
                  type="checkbox"
                  name={checkboxQuestion.questionId}
                  value={option}
                  checked={selectedChoices.includes(option)} // Check if the choice is selected
                  onChange={(e) => {
                    toggleCheckbox(option);
                    updateAnswer(e.target.value) ;
                  }} // Toggle selection
                  disabled={!option} // Disable if the option is empty
                />
                <span className="option-label">{option}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div ref={questionRef} className="input-container question">
          <ToggleSwitch
            label="move-me"
            questionId={checkboxQuestion?.questionId}
          />
          <button className="TrashButton">
            <Trash2
              className="trashPosition"
              onClick={() => {
                if (props.removeOption) {
                  props.removeOption(checkboxQuestion?.questionId);
                }
              }}
              size={18}
              color="#f44336"
            />
          </button>
          <textarea
            className="textareaQuestion"
            onChange={(e) => updateQuestion(e.target.value)}
            value={checkboxQuestion.question ?? ""}
            rows={1}
            cols={40}
            placeholder="Enter Question Here"
          ></textarea>
          <br />
          {checkboxQuestion.values?.map((option, index) => (
            <div key={index} className="choice-container">
              <div className="input-checkbox-container">
                <input
                  className="inputChoices"
                  type="text"
                  value={option}
                  onChange={(e) => updateChoice(index, e.target.value)}
                  placeholder={`Enter option number ${index + 1}`}
                />
                <input
                  className="checkBoxButton"
                  type="checkbox"
                  name={checkboxQuestion.questionId}
                  value={option}
                  checked={selectedChoices.includes(option)} // Check if the choice is selected
                  onChange={() => toggleCheckbox(option)} // Toggle selection
                  disabled // Disable in non-review mode
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
          <button className="add-choice-button" onClick={addOption}>
            Add Option
          </button>
        </div>
      )}
    </>
  );
}