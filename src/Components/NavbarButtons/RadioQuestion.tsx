import { useEffect, useState } from "react";
import { BaseQuestionProps, generateUniqueId, QuestionFormat } from "./type.ts"; // Ensure this import path is correct

export default function RadioQuestion(props: BaseQuestionProps) {

  const [question, setQuestion] = useState<QuestionFormat>(
    {} as QuestionFormat
  );

  useEffect(() => {
    setQuestion(props.questionDetails);
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
    // Remove choice from the list
    setQuestion((prev) => {
      return {...prev, values: prev?.values?.filter((_, i) => i !== index)} ;
    })
    // setQuestion((prev) => {
    //   const hope = prev?.values?.filter((option, i) => i !== index) ;
      
    //   return {...prev, values: hope} ;
    // })
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
  console.log(question) ;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      {/* Question Textarea */}
      <textarea
        value={question.question ?? ""}
        rows={1}
        cols={50}
        onChange={(e) => {
          updateQuestion(e.target.value);
        }}
      ></textarea>
      <br />

      {/* Loop through choices dynamically */}
      {question.values?.map((choice, index) => {
        return (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            {/* Selectable radio button with a unique group name */}
            <input
              type="radio"
              name={question.questionId} // Ensures all options in this question are in the same group
              value={choice}
              checked={selectedChoice === choice}
              onChange={() => {
                setSelectedChoice(choice);
                handleChoiceChange(choice);
                
              }}
              disabled={!choice} // Disable selection if input is empty
            />

            {/* Editable text input */}
            <input
              key={index}
              type="text"
              value={choice}
              onChange={(e) => updateChoice(index, e.target.value)}
              placeholder={`Choice ${index + 1}`}
            />

            {/* Remove button a radio choice */}
            <button
              onClick={() => removeChoice(index)}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)", // 70% transparent black
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>
        );
      })}

      <br />
      {/* Button to Add More radio choices */}
      <button onClick={addChoice}>Add Choice</button>

      {/* remove the entire radio question component */}
      <button
        onClick={() => {
          console.log(
            "Button clicked, removeOption:",
            typeof props.removeOption
          );
          if (props.removeOption) {
            props.removeOption(question?.questionId);
          } else {
            console.error("removeOption function is undefined");
          }
        }}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)", // 70% transparent black
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        ✖
      </button>
    </div>
  );
}
