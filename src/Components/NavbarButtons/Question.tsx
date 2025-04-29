import TextQuestion from './TextQuestion';
import {BaseQuestionProps} from "./type";
import RadioQuestion from './RadioQuestion';
import SelectQuestion from './CheckBox';



export default function Question (props: BaseQuestionProps) { 
    return (
        <>
            {props?.questionDetails?.type === 'text' && <TextQuestion isReview={props.isReview} updateSectionsGlobalState={props.updateSectionsGlobalState}  questionDetails={props.questionDetails} removeOption={props.removeOption} />}
            {props?.questionDetails?.type === 'radio' && <RadioQuestion isReview={props.isReview} updateSectionsGlobalState={props.updateSectionsGlobalState} questionDetails={props.questionDetails} removeOption={props.removeOption}  />}
            {props?.questionDetails?.type === 'checkbox' && <SelectQuestion isReview={props.isReview} updateSectionsGlobalState={props.updateSectionsGlobalState} questionDetails={props.questionDetails} removeOption={props.removeOption}/>}
        </>
    );
}
