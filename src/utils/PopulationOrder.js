function populationOrderFunction(array, letter) {
    const arrayOrdenado = array.slice().sort((a, b) => {
        const nombreA = a.poblacion;
        const nombreB = b.poblacion;
        if (letter === 'a') {
            if (nombreA < nombreB) {
                return -1;
            }
            if (nombreA > nombreB) {
                return 1;
            }
            return 0;
        }
        else {
            if (nombreA < nombreB) {
                return 1;
            }
            if (nombreA > nombreB) {
                return -1;
            }
            return 0;
        }
    });
    return arrayOrdenado;
}

export default populationOrderFunction;