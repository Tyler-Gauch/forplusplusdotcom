export const indexOfFromProperty = (array, property, value) => {
    for (var i = 0; i < array.length; i++) {
        if (array[i][property] === value) {
            return i;
        }
    }

    return -1;
}