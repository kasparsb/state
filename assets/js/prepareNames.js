/**
 * Ja name pēdējai simbols ir ? tad
 * tas ir optional
 */
function prepareNames(names) {
    return names.map(name => {
        let last = name.substring(name.length-1);
        return {
            name: last == '?' ? name.substring(0, name.length-1) : name,
            optional: last == '?'
        }
    })
}

export default prepareNames