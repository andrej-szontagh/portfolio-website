
/* global Utils */
/* global Masonry */
/* global manager_content */

class GalleryImages {

    constructor (container, json, callback_update) {

        let t = this;

        t.json      = json;
        t.container = container;

        // Mansonry column layour

        // https://github.com/desandro/masonry
        // No simple solution for this ..

        t.layout = new Masonry ("#gallery-images", {

            itemSelector:       ".gallery-block",
            columnWidth:        ".gallery-block",
            percentPosition:    true,
            // horizontalOrder:    true,
            transitionDuration: 0,
            stagger:            0,
            resize:             true,
        });

        t.layout.on ("layoutComplete", function (items) {

            // this might be called too early so safety check ..
            if (manager_content.content) {
                manager_content.content.dispatchEvent (new Event ("layoutComplete", { detail: items}));
            }
        });

        // make an array of image json objects to form a loading queue

        t.loadstack = [];

        Utils.forEachObject (json.images, function (id, data, i) {

            t.loadstack.push ({ id, data });
        });

        function addNextImage (index) {

            if (index < t.loadstack.length) {

                let id          = t.loadstack [index].id;
                let filename    = json.filebase_images + id;

                // https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript

                let base        = filename.split (".").slice (0, -1).join (".");
                let extension   = filename.substring (base.length, filename.length);

                // console.log ("FILE : " + base + " EXTENSION : " + extension);

                let src         = base + "_tumbnail" + extension;
                let src_fullres = filename;

                t.addImage (id, src, src_fullres, function () {

                    callback_update ();

                    addNextImage (++ index);
                });
            }
        }

        addNextImage (0);
    }

    addImage (id, src, src_fullres, callback) {

        let t = this;

        let wrapper     = document.createElement ("div");
        let img         = document.createElement ("img");

        wrapper.id          = id;
        wrapper.className   = "gallery-block";

        // store full res image filename for lightbox (loads when opening lightbox)
        img.setAttribute ("src",            src);
        img.setAttribute ("src-lightbox",   src_fullres);
        img.setAttribute ("srcset",         src + " 500w, " + src_fullres + " 1000w");

        wrapper     .appendChild (img);
        t.container .appendChild (wrapper);

        // as soon as image is loaded update the layout ..

        img.addEventListener ("load", function (e) {

            // console.log ("Image loaded > " + e.target);

            t.layout.appended (e.target.parentNode);
            t.layout.layout (); // !!

            callback ();
        });

        img.addEventListener ("error", function (e) {

            // console.log ("Image load error > " + e.target);

            e.target.remove ();
            t.layout.layout (); // !!

            callback ();
        });
    }
}
