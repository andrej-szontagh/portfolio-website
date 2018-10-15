
var manager_ui          = null;
var manager_animations  = null;
var manager_gallery     = null;

window.onload = function (e) {

    // console.log ("window.location.href      : " + window.location.href);
    // console.log ("window.location.hostname  : " + window.location.hostname);
    // console.log ("window.location.pathname  : " + window.location.pathname);
    // console.log ("window.location.protocol  : " + window.location.protocol);
    // console.log ("window.location.port      : " + window.location.port);

    manager_ui          = new UI            ();
    manager_animations  = new Animations    ();
    manager_gallery     = new Gallery       (manager_ui, manager_animations, "data/gallery.json");
}
