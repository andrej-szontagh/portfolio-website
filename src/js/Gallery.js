
/* global Utils */
/* global GalleryVideos */
/* global GalleryImages */
/* global GalleryLightbox */
/* global manager_buttons */
/* global manager_content */

class Gallery {

    constructor (filepath_json) {

        let t = this;

        t.manager_videos    = null;
        t.manager_images    = null;

        t.lightbox          = null;

        t.desc              = document.getElementById ("label-description");
        t.container         = document.getElementById ("content-transform");

        t.desc_header       = t.desc.querySelector ("h1");
        t.desc_oneliner     = t.desc.querySelector ("p");
        t.desc_tags         = t.desc.querySelector ("h3");

        Utils.loadJSON (filepath_json, function (json) {

            t.json = json;

            t.manager_videos = new GalleryVideos (document.getElementById ("gallery-videos"), json);
            t.manager_images = new GalleryImages (document.getElementById ("gallery-images"), json,

                function () {

                    // console.log ("Image Gallery Update");

                    t.updateButtons ();
                }
            );

            t.lightbox = new GalleryLightbox (json);

            t.updateButtons ();
        });
    }

    updateButtons () {

        let t = this;

        function onOpen     (e) { t.onOpen      (e);    }
        function onVisible  (e) { t.onVisible   (e);    }

        Utils.forEachNodeList (document.querySelectorAll (".gallery-block"), function (el, i) {

            if (el.classList.contains   ("button-hover") === false) {
                el.classList.add        ("button-hover");
                el.classList.add        ("hidden");

                el.setAttribute ("button-target",  "<this> #label-description");
                el.setAttribute ("button-clear",   ".gallery-block");

                el.addEventListener ("onvisible", onVisible);
                el.___callback_open = onOpen;
            }
        });

        manager_buttons.updateButtons ();
    }

    static getDescriptor (json, id) {

        if (id in json.images) { return json.descriptions [json.images [id].description]; }
        if (id in json.videos) { return json.descriptions [json.videos [id].description]; }

        return null;
    }

    buildTagsString (tags) {

        let str = "";

        Utils.forEachObject (tags, function (k, tag, i) {

            if (i > 0) {

                str += " - ";
            }

            str += tag;
        });

        return str;
    }

    onVisible (e) {

        let t = this;

        let desc = Gallery.getDescriptor (t.json, e.target.id);
        if (desc) {

            t.desc_header   .innerHTML = desc.name + "<br> (" + desc.year + ")";
            t.desc_oneliner .innerHTML = desc.oneliner;
            t.desc_tags     .innerHTML = "";

            if (desc.tags) {

                t.desc_tags.innerHTML = t.buildTagsString (desc.tags);
            }

        } else {

            t.desc_header   .innerHTML = "";
            t.desc_oneliner .innerHTML = "";
            t.desc_tags     .innerHTML = "";
        }
    }

    onOpen (e) {

        let t = this;

        // avoid some trouble when clicking on the block while zooming
        if (manager_content.zooming === false) {

            if (t.lightbox.isVisible ()) {

                t.lightbox.hide (); } else {
                t.lightbox.show (e.target);
            }
        }
    }
}
