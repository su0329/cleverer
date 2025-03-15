import React from "react";
import "./index.css";


const UnderscoredInput = React.memo(function UnderscoredInput(props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
    return <input {...props} className="form-input"/>
})

export default React.memo(UnderscoredInput);

