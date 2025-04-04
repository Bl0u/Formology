import { useEffect, useState } from "react";
// import BaseQuestionProps {QuestionFormat} from "./type.ts";
import  {BaseQuestionProps, QuestionFormat } from "./type.ts";

export default function TextQuestion(props: BaseQuestionProps) {
  const [question, setQuestion] = useState<QuestionFormat>({} as QuestionFormat);

  useEffect(() => {
    setQuestion(props.questionDetails);
  }, [props.questionDetails]);

  console.log(question);
  return (
    <div>
      {/* question box */}
      <textarea
        onChange={(e) => {
          setQuestion((prev) => {
            const newQuestion = {...prev} ;
              // console.log(newQuestion);
              newQuestion.question = e.target.value ;
              console.log(newQuestion.question);
            return newQuestion
          })
        }}
        value={(question.question?? "")}
        rows={1}
        cols={50}
      ></textarea>

      <br></br>

      {/* clients response box */}
      <textarea
        onChange={(e) => {
          setQuestion((prev) => {
            
            const newQuestion = {...prev} ;
            newQuestion.answer = e.target.value ;
            // console.log(newQuestion);            
            return newQuestion ;
          })
          // console.log(e.target.value);
        }}
        placeholder="Enter your text here..."
        rows={4}
        cols={50}
      ></textarea>

      {/* component removal button, delete the TEXT quetion entirely */}
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
