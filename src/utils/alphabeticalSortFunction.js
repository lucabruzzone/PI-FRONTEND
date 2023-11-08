function alphabeticalSortFunction(array) {
    const arrayOrdenado = array.slice().sort((a, b) => {
        const nombreA = a.nombre.toUpperCase();
        const nombreB = b.nombre.toUpperCase();
        if (nombreA < nombreB) {
            return -1;
        }
        if (nombreA > nombreB) {
            return 1;
        }
        return 0;
    });
    return arrayOrdenado;
}

export default alphabeticalSortFunction;