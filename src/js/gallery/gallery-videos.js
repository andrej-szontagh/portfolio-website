
function GalleryVideos (container, json, animations, edge) {

    var t = this;

    t.container = container;

    // YouTube API needs to be initialized beforehand !
    YouTubeAPIInit ();

    var index = -1;

    for (var vid in json.videos) {

        index ++;

        // check if the property/key is defined in the object itself, not in parent
        if (json.videos.hasOwnProperty (vid)) {

            var video = json.videos [vid];

            // console.log (key, json.videos [vid]);

            var wrapper = document.createElement ('div');
            var cover   = document.createElement ('img');
            var player  = document.createElement ('div');

            cover   .id         = "youtube-cover-"  + index;
            player  .id         = "youtube-player-" + index;

            cover   .src        = json.filebase_covers + video.cover;
            cover   .className  = "video-cover";

            wrapper .id         = vid;
            wrapper .className  = "video-wrapper gallery-block";

            wrapper     .appendChild (cover);
            wrapper     .appendChild (player);
            t.container .appendChild (wrapper);

            YouTubeAPIAddPlayer ({

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
                        'autoplay'          : 0,
                        'controls'          : 0,
                        'showinfo'          : 0,
                        'fs'                : 0,
                        'rel'               : 0,
                        'disablekb'         : 1,
                        'modestbranding'    : 1,
                        'playsinline'       : 1,
                      //'origin'            : "https://www.andrejszontagh.com/",
                    },

                    events: {

                        "onReady": function (e) {

                            // https://developers.google.com/youtube/iframe_api_reference#Operations

                            var player = e.target;
                            var iframe = player.getIframe ();

                            // makes sure it's muted
                            player.mute ();

                            // starts low quality to make the buffering fast ..
                            player.setPlaybackQuality ("small");  // small, medium, large, hd720 ..

                            // this starts buffering but do not play yet
                            // we want to start buffering as soon as possible ..
                            player.playVideo    ();
                            player.pauseVideo   ();

                            function onScroll () {

                                if (animations.isInViewport (iframe.parentNode, edge)) {

                                    // this helps with loading spikes when user scrolls wildly ..

                                    if (player.timer === undefined) player.timer = null;

                                    if (player.timer != null) clearTimeout (player.timer);

                                    player.timer = setTimeout (function () {

                                        // make sure still in viewport !
                                        if (animations.isInViewport (iframe.parentNode, edge)) {

                                            player.playVideo ();
                                        }

                                    }, 500);

                                } else {

                                    player.pauseVideo ();
                                }
                            }

                            // in the case object is already in the viewport
                            onScroll ();

                            window.addEventListener ("resize", onScroll);
                            window.addEventListener ("scroll", onScroll);
                        },

                        "onStateChange": function (e) {

                            var player  = e.target;
                            var iframe  = player.getIframe ();
                            var cover   = iframe.parentNode.querySelector (".video-cover");

                            switch (e.data) {

                                case YT.PlayerState.BUFFERING:

                                    // console.log ("BUFFERING >> " + iframe.id);

                                    // show cover
                                    cover.classList.remove  ("cover-hidden");
                                    cover.classList.add     ("cover-visible");

                                    break;

                                case YT.PlayerState.PLAYING:

                                    // console.log ("PLAYING   >> " + iframe.id);

                                    // hide cover
                                    cover.classList.remove  ("cover-visible");
                                    cover.classList.add     ("cover-hidden");

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
}

GalleryVideos.prototype = {

    constructor: GalleryVideos,
}
