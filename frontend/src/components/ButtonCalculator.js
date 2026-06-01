import React from 'react';
import './../styles/button.css';

const ButtonCalculator = ({ text, primary = true, icon, action }) => {

    const styles = {
        backgroundColor: primary ? '#90BE6D' : 'white',
        color: primary ? 'white' : '#90BE6D',
        border: primary ? '0px' : '1px solid #90BE6D',
    }

    return (
        <button 
            type={action ? 'button' : 'submit'} 
            className='btn' 
            style={styles}
            onClick={action}
        >
            {icon && <span>{icon}</span>}
            <p>{text}</p>
        </button>
    );
}

export { ButtonCalculator }
