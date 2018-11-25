
class VideoManager /* extends EventTarget */ {

    constructor () {

        // Edge doesn't support EventTarget class extension ..
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/18274176/

        // super ();

        let t = this;

        // t.events = new EventTarget ();

        // welcome ugly hack .. 
        t.events = document.createElement ("div");

        t.initialized   = false;
        t.sealed        = false;
        t.queue         = [];
    }

    // Edge doesn't support EventTarget class extension ..
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/18274176/
    dispatchEvent (event) {

        let t = this;

        t.events.dispatchEvent (event);
    }

    // Edge doesn't support EventTarget class extension ..
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/18274176/
    addEventListener (event, listener) {

        let t = this;

        t.events.addEventListener (event, listener);
    }

    // Edge doesn't support EventTarget class extension ..
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/18274176/
    removeEventListener (event, listener) {

        let t = this;

        t.events.removeEventListener (event, listener);
    }

    init () {

        let t = this;

        t.initialized = true;
    }

    addPlayer (id, container, start, callback) {

        let t = this;

        if (!t.sealed) {
            t.queue.push ({ id, container, start, callback });
        }
    }

    createPlayers () {

        let t = this;

        if (t.initialized) {
            t.sealed = true;
        }
    }
}
