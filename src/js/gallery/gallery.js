
function Gallery (manager_ui, manager_animations) {

    var t = this;

    t.manager_videos = new GalleryVideos (

        document.getElementById ("gallery-videos"), "data/gallery-videos.json", manager_animations, 0.0,

        function () {

            console.log ("Video Gallery Initialized");
        }
    );

    t.manager_images = new GalleryImages (

        document.getElementById ("gallery-images"), "data/gallery-images.json",

        function () {

            console.log ("Image Gallery Initialized");
        },

        function () {

            console.log ("Image Gallery Update");

            updateButtons ();
        }
    );

    updateButtons ();

    function updateButtons () {

        var gallery_blocks = document.querySelectorAll (".gallery-block");

        if (gallery_blocks) {

            for (var i = 0; i < gallery_blocks.length; i ++) {

                var el = gallery_blocks [i];

                if (el.classList.contains   ("button-hover") == false) {
                    el.classList.add        ("button-hover");
                    el.classList.add        ("hidden");

                    el.setAttribute ("button-target",  "<this>");
                    el.setAttribute ("button-clear",   ".gallery-block");

                    el.___callback_open_lightbox = function (e) {

                        if (e.target.parentNode.id === "gallery-images") {

                            // console.log ("LIGHTBOX >> OPEN >> IMAGE LIGHTBOX");

                            t.manager_images.showLightbox (e.target.querySelector ("img"));

                        } else
                        if (e.target.parentNode.id === "gallery-videos") {

                            // console.log ("LIGHTBOX >> OPEN >> VIDEO LIGHTBOX");
                        }
                    }
                }
            }
        }

        manager_ui.updateButtons ();
    }
};

Gallery.prototype = {

    constructor:        Gallery,

    manager_videos:     null,
    manager_images:     null,

    showLightbox: function (img) {

        console.log ("showLightbox");

        /*
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

        this.lightbox_visible = true;
        */
    },

    hideLightbox: function () {

        console.log ("hideLightbox");

        /*
        this.lightbox.classList.remove  ("lightbox-visible");
        this.lightbox.classList.add     ("lightbox-hidden");

        this.lightbox_visible = false;
        */
    },

}
