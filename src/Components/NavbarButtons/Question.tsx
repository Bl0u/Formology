import React, { useState } from 'react'
import TextQuestion from './TextQuestion';
import {BaseQuestionProps} from "./type";
import RadioQuestion from './RadioQuestion';
import SelectQuestion from './CheckBox';



export default function Question (props: BaseQuestionProps) { 
    return (
        <>
            {props.questionDetails.type === 'text' && <TextQuestion  questionDetails={props.questionDetails} />}
            {props.questionDetails.type === 'radio' && <RadioQuestion questionDetails={props.questionDetails} removeOption={props.removeOption} />}
            {props.questionDetails.type === 'checkbox' && <SelectQuestion questionDetails={props.questionDetails} removeOption={props.removeOption}/>}
        </>
    );
}
