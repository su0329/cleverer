import React from "react";
import "./index.css";


const UnderscoredTextArea = React.memo(function UnderscoredTextArea(props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>) {
    return <textarea {...props} className="form-input"/>
})

export default React.memo(UnderscoredTextArea);