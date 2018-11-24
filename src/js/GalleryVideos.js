
/* global manager_video */
/* global YT */

class GalleryVideos {

    constructor (container, json, animations) {

        let t = this;

        t.container     = container;
        t.animations    = animations;

        let index = -1;

        for (let vid in json.videos) {

            // check if the property/key is defined in the object itself, not in parent
            if (json.videos.hasOwnProperty (vid)) {

                // console.log (key, json.videos [vid]);

                index ++;

                let video = json.videos [vid];

                let dom = t.addVideoDOM (vid, index, json.filebase_covers + video.cover);

                // start fake progres-bar right away with
                // random delay and duration to make it look natural
                // the duration is set to be slow enough that video will be
                // loaded before the animation ends at least in majority of cases, but
                // not too slow that it's apparent that video is loading so the user stops by and keep waiting.

                // we cannot start animation right after dom element is created since we
                // have to change the transition property and that wouldn't count as change

                dom.progressbar_img.addEventListener ("load", function (e) {

                    t.playProgressBar (e.target.parentNode);
                });

                manager_video.addPlayer ({

                    id:     dom.player.id,
                    params: {

                        width:      640,    // 720p half-res
                        height:     360,    // 720p half-res
                        videoId:    vid,

                        playerVars: {

                            // https://developers.google.com/youtube/player_parameters

                            "enablejsapi"       : 1,
                            "loop"              : 1,
                            "start"             : video.start,
                            "playlist"          : vid,  // this is necessary for "loop" to work
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

                            "onReady": function (e) {

                                t.initPlayer (dom, e.target);
                            },

                            "onStateChange":    GalleryVideos.printState,
                            "onError":          GalleryVideos.printError,
                        }
                    }
                });
            }
        }

        manager_video.createPlayers ();
    }

    initPlayer (dom, player) {

        let t = this;

        // https://developers.google.com/youtube/iframe_api_reference#Operations

        let iframe      = player.getIframe ();
        // let cover       = iframe.parentNode.querySelector (".video-cover");
        // let progressbar = iframe.parentNode.querySelector (".video-progressbar");

        let cover       = dom.cover;
        let progressbar = dom.progressbar;

        // console.log ("onReady >> " + iframe.id);

        // makes sure it's muted
        player.mute ();

        // starts low quality to make the buffering fast ..
        player.setPlaybackQuality ("small");  // small, medium, large, hd720 ..

        // this is required for the player loading queue to advance ..
        // we will pause video on YT.PlayerState.PLAYING if not in viewport
        player.playVideo ();

        function playPlayer (player) {

            let w = player.getIframe ().parentNode;

            // make sure is in viewport !
            if (t.animations.isInViewport (w, 0)) {

                player.playVideo ();
                w.style.visibility = "visible";
            }
        }

        function onScroll () {

            // playback is in the hands of loading progress code until cover is hidden ..
            if (cover.classList.contains ("hidden")) {

                if (t.animations.isInViewport (iframe.parentNode, 0)) {

                    // this helps with loading spikes when user scrolls wildly ..
                    playPlayer (player);

                    /*
                    if (player.timer === undefined) player.timer = null;

                    if (player.timer != null) clearTimeout (player.timer);

                    player.timer = setTimeout (function () {

                        playPlayer (player);

                    }, 500);
                    */

                } else {

                    player.pauseVideo ();
                    iframe.parentNode.style.visibility = "hidden";
                }
            }
        }

        window.addEventListener ("resize", onScroll);
        window.addEventListener ("scroll", onScroll);

        function finishLoading () {

            // console.log ("finishLoading");

            // when the video loading / initalization is finished and video is ready to play
            // we hide the entire cover and don't have to update the progress bar anymore

            if (cover.classList.contains ("visible") === true) {

                progressbar.style.setProperty ("--progress", "100%");

                progressbar.style.transitionDuration    = "0.5s";
                progressbar.style.transitionDelay       = null;

                // this bypasses any possible progress bar changes in the meantime
                cover.classList.remove ("visible");

                if (player) {
                    player.pauseVideo ();
                }

                function hideCover () {

                    // hide cover when the video is actually playing
                    // this way we avoid black frames at the start ..

                    cover.classList.add ("hidden");
                }

                function playAtTransitionEnd () {

                    // now we can actually play the video
                    playPlayer (player);

                    // wait a little to avoid some black frames
                    setTimeout (hideCover, 100);
                }

                progressbar.addEventListener ("transitionend", function listener (e) {

                    // make sure we are on the right transition and object
                    if (e.target        === progressbar &&
                        e.propertyName  === "clip-path" ||
                        e.propertyName  === "width") {

                        e.target.removeEventListener (e.type, listener);

                        playAtTransitionEnd ();
                    }
                });
            }
        }

        player.addEventListener ("onStateChange", function listener (e) {

            if (e.data === YT.PlayerState.PLAYING) {

                e.target.removeEventListener (e.type, listener);

                finishLoading ();
            }
        });
    }

    playProgressBar (progressbar) {

        let index = parseFloat (progressbar.getAttribute ("index"));

        progressbar.style.setProperty ("--progress", "98%");

        progressbar.style.transitionDelay       = (1  + Math.random ()) * index + "s";
        progressbar.style.transitionDuration    = (20 + Math.random ()  * 10)   + "s";
    }

    addVideoDOM (vid, index, coversrc) {

        let t = this;

        let dom = {

            wrapper:            document.createElement ("div"),
            player:             document.createElement ("div"),

            cover:              document.createElement ("div"),
            cover_img:          document.createElement ("img"),

            progressbar:        document.createElement ("div"),
            progressbar_img:    document.createElement ("img"),
        }

        // save index / order of loading ..
        dom.progressbar.setAttribute ("index", index);

        // wrapper id needs to match json key !

        dom.wrapper         .id         = vid;
        dom.player          .id         = "YouTube-" + vid;

        dom.wrapper         .className  = "video-wrapper gallery-block";
        dom.player          .className  = "youtube-player";
        dom.cover           .className  = "video-cover visible";
        dom.progressbar     .className  = "video-progressbar";

        dom.cover_img       .src        = coversrc; //json.filebase_covers + video.cover;
        dom.progressbar_img .src        = coversrc; //json.filebase_covers + video.cover;

        dom.cover           .appendChild (dom.cover_img);
        dom.cover           .appendChild (dom.progressbar);
        dom.progressbar     .appendChild (dom.progressbar_img);

        dom.wrapper         .appendChild (dom.cover);
        dom.wrapper         .appendChild (dom.player);

        t.container         .appendChild (dom.wrapper);

        return dom;
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

            case 2:     console.log ("YouTube API error 2");    break;  // The request contains an invalid parameter value
            case 5:     console.log ("YouTube API error 5");    break;  // The requested content cannot be played in an HTML5 player
            case 100:   console.log ("YouTube API error 100");  break;  // The video requested was not found
            case 101:   console.log ("YouTube API error 101");  break;  // The owner of the requested video does not allow it to be played in embedded players
            case 150:   console.log ("YouTube API error 150");  break;  // This error is the same as 101. It's just a 101 error in disguise!

            default:
        }
    }
}
