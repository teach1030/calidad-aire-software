import React from 'react';
import "./../styles/input.css";

const InputCalculator = ({ label, type, placeholder, name, value, onChange }) => {
    return (
        <div className="input__group">
            <label>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export { InputCalculator };
