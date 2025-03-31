import { useState } from "react";
import BaseQuestionProps from "./type.ts"; // Ensure this import path is correct

export default function RadioQuestion(props: BaseQuestionProps) {
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // Unique name for the radio group to prevent cross-question interference
  const questionName = `radio-question-${props.id || Math.random().toString(36).substr(2, 9)}`;

  // Function to add a new empty choice without selecting it automatically
  const addChoice = () => {
    setChoices((prevChoices) => [...prevChoices, ""]); // Adds an empty choice
  };

  // Function to update a specific choice
  const updateChoice = (index: number, value: string) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  // Function to remove a choice
  const removeChoice = (index: number) => {
    const choiceToRemove = choices[index];

    // Remove the selected choice only if it's being deleted
    if (choiceToRemove === selectedChoice) {
      setSelectedChoice(null);
    }

    // Remove choice from the list
    setChoices((prevChoices) => prevChoices.filter((_, i) => i !== index));
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
      {/* Question Textarea */}
      <textarea value={props.question} rows={1} cols={50}></textarea>
      <br />

      {/* Loop through choices dynamically */}
      {choices.map((choice, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Selectable radio button with a unique group name */}
          <input
            type="radio"
            name={questionName} // Ensures all options in this question are in the same group
            value={choice}
            checked={selectedChoice === choice}
            onChange={() => setSelectedChoice(choice)}
            disabled={!choice} // Disable selection if input is empty
          />
          
          {/* Editable text input */}
          <input
            type="text"
            value={choice}
            onChange={(e) => updateChoice(index, e.target.value)}
            placeholder={`Choice ${index + 1}`}
          />

          {/* Remove button */}
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
      ))}

      <br />
      {/* Button to Add More Choices */}
      <button onClick={addChoice}>Add Choice</button>

      
      <button
              onClick={() => {
                console.log("Button clicked, removeOption:", typeof props.removeOption);
                if (props.removeOption) {
                  props.removeOption(props.id);
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
