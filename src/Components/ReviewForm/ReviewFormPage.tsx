import { useAuth } from "../Auth/Context/AuthContext";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Question from "../NavbarButtons/Question";
import Form from "../Form/Form";
import { ChildProps } from "../NavbarButtons/type";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import './ReviewFormPage.css' ;

export default function ReviewFormPage(props: ChildProps) {
  const { form, setForm } = useAuth();
  // console.log(form);
  const {isReview, setIsReview} = useAuth() ;

  const navigator = useNavigate() ;

  const dispatch = useDispatch()

  useEffect(() => {
    if (props.getFormStateFromChildToParent) {
      props.getFormStateFromChildToParent();
    }

    // console.log('here at ReviewFromPage on mount');
    
  }, [])




  return (
    <>
    <Form>
      <div key={form?.formId}>
        {form?.sections.map((section) => {
          return (
            <>
              <div key={section.sectionId}>
                <textarea
                  className="textareaQuestion"
                  name="formTitle"
                  id={`formTitle-${section.sectionId}`}
                  rows={2}
                  cols={50}
                  placeholder={section.title}
                ></textarea>
                {section.questions?.map((question) => {
                  return (
                    <>
                      <div className="eachQuestion">
                        <Question
                          key={question.questionId}
                          questionDetails={question}
                        />
                        {/* add navbar as a button here */}
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          );
        })}
          <button onClick={() => {
            // console.log('niggas');
            setIsReview(false)   ;
            navigator('/builder');
          }}>Edit Form</button>
          
          {/* <Link to="/builder">Back to Builder</Link> */}

      </div>
    </Form>
    </>
    
  );
}
