import isUnd from './isUnd';
import dataGet from './dataGet';
import * as stateServer from './stateServer';

/**
 * Globālais data store priekš visiem Logic
 * Ja Logic uztaisa instanci, tad padod namespace
 * ja tāds namespace jau ir, Logic dabū stat ar
 * tādu pašu namespace
 */

let namespaces = {}
let structure = {}
let listeners = {}
let listenersLength = {}

function createNamespace(name) {
    if (isUnd(namespaces[name])) {
        namespaces[name] = {}
        structure[name] = {}
    }
}

function definedStructure(struc) {
    structure[name] = struc;
}

/**
 * Set value according to path
 * but notify change on first segment of path
 * Example
 *     departments.0.caption = 'asdf'
 * Sets first record of departments caption to 'asdf'
 * Notify that field departments have changed
 */
function set(owner, path, value) {
    let pathSegments = path.split('.');

    let g = namespaces[owner.ns];
    let first = pathSegments[0];
    let last = pathSegments.at(-1);
    for (let i = 0; i < pathSegments.length-1; i++) {
        g = g[pathSegments[i]];
    }
    g[last] = value;

    if (!isUnd(listeners[owner.ns])) {
        for (let i = 0; i < listenersLength[owner.ns]; i++) {
            // Listener trigger tikai par pašu pirmo no path
            listeners[owner.ns][i](first, value)
        }
    }

    /**
     * Uz state server paziņojam pilno change path
     * Bet līdz ar to padodam arī tikai izmainīto vērtību
     * nevis visu pirmā līmeņa value
     *
     * State server pusē objekts tiek glabāts, kā json string
     * ja padod tikai izmainīto vērtību, tad server pusē vajadzēs
     * atserializēt visu objektu un tajā uzstādīt izmainīto vērtību
     *
     * bet līdz ar to nevajag visu milzīgo data set pušot uz serveri
     */

    stateServer.notify(path, value);
    // OR
    //stateServer.notify(first, namespaces[owner.ns][first]);
}

function get(owner, path) {
    return dataGet(namespaces[owner.ns], path);
}

/**
 * Get all state ar json string
 */
function json(owner) {
    return JSON.stringify(namespaces[owner.ns]);
}

function dump(owner) {
    console.log(namespaces[owner.ns]);
}

function onChange(owner, cb) {
    if (isUnd(listeners[owner.ns])) {
        listeners[owner.ns] = [];
    }
    listeners[owner.ns].push(cb);

    listenersLength[owner.ns] = listeners[owner.ns].length
}

export {
    createNamespace,
    set,
    get,
    onChange,
    json,
    dump
}