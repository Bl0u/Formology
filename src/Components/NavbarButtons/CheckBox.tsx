import { BaseQuestionProps, QuestionFormat } from "./type";
import "../CSS/CheckBox.css"
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch.tsx";
import "../CSS/CheckBox.css";
export default function SelectOption(props: BaseQuestionProps) {
  const [checkboxQuestion, setQuestion] = useState<QuestionFormat>(
    {} as QuestionFormat
  );
  useEffect(() => {
    props.updateSectionsGlobalState(checkboxQuestion);
  }, [checkboxQuestion]);
  useEffect(() => {
    setQuestion(() => props.questionDetails);
  }, [props.questionDetails]); // it needs an array of dependancies

  const addOption = () => {
    setQuestion((prev) => {
      const newQuestion = { ...prev }; // this means spread the prev var props in newQuestion
      const newOptions = [...(newQuestion.values ?? []), ""];
      return { ...newQuestion, values: newOptions };
    });
  };

  const removeChoice = (index: number) => {
    setQuestion((prev) => {
      const newValues = prev.values?.filter((_, i) => i !== index);
      return { ...prev, values: newValues };
    });
  };

  const updateChoice = (index: number, value: string) => {
    setQuestion((prev) => {
      const newQuestion = { ...prev };
      let newValues = newQuestion.values ?? [];
      newValues[index] = value;
      return { ...newQuestion, values: newValues };
    });
  };

  const updateQuestion = (value: string) => {
    setQuestion((prev) => {
      const newQuestion = { ...prev };
      let userQuestion = value;
      return { ...newQuestion, question: userQuestion };
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
      <div
        className="input-container question">
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
          onChange={(e) => {
            setQuestion((prev) => {
              const newQuestion = { ...prev };
              newQuestion.question = e.target.value;
              return newQuestion;
            });
          }}
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
                onChange={(e) => {
                  updateAnswer(e.target.value);
                }}
                // disabled={!option}
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

        <button className="add-choice-button" onClick={addOption}>Add Option</button>
        
      </div>
    </>
  );
}
