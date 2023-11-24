import activitiesOnly from '../utils/activitiesOnly';
import { deleteDuplicatesActivities } from '../utils/deleteDuplicates';
import alphabeticalSortFunction from '../utils/alphabeticalSortFunction';
import areaOrderFunction from '../utils/AreaOrder';
import populationOrderFunction from '../utils/PopulationOrder';
import {
    SET_PAGE,
    SET_DISPLAY_MENU_BAR,
    SET_DISPLAY_MOBILE_FILTERS,
    SET_DISPLAY_FILTERS,
    INITIAL_COUNTRIES,
    ACTIVITIES_AVAILABLES,
    RENDER_COUNTRIES,
    FILTER_ACTIVITIES,
    FILTER_DIFFICULTY,
    FILTER_SEASON,
    FILTER_CONTINENTS,
    REMOVE_ALL_FILTERS,
    FILTER_ONLY_COUNTRIES_WITH_ACTIVITIES,
    FILTER_ALPHABETICAL_SORT,
    FILTER_AREA_SORT,
    FILTER_POPULATION_SORT,
} from '../utils/actionTypes';

const initialState = {
    page: 1,
    displayMenuBar: false,
    displayFiltersMobile: false,
    displayFilters: false,
    onlyCountriesWActivities: false,
    alphabeticalRender: '',
    areaRender: '',
    populationRender: '',
    initialCountries: [],
    renderCountries: [], // array principal de la app. Este array se modifica conforme el usuario decida filtrar u ordenar los países a lo largo de toda la app.
    saveInitialCountries: [], // reserva los países iniciales para volver a mostrarlos una vez que se cierre el filtro mas estricto de todos (Mostrar solo países con actividades).
    saveRenderCountries: [], // reserva algún cambio anterior de renderCountries para volver a mostrarlo en algún momento
    activitiesAvailable: [],
    activitiesFilter: [],
    difficultyFilter: [],
    seasonFilter: [],
    continentsFilter: [],
};

