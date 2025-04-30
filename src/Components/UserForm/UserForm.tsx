import axios from "axios";
import Question from "../NavbarButtons/Question";
import {
  QuestionFormat,
  SectionContent,
  FormContent,
  generateUniqueId,
} from "../NavbarButtons/type";
import Form from "../Form/Form";
import { useRef, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Auth/Context/AuthContext";

function UserForm() {
  const { isReview, setIsReview } = useAuth();
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<FormContent>({
    formId: generateUniqueId(),
    sections: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Fetch form data when the component mounts
  useEffect(() => {
    console.log('First useEffect');
    
    const fetchForm = async () => {
      if (!formId) {
        setError("No form ID provided in the URL.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost/Form/UseFormBuilder.php",
          { params: { formId } }
        );
        const fetchedForm: FormContent = response.data.data;
        setForm(fetchedForm);
        

        // Only set `isReview` if it hasn't already been set
        if (!isReview) {
          setIsReview(true);
        }
      } catch (error) {
        console.error("Error fetching form:", error);
        setError("Failed to fetch the form. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [formId, isReview, setIsReview]);

  // Update sections in the global state
  const updateSectionsGlobalState = (newQuestion: QuestionFormat) => {
    if (!form) return;
  
    // Create a new array with the updated question
    const updatedSections = form.sections.map((section) => {
      if (section.sectionId !== newQuestion.sectionId) {
        return section; // Return the section unchanged
      }
  
      const updatedQuestions = section.questions?.map((question) => {
        if (question.question_id === newQuestion.question_id) {
          return newQuestion; // Replace the target question with the updated one
        }
        return question; // Return other questions unchanged
      });
  
      return {
        ...section,
        questions: updatedQuestions,
      };
    });
  
    // Compare updated sections with the current form's sections
    if (JSON.stringify(updatedSections) === JSON.stringify(form.sections)) {
      console.log("No changes detected in form sections. Skipping state update.");
      return; // Exit early if no changes are detected
    }
  
    // Update the global state with the new sections
    const newForm: FormContent = {
      ...form,
      sections: updatedSections,
    };
  
    console.log("New Form:", newForm);
  
    setForm(newForm); // Update the form state with the new structure
  };
  
  const handleFormSubmit = async () => {
    if (!form) {
      alert("Form is not loaded yet.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/Form/Response.php",
        form
      );
      console.log("Form submitted successfully:", response.data);
      alert("Your response has been submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!form?.sections) return <div>No form data available.</div>;
//   form.sections.forEach((section) => {
//     section?.questions?.forEach(question => {
//         console.log(question);
        
//         console.log(question.question_id);
        
//     });
//   });
  
  return (
    <Form>
      <div key={form.formId}>
        {form.sections.map((section) => (
          <div key={section.sectionId} ref={sectionRef}>
            <textarea
              className="textareaQuestion"
              name="formTitle"
              id={`formTitle-${section.sectionId}`}
              rows={2}
              cols={50}
              value={section.title}
              readOnly
            />
            {section.questions?.map((question) => (
              <div className="eachQuestion" key={question.questionId}>
                <Question
                  updateSectionsGlobalState={updateSectionsGlobalState}
                  questionDetails={question}
                  sectionId={section.sectionId}
                />
              </div>
            ))}
          </div>
        ))}
        <button onClick={handleFormSubmit}>Submit a response</button>
      </div>
    </Form>
  );
}

export default UserForm;
