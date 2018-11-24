
/* global manager_video */
/* global Animations */
/* global VideoEvent */
/* global YT */

class GalleryVideos {

    constructor (container, json) {

        let t = this;

        t.container = container;

        let index = -1;

        for (let vid in json.videos) {

            // check if the property/key is defined in the object itself, not in parent
            if (json.videos.hasOwnProperty (vid)) {

                // console.log (key, json.videos [vid]);

                index ++;

                let video = json.videos [vid];

                let dom = t.appendVideoDOM (vid, index, json.filebase_covers + video.cover);

                // start fake progres-bar right away with
                // random delay and duration to make it look natural
                // the duration is set to be slow enough that video will be
                // loaded before the animation ends at least in majority of cases, but
                // not too slow that it's apparent that video is loading so the user stops by and keep waiting.

                // we cannot start animation right after dom element is created since we
                // have to change the transition property and that wouldn't count as change

                dom.progressbar_img.addEventListener ("load", function (e) {

                    t.startBuffering (dom);
                });

                manager_video.addPlayer (vid, dom.placeholder, video.start, function (player) {

                    t.initPlayer (dom, player);
                });
            }
        }

        manager_video.createPlayers ();
    }

    initPlayer (dom, player) {

        let t = this;

        function onScroll () {

            // playback is in the hands of loading progress code until cover is hidden ..
            if (dom.cover.classList.contains ("hidden")) {

                if (Animations.isInViewport (dom.wrapper, 0)) {

                    // this helps with loading spikes when user scrolls wildly ..
                    t.playPlayer (dom, player);

                    /*
                    if (player.timer === undefined) player.timer = null;

                    if (player.timer != null) clearTimeout (player.timer);

                    player.timer = setTimeout (function () {

                        playPlayer (dom, player);

                    }, 500);
                    */

                } else {

                    t.pausePlayer (dom, player);
                }
            }
        }

        window.addEventListener ("resize", onScroll);
        window.addEventListener ("scroll", onScroll);

        manager_video.addEventListener (VideoEvent.ON_PLAYING, function listener (e) {

            e.target.removeEventListener (e.type, listener);

            if (t.finishBuffering (dom, function () {

                t.playPlayer (dom, e.player);

            })) {

                // waiting for the progressbar to finish ..
                e.player.pauseVideo ();
            }
        });
    }

    playPlayer (dom, player) {

        var t = this;

        // make sure is in viewport !
        if (Animations.isInViewport (dom.wrapper, 0)) {

            player.playVideo ();
            dom.wrapper.style.visibility = "visible";
        }
    }

    pausePlayer (dom, player) {

        var t = this;

        player.pauseVideo ();
        dom.wrapper.style.visibility = "hidden";
    }

    startBuffering (dom) {

        var t = this;

        let index = parseFloat (dom.progressbar.getAttribute ("index"));

        dom.progressbar.style.setProperty ("--progress", "98%");

        dom.progressbar.style.transitionDelay       = (1  + Math.random ()) * index + "s";
        dom.progressbar.style.transitionDuration    = (20 + Math.random ()  * 10)   + "s";
    }

    finishBuffering (dom, callback) {

        var t = this;

        // when the video loading / initalization is finished and video is ready to play
        // we hide the entire cover and don't have to update the progress bar anymore

        if (dom.cover.classList.contains ("visible") === true) {

            dom.progressbar.style.setProperty ("--progress", "100%");

            dom.progressbar.style.transitionDuration    = "0.5s";
            dom.progressbar.style.transitionDelay       = null;

            // this bypasses any possible progress bar changes in the meantime
            dom.cover.classList.remove ("visible");

            dom.progressbar.addEventListener ("transitionend", function listener (e) {

                // make sure we are on the right transition and object
                if ((e.target        === dom.progressbar) &&
                    (e.propertyName  === "clip-path" ||
                     e.propertyName  === "width")) {

                    e.target.removeEventListener (e.type, listener);

                    if (callback) {
                        callback ();
                    }

                    // wait a little to avoid some black frames
                    setTimeout (function () {

                        // hide cover when the video is actually playing
                        // this way we avoid black frames at the start ..

                        dom.cover.classList.add ("hidden");

                    }, 100);
                }
            });

            return true;
        }

        return false;
    }

    appendVideoDOM (vid, index, coversrc) {

        let t = this;

        let dom = {

            wrapper:            document.createElement ("div"),
            placeholder:        document.createElement ("div"),

            cover:              document.createElement ("div"),
            cover_img:          document.createElement ("img"),

            progressbar:        document.createElement ("div"),
            progressbar_img:    document.createElement ("img"),
        };

        // save index / order of loading ..
        dom.progressbar.setAttribute ("index", index);

        // wrapper id needs to match json key !

        dom.wrapper         .id         = vid;
        dom.placeholder     .id         = "YouTube-" + vid;

        dom.wrapper         .className  = "video-wrapper gallery-block";
        dom.placeholder     .className  = "youtube-player";
        dom.cover           .className  = "video-cover visible";
        dom.progressbar     .className  = "video-progressbar";

        dom.cover_img       .src        = coversrc;
        dom.progressbar_img .src        = coversrc;

        dom.cover           .appendChild (dom.cover_img);
        dom.cover           .appendChild (dom.progressbar);
        dom.progressbar     .appendChild (dom.progressbar_img);

        dom.wrapper         .appendChild (dom.cover);
        dom.wrapper         .appendChild (dom.placeholder);

        t.container         .appendChild (dom.wrapper);

        return dom;
    }
}
