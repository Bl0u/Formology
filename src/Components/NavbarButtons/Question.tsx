import React, { useState } from 'react'
import TextQuestion from './TextQuestion';
import BaseQuestionProps, { generateUniqueId } from "./type.ts";
import RadioQuestion from './RadioQuestion';



export default function Question (props: BaseQuestionProps) { 

    const [cnt, setCnt] = useState(0) ;
    return (
        <>
            {props.type === 'text' && <TextQuestion id={generateUniqueId()} question={props.question}/>}
            {props.type === 'radio' && <RadioQuestion id={generateUniqueId()} question={props.question}/>}
        </>
    );
}
