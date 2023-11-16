function areaOrderFunction(array, letter) {
    const arrayOrdenado = array.slice().sort((a, b) => {
        const nombreA = a.area;
        const nombreB = b.area;
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

export default areaOrderFunction;