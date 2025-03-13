import { ReactNode, useState } from 'react'
import Question from '../NavbarButtons/Question';


interface props {
    children?: ReactNode ;
}
export default function Form ({children}: props) {
    const [isQuestionVisible, setQuestionVisible] = useState(false) ;

    const handleClick = () => {
        setQuestionVisible(prev => !prev) ;
    }
  return (
    <div className='react-form-displayer'>
        {children}
    </div>
  )
}
