import styles from './Form.module.css';
import axios from 'axios';
import flagIcon from '../../img/flag-solid.svg';
import { HOME, COUNTRY, URL, ACTIVITIES, SUCCESSFORM } from '../../utils/pathroutes';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { actionDisplayMenuBar, actionDisplayFilters, actionRenderCountries, actionDisplayMobileFilters } from '../../redux/actions';

function Form() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initialCountries = useSelector(state => state.initialCountries);
    const renderCountries = useSelector(state => state.renderCountries);
    const [displayedTable, setDisplayedTable] = useState(false);
    const [formCompleted, setFormCompleted] = useState(false);
    const [displayedSelectedCountries, setDisplayedSelectedCountries] = useState(false);
    const [valueSearch, setValueSearch] = useState('');
    const [newActivity, setNewActivity] = useState({
        nombre: '',
        dificultad: 0,
        duracion: 0,
        temporada: '',
        paises: []
    });

    function handleMiniTable() {
        setDisplayedSelectedCountries(!displayedSelectedCountries)
    }

    function handleInput(e) {
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
        // seteamos el estado valueSearch para que se escriba automáticamente en el input al seleccionar el país en la tabla:
        setValueSearch(countryName);
        // luego buscamos si el país seleccionado ya lo habíamos ingresado, para que no se repitan:
        const match = newActivity.paises.some(nombre => {
            return nombre === countryName;
        })
        if (!match) setNewActivity({ ...newActivity, paises: [...newActivity.paises, countryName] });
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
            if (newActivity.paises.length) {
                const { data } = axios.post(`${URL}/${ACTIVITIES}`, newActivity);
                if (data) alert('Actividad creada con éxito');
            }
            e.preventDefault();
            navigate(SUCCESSFORM);
        } catch (error) {
            console.log(error.message);
        }
    }

    function handleFocus() {
        setDisplayedTable(true);
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
        // con la línea de abajo nos aseguramos de que otras barSearch usados en otros componentes no borren países del estado global
        // de lo contrario, en el home u otros componentes, no se mostrarían todos los países
        dispatch(actionRenderCountries(initialCountries));
    }, []);

    useEffect(() => {
        // cada vez que ingresamos un dato al formulario, preguntamos si el estado local newActivity está completo
        // en caso de estarlo, se habilita el botón submit del formulario (crear actividad)
        if (!newActivity.paises.length || newActivity.nombre === '' || newActivity.temporada === '' || !newActivity.dificultad || !newActivity.duracion) {
            setFormCompleted(false);
        }
        else return setFormCompleted(true);
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
                                <p>{newActivity.paises.length}</p>
                                <img src={flagIcon} alt="" />
                                <p onClick={handleMiniTable} id={styles.inputBoxImgBoxAfter}>Ver países seleccionados</p>
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
                    <button id={styles.submitButton} className={formCompleted ? styles.submitButtonOn : styles.submitButtonOff}>
                        Crear actividad
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Form;