const rootReducer = (state = initialState, action) => {
    let dinamicArray = action.payload;

    switch (action.type) {
        case SET_PAGE: // seteamos la página actual del paginado
            return { ...state, page: action.payload };

        case SET_DISPLAY_MENU_BAR: // para avisarnos si se desplagó la barra menú mobile
            return { ...state, displayMenuBar: action.payload };

        case SET_DISPLAY_MOBILE_FILTERS: // para avisarnos si se desplagó la sección de los filtros en mobile size
            return { ...state, displayFiltersMobile: action.payload };

        case SET_DISPLAY_FILTERS: // para avisarnos si se desplagó la sección de los filtros
            return { ...state, displayFilters: action.payload };

        case INITIAL_COUNTRIES: // carga todos los países al iniciar la app
            return { ...state, initialCountries: action.payload, renderCountries: action.payload, saveInitialCountries: action.payload };

        case ACTIVITIES_AVAILABLES: // estado que muestra la variedad de actividades que existen en total, para así poder mostrárselas como opción al usuario en los filtros.
            return { ...state, activitiesAvailable: deleteDuplicatesActivities(action.payload) };

        case FILTER_ACTIVITIES: // actividades seleccionadas por el usuario en la sección filtros
            if (!state.activitiesFilter.includes(action.payload)) {
                return { ...state, activitiesFilter: [...state.activitiesFilter, action.payload] };
            }
            return { ...state, activitiesFilter: state.activitiesFilter.filter(activity => activity !== action.payload) };

        case FILTER_DIFFICULTY: // dificultad seleccionada por el usuario en la sección filtros
            if (!state.difficultyFilter.includes(action.payload)) {
                return { ...state, difficultyFilter: [...state.difficultyFilter, action.payload] };
            }
            return { ...state, difficultyFilter: state.difficultyFilter.filter(difficulty => difficulty !== action.payload) };

        case FILTER_SEASON: // temporada seleccionada por el usuario en la sección filtros
            if (!state.seasonFilter.includes(action.payload)) {
                return { ...state, seasonFilter: [...state.seasonFilter, action.payload] };
            }
            return { ...state, seasonFilter: state.seasonFilter.filter(season => season !== action.payload) };

        case FILTER_CONTINENTS: // continentes seleccionados por el usuario en la sección filtros
            if (!state.continentsFilter.includes(action.payload)) {
                return { ...state, continentsFilter: [...state.continentsFilter, action.payload] };
            }
            return { ...state, continentsFilter: state.continentsFilter.filter(continent => continent !== action.payload) };



            

            // los siguientes cases son de ordenamientos. 
            // recordar que en cada case de esta sección, se limpian los otros ordenamientos del estado global, ya que por razones matemáticas, jamás pueden convivir dos tipos de ordenamientos al mismo tiempo.
        case FILTER_ALPHABETICAL_SORT:
            if (state.alphabeticalRender === action.payload) {
                return { ...state, alphabeticalRender: '' }
            }
            return { ...state, alphabeticalRender: action.payload, areaRender: '', populationRender: '' }

        case FILTER_AREA_SORT:
            if (state.areaRender === action.payload) {
                return { ...state, areaRender: '' }
            }
            return { ...state, areaRender: action.payload, alphabeticalRender: '', populationRender: '' }

        case FILTER_POPULATION_SORT:
            if (state.populationRender === action.payload) {
                return { ...state, populationRender: '' }
            }
            return { ...state, populationRender: action.payload, alphabeticalRender: '', areaRender: '' }




            // el case siguiente es el patrón de diseño implementado para trabajar todos los filtros de manera integral, pasando por estaciones donde preguntamos si debemos o no, aplicar un filtro en específico.
            // este patrón funciona con un array madre "dinamicArray" que se inicializa con un payload y va cambiando su valor conforme avanzamos en este case.
        case RENDER_COUNTRIES:
            if (action.payload[1] === 'searchBar') { // si estamos usando un searchBar, llegamos hasta acá y no seguimos con los filtros.
                return { ...state, page: 1, renderCountries: action.payload[0] };
            }

            if (state.onlyCountriesWActivities) { // el primer filtro y el mas estricto de todos.
                dinamicArray = activitiesOnly(action.payload);
            }

            if (state.activitiesFilter.length || state.difficultyFilter.length || state.seasonFilter.length || state.continentsFilter.length) {

                // en esta estación, preguntamos si el usuario activó o desactivó los filtros de cada tipo (activities, difficulty, season, continents).
                if (state.activitiesFilter.length) {
                    let newArray = [];
                    let initialCountries = dinamicArray;
                    for (const country of initialCountries) {
                        let booleanValue = false;
                        let countryActivities = country.activities;
                        for (const activity of countryActivities) {
                            if (state.activitiesFilter.includes(activity.nombre)) {
                                booleanValue = true;
                            }
                        }
                        if (booleanValue) {
                            newArray.push(country);
                        }
                    }
                    dinamicArray = newArray;
                }

                if (state.difficultyFilter.length) {
                    let newArray = [];
                    let initialCountries = dinamicArray;
                    for (const country of initialCountries) {
                        let booleanValue = false;
                        let countryActivities = country.activities;
                        for (const activity of countryActivities) {
                            if (state.difficultyFilter.includes(activity.dificultad)) {
                                booleanValue = true;
                            }
                        }
                        if (booleanValue) {
                            newArray.push(country);
                        }
                    }
                    dinamicArray = newArray;
                }

                if (state.seasonFilter.length) {
                    let newArray = [];
                    let initialCountries = dinamicArray;
                    for (const country of initialCountries) {
                        let booleanValue = false;
                        let countryActivities = country.activities;
                        for (const activity of countryActivities) {
                            if (state.seasonFilter.includes(activity.temporada)) {
                                booleanValue = true;
                            }
                        }
                        if (booleanValue) {
                            newArray.push(country);
                        }
                    }
                    dinamicArray = newArray;
                }

                if (state.continentsFilter.length) {
                    let newArray = [];
                    let initialCountries = dinamicArray;
                    for (const country of initialCountries) {
                        let booleanValue = false;
                        let countryContinents = country.continente.toLowerCase();
                        if (state.continentsFilter.includes(countryContinents)) {
                            booleanValue = true;
                        }
                        if (booleanValue) {
                            newArray.push(country);
                        }
                    }
                    dinamicArray = newArray;
                }
            }

            // una vez que ya tenemos el array madre filtrado, pasamos a los ordenamientos.
            //estos, por razones lógicas, no pueden funcionar al mismo tiempo, pero ese asunto se maneja con anterioridad en otros cases.
            if (state.alphabeticalRender !== '') {
                dinamicArray = alphabeticalSortFunction(dinamicArray, state.alphabeticalRender);
            }

            if (state.areaRender !== '') {
                dinamicArray = areaOrderFunction(dinamicArray, state.areaRender);
            }

            if (state.populationRender !== '') {
                dinamicArray = populationOrderFunction(dinamicArray, state.populationRender);
            }

            return { ...state, page: 1, renderCountries: dinamicArray };







        case REMOVE_ALL_FILTERS: // remueve todos los filtros seleccionados
            return { ...state, page: 1, activitiesFilter: [], difficultyFilter: [], seasonFilter: [], continentsFilter: [] };

        case FILTER_ONLY_COUNTRIES_WITH_ACTIVITIES: // renderiza solo los países que cuentan con actividades turísticas o vuelve a mostrar todos.
            return { ...state, onlyCountriesWActivities: action.payload }

        default:
            return { ...state };
    }
};

export default rootReducer;
