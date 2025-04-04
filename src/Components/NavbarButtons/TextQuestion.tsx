import { useContext, useEffect, useState } from "react";
// import BaseQuestionProps {QuestionFormat} from "./type.ts";
import  {BaseQuestionProps, QuestionFormat } from "./type.ts";
import { SectionContext } from "../../App.tsx";
export default function TextQuestion(props: BaseQuestionProps) {

  const [textQuestion, setTextQuestion] = useState<QuestionFormat>({} as QuestionFormat);
  
  useEffect(() => {
    
    props.updateSectionsGlobalState(textQuestion) ;
  }, [textQuestion])

  useEffect(() => {
    setTextQuestion(props.questionDetails);
  }, [props.questionDetails]);
  const sectionContextGlobalState = useContext(SectionContext) ;
  return (
    <div>
      {/* question box */}
      <textarea
        onChange={(e) => {
          setTextQuestion((prev) => {
            const newQuestion = {...prev} ;
              newQuestion.question = e.target.value ;
            return newQuestion
          })
        }}
        value={(textQuestion.question?? "")}
        rows={1}
        cols={50}
      ></textarea>

      <br></br>

      {/* clients response box */}
      <textarea
        onChange={(e) => {
          setTextQuestion((prev) => {
            
            const newQuestion = {...prev} ;
            newQuestion.answer = e.target.value ;
            return newQuestion ;
          })
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
            props.removeOption(textQuestion?.questionId);
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
