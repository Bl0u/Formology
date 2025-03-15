type QuestionType = 'text' | 'radio' | 'checkbox';

interface BaseQuestionProps {
  question?: string;
  type?: QuestionType | string;
}


export default BaseQuestionProps ;