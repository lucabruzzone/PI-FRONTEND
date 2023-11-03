import styles from './FilterDesktop.module.css';
import axios from 'axios';
import { useEffect } from 'react';
import { URL, ACTIVITIES } from '../../utils/pathroutes';
import { useSelector, useDispatch } from 'react-redux';
import { 
    actionRenderCountries, 
    actionFilterActivities, 
    actionFilterDifficulty, 
    actionFilterSeason, 
    actionFilterContinents, 
    actionActivitiesAvailable 
} from '../../redux/actions';

function FilterDesktop() {
    const dispatch = useDispatch();
    const initialCountries = useSelector(state => state.initialCountries);
    const activitiesAvailable = useSelector(state => state.activitiesAvailable);
    const activitiesFilter = useSelector(state => state.activitiesFilter);
    const difficultyFilter = useSelector(state => state.difficultyFilter);
    const seasonFilter = useSelector(state => state.seasonFilter);
    const continentsFilter = useSelector(state => state.continentsFilter);

    function handleSelect(e) {
        const id = e.target.id;
        let title = e.target.title.toLowerCase();
        if(id === 'Actividad') {
            dispatch(actionFilterActivities(title));
            dispatch(actionRenderCountries(initialCountries));
        }
        else if(id === 'Dificultad') {
            title = parseInt(title);
            dispatch(actionFilterDifficulty(title));
            dispatch(actionRenderCountries(initialCountries));
        }
        else if(id === 'Temporada') {
            dispatch(actionFilterSeason(title));
            dispatch(actionRenderCountries(initialCountries));
        }
        else if(id === 'Continente') {
            dispatch(actionFilterContinents(title));
            dispatch(actionRenderCountries(initialCountries));
        }
    }

    async function getActivitiesAvailable() {
        try {
            const { data } = await axios(`${URL}/${ACTIVITIES}`);
            if (data.length) {
                dispatch(actionActivitiesAvailable(data));
            }
            else throw Error('La carga de las actividades no fue exitosa');
        } catch (error) {
            console(error.message);
        }
    }

    useEffect(() => {
        getActivitiesAvailable();
    }, []);

    return (
        <div id={styles.mainContainer}>
            <section id={styles.eachSection} className={activitiesFilter.length ? styles.borderSelected : styles.borderHidden}>
                <label className={styles.actividad} htmlFor="">Actividad</label>
                <ul className={styles.listUl} name="actividad" id="actividad">
                    {activitiesAvailable.length && activitiesAvailable.map((activity, i) => {
                        return <li key={i} onClick={handleSelect} title={activity.nombre} id='Actividad' className={activitiesFilter.includes(activity.nombre) && styles.selectionOn}>{activity.nombre}</li>
                    })}
                </ul>
            </section>

            <section id={styles.eachSection} className={difficultyFilter.length ? styles.borderSelected : styles.borderHidden}>
                <label className={styles.dificultad} htmlFor="">Dificultad</label>
                <ul className={styles.listUl} name="Dificultad" id="Dificultad">
                    <li onClick={handleSelect} title="1" id='Dificultad' className={difficultyFilter.includes(1) && styles.selectionOn}>1 Muy Baja</li>
                    <li onClick={handleSelect} title="2" id='Dificultad' className={difficultyFilter.includes(2) && styles.selectionOn}>2 Baja</li>
                    <li onClick={handleSelect} title="3" id='Dificultad' className={difficultyFilter.includes(3) && styles.selectionOn}>3 Media</li>
                    <li onClick={handleSelect} title="4" id='Dificultad' className={difficultyFilter.includes(4) && styles.selectionOn}>4 Media Alta</li>
                    <li onClick={handleSelect} title="5" id='Dificultad' className={difficultyFilter.includes(5) && styles.selectionOn}>5 Alta</li>
                </ul>
            </section>

            <section id={styles.eachSection} className={seasonFilter.length ? styles.borderSelected : styles.borderHidden}>
                <label className={styles.temporada} htmlFor="">Temporada</label>
                <ul className={styles.listUl} name="Temporada" id="Temporada">
                    <li onClick={handleSelect} title="Verano" id='Temporada' className={seasonFilter.includes('verano') && styles.selectionOn}>Verano</li>
                    <li onClick={handleSelect} title="Otoño" id='Temporada' className={seasonFilter.includes('otoño') && styles.selectionOn}>Otoño</li>
                    <li onClick={handleSelect} title="Invierno" id='Temporada' className={seasonFilter.includes('invierno') && styles.selectionOn}>Invierno</li>
                    <li onClick={handleSelect} title="Primavera" id='Temporada' className={seasonFilter.includes('primavera') && styles.selectionOn}>Primavera</li>
                </ul>
            </section>

            <section id={styles.eachSection} className={continentsFilter.length ? styles.borderSelected : styles.borderHidden}>
                <label className={styles.continente} htmlFor="">Continente</label>
                <ul className={styles.listUl} name="Continente" id="Continente">
                    <li onClick={handleSelect} title="Americas" id='Continente' className={continentsFilter.includes('americas') && styles.selectionOn}>América</li>
                    <li onClick={handleSelect} title="Europe" id='Continente' className={continentsFilter.includes('europe') && styles.selectionOn}>Europa</li>
                    <li onClick={handleSelect} title="Asia" id='Continente' className={continentsFilter.includes('asia') && styles.selectionOn}>Asia</li>
                    <li onClick={handleSelect} title="Africa" id='Continente' className={continentsFilter.includes('africa') && styles.selectionOn}>Africa</li>
                    <li onClick={handleSelect} title="Oceania" id='Continente' className={continentsFilter.includes('oceania') && styles.selectionOn}>Oceanía</li>
                </ul>
            </section>
        </div>
    );
}

export default FilterDesktop;