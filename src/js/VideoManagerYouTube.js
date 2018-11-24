
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

    createPlayers () {

        let t = this;

        t.sealed = true;

        if (t.initialized && t.apiready) {

            // after the API code downloads ..
            function initPlayer () {

                if (t.queue.length > 0) {

                    let desc = t.queue.shift ();

                    let player = new YT.Player (desc.container.id,

                        {
                            width:      640,    // 720p half-res
                            height:     360,    // 720p half-res
                            videoId:    desc.id,

                            playerVars: {

                                // https://developers.google.com/youtube/player_parameters

                                "enablejsapi"       : 1,
                                "loop"              : 1,
                                "start"             : desc.start,
                                "playlist"          : desc.id,  // this is necessary for "loop" to work
                                "autoplay"          : 1,
                                "controls"          : 0,
                                "showinfo"          : 0,
                                "fs"                : 0,
                                "rel"               : 0,
                                "disablekb"         : 1,
                                "modestbranding"    : 1,
                                "playsinline"       : 1,
                                // "origin"            : "https://andrej-szontagh.github.io/",
                                // "origin"            : "https://www.andrejszontagh.com/",
                            },

                            events: {

                                onReady: function (e) {

                                    // console.log ("onReady >> " + e.target.getIframe ().id);

                                    // https://developers.google.com/youtube/iframe_api_reference#Operations

                                    let player = e.target;

                                    // makes sure it's muted
                                    player.mute ();

                                    // starts low quality to make the buffering fast ..
                                    player.setPlaybackQuality ("small");  // small, medium, large, hd720 ..

                                    // this is required for the player loading queue to advance ..
                                    // we will pause video on YT.PlayerState.PLAYING if not in viewport
                                    player.playVideo ();

                                    desc.callback (player);
                                },

                                onStateChange:  VideoManagerYouTube.printState,
                                onError:        VideoManagerYouTube.printError,
                            }
                        }
                    );

                    t.players.push (player);

                    // console.log ("YouTube player created >> " + player_desc.id);

                    /*
                    player.addEventListener ("onReady", function listener (e) {

                        e.target.removeEventListener (e.type, listener);

                        initPlayer ();
                    });
                    */

                    player.addEventListener ("onStateChange", function listener (e) {

                        if (e.data === YT.PlayerState.PLAYING) {

                            t.dispatchEvent (new VideoEvent (VideoEvent.ON_PLAYING, e.target));
                        }
                    });

                    t.addEventListener (VideoEvent.ON_PLAYING, function listener (e) {

                        e.target.removeEventListener (e.type, listener);

                        // timeout helps to greatly reduce CPU spikes
                        setTimeout (initPlayer, 1000);
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

    static printState (e) {

        let player  = e.target;
        let iframe  = player.getIframe ();

        // console.log ("onStateChange >> " + iframe.id + " >> " + e.data);

        switch (e.data) {

            case YT.PlayerState.BUFFERING:

                // console.log ("BUFFERING >> " + iframe.id);
                break;

            case YT.PlayerState.PLAYING:

                // console.log ("PLAYING   >> " + iframe.id);
                break;
        }
    }

    static printError (e) {

        switch (e.data) {

            case 2:     Console.log ("YouTube API error 2");    break;  // The request contains an invalid parameter value
            case 5:     Console.log ("YouTube API error 5");    break;  // The requested content cannot be played in an HTML5 player
            case 100:   Console.log ("YouTube API error 100");  break;  // The video requested was not found
            case 101:   Console.log ("YouTube API error 101");  break;  // The owner of the requested video does not allow it to be played in embedded players
            case 150:   Console.log ("YouTube API error 150");  break;  // This error is the same as 101. It's just a 101 error in disguise!

            default:
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
