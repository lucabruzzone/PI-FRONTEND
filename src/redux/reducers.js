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
    saveInitialCountries: [], // reserva los países iniciales para volver a mostrarlos una vez que se cierre el filtro mas estricto de todos (Mostrar solo países con actividades).
    saveRenderCountries: [], // reserva algún cambio anterior de renderCountries para volver a mostrarlo en algún momento
    renderCountries: [],
    initialCountries: [],
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

        case ACTIVITIES_AVAILABLES: // estado que muestra la variedad de actividades que existen en total
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

        case FILTER_ALPHABETICAL_SORT:
            if (state.alphabeticalRender === action.payload) {
                return {...state, alphabeticalRender: ''}
            }
            return {...state, alphabeticalRender: action.payload, areaRender: '', populationRender: ''}

        case FILTER_AREA_SORT:
            if (state.areaRender === action.payload) {
                return {...state, areaRender: ''}
            }
            return {...state, areaRender: action.payload, alphabeticalRender: '', populationRender: ''}

        case FILTER_POPULATION_SORT:
            if (state.populationRender === action.payload) {
                return {...state, populationRender: ''}
            }
            return {...state, populationRender: action.payload, alphabeticalRender: '', areaRender: ''}




        // LOS CASES DEBAJO DE ESTA LÍNEA SON EL RENDERIZADO RESULTANTE LUEGO DE EJECUTAR LOS FILTROS:
        // en todos los casos, no se nos puede olvidar setear el estado global "pages" en "1" para que siempre se renderizen los países desde la página 1.


        // el siguiente case renderiza los países de acuerdo a la suma de filtros que el usuario selecciona
        // es complejo ya que acumula las seleciones en lugar de excluirlas
        case RENDER_COUNTRIES:
            // primero preguntamos si hay filtros seleccionados. En caso de que no hayan, saltamos al final de este CASE ya que el usuario no está utilizando los filtros.
            // si esque hay filtros seleccionados, comentamos a iterar cada lista de filtros.
            if (state.onlyCountriesWActivities) {
                dinamicArray = activitiesOnly(action.payload);
            }

            if (state.activitiesFilter.length || state.difficultyFilter.length || state.seasonFilter.length || state.continentsFilter.length) {

                // primero pregunta si esque hay filtros de actividades turísticas seleccionados
                // para iterar en dos ciclos for las actividades de cada país y hacer un match con los filtros del usuario
                // si se hace el match, entonces hacemos un push de ese país al array madre "newArray" que lo inicializamos antes de comenzar el SWITCH
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

                // luego hace lo mismo pero con los filtros de dificultad de las actividades turísticas
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

                // luego exactamente lo mismo pero con los filtros de las temporadas (verano, otoño..etc)
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

                // y aquí sigue con los filtros de continentes
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

        case FILTER_ONLY_COUNTRIES_WITH_ACTIVITIES: // renderiza solo los países que cuentan con actividades turísticas
        return {...state, onlyCountriesWActivities: !state.onlyCountriesWActivities}

        default:
            return { ...state };
    }
};

export default rootReducer;
