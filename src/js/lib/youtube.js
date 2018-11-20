
function onYouTubeIframeAPIReady () {

    // console.log ("onYouTubeIframeAPIReady");

    YouTube.apiready = true;

    if (YouTube.initialized &&
        YouTube.sealed) {

        YouTube.createPlayers ();
    }
}

function YouTube () {

    var t = this;

    // ..
}

YouTube.prototype = {

    constructor:    YouTube,

    initialized:    false,
    sealed:         false,
    apiready:       false,
    queue:          [],
    players:        [],

    init: function () {

        var t = this;

        // initialize YouTube API
        // https://developers.google.com/youtube/iframe_api_reference#top_of_page
        if (t.initialized ==  false) {
            t.initialized =   true;

            var tag = document.createElement ('script');

            tag.id  = 'iframe-api';
            tag.src = 'https://www.youtube.com/iframe_api';

            var firstScriptTag = document.getElementsByTagName ('script')[0];

            firstScriptTag.parentNode.insertBefore (tag, firstScriptTag);
        }
    },

    debug: function () {

        var t = this;

        for (var i = 0; i < t.players.length; i ++) {

            var state = t.players [i].getPlayerState ();

            switch (state) {
                case YT.PlayerState.ENDED:      state = "ended";        break;
                case YT.PlayerState.PLAYING:    state = "playing";      break;
                case YT.PlayerState.PAUSED:     state = "paused";       break;
                case YT.PlayerState.BUFFERING:  state = "buffering";    break;
                case YT.PlayerState.CUED:       state = "cued";         break;
                default:                        state = "unstarted";    break;
            }

            console.log ("Player " + i + " >> " + state);
        }
    },

    addPlayer: function (player_desc) {

        var t = this;

        /*
        YouTubeAPIAddPlayer ({

            id:     <element-id>,
            params: <youtube-api-parameters>
        });
        */

        // console.log ("addPlayer >> " + player_desc.id);

        t.queue.push (player_desc);
    },

    createPlayers: function () {

        // console.log ("createPlayers");

        var t = this;

        t.sealed = true;

        if (t.initialized && t.apiready) {

            // after the API code downloads ..
            function initPlayer () {

                if (t.queue.length > 0) {

                    var player_desc = t.queue.shift ();
                    var player      = new YT.Player (player_desc.id, player_desc.params);

                    t.players.push (player);

                    // console.log ("YouTube player created >> " + player_desc.id);

                    /*
                    player.addEventListener ("onReady", function listener (e) {

                        e.target.removeEventListener (e.type, listener);

                        initPlayer ();
                    });
                    */

                    player.addEventListener ("onStateChange", function listener (e) {

                        // console.log ("createPlayers >> onStateChange : " + e.data + " >> " + e.target.getIframe ().id);

                        if (e.data === YT.PlayerState.PLAYING) {

                            e.target.removeEventListener (e.type, listener);

                            // timeout helps to greatly reduce CPU spikes
                            setTimeout (initPlayer, 1000);

                            // initPlayer ();
                        }
                    });
                }
            }

            // initialize players one by one to avoid excessive CPU peaks making the
            // website sluggish and lagging at the beginning
            initPlayer ();

            /*
            for (var i = 0; i < t.queue.length; i ++) {

                var player_desc = t.queue [i];

                var player = new YT.Player (player_desc.id, player_desc.params);

                t.players.push (player);
            }
            */
        }
    },
}

var YouTube = new YouTube ();
