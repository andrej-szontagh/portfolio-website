
class Mechanics {

    constructor () {

        let t = this;

        // build the email
        {
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

        // add body class add ability to adjust CSS in entire hierarchy
        {
            let bodytags = {

                "screen"    : "has-screen"
                // "popup"     : "has-popup"
            };

            let query = "";

            let index = 0;
            for (let key in bodytags) {

                if (bodytags.hasOwnProperty (key)) {

                    if (index ++ > 0) query += ", ";

                    query += "." + key;
                }
            }

            // console.log ("bodytags query > " + query);

            let elements = document.querySelectorAll (query);

            for (let i = 0; i < elements.length; i ++) {

                let el = elements [i];

                el.addEventListener ('onhidden', function (e) {
                    for (let key in bodytags) {
                        if (bodytags.hasOwnProperty (key)) {
                            if (e.target.classList.contains (key)) {
                                body.classList.remove (bodytags [key]);
                            }
                        }
                    }
                }, false);

                el.addEventListener ('onvisible', function (e) {
                    for (let key in bodytags) {
                        if (bodytags.hasOwnProperty (key)) {
                            if (e.target.classList.contains (key)) {
                                body.classList.add (bodytags [key]);
                            }
                        }
                    }
                }, false);
            }
        }

        // reset scrolls when screen visible
        {
            let elements = document.querySelectorAll (".screen");

            for (let i = 0; i < elements.length; i ++) {

                let el = elements [i];

                el.addEventListener ('onvisible', function (e) {

                    let scroll = e.target.querySelector (".scroll");
                    if (scroll) {

                        // scroll to top !
                        scroll.parentNode.scrollTop = 0;
                    }

                }, false);
            }
        }

        // update custom CSS property for scroll elements to add ability to modify CSS depending on scroll position
        {
            let elements = document.querySelectorAll (".scroll");

            for (let i = 0; i < elements.length; i ++) {

                let el = elements [i];

                let cs = window.getComputedStyle (el);

                let scroll_pos_min = cs.getPropertyValue ('--scroll-pos-min');
                let scroll_pos_max = cs.getPropertyValue ('--scroll-pos-max');

                scroll_pos_min = (scroll_pos_min) ? parseFloat (scroll_pos_min) : 0.0;
                scroll_pos_max = (scroll_pos_max) ? parseFloat (scroll_pos_max) : 1.0;

                function onScroll (e) {

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
                }

                el.parentNode.addEventListener ("scroll", onScroll);
            }
        }
    }
}
