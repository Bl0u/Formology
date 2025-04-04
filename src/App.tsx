import "./App.css";
import Question from "./Components/NavbarButtons/Question";
import Form from "./Components/Form/Form";
import Navbar from "./Components/NavbarButtons/Navbar";
import { useState, createContext } from "react";
import {
  generateUniqueId,
  QuestionFormat,
} from "./Components/NavbarButtons/type.ts";
import AskAi from "./Components/NavbarButtons/AskAi";
import { sendToDB } from "./Components/DB/Database.tsx";
// used to efficiently store the content of the form

export interface SectionContent {
  title?: string;
  sectionId?: string;
  questions?: QuestionFormat[];
}
export const SectionContext = createContext({});
// custom hooks to avoid initial value error

function App() {
  const [sectionContent, setSectionContent] = useState<SectionContent>(
    {} as SectionContent
  );
  const [sections, setSections] = useState<SectionContent[]>([]);
  const [currSectionId, setCurrSectionId] = useState<string | null>(null);
  const [btnName, setBtnName] = useState("Start Section");
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
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a structured JSON form with an appropriate section name. 
                  - The form should focus on '${message}'.
                  - Include only JSON output with:
                    {
                      "sectionName": "Suggested Section Title",
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
                    }
                  - Ensure that the JSON contains a "sectionName" and a "fields" array.
                  - Do not wrap the JSON inside markdown formatting.
                  - Return only JSON, no explanations.`,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      aiText = aiText.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(aiText);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        parsed = { sectionName: "AI Generated Section", fields: [] };
      }

      if (Array.isArray(parsed.fields)) {
        const sectionid_hope = generateUniqueId();
        const aiSection: SectionContent = {
          title: parsed.sectionName || "AI Generated Section",
          sectionId: sectionid_hope,
          questions: parsed.fields.map(
            (field: {
              type: "text" | "radio" | "checkbox";
              question: string;
              options?: string[];
            }) => {
              return {
                sectionId: sectionid_hope,
                questionId: generateUniqueId(),
                type: field.type,
                question: field.question,
                values: field.options || null,
              };
            }
          ),
        };
        if (aiSection.sectionId) {
          setCurrSectionId(aiSection.sectionId); // Fixed: id to sectionId
        }
        setSections((prev) => [...prev, aiSection]);
        sendToDB(aiSection);
      } else {
        console.warn("AI response did not contain a valid 'fields' array.");
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

  // const handleRemoveOption = (id: string) => {
  //   setSectionContent((prev) => {
  //     const newContent = { ...prev };
  //     Object.keys(newContent).forEach((sectionId) => {
  //       if (newContent[sectionId].questions[id]) {
  //         delete newContent[sectionId].questions[id];
  //       }
  //     });
  //     return newContent;
  //   });
  // };

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

  console.log(sections);
  
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
        <AskAi onRequest={handleAiRequest}></AskAi>
      </Navbar>
      <Form>
        {sections.map((section) => {
          return (
            <div key={section.sectionId || "fallback-key"}>
              <h3 className="section-title">{section.title}</h3>
              {section.questions?.map((question) => {
                return (
                  <Question
                    updateSectionsGlobalState={updateSectionsGlobalState}
                    key={question.questionId}
                    questionDetails={question}
                    sectionId={currSectionId ?? ""}
                    // removeOption={handleRemoveOption}
                  />
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
