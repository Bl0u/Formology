import TextQuestion from './TextQuestion';
import {BaseQuestionProps} from "./type";
import RadioQuestion from './RadioQuestion';
import SelectQuestion from './CheckBox';



export default function Question (props: BaseQuestionProps) { 
    return (
        <>
            {props?.questionDetails?.type === 'text' && <TextQuestion updateSectionsGlobalState={props.updateSectionsGlobalState}  questionDetails={props.questionDetails} removeOption={props.removeOption} />}
            {props?.questionDetails?.type === 'radio' && <RadioQuestion updateSectionsGlobalState={props.updateSectionsGlobalState} questionDetails={props.questionDetails} removeOption={props.removeOption}  />}
            {props?.questionDetails?.type === 'checkbox' && <SelectQuestion updateSectionsGlobalState={props.updateSectionsGlobalState} questionDetails={props.questionDetails} removeOption={props.removeOption}/>}
        </>
    );
}
