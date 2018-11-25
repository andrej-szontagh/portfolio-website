
// TODO: use Enumify !
// https://github.com/rauschma/enumify

const VideoEvents = Object.freeze ({

    PLAYING: Symbol ("onplaying")
});

const VideoEventsStrings = Object.freeze ({

    [VideoEvents.PLAYING]: "onplaying"
});

class VideoEvent extends Event {

    constructor (name, player) {

        super (name);

        var t = this;

        t.player = player;
    }
}
