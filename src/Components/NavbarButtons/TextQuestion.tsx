
import { useEffect, useRef, useState } from "react";
import "../Trash/Trash.css" ;
// import BaseQuestionProps {QuestionFormat} from "./type.ts";
import { BaseQuestionProps, QuestionFormat } from "./type.ts";
import { Trash2 } from "lucide-react";
import  ToggleSwitch  from "../ToggleSwitch/ToggleSwitch.tsx";
export default function TextQuestion(props: BaseQuestionProps) {
  const [textQuestion, setTextQuestion] = useState<QuestionFormat>(
    {} as QuestionFormat
  );
  const questionRef = useRef(null) ;


  useEffect(() => {
    questionRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [])
  useEffect(() => {
    props.updateSectionsGlobalState(textQuestion);
  }, [textQuestion]);

  useEffect(() => {
    setTextQuestion(props.questionDetails);
  }, [props.questionDetails]);
  return (
    <div className="question" ref={questionRef} >
        <ToggleSwitch label="move-me" questionId={textQuestion?.questionId} />
        <button className="TrashButton">
        <Trash2 className="trashPosition"
          onClick={() => {
            if (props.removeOption) {
              props.removeOption(textQuestion?.questionId);
            }
          }}
          size={18}
          color="#f44336"
        />
      </button>
      {/* question box */}
      <textarea
        className="textareaQuestion"
        onChange={(e) => {
          setTextQuestion((prev) => {
            const newQuestion = { ...prev };
            newQuestion.question = e.target.value;
            return newQuestion;
          });
        }}
        value={textQuestion.question ?? ""}
        rows={1}
        cols={40}
        placeholder="Enter Question Here"
      ></textarea>

      <br></br>

      {/* clients response box */}
      <textarea
        readOnly
        className="textareaAnswer"
        onChange={(e) => {
          setTextQuestion((prev) => {
            const newQuestion = { ...prev };
            newQuestion.answer = e.target.value;
            return newQuestion;
          });
        }}
        placeholder="Clients' Answers are writen here"
        rows={4}
        cols={50}
      ></textarea>

      
    </div>
  );
}
