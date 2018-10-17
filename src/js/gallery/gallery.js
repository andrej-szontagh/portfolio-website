
function Gallery (manager_ui, manager_animations, filepath_json) {

    var t = this;

    // initialize YouTube API ASAP (for faster loading)
    YouTubeManager.init ();

    var desc = document.querySelector ("#description-block");

    t.desc_header   = desc.querySelector ("h1");
    t.desc_oneliner = desc.querySelector ("p");
    t.desc_tags     = desc.querySelector ("h3");

    loadJSON (filepath_json, function (json) {

        t.json = json;

        t.manager_videos = new GalleryVideos (document.getElementById ("gallery-videos"), json, manager_animations, 0.0);
        t.manager_images = new GalleryImages (document.getElementById ("gallery-images"), json,

            function () {

                // console.log ("Image Gallery Update");

                updateButtons ();
            }
        );

        updateButtons ();
    });

    function updateButtons () {

        var gallery_blocks = document.querySelectorAll (".gallery-block");

        if (gallery_blocks) {

            for (var i = 0; i < gallery_blocks.length; i ++) {

                var el = gallery_blocks [i];

                if (el.classList.contains   ("button-hover") == false) {
                    el.classList.add        ("button-hover");
                    el.classList.add        ("hidden");

                    el.setAttribute ("button-target",  "<this> #description-block");
                    el.setAttribute ("button-clear",   ".gallery-block");

                    el.addEventListener ('onvisible', function (e) {

                        var d, desc = null;

                        var id = e.target.id;

                        if (d = t.json.images [id]) desc = d.description; else
                        if (d = t.json.videos [id]) desc = d.description;

                        if (desc) {
                            desc = t.json.descriptions [desc];

                            if (desc) {

                                t.desc_header   .innerHTML = desc.name + "<br> (" + desc.year + ")";
                                t.desc_oneliner .innerHTML = desc.oneliner;
                                t.desc_tags     .innerHTML = "";

                                if (desc.tags) {

                                    for (var i = 0; i < desc.tags.length; i ++) {

                                        if (i > 0) {

                                            t.desc_tags.innerHTML += " - ";
                                        }

                                        t.desc_tags.innerHTML += desc.tags [i];
                                    }
                                }

                            } else {

                                t.desc_header   .innerHTML = "";
                                t.desc_oneliner .innerHTML = "";
                                t.desc_tags     .innerHTML = "";
                            }
                        }
                    });

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

    desc_header:        null,
    desc_oneliner:      null,
    desc_tags:          null,

    showLightbox: function (img) {

        // console.log ("showLightbox");

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

        // console.log ("hideLightbox");

        /*
        this.lightbox.classList.remove  ("lightbox-visible");
        this.lightbox.classList.add     ("lightbox-hidden");

        this.lightbox_visible = false;
        */
    },

}
