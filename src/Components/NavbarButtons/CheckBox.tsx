import BaseQuestionProps from "./type";
import { useState } from "react";

export default function SelectOption(props: BaseQuestionProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string[] | null>(null);

  const addOption = () => {
    setOptions((prev) => {
      return [...prev, ""] ;
    })
  }
  const removeChoice = (index: number) => {
    const currOption = options[index] ;
    setOptions((prev) => prev.filter((_, i) => i != index))
  }


  const updateChoice = (index: number, value: string) => {
    const newOptions = [...options] ;
    newOptions[index] = value ;
    setOptions(newOptions) ;
  }


  return (
    <>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <textarea value={props.question} rows={1} cols={50}></textarea>
        <br />

        {options.map((option, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            {/* Option content here */}
            <input
              type="checkbox"
              name={props.id}
              value={option}
              onChange={(e) => {
                setSelectedOption([...options, option])
                // console.log(e.target) ;
              }}
              disabled={!option}
            />

            <input
              type="text"
              value={option}
              onChange={(e) => updateChoice(index, e.target.value)}
              placeholder={`Choice ${index + 1}`}
            />

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
        <button onClick={addOption}>Add Option</button>
      </div>

      <button
        onClick={() => {
          console.log(
            "Button clicked, removeOption:",
            typeof props.removeOption
          );
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
    </>
  );
}
