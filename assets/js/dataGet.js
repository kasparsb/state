import isUnd from './isUnd';

/**
 * Return nested data
 * Path is nester object items separated by dot
 */
function dataGet(obj, path) {
    let items = path.split('.');

    let found = obj;
    for (var i = 0; i < items.length; i++) {
        if (isUnd(found[items[i]])) {
            return undefined;
        }

        found = found[items[i]]
    }

    return found
}

export default dataGet