import axios from 'axios';
import styles from './Detail.module.css';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { actionDisplayMenuBar, actionDisplayFilters, actionDisplayMobileFilters } from '../../redux/actions';
import { useParams } from 'react-router-dom';
import { URL, ACTIVITIES_BY_COUNTRY } from '../../utils/pathroutes';
import Loading from '../loading/Loading';

function Detail() {
    const [country, setCountry] = useState(null);
    const { id } = useParams();
    const dispatch = useDispatch();

    const dataCountry = async () => {
        try {
            let obj = {}
            const { data } = await axios(`${URL}/${ACTIVITIES_BY_COUNTRY}/${id}`);
            if (Object.keys(data).length) {
                const activities = data.activities;
                const country = data.country;
                let capital = country.capital;
                capital = capital.replace(/[{}]/g, ''); // limpiamos el string ya que puede venir con símbolos que no queremos
                obj = { ...country, capital, activities };
                setCountry(obj);
            }
            else throw Error('Error al cargar los datos del país');
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        //acá nos aseguramos de que el menú desplegable y los filtros no se abran indeseablemente al renderizar este componente
        //este dispatch hace que al NavBar le llegue un false del menú desplegable y de los filtros, evitando que se abran
        dispatch(actionDisplayMenuBar(false));
        dispatch(actionDisplayMobileFilters(false));
        dispatch(actionDisplayFilters(false));
        // y en la siguiente línea, recuperamos los datos del país haciendo una petición al back-end:
        dataCountry();
    }, []);

    return (
        <div className={styles.mainView}>
            {country ?
                <div className={styles.mainViewContainer}>
                    <div className={styles.firstViewContainer}>
                        <div className={styles.infoContainer}>
                            <div className={styles.nombre}>
                                <p>{country.nombre}</p>
                                <img className={styles.nameAfter} src={country.imagenBandera} alt="" />
                            </div>
                            <div className={styles.infoSinNombre}>
                                <p>Continente: {country.continente}</p>
                                <p>Sub region: {country.subRegion}</p>
                                <p>Capital: {country.capital}</p>
                                <p>Área: {country.area.toLocaleString()} km2</p>
                                <p>población: {country.poblacion.toLocaleString()} habitantes</p>
                            </div>
                        </div>
                        <img className={styles.imagenBandera} src={country.imagenBandera} alt="" />
                    </div>

                    <div className={styles.activitiesTableView}>
                        <p className={styles.actividadesTuristicas}>Actividades turísticas:</p>
                        {country.activities.length ?
                            <div className={styles.activitiesTableContainer}>
                                <div className={styles.params}>
                                    <p className={styles.actividadParam}>Actividad</p>
                                    <p className={styles.allParams}>Dificultad</p>
                                    <p className={styles.allParams}>Duracion</p>
                                    <p className={styles.allParams} id={styles.temporadaValue}>Temporada</p>
                                </div>
                                <div className={styles.valuesRowsTable}>
                                    {country.activities?.map((activity, i) => {
                                        return (
                                            <div key={i} className={styles.eachRow}>
                                                <p className={styles.actividadValue}>{activity.nombre}</p>
                                                <p className={styles.allValue}>{activity.dificultad}</p>
                                                <p className={styles.allValue}>{activity.duracion}</p>
                                                <p className={styles.allValue} id={styles.temporadaValue}>{activity.temporada}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div> :
                            <div>
                                Este país no registra actividades
                            </div>
                        }
                    </div>
                </div> :
                <div className={styles.loadingContainer}>
                    <Loading />
                </div>
            }
        </div>
    );
}

export default Detail;