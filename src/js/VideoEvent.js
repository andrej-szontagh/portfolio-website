
class VideoEvent extends Event {

    constructor (name, player) {

        super (name);

        var t = this;

        t.player = player;
    }

    static get ON_PLAYING () {

        return "onplaying";
    }
}
