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
    actionDisplayMobileFilters,
    actionFilterOnlyActivities,
    actionAlphabeticalSort,
    actionAreaSort,
    actionPopulationSort
} from '../../redux/actions';

function Home() {
    const areaRender = useSelector(state => state.areaRender);
    const populationRender = useSelector(state => state.populationRender);
    const onlyCountriesWActivities = useSelector(state => state.onlyCountriesWActivities);
    const alphabeticalSortGlobal = useSelector(state => state.alphabeticalRender);
    const initialCountries = useSelector(state => state.initialCountries);
    const renderCountries = useSelector(state => state.renderCountries);
    const activitiesFilter = useSelector(state => state.activitiesFilter);
    const difficultyFilter = useSelector(state => state.difficultyFilter);
    const seasonFilter = useSelector(state => state.seasonFilter);
    const continentsFilter = useSelector(state => state.continentsFilter);
    const page = useSelector(state => state.page);
    const [numberOfFiltersSelected, setNumberOfFiltersSelected] = useState(0);
    const eachPage = 24
    let totalPages = Math.ceil(renderCountries.length / eachPage);
    let initialSlice = (page - 1) * eachPage;
    let lastSlice = ((page - 1) * eachPage) + eachPage;
    const dispatch = useDispatch();

    function removeFilters() {
        dispatch(actionRemoveAllFilters());
        dispatch(actionRenderCountries(initialCountries));
    }

    function filterCountriesWActivities(value) {
        dispatch(actionFilterOnlyActivities(value));
        dispatch(actionRenderCountries(initialCountries));
    }

    function alphabeticalSort(letter) {
        dispatch(actionAlphabeticalSort(letter));
        dispatch(actionRenderCountries(initialCountries));
        // dispatch(actionAlphabeticalSort(letter));
    }

    function areaSort(letter) {
        dispatch(actionAreaSort(letter));
        dispatch(actionRenderCountries(initialCountries));
        // dispatch(actionAlphabeticalSort(letter));
    }

    function populationSort(letter) {
        dispatch(actionPopulationSort(letter));
        dispatch(actionRenderCountries(initialCountries));
        // dispatch(actionAlphabeticalSort(letter));
    }

    useEffect(() => {
        //acá nos aseguramos de que el menú desplegable y los filtros no se abran indeseablemente al renderizar este componente
        //este dispatch hace que al NavBar le llegue un false del menú desplegable y de los filtros, evitando que se abran
        dispatch(actionDisplayMenuBar(false));
        dispatch(actionDisplayMobileFilters(false));
        dispatch(actionDisplayFilters(false));
        // con la línea de abajo nos aseguramos de que otras barSearch usados en otros componentes no borren países del estado global
        // de lo contrario, en el home u otros componentes, no se mostrarían todos los países
        dispatch(actionRenderCountries(initialCountries));
    }, []);

    useEffect(() => {
        // acá recuperamos la cantidad de filtros aplicados.
        const suma = activitiesFilter.length + difficultyFilter.length + seasonFilter.length + continentsFilter.length;
        setNumberOfFiltersSelected(suma);
    }, [activitiesFilter, difficultyFilter, seasonFilter, continentsFilter]);

    return (
        <div className={styles.mainView}>
            <section className={styles.filterSelectionsView} id={!initialCountries.length && styles.filterSelectionsViewLoading}>
                <div className={styles.filterSelectionsContainer}>
                    <div className={styles.showContainer}>
                        <div id={styles.activitiesOnly}>
                            <div className={styles.orderDiv}>
                                <label htmlFor="">km2</label>
                                <div className={styles.orderSubDiv}>
                                    <p onClick={() => areaSort('a')} id={areaRender === 'a' ? styles.orderOn : styles.orderOff}>↑</p>
                                    <p onClick={() => areaSort('z')} id={areaRender === 'z' ? styles.orderOn : styles.orderOff}>↓</p>
                                </div>
                            </div>
                            <div className={styles.orderDiv}>
                                <label htmlFor="">Población</label>
                                <div className={styles.orderSubDiv}>
                                    <p onClick={() => populationSort('a')} id={populationRender === 'a' ? styles.orderOn : styles.orderOff}>↑</p>
                                    <p onClick={() => populationSort('z')} id={populationRender === 'z' ? styles.orderOn : styles.orderOff}>↓</p>
                                </div>
                            </div>
                            <div className={styles.orderDiv}>
                                <label htmlFor="">Alfabético</label>
                                <div className={styles.orderSubDiv}>
                                    <p onClick={() => alphabeticalSort('a')} id={alphabeticalSortGlobal === 'a' ? styles.orderOn : styles.orderOff}>↑</p>
                                    <p onClick={() => alphabeticalSort('z')} id={alphabeticalSortGlobal === 'z' ? styles.orderOn : styles.orderOff}>↓</p>
                                </div>
                            </div>
                        </div>
                        <div id={styles.activitiesOnly}>
                            <p onClick={() => filterCountriesWActivities(false)} id={onlyCountriesWActivities ? styles.activitiesOnlyOffP : styles.activitiesOnlyOnP}>Todos los países</p>
                            <p className={styles.activitiesOnlyDown} onClick={() => filterCountriesWActivities(true)} id={onlyCountriesWActivities ? styles.activitiesOnlyOnP : styles.activitiesOnlyOffP}>Con actividades</p>
                        </div>
                    </div>
                </div>
            </section>
            {initialCountries.length ?
                <section className={styles.cardsView}>
                    <div className={styles.borrarDiv}>
                        <p>Filtros aplicados: {numberOfFiltersSelected > 0 && <span>{numberOfFiltersSelected}</span>}</p>
                        <button onClick={removeFilters}>Borrar filtros</button>
                    </div>
                    <p className={styles.seleccionaUnPais} id={!initialCountries.length && styles.filterSelectionsViewLoading}>Selecciona un país:</p>
                    <div className={styles.paginado1}>
                        <Paginado totalPages={totalPages} />
                    </div>
                    {renderCountries.length ?
                        <div className={styles.cardsContainer}>
                            {renderCountries?.length && renderCountries?.slice(initialSlice, lastSlice).map((country, index) => {
                                return (
                                    <div key={index} className={styles.cardComponentBox}>
                                        <Card country={country} />
                                    </div>
                                )
                            })}
                        </div> :
                        <div className={styles.cardsContainer} id={styles.falseCardsContainer}>
                            <div className={styles.cardComponentBox}>
                                <div className={styles.falseCard}></div>
                            </div>
                            <div className={styles.cardComponentBox}>
                                <div className={styles.falseCard}></div>
                            </div>
                            <div className={styles.cardComponentBox}>
                                <div className={styles.falseCard}></div>
                            </div>
                            <div className={styles.cardComponentBox}>
                                <div className={styles.falseCard}></div>
                            </div>
                            <div className={styles.cardComponentBox}>
                                <div className={styles.falseCard}></div>
                            </div>
                            <div className={styles.cardComponentBox}>
                                <div className={styles.falseCard}></div>
                            </div>
                            <div className={styles.cardComponentBox}>
                                <div className={styles.falseCard}></div>
                            </div>
                            <div className={styles.cardComponentBox}>
                                <div className={styles.falseCard}></div>
                            </div>
                        </div>
                    }
                    <div className={styles.paginado2}>
                        <Paginado totalPages={totalPages} />
                    </div>
                </section> :
                <div className={styles.loadingContainer}>
                    <Loading />
                </div>
            }
        </div>
    );
}

export default Home;