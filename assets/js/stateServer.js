import isUnd from './isUnd';
import throttle from './throttle';

let accountId;
let url;
let sessionId;

// Iesūtīšanas rinda
let queue = [];

function setConfig(config) {
    url = config.url;
    accountId = config.accountId;

    start();
}

function start() {
    send('/api/state/session/start', 'POST')
        .then(r => r.json())
        .then(r => {
            sessionId = r.session_id

            checkQueue()
        });
}

/**
 * Katra state izmaiņa tiek paziņota state serverim
 *
 * @param string Key tas ir pirmais top level key
 * @param string path, tas ir nested pilnais path, kuru vērtību objektā maina
 * @param variants Vērtība. vai nu objekts vai string|number|utt
 */
function notify(path, value) {

    queue.push({
        path: path,
        value: value
    })

    checkQueue();
}

let checkQueue = throttle(function(){
    if (!sessionId) {
        return;
    }

    if (queue.length == 0) {
        return;
    }

    // Nosūtām rindu un notīrām queue
    send('/api/state/session/changes', 'POST', JSON.stringify({
        session_id: sessionId,
        changes: queue
    }));
    queue = [];
}, 100)

function send(endpoint, method, body) {
    if (isUnd(body)) {
        body = null;
    }

    // Sūtām tikai izmaiņas, kas ienākušas
    return fetch(url+endpoint, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Account': accountId
        },
        method: method,
        body: body
    })
}

export {
    setConfig,
    start,
    notify
}