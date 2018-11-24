
/* global GOLDEN_RATIO_SQRT */
/* global ContentCrop */
/* global body */

class ContentZoom extends ContentCrop {

    constructor () {

        super ();

        let t = this;

        t.zoomed_at = null;
        t.zooming   = false;

        function onResize (e) {

            // console.log ("onResize");

            if (t.zoomed_at) {

                let target = t.zoomed_at;

                // no transitions !
                t.content_transform.style.transition = "none";

                t.zoomOut ();

                let c = t.content_transform .getBoundingClientRect ();
                let r = target              .getBoundingClientRect ();

                let h = window.innerHeight;
                let w = window.innerWidth;

                document.documentElement.scrollTop = r.top - c.top - (h - r.height)*0.5;

                t.zoomIn (target);

                t.content_transform.style.transition = null;
            }
        }

        window.addEventListener ("resize", function (e) {

            // console.log ("resize");

            t.content.addEventListener ("layoutComplete", function listener (e) {

                e.target.removeEventListener (e.type, listener);

                // there is still something going on
                // content proportions are not correct
                // (a bit smaller height than it suppose to be)
                // it looks like this approach works so far ..

                requestAnimationFrame (function () {

                    onResize (e);
                });
            });
        });
    }

    zoomIn (element, callback) {

        let t = this;

        let h = window.innerHeight;
        let w = window.innerWidth;

        let r = element.getBoundingClientRect ();

        let border_top      = (r.top    < 0) ? -r.top           : 0;
        let border_bottom   = (r.bottom > h) ? (r.bottom - h)   : 0;

        // console.log ("border_top    >> " + border_top);
        // console.log ("border_bottom >> " + border_bottom);

        t.cropIn (border_top, border_bottom);

        let cx  = r.left   + r.width  * 0.5;
        let cy  = r.top    + r.height * 0.5;

        // adjust scale depending on the size of the block

        let mins    = GOLDEN_RATIO_SQRT;
        let minsw   = mins * r.width    / w;
        let minsh   = mins * r.height   / h;

        let s   = Math.max (
                    (w * Math.max (0.75, minsw)) / r.width,
                    (h * Math.max (0.75, minsh)) / r.height);

        let tx  = w * 0.5 - cx;
        let ty  = h * 0.5 - cy;

        let rot = 5.0;

        cy += border_top;

        t.content_transform.style.transform         = "translateX(" + tx + "px) translateY(" + ty + "px) scale(" + s + ") rotate(" + rot + "deg)";
        t.content_transform.style.transformOrigin   = cx + "px " + cy + "px ";

        t.content_transform.classList.add ("focusing");

        t.content_transform.addEventListener ("animationend", function listener (e) {

            if (e.target        === t.content_transform &&
                e.animationName === "focusing") {

                e.target.removeEventListener (e.type, listener);

                t.content_transform.classList.remove ("focusing");
            }
        });

        // // scaled box ..
        // let n_top     = s*(r.top    - cy) + cy;
        // let n_bottom  = s*(r.bottom - cy) + cy;
        // let n_left    = s*(r.left   - cx) + cx;
        // let n_right   = s*(r.right  - cx) + cx;
        //
        // let overflow_left   = (n_left   < 0);
        // let overflow_right  = (n_right  > w);
        // let overflow_top    = (n_top    < 0);
        // let overflow_bottom = (n_bottom > h);
        //
        // // change the focus of zoom depending on the overflow
        //
        // // in the case both are overflowing keep center ..
        // if (overflow_left       && !overflow_right)     cx = r.left;
        // if (overflow_right      && !overflow_left)      cx = r.right;
        //
        // // in the case both are overflowing keep center ..
        // if (overflow_top        && !overflow_bottom)    cy = r.top;
        // if (overflow_bottom     && !overflow_top)       cy = r.bottom;
        //
        // // update scaled box ..
        // n_top     = s*(r.top    - cy) + cy;
        // n_bottom  = s*(r.bottom - cy) + cy;
        // n_left    = s*(r.left   - cx) + cx;
        // n_right   = s*(r.right  - cx) + cx;
        //
        // overflow_left   = (n_left   < 0);
        // overflow_right  = (n_right  > w);
        // overflow_top    = (n_top    < 0);
        // overflow_bottom = (n_bottom > h);
        //
        // ty = 0;
        //
        // // in the case both are overflowing keep center ..
        // if (overflow_top        && !overflow_bottom)    ty = -n_top;
        // if (overflow_bottom     && !overflow_top)       ty = -n_bottom + h;
        //
        // // now transform into transformed "content_transform" coordinates
        // if (!t.cropped) {
        //
        //     let cr = t.content_transform.getBoundingClientRect ();
        //
        //     cx -= cr.left;
        //     cy -= cr.top;
        // }
        //
        // cy += border_top;
        //
        // // let rot = cx / w;
        // let rot = 5.0;
        //
        // t.content_transform.style.transform         = "translateX(" + tx + "px) translateY(" + ty + "px) scale(" + s + ") rotate(" + rot + "deg)";
        // t.content_transform.style.transformOrigin   = cx + "px " + cy + "px ";

        body.classList.add ("has-zoom");

        t.zoomed_at = element;
        t.zooming   = true;

        // position details strip relative to the block ..
        // t.lightbox_details.style.left   = "calc(15% * " + (r.width  *s / w) + " + " + Math.max (n_left,              0) + "px)";
        // t.lightbox_details.style.bottom = "calc(18% * " + (r.height *s / h) + " + " + Math.max (h - n_bottom - v,    0) + "px)";

        if (callback) {

            body.classList.add ("is-zooming-in");

            t.content_transform.addEventListener ("transitionend", function listener (e) {

                // console.log ("e.propertyName >> " + e.propertyName);

                if (e.target        === t.content_transform &&
                    e.propertyName  === "transform") {

                    e.target.removeEventListener (e.type, listener);

                    body.classList.remove ("is-zooming-in");

                    t.zooming = false;

                    callback (e);
                }
            });

        } else {

            t.zooming = false;
        }
    }

