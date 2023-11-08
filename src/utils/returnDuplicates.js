function returnDuplicates(array, propertyName) {
    let absoluteBoolean = false;
    const countMap = {};
    array.forEach((obj) => {
        const value = obj[propertyName];
        if (countMap[value] === undefined) {
            countMap[value] = 1; // Inicializa el contador en 1
        } else {
            countMap[value]++; // Incrementa el contador
            absoluteBoolean = true;
        }
    });
    const duplicates = array.filter((obj) => countMap[obj[propertyName]] > 1);
    if (absoluteBoolean) {
        return duplicates;
    }
    else return array;
}

export default returnDuplicates;
