
function GalleryImages (container, filepath_json, callback_init, callback_update) {

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

        itemSelector:       '.gallery-block',
        columnWidth:        '.gallery-block',
        percentPosition:    true,
        // horizontalOrder:    true,
        transitionDuration: 0,
        stagger:            0,
        resize:             true,
    });

    loadJSON (filepath_json, function (json) {

        addNextImage (0);

        function addNextImage (index) {

            if (index < json.images.length) {

                var filename    = json.images [index];

                // https://stackoverflow.com/questions/4250364/how-to-trim-a-file-extension-from-a-string-in-javascript

                var base        = filename.split ('.').slice (0, -1).join ('.');
                var extension   = filename.substring (base.length, filename.length);

                // console.log ("FILE : " + base + " EXTENSION : " + extension);

                var src         = base + "_tumbnail" + extension;
                var src_fullres = filename;

                t.addImage (src, src_fullres, function () {

                    callback_update ();

                    addNextImage (++ index);
                });
            }
        }

        // images might not be loaded yet and layout not ready !
        callback_init ();
    });
};

GalleryImages.prototype = {

    constructor: GalleryImages,

    addImage: function (src, src_fullres, callback) {

        var t = this;

        var wrapper     = document.createElement ('div');
        var img         = document.createElement ('img');

        wrapper.className = "gallery-block";

        // store full res image filename for lightbox (loads when opening lightbox)
        img.setAttribute ("src",            src);
        img.setAttribute ("src-lightbox",   src_fullres);

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
    },

    showLightbox: function (img) {

        this.lightbox.classList.remove  ("lightbox-hidden");
        this.lightbox.classList.add     ("lightbox-visible");

        // Set low-res image first (which suppose to be already loaded)
        // and after showing up start loading actuall hi-res image

        this.lightbox_img.setAttribute ("src",      img.getAttribute ("src"));
        this.lightbox_img.setAttribute ("src-lazy", img.getAttribute ("src-lightbox"));

        this.lightbox_img.onload = function (e) {

            var img = e.target;

            img.src = img.getAttribute ("src-lazy");
        }

        // TODO:
        // body.classList.add ("noscroll");
        // call it from some UI function

        this.lightbox_visible = true;
    },

    hideLightbox: function () {

        this.lightbox.classList.remove  ("lightbox-visible");
        this.lightbox.classList.add     ("lightbox-hidden");

        // TODO:
        // body.classList.remove ("noscroll");
        // call it from some UI function

        this.lightbox_visible = false;
    },
}
