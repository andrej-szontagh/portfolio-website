
/* global manager_video */
/* global YT */

class VideoManagerYouTube extends VideoManager {

    constructor () {

        super ();

        let t = this;

        t.players   = [];
        t.apiready  = false;
    }

    init () {

        let t = this;

        // initialize YouTube API
        // https://developers.google.com/youtube/iframe_api_reference#top_of_page
        if (t.initialized ==  false) {
            t.initialized =   true;

            let tag = document.createElement ("script");

            tag.id  = "iframe-api";
            tag.src = "https://www.youtube.com/iframe_api";

            let firstScriptTag = document.getElementsByTagName ("script")[0];

            firstScriptTag.parentNode.insertBefore (tag, firstScriptTag);
        }
    }

    addPlayer (player_desc) {

        super.addPlayer (player_desc);

        let t = this;
    }

    createPlayers () {

        let t = this;

        t.sealed = true;

        if (t.initialized && t.apiready) {

            // after the API code downloads ..
            function initPlayer () {

                if (t.queue.length > 0) {

                    let player_desc = t.queue.shift ();
                    let player      = new YT.Player (player_desc.id, player_desc.params);

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
            for (let i = 0; i < t.queue.length; i ++) {

                let player_desc = t.queue [i];

                let player = new YT.Player (player_desc.id, player_desc.params);

                t.players.push (player);
            }
            */
        }
    }

    debug () {

        let t = this;

        for (let i = 0; i < t.players.length; i ++) {

            let state = t.players [i].getPlayerState ();

            switch (state) {
                case YT.PlayerState.ENDED:      state = "ended";        break;
                case YT.PlayerState.PLAYING:    state = "playing";      break;
                case YT.PlayerState.PAUSED:     state = "paused";       break;
                case YT.PlayerState.BUFFERING:  state = "buffering";    break;
                case YT.PlayerState.CUED:       state = "cued";         break;
                default:                        state = "unstarted";    break;
            }

            Console.log ("Player " + i + " >> " + state);
        }
    }
}

function onYouTubeIframeAPIReady () {

    // console.log ("onYouTubeIframeAPIReady");

    manager_video.apiready = true;

    if (manager_video.initialized &&
        manager_video.sealed) {

        manager_video.createPlayers ();
    }
}
