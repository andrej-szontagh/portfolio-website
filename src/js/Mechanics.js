
/* global Utils */
/* global body */

class Mechanics {

    constructor () {

        let t = this;

        // I am not fan of this, but to make the Codacy happy
        // I made single call functions ..

        // build the email
        t.initEmailBanner ();

        // add body class add ability to adjust CSS in entire hierarchy
        t.initBodyTagSystem ();

        // reset scrolls when screen visible
        t.initScrollReset ();

        // update custom CSS property for scroll elements to add ability to
        // modify CSS depending on scroll position
        t.initScrollCSSVar ();
    }

    initEmailBanner () {

        // build the email banner

        let t = this;

        let email_button    = body  .querySelector ("#button-contact");
        let email_banner    = body  .querySelector ("#label-email");

        let email_name_1    = "andrej";
        let email_name_2    = "szontagh";
        let email_serv_1    = "gmail";
        let email_serv_2    = "com";

        email_button.href = "mailto:" +
            email_name_1 + "." + email_name_2 + "@" +
            email_serv_1 + "." + email_serv_2;

        // \u200B is zero width space that will allow desired work breaking behaviour
        email_banner.innerHTML =
            email_name_1 + "\u200B.\u200B" + email_name_2 + " \u200B@ \u200B" +
            email_serv_1 + "\u200B.\u200B" + email_serv_2;
    }

    initBodyTagSystem () {

        // add body class add ability to adjust CSS in entire hierarchy

        let t = this;

        let bodytags = {

            "screen"    : "has-screen"
            // "popup"     : "has-popup"
        };

        let query = "";

        let index = 0;

        Utils.forEachObject (bodytags, function (k, v, i) {

            if (i > 0) {
                query += ", ";
            }

            query += "." + k;
        });

        // console.log ("bodytags query > " + query);

        function onHidden (e) {

            Utils.forEachObject (bodytags, function (k, v, i) {

                if (e.target.classList.contains (k)) {

                    body.classList.remove (v);
                }
            });
        }

        function onVisible (e) {

            Utils.forEachObject (bodytags, function (k, v, i) {

                if (e.target.classList.contains (k)) {

                    body.classList.add (v);
                }
            });
        }

        Utils.forEachNodeList (document.querySelectorAll (query), function (el, i) {

            el.addEventListener ("onhidden",    onHidden,   false);
            el.addEventListener ("onvisible",   onVisible,  false);
        });
    }

    initScrollReset () {

        // reset scrolls when screen visible

        let t = this;

        function onVisible (e) {

            let scroll = e.target.querySelector (".scroll");
            if (scroll) {

                // scroll to top !
                scroll.parentNode.scrollTop = 0;
            }
        }

        Utils.forEachNodeList (document.querySelectorAll (".screen"), function (el, i) {

            el.addEventListener ("onvisible", onVisible, false);
        });
    }

    initScrollCSSVar () {

        // update custom CSS property for scroll elements to add ability to modify CSS depending on scroll position

        let t = this;

        Utils.forEachNodeList (document.querySelectorAll (".scroll"), function (el, i) {

            let cs = window.getComputedStyle (el);

            let scroll_pos_min = cs.getPropertyValue ("--scroll-pos-min");
            let scroll_pos_max = cs.getPropertyValue ("--scroll-pos-max");

            scroll_pos_min = (scroll_pos_min) ? parseFloat (scroll_pos_min) : 0.0;
            scroll_pos_max = (scroll_pos_max) ? parseFloat (scroll_pos_max) : 1.0;

            let on_scroll = function onScroll (e) {

                // viewport height
                let h = window.innerHeight;

                // elements bounding rect in viewport coordinates
                let r = el.getBoundingClientRect ();

                let pos = (r.height > h) ? (Math.abs (r.top) / (r.height - h)) : (0);

                // console.log ("top       : " + r.top);
                // console.log ("height    : " + r.height);
                // console.log ("window    : " + h);
                // console.log ("pos       : " + pos);

                pos = Math.min (Math.max ((pos - scroll_pos_min) / (scroll_pos_max - scroll_pos_min), 0.0), 1.0);

                el.style.setProperty ("--scroll-pos", pos);
            };

            el.parentNode.addEventListener ("scroll", on_scroll);
        });
    }
}
