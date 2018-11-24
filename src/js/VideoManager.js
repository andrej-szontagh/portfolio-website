
class VideoManager extends EventTarget {

    constructor () {

        super ();

        let t = this;

        t.initialized   = false;
        t.sealed        = false;
        t.queue         = [];
    }

    init () {

        let t = this;

        t.initialized = true;
    }

    addPlayer (id, container, start, callback) {

        let t = this;

        if (!t.sealed) {
            t.queue.push ({

                id:         id,
                container:  container,
                start:      start,
                callback:   callback,
            });
        }
    }

    createPlayers () {

        let t = this;

        if (t.initialized) {
            t.sealed = true;
        }
    }
}
