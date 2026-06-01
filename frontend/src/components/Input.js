import React from 'react'
import './../styles/input.css'

const Input = ({ label, type, value, change }) => {
    return(<div className='inp'>
        <label className="inp__label">{ label }</label>
        <input 
            className='inp__input' 
            type={ type } 
            value={value} 
            onChange={(e) => change(e.target.value)} 
        />
    </div>);
}

export { Input }
