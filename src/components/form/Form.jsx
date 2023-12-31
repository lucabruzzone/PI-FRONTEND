import styles from './Form.module.css';
import axios from 'axios';
import flagIcon from '../../img/flag-solid.svg';
import { HOME, COUNTRY, URL, ACTIVITIES, SUCCESSFORM, FORM } from '../../utils/pathroutes';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    actionDisplayMenuBar, 
    actionDisplayFilters, 
    actionRenderCountries, 
    actionDisplayMobileFilters,
    actionRemoveAllFilters,
    actionFilterOnlyActivities
} from '../../redux/actions';

function Form() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initialCountries = useSelector(state => state.initialCountries);
    const renderCountries = useSelector(state => state.renderCountries);
    const [displayedTable, setDisplayedTable] = useState(false);
    const [displayedSelectedCountries, setDisplayedSelectedCountries] = useState(false);
    const [errors, setErrors] = useState(null);
    const [formCompleted, setFormCompleted] = useState(false);
    const [valueSearch, setValueSearch] = useState('');
    const [newActivity, setNewActivity] = useState({
        nombre: '',
        dificultad: 0,
        duracion: 0,
        temporada: '',
        paises: []
    });

    function handleMiniTable() {
        setDisplayedSelectedCountries(!displayedSelectedCountries);
    }

    function handleInput(e) {
        //inmediatamente avisamos al usuario que debe completar todos los datos.
        setErrors('Debe completar todos los campos');
        const value = e.target.value;
        const id = e.target.id;
        const title = e.target.title;
        const titlParse = parseInt(title);
        if (title || id === 'dificultad') setNewActivity({ ...newActivity, dificultad: titlParse });
        if (id === 'nombre') setNewActivity({ ...newActivity, nombre: value });
        if (id === 'Verano' || id === 'Otoño' || id === 'Invierno' || id === 'Primavera') setNewActivity({ ...newActivity, temporada: id });
        if (id === 'duracion') setNewActivity({ ...newActivity, duracion: value });
    }

    /* async function handleSearch(e) {
        try {
            const value = e.target.value;
            // seteamos el estado valueSearch para no tener conflicos al seleccionar el país en la tabla 
            // ya que al clickear el país en la tabla escribirá automáticamente el nombre del país en el input y se bloquea la escritura del input;
            setValueSearch(value);
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
    } */

    async function handleSearch(e) {
        try {
            const value = e.target.value;
            setValueSearch(value);
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

    function handleCountrySelect(e) {
        const countryName = e.target.id;
        // seteamos el estado local valueSearch para que se escriba automáticamente en el input, el país que acabamos de seleccionar en la tabla.
        setValueSearch(countryName);
        // luego buscamos si el país seleccionado ya lo habíamos ingresado, para que no se repitan:
        const match = newActivity.paises.some(nombre => {
            return nombre === countryName;
        })
        if (!match) {
            setErrors('Debe completar todos los campos');
            setNewActivity({ ...newActivity, paises: [...newActivity.paises, countryName] });
        }
    }

    function deleteCountry(e) {
        const name = e.target.title;
        const newArray = newActivity.paises.filter(country => {
            return country !== name;
        })
        setNewActivity({ ...newActivity, paises: newArray })
    }

    async function handleSubmit(e) {
        // nos aseguramos una vez más de que los datos del formulario estén completos
        try {
            e.preventDefault();
            if (formCompleted) {
                axios.post(`${URL}/${ACTIVITIES}`, newActivity);
                navigate(SUCCESSFORM);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    function handleFocus() {
        setDisplayedTable(true);
        setDisplayedSelectedCountries(false);
    }

    function handleBlur() {
        // lo hacemos en setTimeOut para que no se cierre la tabla antes de seleccionar un país
        setTimeout(() => {
            setDisplayedTable(false);
        }, 200);
    }

    useEffect(() => {
        //acá nos aseguramos de que el menú desplegable y los filtros no se abran indeseablemente al renderizar este componente
        //este dispatch hace que al NavBar le llegue un false del menú desplegable y de los filtros, evitando que se abran
        dispatch(actionDisplayMenuBar(false));
        dispatch(actionDisplayMobileFilters(false));
        dispatch(actionDisplayFilters(false));
        // con la línea de abajo nos aseguramos de que en otros searchBar, como el de esta ruta, no aparezcan los países filtrados indeseadamente por culpa de otros componentes, como los filtros del home o del navBar.
        // como en el formulario queremos ver la lista completa de países, y sin filtrar, debemos renderizar TODOS los países sin filtros anteriores.
        // para esto, necesitamos remover todos los filtros y el estricto "FilterOnlyActivities" a penas renderizamos esta ruta.
        dispatch(actionRemoveAllFilters());
        dispatch(actionFilterOnlyActivities(false));
        dispatch(actionRenderCountries(initialCountries));
    }, []);

    useEffect(() => {
        // cada vez que ingresamos un dato al formulario, preguntamos si el estado local newActivity está completo
        // en caso de estarlo, se habilita el botón submit del formulario (crear actividad)
        if (!newActivity.paises.length || newActivity.nombre === '' || newActivity.temporada === '' || !newActivity.dificultad || !newActivity.duracion) {
            setFormCompleted(false);
        }
        else {
            setErrors(null);
            return setFormCompleted(true);
        }
    }, [newActivity]);

    return (
        <form onSubmit={handleSubmit} className={styles.mainView}>
            <div className={styles.mainContainer}>
                <p className={styles.nuevaActividad}>Nueva actividad</p>
                <NavLink to={HOME}>
                    <button className={styles.closeButton}>
                        Cerrar x
                    </button>
                </NavLink>

                <div className={styles.inputsContainer}>
                    <div className={styles.paisNombreInput}>
                        <label className={styles.inputsLabel} htmlFor="">País o países</label>
                        <div className={styles.inputBox}>
                            <input value={valueSearch} onChange={handleSearch} onFocus={handleFocus} onBlur={handleBlur} id='paises' type="search" autoComplete='off' placeholder='Puedes agregar mas de un país' />
                            <div className={styles.inputBoxImgBox}>
                                <p className={newActivity.paises.length && styles.countriesCount}>{newActivity.paises.length}</p>
                                <img src={flagIcon} alt="" />
                                <p onClick={handleMiniTable} id={styles.inputBoxImgBoxAfter}>{displayedSelectedCountries && newActivity.paises.length ? 'Ocultar países' : 'Ver países seleccionados'}</p>
                                <div className={styles.seleccionPaisContainer} id={displayedTable ? '' : styles.hidden}>
                                    {renderCountries?.map((country, i) => {
                                        const name = country.nombre;
                                        return (
                                            <div onClick={handleCountrySelect} id={name} key={i} className={styles.countrySelectionRow}>
                                                <p onClick={handleCountrySelect} id={name}>{name}</p>
                                                <img src={country.imagenBandera} alt="" onClick={handleCountrySelect} id={name} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            {displayedSelectedCountries &&
                                <div className={styles.falseDiv}>
                                    <div className={styles.selectedCountries}>
                                        {newActivity.paises?.map((nombre, i) => {
                                            return (
                                                <div key={i} className={styles.selectedCountriesRow}>
                                                    <p>{nombre}</p>
                                                    <p onClick={deleteCountry} title={nombre} id={styles.deleteSelection}>✕</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={styles.paisNombreInput}>
                        <label className={styles.inputsLabel} htmlFor="">Nombre de la actividad</label>
                        <input onChange={handleInput} id='nombre' type="text" autoComplete='off' placeholder='Ej. Cabalgata' />
                    </div>
                    <div className={styles.dificultadInput}>
                        <label className={styles.inputsLabel} htmlFor="">Dificultad</label>
                        <div className={styles.numberBox}>
                            <p className={newActivity.dificultad === 1 && styles.difOn} title='1' onClick={handleInput} id='dificultad'>1</p>
                            <p className={newActivity.dificultad === 2 && styles.difOn} title='2' onClick={handleInput} id='dificultad'>2</p>
                            <p className={newActivity.dificultad === 3 && styles.difOn} title='3' onClick={handleInput} id='dificultad'>3</p>
                            <p className={newActivity.dificultad === 4 && styles.difOn} title='4' onClick={handleInput} id='dificultad'>4</p>
                            <p className={newActivity.dificultad === 5 && styles.difOn} title='5' onClick={handleInput} id='dificultad'>5</p>
                        </div>
                    </div>
                    <div className={styles.duracionInput}>
                        <label className={styles.inputsLabel} htmlFor="">Duración (horas)</label>
                        <input onChange={handleInput} id='duracion' type="number" min='0' max='5' placeholder='Ej. 3' />
                    </div>
                    <div className={styles.temporadaInput}>
                        <label htmlFor="">Temporada</label>
                        <div className={styles.temporadaBox}>
                            <p className={newActivity.temporada === 'Verano' && styles.tempOn} onClick={handleInput} id='Verano'>Verano</p>
                            <p className={newActivity.temporada === 'Otoño' && styles.tempOn} onClick={handleInput} id='Otoño'>Otoño</p>
                            <p className={newActivity.temporada === 'Invierno' && styles.tempOn} onClick={handleInput} id='Invierno'>Invierno</p>
                            <p className={newActivity.temporada === 'Primavera' && styles.tempOn} onClick={handleInput} id='Primavera'>Primavera</p>
                        </div>
                    </div>
                    {errors && <p id={styles.errorMessage}>{errors}</p>}
                    <button id={styles.submitButton} className={formCompleted ? styles.submitButtonOn : styles.submitButtonOff}>
                        Crear actividad
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Form;