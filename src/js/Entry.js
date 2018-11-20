
var body                = null;
var manager_buttons     = null;
var manager_mechanics   = null;
var manager_animations  = null;
var manager_content     = null;

window.onload = function (e) {

    // console.log ("window.location.href      : " + window.location.href);
    // console.log ("window.location.hostname  : " + window.location.hostname);
    // console.log ("window.location.pathname  : " + window.location.pathname);
    // console.log ("window.location.protocol  : " + window.location.protocol);
    // console.log ("window.location.port      : " + window.location.port);

    body = document.getElementsByTagName ("BODY")[0];

    manager_buttons     = new Buttons       ();
    manager_mechanics   = new Mechanics     ();
    manager_animations  = new Animations    ();
    manager_content     = new Content       ();
}
