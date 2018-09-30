
function UI () {

    // console.log ("init UI");

    var t = this;

    t.ui        = document.getElementById ("ui");
    t.overlay   = document.getElementById ("overlay");

    t.ui_links      = t.ui.querySelector ("#external-links");
    t.ui_contact_a  = t.ui.querySelector ("#contact a");

    // build the email
    {
        var email_link      = t.ui.querySelector ("#contact a");
        var email_banner    = t.ui.querySelector ("#contact #email");

        var email_name_1    = "andrej";
        var email_name_2    = "szontagh";
        var email_serv_1    = "gmail";
        var email_serv_2    = "com";

        email_link.href = "mailto:" +
            email_name_1 + "." + email_name_2 + "@" +
            email_serv_1 + "." + email_serv_2;

        // \u200B is zero width space that will allow desired work breaking behaviour
        email_banner.innerHTML =
            email_name_1 + "\u200B.\u200B" + email_name_2 + " \u200B@ \u200B" +
            email_serv_1 + "\u200B.\u200B" + email_serv_2;
    }

    // button mechanics ..
    {
        function parseButtonStateRef (el) {

            var attr = el.getAttribute ("button-state");

            if (attr) {
                attr = attr.trim ();
            }

            if (
                attr &&
                attr !== ""     &&
                attr !== "on"   &&
                attr !== "off"  &&
                (attr.charAt (0)                === '{') &&
                (attr.charAt (attr.length - 1)  === '}')
            ){

                attr = attr.substring (1, attr.length - 1);

                return attr;
            }

            return null;
        }

        function setButtonState (el, state) {

            var attr = parseButtonStateRef (el);

            if (attr !== null) {

                var targets = t.ui.querySelectorAll (attr);

                if (targets) {

                    for (var i = 0; i < targets.length; i ++) {

                        var target = targets [i];

                        target.setAttribute ("button-state", state);

                        // console.log ("Button : " + target.id + " Ref. State > " + attr);
                    }
                }

            } else {

                // console.log ("Button : " + el.id + " State > " + state);

                el.setAttribute ("button-state", state);
            }
        }

        function getButtonState (el) {

            var attr = parseButtonStateRef (el);

            // console.log ("getButtonState > parseButtonStateRef > " + attr);

            if (attr !== null) {

                var target = t.ui.querySelector (attr);

                if (target) {

                    return target.getAttribute ("button-state");
                }

            } else {

                return el.getAttribute ("button-state");
            }
        }

        function showButtonTargets (el, attr, on) {

            var sel = el.getAttribute (attr);

            if (sel) {

                var targets = t.ui.querySelectorAll (sel);

                if (targets != null) {

                    for (var i = 0; i < targets.length; i ++) {

                        var target = targets [i];

                        if (on) {

                            target.classList.remove ("hidden");
                            target.classList.add    ("visible");

                            target.dispatchEvent (new Event ('onvisible'));

                        } else {

                            target.classList.remove ("visible");
                            target.classList.add    ("hidden");

                            target.dispatchEvent (new Event ('onhidden'));
                        }
                    }
                }
            }
        }

        // HOVER BUTTONS >>
        {
            var buttons = t.ui.querySelectorAll (".button-hover");

            for (var i = 0; i < buttons.length; i ++) {

                var b = buttons [i];

                b.addEventListener ("mouseenter", function (e) {

                    setButtonState      (e.target, "on");
                    showButtonTargets   (e.target, "button-target", true);
                });

                b.addEventListener ("mouseleave", function (e) {

                    setButtonState      (e.target, "off");
                    showButtonTargets   (e.target, "button-target", false);
                });
            }
        }

        // PRESS BUTTONS >>
        {
            var buttons = t.ui.querySelectorAll (".button-press");

            for (var i = 0; i < buttons.length; i ++) {

                var b = buttons [i];

                //b.addEventListener ("click", function (e) {
                b.addEventListener ("mousedown", function (e) {

                    var el = e.target;

                    var state = getButtonState (el);

                    if (state === "on") {

                        setButtonState      (el, "off");
                        showButtonTargets   (el, "button-target", false);

                    } else
                    if (state === "off" || state === "") {

                        setButtonState      (el, "on");
                        showButtonTargets   (el, "button-target", true);
                    }
                });
            }
        }

        {
            // special case .. for disabling main content scrolling

            var el      = document.getElementById ("terms-conditions-block");
            var body    = document.getElementsByTagName ("BODY")[0];

            el.addEventListener ('onvisible',   function (e) { body.classList.add       ("noscroll"); }, false);
            el.addEventListener ('onhidden',    function (e) { body.classList.remove    ("noscroll"); }, false);
        }
    }
}

UI.prototype = {

    constructor:    UI,

    overlay:        null,
    ui:             null,
}
