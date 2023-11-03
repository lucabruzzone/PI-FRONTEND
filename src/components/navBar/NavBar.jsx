import styles from './NavBar.module.css';
import FilterDesktop from './FilterDesktop';
import countriesIcon from '../../img/mountain-sun-solid.svg';
import menuIcon from '../../img/menuIcon.svg';
import searchIcon from '../../img/searchIcon.svg';
import axios from 'axios';
import { HOME, FORM, URL, COUNTRY } from '../../utils/pathroutes';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { actionDisplayMenuBar, actionDisplayFilters, actionRenderCountries } from '../../redux/actions';

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const globalDisplayMenuBar = useSelector(state => state.displayMenuBar);
    const globalDisplayFilters = useSelector(state => state.displayFilters);
    const initialCountries = useSelector(state => state.initialCountries);

    async function handleSearch(e) {
        try {
            const value = e.target.value;
            if (value !== '') {
                const { data } = await axios(`${URL}/${COUNTRY}?name=${value}`);
                if (data) {
                    dispatch(actionRenderCountries(data));
                }
            }
            else dispatch(actionRenderCountries(initialCountries));
        } catch (error) {
            dispatch(actionRenderCountries([]));
            console.log(error.message);
        }
    }

    function handleMediaMenuBar() {
        console.log('tukis');
        // abrimos o cerramos el menu desplegable y despachamos al estado global true si se desplegó y false si no
        // si el estado global es false, significa que se esconderá el menu desplegable
        dispatch(actionDisplayMenuBar(!globalDisplayMenuBar));
    }

    function handlerFilters() {
        dispatch(actionDisplayFilters(!globalDisplayFilters))
    }

    return (
        <div className={styles.mainView}>
            <div className={styles.navBarContainer}>
                <div className={styles.leftElements}>
                    <img onClick={() => navigate(HOME)} className={styles.countriesIcon} src={countriesIcon} alt="app icon" />
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
                    <img onClick={handleMediaMenuBar} className={styles.menuIcon} src={menuIcon} alt="menu image" />
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
                <div id={styles.menuBarContainer} className={globalDisplayMenuBar ? styles.menuDisplayed : styles.menuHidden}>
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

                        <li className={styles.li} onClick={handlerFilters}>
                            <NavLink className={styles.navLinkMedia}>
                                <button className={styles.filtros}>Filtros</button>
                            </NavLink>
                        </li>
                        {/* <div id={styles.filterMobile} className={globalDisplayFilters ? '' : styles.filterMobileHidden}>
                            <FilterMobile />
                        </div> */}
                        <div id={styles.filterMobile} className={globalDisplayFilters ? styles.filterMobileDisplayed : styles.filterMobileHidden}>
                            <FilterDesktop />
                        </div>
                    </ul>
                </div>
            }
        </div>
    );
}

export default NavBar;