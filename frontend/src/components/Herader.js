import React from "react";
import { PiPottedPlantFill } from "react-icons/pi";

const header = {
    backgroundColor: '#2C7DA0',
    padding: '18px',
    display: 'flex',
    gap: '12px'
}
const headerText = {
    margin: '0px',
    padding: '0px',
    color: 'white',
    fontSize: '1.2rem'
}

const Header = () => {
    return(
        <div>
            <header style={header}>
                <PiPottedPlantFill color="white" size={25} />
                <p style={headerText}>Calidad del Aire en Bogotá</p>
            </header>
        </div>
    )
}

export { Header }