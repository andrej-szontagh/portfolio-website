
var animations      = null;
var gallery_videos  = null;
var gallery_images  = null;
var ui              = null;

window.onload = function (e) {

    // console.log ("window.location.href      : " + window.location.href);
    // console.log ("window.location.hostname  : " + window.location.hostname);
    // console.log ("window.location.pathname  : " + window.location.pathname);
    // console.log ("window.location.protocol  : " + window.location.protocol);
    // console.log ("window.location.port      : " + window.location.port);
    
    animations = new Animations ();
    
    gallery_videos = new GalleryVideos (
        document.getElementById ("gallery-videos"), "data/gallery-videos.json", animations, 0.0,
        
        function () {
       
            console.log ("Video Gallery Initialized");
        }
    );
    
    gallery_images = new GalleryImages (
        document.getElementById ("gallery-images"), "data/gallery-images.json",
        
        function () {
       
            console.log ("Image Gallery Initialized");
        }
    );
    
    ui = new UI ();
}