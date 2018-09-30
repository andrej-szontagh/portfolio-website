
function GalleryImages (container, filepath_json, callback) {

    var t = this;

    t.container         = container;
    t.lightbox          = container.querySelector ("#lightbox");
    t.lightbox_img      = container.querySelector ("#lightbox-image");
    t.lightbox_visible  = false;

    t.lightbox.onclick = function (e) {

        t.hideLightbox ();
    };

    t.hideLightbox ();

    // Mansonry column layour

    // https://github.com/desandro/masonry
    // No simple solution for this ..

    t.layout = new Masonry ('#gallery-images', {

        itemSelector:       '.gallery-image',
        columnWidth:        '.gallery-image',
        percentPosition:    true,
        transitionDuration: 0,
        stagger:            0,
        resize:             true,
    });

    loadJSON (filepath_json, function (json) {

        for (var i = 0; i < json.images.length; i ++) {

            // console.log ("json.images [i] >> " + json.images [i]);

            var img = document.createElement ('img');

            // https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript

            var filename    = json.images [i];

            var base        = filename.split ('.').slice (0, -1).join ('.');
            var extension   = filename.substring (base.length, filename.length);

            // console.log ("FILE : " + base + " EXTENSION : " + extension);

            img.src         = base + "_tumbnail" + extension;
            img.className   = "gallery-image";

            // store full res image filename for lightbox (loads when opening lightbox)
            img.setAttribute ("src-lightbox", filename);

            img.onclick = function (e) {

                t.showLightbox (e.target);
            };

            t.container.appendChild (img);

            // as soon as image is loaded update the layout ..

            img.addEventListener ('load', function (e) {

                // console.log ("Image loaded > " + e.target);

                t.layout.appended (e.target);
                t.layout.layout (); // !!
            });

            img.addEventListener ('error', function () {

                // console.log ("Image load error > " + e.target);

                e.target.remove ();
                t.layout.layout (); // !!
            });
        }

        // images might not be loaded yet and layout not ready !
        callback ();
    });
};

GalleryImages.prototype = {

    constructor: GalleryImages,

    showLightbox: function (img) {

        this.lightbox.classList.remove  ("lightbox-hidden");
        this.lightbox.classList.add     ("lightbox-visible");

        this.lightbox_img.src = img.getAttribute ("src-lightbox");

        this.lightbox_visible = true;
    },

    hideLightbox: function () {

        this.lightbox.classList.remove  ("lightbox-visible");
        this.lightbox.classList.add     ("lightbox-hidden");

        this.lightbox_visible = false;
    },
}
