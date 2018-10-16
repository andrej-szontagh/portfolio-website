
// YouTube API ..

// we keep things global since that is how
// the API works anyways (by calling 'onYouTubeIframeAPIReady')

var YouTubeAPIInitialized   = false;
var YouTubeAPIPlayersQueue  = [];
var YouTubeAPIPlayers       = [];

function YouTubeAPIAddPlayer (player_desc) {

    /*
    YouTubeAPIAddPlayer ({

        id:     <element-id>,
        params: <youtube-api-parameters>
    });
    */

    YouTubeAPIPlayersQueue.push (player_desc);
}

function YouTubeAPIInit () {

    // initialize YouTube API
    // https://developers.google.com/youtube/iframe_api_reference#top_of_page
    if (YouTubeAPIInitialized ==    false) {
        YouTubeAPIInitialized =     true;

        var tag = document.createElement ('script');

        tag.id  = 'iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';

        var firstScriptTag = document.getElementsByTagName ('script')[0];

        firstScriptTag.parentNode.insertBefore (tag, firstScriptTag);
    }
}

function onYouTubeIframeAPIReady () {

    // after the API code downloads ..
    function initPlayer () {

        if (YouTubeAPIPlayersQueue.length > 0) {

            var player_desc = YouTubeAPIPlayersQueue.shift ();
            var player      = new YT.Player (player_desc.id, player_desc.params);

            YouTubeAPIPlayers.push (player);

            // console.log ("YouTube player created >> " + player_desc.id);

            /*
            player.addEventListener ("onReady", function (e) {

                // https://www.sitepoint.com/create-one-time-events-javascript/
                e.target.removeEventListener (e.type, arguments.callee);

                initPlayer ();
            });
            */

            player.addEventListener ("onStateChange", function (e) {

                if (e.data === YT.PlayerState.PLAYING) {

                    // https://www.sitepoint.com/create-one-time-events-javascript/
                    e.target.removeEventListener (e.type, arguments.callee);

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
    for (var i = 0; i < YouTubeAPIPlayersQueue.length; i ++) {

        var player_desc = YouTubeAPIPlayersQueue [i];

        var player = new YT.Player (player_desc.id, player_desc.params);

        YouTubeAPIPlayers.push (player);
    }
    */
}
