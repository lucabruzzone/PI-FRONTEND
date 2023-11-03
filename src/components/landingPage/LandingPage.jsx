import styles from './LandingPage.module.css';
import seaVideo from '../../img/seaVideo.mp4';
import desertVideo from '../../img/desertVideo.mp4';
import newYorkVideo from '../../img/newYorkVideo.mp4';
import spainVideo from '../../img/spainVideo.mp4';
import { HOME } from '../../utils/pathroutes';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { actionDisplayMenuBar, actionDisplayFilters } from '../../redux/actions';
import { NavLink } from 'react-router-dom';

function LandingPage() {
    const dispatch = useDispatch();
    const videos = [seaVideo, newYorkVideo, desertVideo, spainVideo];
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoRef = useRef(null);

    useEffect(() => {
        //acá nos aseguramos de que el menú desplegable y los filtros no se abran indeseablemente al renderizar este componente
        //este dispatch hace que al NavBar le llegue un false del menú desplegable y de los filtros, evitando que se abran
        dispatch(actionDisplayMenuBar(false));
        dispatch(actionDisplayFilters(false));

        const videoElement = videoRef.current;
        const interval = setInterval(() => {
            setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
            videoElement.load();
        }, 6000);
        return () => clearInterval(interval);
    }, [videos]);

    return (
        <div className={styles.mainView}>
            <div className={styles.buttonContainer}>
                <NavLink className={styles.navLink} to={HOME}>
                    <button className={styles.button}>Empezar</button>
                </NavLink>
            </div>
            <video ref={videoRef} className={styles.videoContainer} autoPlay loop muted>
                <source src={videos[currentVideoIndex]} type="video/mp4" />
            </video>
        </div>
    );
}

export default LandingPage;