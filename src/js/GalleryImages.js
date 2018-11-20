
class GalleryImages {

    constructor (container, json, callback_update) {

        var t = this;

        t.json      = json;
        t.container = container;

        // Mansonry column layour

        // https://github.com/desandro/masonry
        // No simple solution for this ..

        t.layout = new Masonry ('#gallery-images', {

            itemSelector:       '.gallery-block',
            columnWidth:        '.gallery-block',
            percentPosition:    true,
            // horizontalOrder:    true,
            transitionDuration: 0,
            stagger:            0,
            resize:             true,
        });

        t.layout.on ('layoutComplete', function (items) {

            // this might be called too early so safety check ..
            if (manager_content.content) {
                manager_content.content.dispatchEvent (new Event ('layoutComplete', { detail: items}));
            }
        });

        // make an array of image json objects to form a loading queue

        t.loadstack = [];

        for (var img in json.images) {

            // check if the property/key is defined in the object itself, not in parent
            if (json.images.hasOwnProperty (img)) {

                t.loadstack.push ({id:img, data:json.images [img]});
            }
        }

        addNextImage (0);

        function addNextImage (index) {

            if (index < t.loadstack.length) {

                var id          = t.loadstack [index].id;
                var filename    = json.filebase_images + id;

                // https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript

                var base        = filename.split ('.').slice (0, -1).join ('.');
                var extension   = filename.substring (base.length, filename.length);

                // console.log ("FILE : " + base + " EXTENSION : " + extension);

                var src         = base + "_tumbnail" + extension;
                var src_fullres = filename;

                t.addImage (id, src, src_fullres, function () {

                    callback_update ();

                    addNextImage (++ index);
                });
            }
        }
    }

    addImage (id, src, src_fullres, callback) {

        var t = this;

        var wrapper     = document.createElement ('div');
        var img         = document.createElement ('img');

        wrapper.id          = id;
        wrapper.className   = "gallery-block";

        // store full res image filename for lightbox (loads when opening lightbox)
        img.setAttribute ("src",            src);
        img.setAttribute ("src-lightbox",   src_fullres);
        img.setAttribute ("srcset",         src + " 500w, " + src_fullres + " 1000w");

        wrapper     .appendChild (img);
        t.container .appendChild (wrapper);

        // as soon as image is loaded update the layout ..

        img.addEventListener ('load', function (e) {

            // console.log ("Image loaded > " + e.target);

            t.layout.appended (e.target.parentNode);
            t.layout.layout (); // !!

            callback ();
        });

        img.addEventListener ('error', function () {

            // console.log ("Image load error > " + e.target);

            e.target.remove ();
            t.layout.layout (); // !!

            callback ();
        });
    }
}
