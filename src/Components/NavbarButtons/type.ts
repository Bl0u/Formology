export interface QuestionFormat {
  questionId: string;
  sectionId: string ;
  type: string;
  question?: string;
  values?: string[] | null;
  answer?: string | string[] ;
}

export  interface BaseQuestionProps {
  sectionId?: string ;
  questionDetails: QuestionFormat ;
  removeOption?: (id: string) => void; // Make sure this is defined
  updateSectionsGlobalState: (newQuestion: QuestionFormat) => void;
}
export interface SectionContent {
  title: string;
  sectionId: string;
  questions?: QuestionFormat[];
}
export interface FormContent{
  formId: string ;
  sections: SectionContent[] ; 
}
// Function to generate a random unique ID
export const generateUniqueId = (): string => {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
};

