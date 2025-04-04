import { BaseQuestionProps, QuestionFormat } from "./type";
import { useEffect, useState } from "react";

export default function SelectOption(props: BaseQuestionProps) {
  const [question, setQuestion] = useState<QuestionFormat>(
    {} as QuestionFormat
  );
  
  useEffect(() => {
    setQuestion(() => props.questionDetails);
  }, [props.questionDetails]); // it needs an array of dependancies

  
  const addOption = () => {
    setQuestion((prev) => {
      const newQuestion = {...prev} ; // this means spread the prev var props in newQuestion
      const newOptions = [...newQuestion.values??[], ""]
      return {...newQuestion, values: newOptions} ;
    })

    
  };

  const removeChoice = (index: number) => {
    setQuestion((prev) => {
      const newValues = prev.values?.filter((_, i) => i !== index)
      return {...prev, values: newValues} ;
    })
  };

  const updateChoice = (index: number, value: string) => {
    setQuestion((prev) => {
    const newQuestion = {...prev} ;
    let newValues = newQuestion.values ?? []
    newValues[index] = value ;
    return {...newQuestion, values: newValues} ;
    })
  };

  const updateQuestion = (value: string) => {
    setQuestion((prev) => {
      const newQuestion = {...prev} ;
      let userQuestion = value ;
      return {...newQuestion, question:userQuestion} ;
    })
  } ;

  const updateAnswer = (value: string) => {
    setQuestion((prev) => {
      return {
        ...prev,
        answer: [...(prev.answer??[]), value],
      };
    })
  } ;
  console.log(question) ;
  return (
    <>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <textarea value={question.question ?? ""} onChange={(e) => {
        updateQuestion(e.target.value) ;
        }} rows={1} cols={50}></textarea>
        <br />

        {question.values?.map((option, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            {/* Option content here */}
            <input
              type="checkbox"
              name={question.questionId}
              value={option}
              onChange={(e) => {
                updateAnswer(e.target.value) ;
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
            props.removeOption(question.questionId);
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
