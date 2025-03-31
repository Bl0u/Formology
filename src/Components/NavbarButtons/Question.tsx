import React, { useState } from 'react'
import TextQuestion from './TextQuestion';
import BaseQuestionProps, { generateUniqueId } from "./type";
import RadioQuestion from './RadioQuestion';



export default function Question (props: BaseQuestionProps) { 

    const [cnt, setCnt] = useState(0) ;
    return (
        <>
            {props.type === 'text' && <TextQuestion removeOption={props.removeOption} id={props.id} question={props.question}/>}
            {props.type === 'radio' && <RadioQuestion removeOption={props.removeOption} id={props.id} question={props.question}/>}
        </>
    );
}
