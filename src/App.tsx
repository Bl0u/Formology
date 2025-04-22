import "./App.css";
import Question from "./Components/NavbarButtons/Question";
import Form from "./Components/Form/Form";
import Navbar from "./Components/NavbarButtons/Navbar";
import { useState, createContext, useEffect } from "react";
import {
  generateUniqueId,
  QuestionFormat,
  SectionContent,
  FormContent
} from "./Components/NavbarButtons/type.ts";
import AskAi from "./Components/NavbarButtons/AskAi";
import { sendToDB } from "./Components/DB/Database.tsx";
// used to efficiently store the content of the form


export const SectionContext = createContext({});
// custom hooks to avoid initial value error

function App() {
  const [sectionContent, setSectionContent] = useState<SectionContent>(
    {} as SectionContent
  );
  const [sections, setSections] = useState<SectionContent[]>([]);
  const [form, setForm] = useState<FormContent>({
    formId: generateUniqueId(), 
  sections: [], 
  }) ;
  const [currSectionId, setCurrSectionId] = useState<string | null>(null);
  const [btnName, setBtnName] = useState("Start Section");

  useEffect(() => {
    // console.log('form has been changed');
    setForm((prev) => ({...prev, sections: sections})) ;
  }, [sections])
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
        })
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
                  
                  Current Date and Time: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}
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
        const newSections: SectionContent[] = parsed.sections.map((aiSection: any) => {
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
        });
  
        // Add all the new sections to the existing ones
        setSections(prev => [...prev, ...newSections]);
        
        // Set the current section ID to the first one generated, if any sections were created
        if (newSections.length > 0) {
          setCurrSectionId(newSections[0].sectionId);
        }
        
        console.log(`Generated ${newSections.length} sections from AI request`);
      } else {
        console.warn("AI response did not contain a valid 'sections' array.");
      }
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
    }
  };
  // no need to update sections, any change in section automatically
  // done in sections
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
      const newSections = prev.map(section => ({
        ...section, 
        questions: section.questions?.filter((question, index) =>
        question.questionId !== id)
      }))
      return newSections ;
    }) ;

  };

  const handleClickStartSection = () => {
    if (btnName === "Start Section") {
      const hope = prompt("Please provide the section name:");
      if (!hope) return;

      const existingSectionId = Object.keys({ sections }).find(
        (_) => sectionContent.title === hope
      );

      if (existingSectionId) {
        setCurrSectionId(existingSectionId);
      } else {
        const newSection: SectionContent = {
          title: hope,
          sectionId: generateUniqueId(),
          questions: [],
        };
        if (newSection.sectionId) {
          setCurrSectionId(newSection.sectionId);
        }
        setSections((prev) => [...prev, newSection]);
      }

      setBtnName("End Section");
    } else {
      setBtnName("Start Section");
      setCurrSectionId(null);
    }
  };
  const handleTitleUpdate = (sectionId: string, newTitle: string) => {
    setForm((prev) => {
      // Create a new object to avoid mutating the previous state
      const newForm = {...prev};
      
      // Update the sections array with the new title for the matching section
      newForm.sections = prev.sections.map((section) => {
        if (section.sectionId === sectionId) {
          return {
            ...section,
            title: newTitle
          };
        }
        return section;
      });
      
      // Return the updated form object
      return newForm;
    });
  }
  console.log(form);
  
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
          sendToDB(form) ;
        }}
        >
          Build Form
        </button>
        <AskAi onRequest={handleAiRequest}></AskAi>
      </Navbar>
      <Form>
        {sections.map((section) => {
          return (
            <div key={section.sectionId || "fallback-key"} style={{
              marginBottom: 200,
            }}>
              <textarea 
              name="formTitle" 
              id="formTitle-Id" 
              rows={2}
              cols={50}
              onChange={(e) => {
                handleTitleUpdate(section.sectionId, e.target.value) ;
              }}
              placeholder={section.title}>
              </textarea>
              
              {section.questions?.map((question) => {
                return (
                  <>
                  <div className="eachQuestion">
                  <Question
                    updateSectionsGlobalState={updateSectionsGlobalState}
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
            </div>
          );
        })}
      </Form>
    </>
  );
}

export default App;
