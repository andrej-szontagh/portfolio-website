
/* global Gallery */

class ContentBase {

    constructor () {

        let t = this;

        t.content_overflow  = document.getElementById ("content-overflow");
        t.content_transform = document.getElementById ("content-transform");
        t.content           = document.getElementById ("content");

        t.gallery = new Gallery ("data/gallery.json");
    }
}
