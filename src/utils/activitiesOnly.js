function activitiesOnly(array) {
    let newArray = array.filter(country => {
        return country.activities.length > 0
    })
    // usamos el método sort para que los países con mayor cantidad de actividades turísticas aparezcan primero
    newArray = newArray.sort((a, b) => b.activities.length - a.activities.length);
    return newArray;
}

export default activitiesOnly;