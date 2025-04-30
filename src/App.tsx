import UserFormBuilder from "./Components/UserForm/UserForm.tsx";
import "./App.css";
import "../src/Components/CSS/Button.css";
import "../src/Components/NavbarButtons/Navbar/Navbar.css";
import Question from "./Components/NavbarButtons/Question";
import Form from "./Components/Form/Form";
import Navbar from "./Components/NavbarButtons/Navbar/Navbar.tsx";
import { useRef, useState, useEffect, use } from "react";
import {
  generateUniqueId,
  QuestionFormat,
  SectionContent,
  FormContent,
} from "./Components/NavbarButtons/type.ts";
import AskAi from "./Components/NavbarButtons/AskAi";
import { sendToDB } from "./Components/DB/Database.tsx";
import { useAuth } from "./Components/Auth/Context/AuthContext.tsx";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Components/state/store.tsx";
import {
  setFormRedux,
  resetForm,
} from "./Components/state/Form/FormSlice.tsx";

function App() {


  const navigator = useNavigate();
  const [sectionContent, setSectionContent] = useState<SectionContent>(
    {} as SectionContent
  );
  const {isReview, setIsReview} = useAuth() ;
  const [sections, setSections] = useState<SectionContent[]>([]);

  const [btnName, setBtnName] = useState("Start Section");

  const [currSectionId, setCurrSectionId] = useState<string | null>(null);

  const sectionRef = useRef<Record<string, HTMLDivElement | null>>({});

  // const { form, setForm } = useAuth();
  const formRedux = useSelector((state: RootState) => state.form.value); // Get form from Redux
  console.log('initial state from formRedux = ', formRedux);
  const [form, setForm] = useState<FormContent>(formRedux); // Initialize local state from Redux
  const [flag, setFlag] = useState(false) ;
  const dispatch = useDispatch();
  // Initialize local state with Redux state on mount
  useEffect(() => {
    setIsReview(false) ;
  },[])
  useEffect(() => {
    setForm(formRedux);
    setSections(formRedux.sections || []);
  }, [formRedux]);

  // Sync local `form` state with Redux state when `form` changes
  useEffect(() => {console.log('answer = ', flag)}, [flag]) ;
  useEffect(() => {
    console.log('formRedux = ', formRedux);
    console.log('form = ', form);
    console.log('first = ', (JSON.stringify(form) !== JSON.stringify(formRedux)) );
    console.log('second = ', (form.sections.length || flag));
    
    
    if ((JSON.stringify(form) !== JSON.stringify(formRedux)) && (form.sections.length || flag)) {
      console.log('im in here');
      
      setFlag(false) ;
      console.log("Syncing form with Redux, length = ", form.sections.length);
      dispatch(setFormRedux(form));
    }
  }, [form, formRedux, dispatch]);

  // Sync `sections` updates with `form`
  useEffect(() => {
    setForm((prevForm) => ({ ...prevForm, sections }));
  }, [sections]);

  // Scroll to the current section when `currSectionId` changes
  // useEffect(() => {
  //   sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [currSectionId]);

  const updateSectionsGlobalState = (newQuestion: QuestionFormat) => {
    // Create a new array with the updated question
    const updatedSections = sections?.map((section) => {
      // If this is not the section containing our question, return it unchanged
      if (section.sectionId !== newQuestion.sectionId) {
        return section;
      }

      // Create a new section with updated questions
      return {
        ...section,
        questions: section?.questions?.map((question) => {
          // If this is our target question, return the new question
          if (question.questionId === newQuestion.questionId) {
            return newQuestion;
          }
          // Otherwise return the original question
          return question;
        }),
      };
    });

    // Update the global state with the new sections
    setSections(updatedSections);
  };
  const handleAiRequest = async (message: string) => {
    try {
      // Check if the message contains a request for multiple sections
      // Parse the message to extract requested structure
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a structured JSON form based on the following requirements: '${message}'.
                  
                  Current Date and Time: ${new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")}
                  Current User: Bl0u
                  
                  - Output should be a valid JSON with this structure:
                  {
                    "sections": [
                      {
                        "sectionName": "Unique Section Title 1",
                        "fields": [
                          {
                            "type": "radio",
                            "question": "Example radio question?",
                            "options": ["Option1", "Option2"]
                          },
                          {
                            "type": "checkbox",
                            "question": "Example checkbox question?",
                            "options": ["Option1", "Option2", "Option3"]
                          },
                          {
                            "type": "text",
                            "question": "Example open-ended question?"
                          }
                        ]
                      },
                      {
                        "sectionName": "Unique Section Title 2",
                        "fields": [...]
                      }
                    ]
                  }
                  
                  - If the user requests specific sections (e.g., "3 sections"), create exactly that many sections
                  - If the user specifies question types (e.g., "2 text, 3 checkbox, 1 radio"), follow those counts exactly
                  - Each section must have a unique title relevant to the form topic
                  - Each question should be meaningful and related to its section
                  - Return only JSON, no explanations or markdown
                  - Ensure the output is properly formatted as a valid JSON object`,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      // Clean up the response to ensure it's valid JSON
      aiText = aiText.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(aiText);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        parsed = { sections: [] };
      }

      // Check if we have a sections array in the response
      if (parsed.sections && Array.isArray(parsed.sections)) {
        // Convert each AI section to your application's SectionContent format
        const newSections: SectionContent[] = parsed.sections.map(
          (aiSection: any) => {
            const sectionId = generateUniqueId();

            return {
              title: aiSection.sectionName || "AI Generated Section",
              sectionId: sectionId,
              questions: Array.isArray(aiSection.fields)
                ? aiSection.fields.map((field: any) => ({
                    sectionId: sectionId,
                    questionId: generateUniqueId(),
                    type: field.type || "text",
                    question: field.question || "Generated Question",
                    values: field.options || null,
                  }))
                : [],
            };
          }
        );

        // Add all the new sections to the existing ones
        setSections((prev) => [...prev, ...newSections]);
      }
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
    }
  };
  const handleClickAddQuestion = (questionType: string) => {
    if (!currSectionId) return;

    setSections((prevSections) => {
      return prevSections.map((section) => {
        if (section.sectionId === currSectionId) {
          const updatedQuestions = [
            ...(section.questions || []),
            {
              sectionId: section.sectionId,
              questionId: generateUniqueId(),
              type: questionType,
              question: "",
              values: [],
            },
          ];
          return { ...section, questions: updatedQuestions };
        }
        setSectionContent(section);
        return section;
      });
    });
  };
  const handleRemoveOption = (id: string) => {
    setSections((prev) => {
      const newSections = prev.map((section) => ({
        ...section,
        questions: section.questions?.filter(
          (question) => question.questionId !== id
        ),
      }));
      return newSections;
    });
  };
  const handleClickStartSection = () => {
    const title = prompt("Please provide the section name:");
    if (!title) return;
    const newSection: SectionContent = {
      title,
      sectionId: generateUniqueId(),
      questions: [],
    };
    setCurrSectionId(newSection.sectionId);
    setSections((prev) => [...prev, newSection]);
  };
  const handleTitleUpdate = (sectionId: string, newTitle: string) => {
    setForm((prev) => {
      // Create a new object to avoid mutating the previous state
      const newForm = { ...prev };

      // Update the sections array with the new title for the matching section
      newForm.sections = prev.sections.map((section) => {
        if (section.sectionId === sectionId) {
          return {
            ...section,
            title: newTitle,
          };
        }
        return section;
      });

      // Return the updated form object
      return newForm;
    });
  };
  const handleDeleteSection = (sectionId: string) => {
    setFlag(true) ;
    console.log('flag = ', flag);
    
    setSections((prev) => {
      console.log('delete this section = ', sectionId);
      
      // Filter out the section with the matching ID
      const newSections = prev.filter(
        (section) => section.sectionId !== sectionId
      );
      // Return the filtered array as the new state
      return newSections;
    });
  };
  // console.log(form);
  console.log('initial state from formRedux = ', formRedux);
  console.log('initial state from form= ', form);
  // setForm(formRedux) ;

  return (
    <>
      <Navbar>
        <button className="navbar-buttons" onClick={handleClickStartSection}>
          {btnName}
        </button>
        <button
          className="navbar-buttons"
          onClick={() => {
            handleClickAddQuestion("text");
          }}
        >
          Add Text
        </button>
        <button
          className="navbar-buttons"
          onClick={() => {
            handleClickAddQuestion("radio");
          }}
        >
          Add Radio
        </button>
        <button
          className="navbar-buttons"
          onClick={() => {
            handleClickAddQuestion("checkbox");
          }}
        >
          Add CheckBox
        </button>
        <button
          onClick={() => {
            if (form) sendToDB(form);
            navigator(`/userFormBuilder/${form.formId}`); // OR use query params like below
            dispatch(resetForm()) ;
          }}
        >
          Build Form
        </button>
        <button
          onClick={() => {
            setIsReview(true) ;
            
            navigator("/reviewForm");
          }}
        >
          Review Form
        </button>
        {/* <Link to="/reviewForm">Review Form</Link> */}

        <AskAi onRequest={handleAiRequest}></AskAi>
      </Navbar>
      <Form>
        <div key={formRedux?.formId}>
          {formRedux?.sections.map((section) => {
            return (
              <>
                <div key={section.sectionId || "fallback-key"}>
                  <textarea
                    className="textareaQuestion"
                    name="formTitle"
                    id={`formTitle-${section.sectionId}`} // Unique ID for each textarea
                    rows={2}
                    cols={50}
                    onChange={(e) => {
                      handleTitleUpdate(section.sectionId, e.target.value);
                    }}
                    placeholder={section.title}
                  ></textarea>
                  {section.questions?.map((question) => {
                    return (
                      <>
                        <div className="eachQuestion">
                          <Question
                          isReview={isReview}
                            updateSectionsGlobalState={
                              updateSectionsGlobalState
                            }
                            key={question.questionId}
                            questionDetails={question}
                            sectionId={currSectionId ?? ""}
                            removeOption={handleRemoveOption}
                          />
                          {/* add navbar as a button here */}
                        </div>
                      </>
                    );
                  })}
                  <button
                    className="changeCurrId-Btn"
                    onClick={() => {
                      setCurrSectionId(section.sectionId);
                    }}
                  >
                    Edit this Section
                  </button>
                  <div className="button-container">
                    <button
                      className="main-button"
                      onMouseOver={() => {
                        setCurrSectionId(section.sectionId);
                        console.log(currSectionId);
                      }}
                    >
                      Pick a service
                    </button>
                    <div className="button-slide">
                      <button
                        className="slide-button"
                        onClick={() => {
                          handleClickAddQuestion("text");
                        }}
                      >
                        Text Question
                      </button>
                      <button
                        className="slide-button"
                        onClick={() => {
                          handleClickAddQuestion("radio");
                        }}
                      >
                        Radio Question
                      </button>
                      <button
                        className="slide-button"
                        onClick={() => {
                          handleClickAddQuestion("checkbox");
                        }}
                      >
                        Checkbox Question
                      </button>
                    </div>
                  </div>
                  <button
                    className="deleteCurrSection"
                    onClick={() => {
                      handleDeleteSection(section.sectionId);
                    }}
                  >
                    Delete Section
                  </button>
                </div>
              </>
            );
          })}
        </div>
      </Form>
    </>
  );
}

export default App;
