import React from "react";
import "./index.css";
import UnderscoredInput from "../UnderscoredInput";
import UnderscoredTextArea from "../UnderscoredInput/UnderScoredTextArea";

const CloseIcon = React.memo(function CloseIcon() {
    return (
        <svg viewBox="0 0 50 50">
            <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
        </svg>
    )
})

const StarIcon = React.memo(function StarIcon() {
    return (
        <svg viewBox="0 0 32 32">
            <polygon points="16 23.369 6.333 30.5 10.2 19.09 1.5 12.434 12.133 12.434 16 1.5 19.867 12.434 30.5 12.434 21.8 19.09 25.667 30.5"></polygon>
        </svg>
    )
})

interface RatingRadioOptionProps {
    value: number
    isCheck: boolean
    onClick: () => void
}

const RatingRadioOption = React.memo(function RatingRadioOption({value, isCheck, onClick}: RatingRadioOptionProps) {
    return (
        <>
            <input type="radio" className="rating-radio" id={`rating-radio${value}`} value={value} checked={isCheck}/>
            <label htmlFor={`rating-radio${value}`} onClick={onClick} >
                <StarIcon />
            </label>
        </>
    )
})

interface StarRatingRadioProps {
    numberOfOptions: number
    selectedValue: number
    setSelectValue: Function
}

function StarRatingRadio({numberOfOptions: maxValue, selectedValue, setSelectValue}: StarRatingRadioProps) {
    const onRadioOptionClick = React.useCallback((value: number) => {
        if (selectedValue !== value){
            // allow users to select a rating
            setSelectValue(value);
        } else {
            // allow users to deselect a rating
            setSelectValue(0);
        }
    }, [selectedValue, setSelectValue]);

    // render options based on the maxValue specified
    const options = React.useMemo(() => {
        let otps: React.JSX.Element[] = [];

        for (let i=maxValue; i>0; i--) {
            otps.push(
                <RatingRadioOption value={i} isCheck={selectedValue >= i} onClick={()=>onRadioOptionClick(i)}/>
            )
        }

        return otps;
    }, [maxValue, selectedValue, onRadioOptionClick])

    return (
        <div className="star-rating-radios">
            {[...options]}
        </div>
    )
}

export default function RatingWidget() {
    const [minimized, setMinimized] = React.useState(false);
    const [starRating, setStarRating] = React.useState(0);
    const [purpose, setPurpose] = React.useState("");
    const [improvement, setImprovement] = React.useState("");

    if (minimized) {
        <div className="rating-widget" id="rating-widget-minimized">
            <button onClick={() => setMinimized(false)}>Give a Feedback?</button>
        </div>
    }

    return (
        <div className="rating-widget" id="rating-widget">

            <button className="form-action-close" id="rating-widget-close-button" onClick={()=> setMinimized(true)}>
                <CloseIcon/>
            </button>

            <h1 className="title">Your feedback is valuable!</h1>
            <p className="subtitle"> Let us know how you are doing, so we can provide an even better experience.</p>
            
            <p className="form-input-label">How would you rate your experience?<label className="red">*</label></p>
            <StarRatingRadio numberOfOptions={5} selectedValue={starRating} setSelectValue={setStarRating}/>
            
            <p className="form-input-label">What was the main purpose of your visit?</p>
            <UnderscoredInput 
                id="rating-widget-input-purpose" 
                value={purpose} 
                onChange={(event) => setPurpose(event.target.value)} 
                placeholder="80 characters maximum"
                maxLength={80}
                style={{width:"70%"}}
            />
            
            <p className="form-input-label">Is there anything we can improve?</p>
            <UnderscoredTextArea 
                className="form-input"
                id="rating-widget-input-improvement" 
                value={improvement} 
                onChange={(event) => setImprovement(event.target.value)} 
                placeholder="200 characters maximum"
                maxLength={200}
                style={{width:"70%"}}
            />
        </div>
    )
}