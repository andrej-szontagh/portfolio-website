
class ContentCrop extends ContentBase {

    constructor () {

        super ();

        var t = this;

        t.crop_scrolltop    = 0;
        t.cropped           = false;
    }

    cropIn (margin_top, margin_bottom) {

        var t = this;

        // IMPORTANT: this is performance optimization (FireFox)

        var r = t.content_transform.getBoundingClientRect ();

        t.crop_scrolltop = document.scrollingElement.scrollTop;

        // crop the content (firefox optimization)
        t.content_transform .style.height   = "calc(100vh + " + (margin_top + margin_bottom) + "px)";
        t.content           .style.top      = (- (t.crop_scrolltop - margin_top)) + "px";

        document.scrollingElement.scrollTop = margin_top;

        body.classList.add ("has-crop");

        t.cropped = true;
    }

    cropOut () {

        var t = this;

        // WARNING:     this causes horrible lag, make sure not animating
        // IMPORTANT:   this is performance optimization (FireFox)

        // turn off the crop of the content (firefox optimization)
        t.content_transform .style.height   = null;
        t.content           .style.top      = null;

        document.scrollingElement.scrollTop = t.crop_scrolltop;

        body.classList.remove ("has-crop");

        t.crop_scrolltop = -1;

        t.cropped = false;
    }
}
