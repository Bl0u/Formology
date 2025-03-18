type QuestionType = 'text' | 'radio' | 'checkbox';

interface BaseQuestionProps {
  id: string; // Ensure ID is always a string
  question?: string;
  type?: QuestionType | string;
  choices?: string[];
}

// Function to generate a random unique ID
const generateUniqueId = (): string => {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
};

// Default export
export default BaseQuestionProps;

// Usage example (if needed elsewhere)
export { generateUniqueId };
