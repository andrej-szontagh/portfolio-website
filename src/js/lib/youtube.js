
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
    
    for (var i = 0; i < YouTubeAPIPlayersQueue.length; i ++) {

        var player_desc = YouTubeAPIPlayersQueue [i];
    
        var player = new YT.Player (player_desc.id, player_desc.params);
                
        YouTubeAPIPlayers.push (player);
    }
}

