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
    path = path.split('.');

    let g = namespaces[owner.ns];
    let last = path.at(-1);
    let first = path[0];
    for (let i = 0; i < path.length-1; i++) {
        console.log(path[i]);
        g = g[path[i]];
        console.log(g);
        console.log('-----------');
    }
    console.log(g);
    g[last] = value;

    if (!isUnd(listeners[owner.ns])) {
        for (let i = 0; i < listenersLength[owner.ns]; i++) {
            listeners[owner.ns][i](first, value)
        }
    }

    stateServer.notify(first, namespaces[owner.ns][first]);
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