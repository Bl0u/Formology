import React, { useState } from 'react'
import TextQuestion from './TextQuestion';
import BaseQuestionProps from "./type";
import RadioQuestion from './RadioQuestion';
import SelectQuestion from './CheckBox';



export default function Question (props: BaseQuestionProps) { 

    const [cnt, setCnt] = useState(0) ;
    return (
        <>
            {props.type === 'text' && <TextQuestion questionDetails={props.questionDetails} removeOption={props.removeOption} />}
            {props.type === 'radio' && <RadioQuestion questionDetails={props.questionDetails} removeOption={props.removeOption} />}
            {/* {props.type === 'select' && <SelectQuestion removeOption={props.removeOption} id={props.id} question={props.question}/>} */}
        </>
    );
}
