import React from "react";
import "./index.css";
import UnderscoredInput from "../UnderscoredInput";
import UnderscoredTextArea from "../UnderscoredInput/UnderScoredTextArea";
import { CloseIcon, StarIcon } from "../Icons";
import { localStorageHelper } from "../../Utility/localStorage";


interface RatingRadioOptionProps {
    value: number
    isCheck: boolean
    onClick: () => void
}

const RatingRadioOption = React.memo(function RatingRadioOption({value, isCheck, onClick}: RatingRadioOptionProps) {
    return (
        <>
            <input type="radio" className="rating-radio" readOnly id={`rating-radio${value}`} value={value} checked={isCheck}/>
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
                <RatingRadioOption key={i} value={i} isCheck={selectedValue >= i} onClick={()=>onRadioOptionClick(i)}/>
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

/**
 * UserRating is the information we collected from users, which consists of a rating rate 1-5, purpose of visiting, improvements
 * @property {starRating} required. min 1, max 5
 * @property {purpose} optional. Purpose of visiting.
 * @property {improvement} optional.
 * TODO: collect user browser info
 * TODO: collect user info
 */
export interface UserRating {
    id?: number
    starRating: number
    purpose?: string
    improvement?: string
}

export default function RatingWidget() {
    const [widgetStatus, setWidgetStatus] = React.useState<'minimized'|'opened'|'submitted'|'closed'>('opened');
    const [starRating, setStarRating] = React.useState(0);
    const [purpose, setPurpose] = React.useState("");
    const [improvement, setImprovement] = React.useState("");

    const onRatingSubmit = React.useCallback(() => {
        // form validation, evaluate required field.
        if (starRating === 0) {
            alert("Please select a star rating.")
            return;
        }

        const formData: UserRating = {
            starRating: starRating,
            purpose: purpose,
            improvement: improvement
        };

        const {status} = localStorageHelper.UpsertUserRating(formData);
        if (status !== "OK") {
            alert("There was an error while saving your feedback, please try again.")
            return;
        }

        // on success
        setWidgetStatus('submitted');
        setTimeout(() => {
            setWidgetStatus('closed');
        }, 5000);
    }, [starRating, purpose, improvement])

    if (widgetStatus === 'closed') {
        return null;
    }

    if (widgetStatus==='minimized') {
        return (<button className="rating-widget" id="rating-widget-minimized" onClick={() => setWidgetStatus('opened')}>Give a Feedback?</button>)
    }

    // todo: Show a dynamic counting down in text
    if (widgetStatus === 'submitted'){
        return (
            <div className="rating-widget" id="rating-widget">

                <button className="form-action-close" id="rating-widget-close-button" onClick={()=> setWidgetStatus('minimized')}>
                    <CloseIcon/>
                </button>

                <h1 className="title">We received your feedback !</h1>
                <p className="subtitle">Appreciate your time and support to help us building a better platform.</p>
                
                <p className="form-input-label">This modal will be closed in 5s</p>
            </div>
        )
    }

    // widgetStatus === 'opened'
    return (
        <div className="rating-widget" id="rating-widget">

            <button className="form-action-close" id="rating-widget-close-button" onClick={()=> setWidgetStatus('minimized')}>
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

            <button id="rating-widget-submit" onClick={onRatingSubmit}>Submit</button>
        </div>
    )
}