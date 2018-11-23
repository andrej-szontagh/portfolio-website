
class Gallery {

    constructor (filepath_json) {

        let t = this;

        // initialize YouTube API ASAP (for faster loading)
        YouTube.init ();

        t.manager_videos    = null;
        t.manager_images    = null;

        t.lightbox          = null;

        t.desc              = document.getElementById ("label-description");
        t.container         = document.getElementById ("content-transform");

        t.desc_header       = t.desc.querySelector ("h1");
        t.desc_oneliner     = t.desc.querySelector ("p");
        t.desc_tags         = t.desc.querySelector ("h3");

        loadJSON (filepath_json, function (json) {

            t.json = json;

            t.manager_videos = new GalleryVideos (document.getElementById ("gallery-videos"), json, manager_animations, 0.0);
            t.manager_images = new GalleryImages (document.getElementById ("gallery-images"), json,

                function () {

                    // console.log ("Image Gallery Update");

                    updateButtons ();
                }
            );

            t.lightbox = new GalleryLightbox (json);

            updateButtons ();
        });

        function updateButtons () {

            let gallery_blocks = document.querySelectorAll (".gallery-block");

            if (gallery_blocks) {

                for (let i = 0; i < gallery_blocks.length; i ++) {

                    let el = gallery_blocks [i];

                    if (el.classList.contains   ("button-hover") == false) {
                        el.classList.add        ("button-hover");
                        el.classList.add        ("hidden");

                        el.setAttribute ("button-target",  "<this> #label-description");
                        el.setAttribute ("button-clear",   ".gallery-block");

                        el.addEventListener ("onvisible", function (e) {

                            let d, desc = null;

                            let id = e.target.id;

                            if (d = t.json.images [id]) desc = d.description; else
                            if (d = t.json.videos [id]) desc = d.description;

                            if (desc) {
                                desc = t.json.descriptions [desc];

                                if (desc) {

                                    t.desc_header   .innerHTML = desc.name + "<br> (" + desc.year + ")";
                                    t.desc_oneliner .innerHTML = desc.oneliner;
                                    t.desc_tags     .innerHTML = "";

                                    if (desc.tags) {

                                        for (let i = 0; i < desc.tags.length; i ++) {

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

                        el.___callback_open = function (e) {

                            // avoid some trouble when clicking on the block while zooming
                            if (manager_content.zooming === false) {

                                if (t.lightbox.isVisible ()) {

                                    t.lightbox.hide (); } else {
                                    t.lightbox.show (e.target);
                                }
                            }
                        }
                    }
                }
            }

            manager_buttons.updateButtons ();
        }
    }
}
