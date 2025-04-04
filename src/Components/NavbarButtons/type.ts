export interface QuestionFormat {
  questionId: string;
  type: string;
  question?: string;
  values?: string[] | null;
  answer?: string | string[] ;
}

export interface BaseQuestionProps {
  sectionId?: string ;
  questionDetails: QuestionFormat ;
  removeOption?: (id: string) => void; // Make sure this is defined
}

// Function to generate a random unique ID
export const generateUniqueId = (): string => {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
};