    zoomOut (callback) {

        let t = this;

        if (t.zoomed_at) {
            t.content_transform.style.transform = null;

            t.content_transform.classList.add ("focusing");

            t.content_transform.addEventListener ("animationend", function listener (e) {

                if (e.target        === t.content_transform &&
                    e.animationName === "focusing") {

                    e.target.removeEventListener (e.type, listener);

                    t.content_transform.classList.remove ("focusing");
                }
            });
        }

        t.zooming = true;

        if (callback) {

            body.classList.add ("is-zooming-out");

            t.content_transform.addEventListener ("transitionend", function listener (e) {

                // console.log ("e.propertyName >> " + e.propertyName);

                if (e.target        === t.content_transform &&
                    e.propertyName  === "transform") {

                    e.target.removeEventListener (e.type, listener);

                    // // avoid cropping out while animating, wait for transition to end
                    // document.getElementById ("ui").addEventListener ("transitionend", function listener (e) {
                    //
                    //     if (e.propertyName === "filter") {
                    //
                    //         e.target.removeEventListener (e.type, listener);
                    //
                    //         t.zooming = false;
                    //
                    //         t.cropOut ();
                    //
                    //         if (callback) {
                    //             callback (e);
                    //         }
                    //     }
                    // });

                    t.zooming   = false;
                    t.zoomed_at = null;

                    body.classList.remove ("is-zooming-out");
                    body.classList.remove ("has-zoom");

                    t.cropOut ();

                    callback (e);
                }
            });

        } else {

            t.zooming   = false;
            t.zoomed_at = null;

            body.classList.remove ("has-zoom");

            t.cropOut ();
        }
    }
}
