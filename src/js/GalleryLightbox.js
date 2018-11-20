
class GalleryLightbox {

    constructor (json) {

        var t = this;

        t.json          = json;

        t.container     = document.getElementById ("screen-lightbox");

        t.details       = t.container.querySelector ("#details");

        t.details_timer = null;
        t.details_index = 0;

        t.target        = null;

        t.container.addEventListener ('onvisible',   function (e) { t.onVisible (); });
        t.container.addEventListener ('onhidden',    function (e) { t.onHidden  (); });
    }

    resetDetails () {

        var t = this;

        if (t.details_timer) {

            clearTimeout (t.details_timer);
        }

        t.details.style.visibility  = "hidden";
        t.details.innerHTML         = "";
        t.details_index             = 0;
    }

    playDetails (id, delay, duration) {

        var t = this;

        t.resetDetails ();

        var d, desc = null;

        if (d = t.json.images [id]) desc = d.description; else
        if (d = t.json.videos [id]) desc = d.description;

        if (desc) {
            desc = t.json.descriptions [desc];

            if (desc) {

                function updateContent () {

                    if (t.details_index >= desc.details.length) {
                        t.details_index = 0;
                    }

                    var content = desc.details [t.details_index ++];

                    t.details.innerHTML = "";
                    for (var i = 0; i < content.length; i ++) {

                        t.details.innerHTML += content [i];
                    }

                    t.details.style.visibility = "visible";
                }

                function onRollOffEnd (e) {

                    // console.log ("onRollOffEnd");

                    e.target.removeEventListener (e.type, onRollOffEnd);

                    // rolling ON
                    t.details.classList.remove  ("roll-off");
                    t.details.classList.add     ("roll-on");
                    t.details.addEventListener ("animationend", onRollOnEnd);

                    updateContent ();
                }

                function onRollOnEnd (e) {

                    // console.log ("onRollOnEnd");

                    e.target.removeEventListener (e.type, onRollOnEnd);

                    if (t.details_timer) {

                        clearTimeout (t.details_timer);
                    }

                    t.details_timer = setTimeout (updateDetails, duration);
                }

                function updateDetails () {

                    // rolling OFF
                    t.details.classList.remove  ("roll-on");
                    t.details.classList.add     ("roll-off");
                    t.details.addEventListener ("animationend", onRollOffEnd);
                }

                t.details_timer = setTimeout (updateDetails, delay);
            }
        }
    }

    onVisible () {

        // console.log ("onLightboxVisible");

        var t = this;

        if (t.target) {

            manager_content.zoomIn (t.target, function (e) {});

            if (manager_content.zoomed_at) {
                manager_content.zoomed_at.classList.add ("in-lightbox");

                t.playDetails (manager_content.zoomed_at.id, 0, 2000);
            }
        }
    }

    onHidden () {

        // console.log ("onLightboxHidden");

        var t = this;

        if (manager_content.zoomed_at) {
            manager_content.zoomed_at.classList.remove ("in-lightbox");
        }

        manager_content.zoomOut (function (e) {

            t.resetDetails ();
        });
    }

    isVisible (el) {

        var t = this;

        return (t.container.classList.contains ("visible"));
    }

    show (el) {

        // console.log ("showLightbox");

        var t = this;

        t.target = el;

        t.container.classList.remove ("hidden");
        t.container.classList.add    ("visible");

        t.container.dispatchEvent (new Event ('onvisible'));   // !!
    }

    hide () {

        // console.log ("hideLightbox");

        var t = this;

        t.container.classList.remove ("visible");
        t.container.classList.add    ("hidden");

        t.container.dispatchEvent (new Event ('onhidden'));   // !!
    }
}
