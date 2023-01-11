/**
 * Veidojam key -> value objektu
 */
function createNameValueMap(data) {
    let r = {};
    data.forEach(d => r[d.name] = d.value)
    return r;
}

function callListener(context, listener) {
    if (listener.listener.type == 'arr') {
        listener.listener.cb.call(
            context,
            createNameValueMap(listener.data)
        )
    }
    else {
        listener.listener.cb.call(
            context,
            // Select only values
            ...listener.data.map(d => d.value)
        )
    }
}

export default callListener