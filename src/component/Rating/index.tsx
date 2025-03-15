import React from "react"
import "./index.css"

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
    const [starRating, setStarRating] = React.useState(0);
    return (
        <div className="rating-widget" id="rating-widget">
            <h1 className="title">You feedback is valuable!</h1>
            <p className="subtitle"> Let us know how you are doing, so we can provide an even better experience.</p>
            <p>How would you rate your experience?<label className="red">*</label></p>
            
            <StarRatingRadio numberOfOptions={5} selectedValue={starRating} setSelectValue={setStarRating}/>

            <p>What was the main purpose of your visit?</p>
            <input></input>
            <p>Is there anything we can improve?</p>
            <input></input>
        </div>
    )
}