import { useAuth } from "../Auth/Context/AuthContext.tsx";
import { useEffect, useRef, useState } from "react";
import "../Trash/Trash.css";
// import BaseQuestionProps {QuestionFormat} from "./type.ts";
import { BaseQuestionProps, QuestionFormat } from "./type.ts";
import { Heading2, Trash2 } from "lucide-react";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch.tsx";

export default function TextQuestion(props: BaseQuestionProps) {
  const [textQuestion, setTextQuestion] = useState<QuestionFormat>(
    {} as QuestionFormat
  );

  const questionRef = useRef<HTMLDivElement | null>(null); // Apply ref to the div only
  const { isReview } = useAuth();

  useEffect(() => {
    questionRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (props.updateSectionsGlobalState) {
      props.updateSectionsGlobalState(textQuestion);
      
    }
  }, [textQuestion]);

  useEffect(() => {
    setTextQuestion(props?.questionDetails ?? ({} as QuestionFormat));
  }, [props.questionDetails]);

  return (
    <>
      {isReview ? (
        <div className="question" ref={questionRef}>
          <textarea
            className="textareaQuestion"
            onChange={(e) => {
              setTextQuestion((prev) => ({
                ...prev,
                question: e.target.value,
              }));
            }}
            value={textQuestion.question ?? ""}
            rows={1}
            cols={40}
            placeholder="Enter Question Here"
          ></textarea>
          <br></br>

          {/* clients response box */}
          <textarea
            className="textareaAnswer"
            onChange={(e) => {
              setTextQuestion((prev) => ({
                ...prev,
                answer: e.target.value,
              }));
              console.log('changed question answer', textQuestion);
            }
          }
            placeholder="Clients' Answers are written here"
            rows={4}
            cols={50}
          ></textarea>
        </div>
      ) : (
        <div className="question" ref={questionRef}>
          <ToggleSwitch label="move-me" questionId={textQuestion?.questionId} />
          <button className="TrashButton">
            <Trash2
              className="trashPosition"
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
              setTextQuestion((prev) => ({
                ...prev,
                question: e.target.value,
              }));
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
            placeholder="Clients' Answers are written here"
            rows={4}
            cols={50}
          ></textarea>
        </div>
      )}
    </>
  );
}