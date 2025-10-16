


import React from 'react';


const Button = ({ label, onClick }) => {
    
    const handleClick = (event) => {
        
        event.preventDefault();

        
        if (onClick) {
            onClick(event);
        }
    };

    
    return (
        <button
            className="custom-button"
            onClick={handleClick}
            type="button"
        >
            {}
            {label}
        </button>
    );
};


Button.defaultProps = {
    label: 'Click Me',  
    onClick: null       
};


export default Button;


