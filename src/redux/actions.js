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
    FILTER_POPULATION_SORT
} from '../utils/actionTypes';

export const actionSetPage = (value) => { // action para setear true o false si está abierto o cerrado el menu mobile
    return { type: SET_PAGE, payload: value }
}

export const actionDisplayMenuBar = (value) => { // action para setear true o false si está abierto o cerrado el menu mobile
    return { type: SET_DISPLAY_MENU_BAR, payload: value }
}

export const actionDisplayMobileFilters = (value) => { // action para setear true o false si está abierta o cerrada la sección de filtros
    return { type: SET_DISPLAY_MOBILE_FILTERS, payload: value }
}

export const actionDisplayFilters = (value) => { // action para setear true o false si está abierta o cerrada la sección de filtros
    return { type: SET_DISPLAY_FILTERS, payload: value }
}







export const actionInitialCountries = (array) => { // action para inicializar el estado global de todos los países al iniciar la app
    return { type: INITIAL_COUNTRIES, payload: array }
}

export const actionActivitiesAvailable = (activities) => { // action para inicializar el estado global de todas los actividades que existen al iniciar la app, para renderizarlas como opciones en los filtros
    return { type: ACTIVITIES_AVAILABLES, payload: activities }
}

export const actionRenderCountries = (array) => { // action para modificar los países que se irán renderizando de acuerdo a la búsqueda y filtrado
    return { type: RENDER_COUNTRIES, payload: array }
}


// las siguientes actions son para guardar o eliminar los filtros que va agregando o quitando el usuario:


export const actionFilterActivities = (activity) => { 
    return { type: FILTER_ACTIVITIES, payload: activity }
}

export const actionFilterDifficulty = (difficulty) => { 
    return { type: FILTER_DIFFICULTY, payload: difficulty }
}

export const actionFilterSeason = (season) => { 
    return { type: FILTER_SEASON, payload: season }
}

export const actionFilterContinents = (continent) => { 
    return { type: FILTER_CONTINENTS, payload: continent }
}

export const actionRemoveAllFilters = (array) => { // action para remover todos los filtros seleccionados por el usuario
    return { type: REMOVE_ALL_FILTERS, payload: array }
}

export const actionFilterOnlyActivities = (value) => { 
    return { type: FILTER_ONLY_COUNTRIES_WITH_ACTIVITIES, payload: value }
}

export const actionAlphabeticalSort = (letter) => { 
    return { type: FILTER_ALPHABETICAL_SORT, payload: letter }
}

export const actionAreaSort = (letter) => { 
    return { type: FILTER_AREA_SORT, payload: letter }
}

export const actionPopulationSort = (letter) => {
    return { type: FILTER_POPULATION_SORT, payload: letter }
}