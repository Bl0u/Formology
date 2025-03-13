import React, { Children, ReactNode, useState } from 'react';
import TextQuestion from './TextQuestion';
import Question from './Question';


interface props {
    children?: ReactNode ;
}
export default function Navbar(props: props) {

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-logo">
                    <span className="logo-text">LOGO</span>
                </div>
                {props.children}
            </div>
        </nav>
    );
}