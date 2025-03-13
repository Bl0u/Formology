type QuestionType = 'text' | 'radio' | 'checkbox';

interface BaseQuestionProps {
  question?: string;
  type?: QuestionType;
}


export default BaseQuestionProps ;