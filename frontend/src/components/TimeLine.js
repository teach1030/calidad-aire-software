import React from 'react'
import './../styles/timeline.css'
import image from './../assets/family.png'

const TimeLine = () => {
    const times = ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM']
    const [activeIndex, setActiveIndex] = React.useState(null);


    React.useEffect(() => {
        setActiveIndex(0);
    }, [])

    return(<div className='timeline__container'>
        <div className='timeline__times'>
        {times.map((t, index) => {
            const active = index === activeIndex;
            const styles = {
                backgroundColor: active ? '#90BE6D' : 'white',
                color: active ? 'white': 'black',
            }
            return(<div style={styles} key={index} className='timeline__hour' onClick={() => setActiveIndex(index)}>
                <p>{ t }</p>
            </div>);
        })}
        </div>

        <div className='timeline__output'>
            <h2>Conoce las recomendaciones según el nivel de calidad del aire para cada hora del día</h2>
            <div><img src={image} width={'200px'} alt='Imagen familia'/></div>
            <p>Para las 4 pm del 29/03/2025 se prevee un pico en contaminante PM2</p>
            <p className='timeline__output--alert'>¡Ciudado! No salgas de casa sin tapabocas</p>
        </div>
    </div>);
}

export { TimeLine }