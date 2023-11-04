import styles from './Home.module.css';
import Card from './Card';
import Paginado from './Paginado';
import Loading from '../loading/Loading';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    actionDisplayMenuBar,
    actionDisplayFilters,
    actionRenderCountries,
    actionRemoveAllFilters,
    actionFilterOnlyActivities
} from '../../redux/actions';

function Home() {
    const onlyCountriesWActivities = useSelector(state => state.onlyCountriesWActivities);
    const initialCountries = useSelector(state => state.initialCountries);
    const renderCountries = useSelector(state => state.renderCountries);
    const activitiesFilter = useSelector(state => state.activitiesFilter);
    const difficultyFilter = useSelector(state => state.difficultyFilter);
    const seasonFilter = useSelector(state => state.seasonFilter);
    const continentsFilter = useSelector(state => state.continentsFilter);
    const page = useSelector(state => state.page);
    const [numberOfFiltersSelected, setNumberOfFiltersSelected] = useState(0);
    const [eachPage, setEachPage] = useState(24);
    let totalPages = Math.ceil(renderCountries.length / eachPage);
    let initialSlice = (page - 1) * eachPage;
    let lastSlice = ((page - 1) * eachPage) + eachPage;
    const dispatch = useDispatch();

    function removeFilters() {
        dispatch(actionRemoveAllFilters());
    }

    function filterCountriesWActivities() {
        dispatch(actionFilterOnlyActivities(initialCountries));
    }

    useEffect(() => {
        //acá nos aseguramos de que el menú desplegable y los filtros no se abran indeseablemente al renderizar este componente
        //este dispatch hace que al NavBar le llegue un false del menú desplegable y de los filtros, evitando que se abran
        dispatch(actionDisplayMenuBar(false));
        dispatch(actionDisplayFilters(false));
        // con la línea de abajo nos aseguramos de que otras barSearch usados en otros componentes no borren países del estado global
        // de lo contrario, en el home u otros componentes, no se mostrarían todos los países
        dispatch(actionRenderCountries(initialCountries));
    }, []);

    useEffect(() => {
        const suma = activitiesFilter.length + difficultyFilter.length + seasonFilter.length + continentsFilter.length;
        setNumberOfFiltersSelected(suma);
    }, [activitiesFilter, difficultyFilter, seasonFilter, continentsFilter]);

    return (
        <div className={styles.mainView}>
            <section className={styles.filterSelectionsView}>
                <div className={styles.filterSelectionsContainer}>
                    <p>Filtros aplicados: <span>{numberOfFiltersSelected}</span></p>
                    <button onClick={removeFilters}>Borrar filtros</button>
                    <div id={styles.activitiesOnly}>
                        <p onClick={onlyCountriesWActivities && filterCountriesWActivities} id={onlyCountriesWActivities ? styles.activitiesOnlyOffP : styles.activitiesOnlyOnP}>Todos los países</p>
                        <p className={styles.activitiesOnlyDown} onClick={!onlyCountriesWActivities && filterCountriesWActivities} id={onlyCountriesWActivities ? styles.activitiesOnlyOnP : styles.activitiesOnlyOffP}>Solo países con actividades</p>
                    </div>
                </div>
            </section>
            <p id={styles.seleccionaUnPais}>Selecciona un país:</p>
            {initialCountries.length ?
                <section className={styles.cardsView}>
                    {renderCountries.length ?
                        <div className={styles.cardsContainer}>
                            {renderCountries.length && renderCountries.slice(initialSlice, lastSlice).map((country, index) => {
                                return (
                                    <div key={index} className={styles.cardComponentBox}>
                                        <Card country={country} />
                                    </div>
                                )
                            })}
                        </div> :
                        <div className={styles.cardsContainer}>
                            <div className={styles.cardComponentBox}></div>
                            <div className={styles.cardComponentBox}></div>
                            <div className={styles.cardComponentBox}></div>
                            <div className={styles.cardComponentBox}></div>
                            <div className={styles.cardComponentBox}></div>
                            <div className={styles.cardComponentBox}></div>
                            <div className={styles.cardComponentBox}></div>
                            <div className={styles.cardComponentBox}></div>
                        </div>
                    }
                    <section className={styles.paginado2}>
                        <Paginado totalPages={totalPages} />
                    </section>
                </section> :
                <div className={styles.loadingContainer}>
                    <Loading />
                </div>
            }
            {/* <section className={styles.paginado2}>
                <Paginado totalPages={totalPages} />
            </section> */}
        </div>
    );
}

export default Home;