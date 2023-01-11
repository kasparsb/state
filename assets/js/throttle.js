function throttle(cb, delay, lastCallDelay) {
    /**
     * Pēc atbloķēšanas tiek uztaisīts setTimeout, kurš gadījumā
     * ja funkcija vairs netiek izsaukta izpildīts padoto cb ar pēdējiem
     * padotajiem argumentiem.
     * Tas nodrošina pēdējo izsaukumu
     *
     * ja lastCallDelay ir mazāks par intervālu ar kādu tiek izsaukta
     * throttle funkcija, tad callback izpildīsies divas reizes
     *     pirmā reize, kad beidzas delay
     *     otrā reize, kad beidzas lastCallDealay
     *     jo intervāls nepaspēs izsaukt throttle
     * Tāpēc lastCallDelay ir jāliek lielāks par intervālu, kurā tiek
     * izsaukts throttle
     */
    if (typeof lastCallDelay == 'undefined') {
        lastCallDelay = 4;
    }

    let wait = false;
    let lastArgs = false;
    let t = 0;
    return function() {
        if (!wait) {
            wait = true;
            lastArgs = false;
            clearTimeout(t);

            cb.apply(this, arguments)

            // Atbloķējam pēc norādītā delay
            setTimeout(function(){
                wait = false;

                // Nodrošina pēdējo izsaukumu
                t = setTimeout(function(){
                    if (lastArgs) {
                        cb.apply(this, lastArgs)
                    }
                }, lastCallDelay)

            }, delay)
        }
        else {
            lastArgs = arguments
        }
    }
}

export default throttle