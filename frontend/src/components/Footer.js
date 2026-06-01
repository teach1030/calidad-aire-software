import React from 'react'
import sensorama from './../assets/sensorama.png'
import unilibre from './../assets/unilibre.png'
import './../styles/footer.css'

const Footer = () => {
    return(<>
        <div>
            <footer>
                <div className='footer__block-images'>
                    <img src={unilibre} width={'80px'} alt='Logo unilibre'/>
                    <img src={sensorama} width={'100px'} alt='Logo sensorama'/>
                </div>
                <p><strong>UNIVERSIDAD LIBRE</strong></p>
                <p>Semillero de invesgigación</p>
                <p>SENSORAMA</p>
            </footer>
        </div>
    </>);
}

export {Footer}