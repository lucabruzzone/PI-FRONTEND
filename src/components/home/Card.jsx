import styles from './Card.module.css';
import { useState, useEffect, useRef } from 'react';
import zoomIcon from '../../img/zoomIcon.svg';
import hikingIcon from '../../img/person-hiking-solid.svg';
import peopleIcon from '../../img/user-solid.svg';
import areaIcon from '../../img/earth-americas-solid.svg';
import { useNavigate } from 'react-router-dom';
import { DETAIL } from '../../utils/pathroutes';

function Card({ country }) {
    const navigate = useNavigate();
    const divRef = useRef(null);
    const { ID, imagenBandera, nombre, activities, poblacion, area } = country;
    const [mouseOverOn, setMouseOverOn] = useState(false);
    const [preDetail, setPreDetail] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    function handleDetail(e) {
        // para aparatos móviles el el efecto hover lo cambiamos a un click, por lo tanto para navegar al detail hay que hacer dos clicks.
        e.preventDefault();
        if (windowDimensions.width <= 500) {
            if (preDetail) {
                navigate(`${DETAIL}/${ID}`);
            }
            else setPreDetail(true);
        }
        else {
            navigate(`${DETAIL}/${ID}`);
        }
    }

    function handleMouseOver(e) {
        e.preventDefault();
        setMouseOverOn(true);
    }

    function handleMouseOff(e) {
        e.preventDefault();
        setMouseOverOn(false);
    }

    function handleClickOutside(e) {
        // para que el preDetail desaparezca al hacer click afuera de cada card
        if (divRef.current && !divRef.current.contains(e.target)) {
            setPreDetail(false);
        }
    }

    const handleResize = () => {
        //función que maneja el ancho de la página.
        setWindowDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    useEffect(() => { 
        // le damos a este componente, la función de recuperar las dimensiones de la página para algunas funciones responsive.
        //también le damos la función de escuchar cuando se haga click en window.
        setPreDetail(false);
        window.addEventListener('resize', handleResize);
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.mainView}>
            {imagenBandera &&
                <div ref={divRef} onClick={handleDetail} onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOff} className={preDetail || mouseOverOn ? styles.imgContainerHover : styles.imgContainer}>
                    <img className={styles.flagImg} src={imagenBandera} alt="" />
                    <div className={(mouseOverOn || preDetail) ? styles.overlayHover : styles.overlay}>
                        <div className={styles.zoomIcon} id={(mouseOverOn || preDetail) && styles.zoomIconHidden}>
                            <img src={zoomIcon} alt="" />
                            <p>Ver detalle</p>
                        </div>
                        {area ?
                            <div className={styles.numberArea} id={(mouseOverOn || preDetail) && styles.numberAreaHidden}>
                                <img src={areaIcon} alt="" />
                                <p>{area.toLocaleString()} km2</p>
                            </div> : null}
                        {poblacion ?
                            <div className={styles.numberPopulation} id={(mouseOverOn || preDetail) && styles.numberPopulationHidden}>
                                <img src={peopleIcon} alt="" />
                                <p>{poblacion.toLocaleString()}</p>
                            </div> : null}
                        {activities?.length ?
                            <div className={styles.numberDown} id={(mouseOverOn || preDetail) && styles.numberDownHidden}>
                                <img src={hikingIcon} alt="" />
                                <p>{activities.length}＋</p>
                            </div> : null}
                    </div>
                </div>
            }
            {nombre &&
                <p className={styles.countryName}>{nombre}</p>
            }
        </div>
    );
}

export default Card;