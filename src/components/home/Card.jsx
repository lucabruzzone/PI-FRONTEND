import styles from './Card.module.css';
import { useState } from 'react';
import zoomIcon from '../../img/zoomIcon.svg';
import hikingIcon from '../../img/person-hiking-solid.svg';
import { useNavigate } from 'react-router-dom';
import { DETAIL } from '../../utils/pathroutes';

function Card({ country }) {
    const navigate = useNavigate();
    const { ID, imagenBandera, nombre, activities } = country;
    const [mouseOverOn, setMouseOverOn] = useState(false);

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
                    <div className={mouseOverOn ? styles.overlay : styles.overlayHidden}>
                        <div className={styles.zoomIcon}>
                            <img src={zoomIcon} alt="" />
                            <p>Ver detalle</p>
                        </div>
                    </div>
                </div>
            }
            {nombre &&
                <p className={styles.countryName}>{nombre}</p>
            }
            {activities?.length ?
                <div className={styles.numberDown} id={mouseOverOn && styles.numberDownHidden}>
                    <p>{activities.length}＋</p>
                    <img src={hikingIcon} alt="" />
                </div> : null}
        </div>
    );
}

export default Card;