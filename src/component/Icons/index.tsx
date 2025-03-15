import React from "react";

export const CloseIcon = React.memo(function CloseIcon() {
    return (
        <svg viewBox="0 0 50 50">
            <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
        </svg>
    )
})

export const StarIcon = React.memo(function StarIcon() {
    return (
        <svg viewBox="0 0 32 32">
            <polygon points="16 23.369 6.333 30.5 10.2 19.09 1.5 12.434 12.133 12.434 16 1.5 19.867 12.434 30.5 12.434 21.8 19.09 25.667 30.5"></polygon>
        </svg>
    )
})

