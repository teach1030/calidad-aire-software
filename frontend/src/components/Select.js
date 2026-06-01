import React from 'react'
import './../styles/input.css'

const Select = ({label, options, id, change}) => {
    return (<div className='inp'>
        <label className="inp__label" for={id}>{label}</label>
        <select className='inp__input' id={id} name={id} onChange={(e) => change(e.target.value)}>
            <option value="">-- Selecciona --</option>
            {options.map(option => <option value={option.value}>{option.text}</option>)}
        </select>
    </div>);
}

export { Select }