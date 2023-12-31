import styles from './NavBar.module.css';
import FilterDesktop from './FilterDesktop';
import countriesIcon from '../../img/mountain-sun-solid.svg';
import menuIcon from '../../img/menuIcon.svg';
import searchIcon from '../../img/searchIcon.svg';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { HOME, FORM, URL, COUNTRY } from '../../utils/pathroutes';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { actionDisplayMenuBar, actionDisplayFilters, actionRenderCountries, actionDisplayMobileFilters } from '../../redux/actions';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const globalDisplayMenuBar = useSelector(state => state.displayMenuBar);
    const displayFiltersMobile = useSelector(state => state.displayFiltersMobile);
    const globalDisplayFilters = useSelector(state => state.displayFilters);
    const initialCountries = useSelector(state => state.initialCountries);
    const activitiesFilter = useSelector(state => state.activitiesFilter);
    const difficultyFilter = useSelector(state => state.difficultyFilter);
    const seasonFilter = useSelector(state => state.seasonFilter);
    const continentsFilter = useSelector(state => state.continentsFilter);
    const [numberOfFiltersSelected, setNumberOfFiltersSelected] = useState(0);

    /* async function handleSearch(e) {
        try {
            const value = e.target.value;
            if (value !== '') {
                const { data } = await axios(`${URL}/${COUNTRY}?name=${value}`);
                console.log(data);
                if (data) {
                    dispatch(actionRenderCountries([data, 'searchBar']));
                }
            }
            else dispatch(actionRenderCountries(initialCountries));
        } catch (error) {
            dispatch(actionRenderCountries([]));
            console.error(error.message);
        }
    } */

    async function handleSearch(e) {
        try {
            const value = e.target.value;
            if (value !== '') {
                const filtro = initialCountries.filter(country => {
                    return country.nombre.toUpperCase().includes(value.toUpperCase());
                })
                if (filtro) {
                    dispatch(actionRenderCountries([filtro, 'searchBar']));
                }
            }
            else dispatch(actionRenderCountries(initialCountries));
        } catch (error) {
            dispatch(actionRenderCountries([]));
            console.error(error.message);
        }
    }

    function handleMediaFilter() { // abre o cierra los filtros en mobile size
        dispatch(actionDisplayMobileFilters(!displayFiltersMobile));
    }

    function handlerFilters() { // acá abrimos o cerramos al mismo tiempo, el menu en mobile size y los filtros en desktop size 
        dispatch(actionDisplayFilters(!globalDisplayFilters));
        dispatch(actionDisplayMenuBar(!globalDisplayMenuBar));
        if (displayFiltersMobile) { // si esque sigue abierto el box de filtros en mobile size, lo cerramos para que no genere problemas
            dispatch(actionDisplayMobileFilters(!displayFiltersMobile));
        }
    }

    function handleIconClick() {
        // Si ya estás en '/home', recargar la página.
        if (window.location.pathname === HOME) {
            window.location.reload();
        } else {
            // Si no estás en '/home', navega a '/home'.
            navigate(HOME);
        }
    }

    useEffect(() => { // esto es para saber la cantidad de filtros aplicados
        const suma = activitiesFilter.length + difficultyFilter.length + seasonFilter.length + continentsFilter.length;
        setNumberOfFiltersSelected(suma);
    }, [activitiesFilter, difficultyFilter, seasonFilter, continentsFilter]);

    return (
        <div className={styles.mainView}>
            <div className={styles.navBarContainer}>
                <div className={styles.leftElements}>
                    <img onClick={handleIconClick} className={styles.countriesIcon} src={countriesIcon} alt="app icon" />
                    {location.pathname !== '/' ?
                        <div className={styles.searchBar}>
                            <input onChange={handleSearch} type="search" placeholder='Busca por país' />
                            <img src={searchIcon} alt="" />
                        </div> :
                        <div className={styles.CountriesTitle}>
                            <p>CountriesApp</p>
                        </div>
                    }
                </div>
                {location.pathname !== '/' &&
                    <img onClick={handlerFilters} className={styles.menuIcon} src={menuIcon} alt="menu image" />
                }
                <div className={styles.listContainer}>
                    <ul>
                        <NavLink to={HOME} className={styles.navLinkDesktop} id={location.pathname === HOME && styles.navLinkDesktopLanding}>
                            <button>Home</button>
                        </NavLink>
                        {location.pathname !== '/' &&
                            <NavLink to={FORM} className={styles.navLinkDesktop} id={location.pathname === FORM && styles.navLinkDesktopLanding}>
                                <button>Agregar actividad</button>
                            </NavLink>
                        }
                        {location.pathname !== '/' &&
                            <NavLink className={styles.navLinkDesktop}>
                                <button onClick={handlerFilters} id={globalDisplayFilters ? styles.filtersOn : styles.filters} className={globalDisplayFilters ? styles.filters : styles.filters2}>Filtros</button>
                                <p className={numberOfFiltersSelected === 0 ? styles.countOff : styles.countOn}>{numberOfFiltersSelected}</p>
                            </NavLink>
                        }
                    </ul>
                </div>
            </div>
            {location.pathname !== '/' &&
                <div id={styles.filterDesktop} className={globalDisplayFilters ? styles.filterDesktopDisplayed : styles.filterDesktopHidden}>
                    <FilterDesktop />
                </div>
            }

            {/* MEDIA QUERY MENU BAR */}
            {location.pathname !== '/' &&
                <div id={styles.menuBarContainer}>
                    <div id={globalDisplayMenuBar ? styles.firstUlOn : styles.firstUlOff}>
                        <ul className={styles.firstUl}>
                            <li className={styles.li} id={location.pathname === HOME ? styles.navLinkMobileLanding : ''}>
                                <NavLink to={HOME} className={styles.navLinkMedia}>
                                    <button id={HOME} className={styles.home}>Home</button>
                                </NavLink>
                            </li>

                            <li className={styles.li} id={location.pathname === FORM && styles.navLinkMobileLanding}>
                                <NavLink to={FORM} className={styles.navLinkMedia}>
                                    <button id={FORM} className={styles.actividades}>Agrega una actividad</button>
                                </NavLink>
                            </li>

                            <li className={styles.li}>
                                <NavLink className={styles.navLinkMedia} onClick={handleMediaFilter}>
                                    <button className={styles.filtros}>Filtros</button>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    <div id={styles.filterMobile} className={displayFiltersMobile ? styles.filterMobileDisplayed : styles.filterMobileHidden}>
                        <FilterDesktop />
                    </div>
                </div>
            }
        </div>
    );
}

export default NavBar;