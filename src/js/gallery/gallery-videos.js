
function GalleryVideos (container, json, animations, edge) {

    var t = this;

    t.container = container;

    // YouTube API needs to be initialized beforehand !
    YouTubeManager.init ();

    var index = -1;

    for (var vid in json.videos) {

        index ++;

        // check if the property/key is defined in the object itself, not in parent
        if (json.videos.hasOwnProperty (vid)) {

            var video = json.videos [vid];

            // console.log (key, json.videos [vid]);

            var wrapper             = document.createElement ('div');
            var player              = document.createElement ('div');

            var cover               = document.createElement ('div');
            var cover_img           = document.createElement ('img');

            var progressbar         = document.createElement ('div');
            var progressbar_img     = document.createElement ('img');

            // save index / order of loading ..
            progressbar.setAttribute ("index", index);

            // wrapper id needs to match json key !

            wrapper         .id         = vid;
            player          .id         = "YouTube-" + vid;

            wrapper         .className  = "video-wrapper gallery-block";
            player          .className  = "youtube-player";
            cover           .className  = "video-cover visible";
            progressbar     .className  = "video-progressbar";

            cover_img       .src        = json.filebase_covers + video.cover;
            progressbar_img .src        = json.filebase_covers + video.cover;

            cover           .appendChild (cover_img);
            cover           .appendChild (progressbar);
            progressbar     .appendChild (progressbar_img);

            wrapper         .appendChild (cover);
            wrapper         .appendChild (player);
            t.container     .appendChild (wrapper);

            // start fake progres-bar right away with
            // random delay and duration to make it look natural
            // the duration is set to be slow enough that video will be
            // loaded before the animation ends at least in majority of cases, but
            // not too slow that it's apparent that video is loading so the user stops by and keep waiting.

            // we cannot start animation right after dom element is created since we
            // have to change the transition property and that wouldn't count as change

            progressbar_img.addEventListener ('load', function (e) {

                var progressbar = e.target.parentNode;

                var index = parseFloat (progressbar.getAttribute ("index"));

                progressbar.style.width                 = "98%";
                progressbar.style.transitionDelay       = (1  + Math.random ()) * index + "s";
                progressbar.style.transitionDuration    = (20 + Math.random ()  * 10)   + "s";
            });

            YouTubeManager.addPlayer ({

                id:     player.id,
                params: {

                    width:      640,    // 720p half-res
                    height:     360,    // 720p half-res
                    videoId:    vid,

                    playerVars: {

                        // https://developers.google.com/youtube/player_parameters

                        'enablejsapi'       : 1,
                        'loop'              : 1,
                        'start'             : video.start,
                        'playlist'          : vid,  // this is necessary for 'loop' to work
                        'autoplay'          : 1,
                        'controls'          : 0,
                        'showinfo'          : 0,
                        'fs'                : 0,
                        'rel'               : 0,
                        'disablekb'         : 1,
                        'modestbranding'    : 1,
                        'playsinline'       : 1,
                        // 'origin'            : "https://andrej-szontagh.github.io/",
                        // 'origin'            : "https://www.andrejszontagh.com/",
                    },

                    events: {

                        "onReady": function (e) {

                            // https://developers.google.com/youtube/iframe_api_reference#Operations

                            var player      = e.target;
                            var iframe      = player.getIframe ();
                            var cover       = iframe.parentNode.querySelector (".video-cover");
                            var progressbar = iframe.parentNode.querySelector (".video-progressbar");

                            // console.log ("onReady >> " + iframe.id);

                            // makes sure it's muted
                            player.mute ();

                            // starts low quality to make the buffering fast ..
                            player.setPlaybackQuality ("small");  // small, medium, large, hd720 ..

                            // sometimes (mobile) when the videos are played right after "onReady"
                            // the playback just never happen. Not sure if bug or what is going on but a
                            // short delay seems to fix the problem

                            setTimeout (function () { player.playVideo (); }, 100);

                            function playPlayer (player) {

                                // make sure is in viewport !
                                if (animations.isInViewport (player.getIframe ().parentNode, edge)) {

                                    player.playVideo ();
                                }
                            }

                            function onScroll () {

                                // playback is in the hands of loading progress code until cover is hidden ..
                                if (cover.classList.contains ("hidden")) {

                                    if (animations.isInViewport (iframe.parentNode, edge)) {

                                        // this helps with loading spikes when user scrolls wildly ..

                                        if (player.timer === undefined) player.timer = null;

                                        if (player.timer != null) clearTimeout (player.timer);

                                        player.timer = setTimeout (function () {

                                            playPlayer (player);

                                        }, 500);

                                    } else {

                                        player.pauseVideo ();
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

                                    progressbar.style.width                 = "100%";
                                    progressbar.style.transitionDuration    = "0.5s";

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

                                    progressbar.addEventListener ("transitionend", function (e) {

                                        // https://www.sitepoint.com/create-one-time-events-javascript/
                                        e.target.removeEventListener (e.type, arguments.callee);

                                        playAtTransitionEnd ();
                                    });
                                }
                            }

                            player.addEventListener ("onStateChange", function (e) {

                                if (e.data === YT.PlayerState.PLAYING) {

                                    // https://www.sitepoint.com/create-one-time-events-javascript/
                                    e.target.removeEventListener (e.type, arguments.callee);

                                    finishLoading ();
                                }
                            });
                        },

                        "onStateChange": function (e) {

                            var player  = e.target;
                            var iframe  = player.getIframe ();

                            // console.log ("onStateChange >> " + iframe.id + " >> " + e.data);

                            switch (e.data) {

                                case YT.PlayerState.BUFFERING:

                                    // console.log ("BUFFERING >> " + iframe.id);
                                    break;

                                case YT.PlayerState.PLAYING:

                                    // console.log ("PLAYING   >> " + iframe.id);
                                    break;
                            }
                        },

                        "onError": function (e) {

                            // TODO: handle errors !

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
                }
            });
        }
    }

    YouTubeManager.createPlayers ();
}

GalleryVideos.prototype = {

    constructor: GalleryVideos,
}
