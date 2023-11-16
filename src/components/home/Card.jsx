import styles from './Card.module.css';
import { useState } from 'react';
import zoomIcon from '../../img/zoomIcon.svg';
import hikingIcon from '../../img/person-hiking-solid.svg';
import peopleIcon from '../../img/user-solid.svg';
import areaIcon from '../../img/earth-americas-solid.svg';
import { useNavigate } from 'react-router-dom';
import { DETAIL } from '../../utils/pathroutes';

function Card({ country }) {
    const navigate = useNavigate();
    const { ID, imagenBandera, nombre, activities, poblacion, area } = country;
    const [mouseOverOn, setMouseOverOn] = useState(false);
    /* const areaRender = useSelector(state => state.areaRender);
    const populationRender = useSelector(state => state.populationRender); */

    function handleDetail() {
        navigate(`${DETAIL}/${ID}`);
    }

    function handleMouseOver() {
        setMouseOverOn(true);
    }

    function handleMouseOff() {
        setMouseOverOn(false);
    }

    return (
        <div className={styles.mainView}>
            {imagenBandera &&
                <div onClick={handleDetail} onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOff} className={styles.imgContainer}>
                    <img className={styles.flagImg} src={imagenBandera} alt="" />
                    <div className={styles.overlay}>
                        <div className={styles.zoomIcon} id={mouseOverOn && styles.zoomIconHidden}>
                            <img src={zoomIcon} alt="" />
                            <p>Ver detalle</p>
                        </div>
                        {area ?
                            <div className={styles.numberArea} id={mouseOverOn && styles.numberAreaHidden}>
                                <img src={areaIcon} alt="" />
                                <p>{area.toLocaleString()} km2</p>
                            </div> : null}
                        {poblacion ?
                            <div className={styles.numberPopulation} id={mouseOverOn && styles.numberPopulationHidden}>
                                <img src={peopleIcon} alt="" />
                                <p>{poblacion.toLocaleString()}</p>
                            </div> : null}
                        {activities?.length ?
                            <div className={styles.numberDown} id={mouseOverOn && styles.numberDownHidden}>
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