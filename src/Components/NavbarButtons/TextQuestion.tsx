import { useState } from "react";
import BaseQuestionProps from "./type";



export default function TextQuestion(props: BaseQuestionProps ) {
    const [text, setText] = useState('') ;
  return (
    <div>
        
        <textarea
            onChange={ (e) => {
                setText(e.target.value) ;
                    // console.log(e.target.value);
            }}
          value={props.question}
          rows={1}
          cols={50}
        ></textarea> <br></br>
        <textarea
            onChange={ (e) => {
                setText(e.target.value) ;
                    // console.log(e.target.value);
                    
            }}
          placeholder="Enter your text here..."
          rows={4}
          cols={50}
        ></textarea>
    </div>
  );
}
