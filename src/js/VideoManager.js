
class VideoManager {

    constructor () {

        let t = this;

        t.initialized   = false;
        t.sealed        = false;
        t.queue         = [];
    }

    init () {

        let t = this;

        t.initialized = true;
    }

    addPlayer (player_desc) {

        let t = this;

        if (!t.sealed) {
            t.queue.push (player_desc);
        }
    }

    createPlayers () {

        let t = this;

        if (t.initialized) {
            t.sealed = true;
        }
    }
}
