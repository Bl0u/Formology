import React, { useState } from 'react'
import TextQuestion from './TextQuestion';
import BaseQuestionProps from './type';



export default function Question (props: BaseQuestionProps) { ;

    const [cnt, setCnt] = useState(0) ;
    return (
        <>
            {props.type === 'text' && <TextQuestion question={props.question}/>}
        </>
    );
}
