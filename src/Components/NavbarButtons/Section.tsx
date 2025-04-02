import { useState } from "react";



export default function Section() {
    // Declarations
    const [title, setTitle] = useState('Section Title') ;
    const [isHeadingVisible, setHeading] = useState(true) ;

    // Functions
    const handleClick = () => {
        const newName = setSectionName();
        setTitle(newName ?? 'Section Title');
        setHeading(true) ;
        console.log(newName);
    };
    const setSectionName = () => {
        const sectionName = prompt('gimme the damn section name nigga')
        return sectionName ;
    }

    // Component
    return (
        <>
        {isHeadingVisible && <h1 className='react-section-name'>{title}</h1>}
        </>
    );

}