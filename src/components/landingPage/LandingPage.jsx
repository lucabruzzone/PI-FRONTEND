import styles from './LandingPage.module.css';
import img1 from '../../img/egypt-2267089_1920.jpeg';
import img2 from '../../img/hallstatt-3609863_1920.jpeg';
import img3 from '../../img/moscowImg.jpeg';
import img4 from '../../img/polynesia-3021072_1920.jpeg';
import img5 from '../../img/tiber-river-4529605_1920.jpeg';
import { HOME } from '../../utils/pathroutes';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { actionDisplayMenuBar, actionDisplayFilters } from '../../redux/actions';
import { NavLink } from 'react-router-dom';

function LandingPage() {
    const dispatch = useDispatch();
    /* const videos = [seaVideo, newYorkVideo, desertVideo, spainVideo]; */
    const videos = [img1, img2, img3, img4, img5];
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoRef = useRef(null);

    useEffect(() => {
        //acá nos aseguramos de que el menú desplegable y los filtros no se abran indeseablemente al renderizar este componente
        //este dispatch hace que al NavBar le llegue un false del menú desplegable y de los filtros, evitando que se abran
        dispatch(actionDisplayMenuBar(false));
        dispatch(actionDisplayFilters(false));

        const interval = setInterval(() => {
            setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [videos]);

    return (
        <div className={styles.mainView}>
            <div className={styles.buttonContainer}>
                <NavLink className={styles.navLink} to={HOME}>
                    <button className={styles.button}>Comenzar</button>
                </NavLink>
            </div>
            <div ref={videoRef} className={styles.videoContainer}>
                <img src={videos[currentVideoIndex]} type="" />
            </div>
        </div>
    );
}

export default LandingPage;