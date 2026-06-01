import React from 'react'
import './../styles/button.css'

const Button = ({ text, primary = true, icon, action }) => {

    const styles = {
        backgroundColor: primary ? '#90BE6D' : 'white',
        color: primary ? 'white' : '#90BE6D',
        border: primary ? '0px' : '1px solid #90BE6D',
    }

    return(<>
        <button type='button' className='btn' onClick={action} style={styles}><span>{ icon }</span><p>{ text }</p></button>
    </>);
}

export {Button}
