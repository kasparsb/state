import isUnd from './isUnd';
import isArray from './isArray';
import throttle from './throttle';
import prepareNames from './prepareNames';
import callListener from './callListener';
import {createNamespace, set, get, json, dump, onChange} from './state';

/**
 * Savācam data no state pēc padotajiem names
 */
function collectDataFromState(owner, names) {
    return names.map(name => ({
        name: name.name,
        value: get(owner, name.name),
        optional: name.optional
    }))
}

function Logic(namespace) {
    this.ns = namespace;

    this.listeners = [];

    onChange(this, path => this.triggerListenersByPath(path))
}

Logic.prototype = {
    dump() {
        dump(this)
    },

    set(path, value) {
        set(this, path, value)
    },

    get(path, defaultValue) {
        let r = get(this, path);

        return isUnd(r) ? defaultValue : r
    },

    /**
     * Define structure
     */
    define(structure) {

    },

    /**
     * Last argument is callback
     */
    on(...ar) {
        if (ar.length < 2) {
            return;
        }

        let t, names, cb = ar.at(-1);

        // Ja pēdējais nav function, tad skip
        if (typeof cb != 'function') {
            return;
        }

        // Ja names padoti masīvā, tad pirmais arg būs array
        if (isArray(ar[0])) {
            t = 'arr';
            names = ar[0]
        }
        else {
            t = 'spread';
            names = ar.slice(0, ar.length-1);
        }

        if (names.length == 0) {
            return;
        }

        let index = this.listeners.push({
            type: t,
            names: prepareNames(names),
            cb: cb,
            throttle: false
        }) - 1;

        // Ja kāds no names jau ir uzstādīts, tad izsaucam listener
        if (collectDataFromState(this, this.listeners[index].names)
                .some(d => !isUnd(d.value))) {
            this.triggerListeners([this.listeners[index]]);
        }

        let mthis = this;

        return {
            throttle(delay) {
                mthis.listeners[index].throttle = throttle(
                    function(owner, listener){
                        callListener(owner, listener)
                    },
                    isUnd(delay) ? 1000/60 : delay
                )
            }
        }
    },

    triggerListenersByPath(path) {
        this.triggerListeners(
            this.listeners
                // Atlasām listeners, tos kuri klausās uz padoto path
                .filter(listener => {

                    if (listener.names.find(name => name.name == path)) {
                        return true;
                    }

                    return false;
                })
        )
    },

    /**
     * !!! Pašlaik tikai pirmai līmenis, bez dot delimited
     */
    triggerListeners(listeners) {

        listeners
            // Add data
            .map(listener => {
                return {
                    listener: listener,
                    data: collectDataFromState(this, listener.names),
                };
            })
            // Filter out by unset data
            .filter(listener => {
                return listener.data.every(d => {
                    // Ja ir data.value ir optional, tad vienmēr atļaujam
                    if (d.optional) {
                        return true;
                    }
                    // Ja kāda no data.value ir undefined, tad tādu skip
                    if (!isUnd(d.value)) {
                        return true;
                    }

                    return false;
                })
            })
            // Fire listeners
            .forEach(listener => {

                if (listener.listener.throttle) {
                    listener.listener.throttle(this, listener)
                }
                else {
                    callListener(this, listener)
                }


            })
    }
}


export default function(namespace) {
    if (isUnd(namespace)) {
        namespace = 'main';
    }

    createNamespace(namespace);

    return new Logic(namespace);
}