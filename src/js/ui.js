
function UI () {

    // console.log ("init UI");

    var t = this;

    t.ui    = document.getElementById ("ui");
    t.body  = document.getElementsByTagName ("BODY")[0];

    // detect touch device !

    // https://codeburst.io/the-only-way-to-detect-touch-with-javascript-7791a3346685

    // this seems to be the only realiable method since you still can have devices supporting and
    // actively using both touch and other pointer devices so the only way to know for sure that the user is
    // going to touch is to use listen for actual touch events.

    // problem with this method is that we don't know until user touches ..

    window.addEventListener ('touchstart', function onFirstTouch () {

        console.log ("User touched !");

        t.touch = true;

        t.updateButtons ();

        // we only need to know once that a human touched the screen, so we can stop listening now
        window.removeEventListener ('touchstart', onFirstTouch, false);

    }, false);

    t.updateButtons ();

    // build the email
    {
        var email_button    = t.ui.querySelector ("#contact-button");
        var email_banner    = t.ui.querySelector ("#contact-email");

        var email_name_1    = "andrej";
        var email_name_2    = "szontagh";
        var email_serv_1    = "gmail";
        var email_serv_2    = "com";

        email_button.href = "mailto:" +
            email_name_1 + "." + email_name_2 + "@" +
            email_serv_1 + "." + email_serv_2;

        // \u200B is zero width space that will allow desired work breaking behaviour
        email_banner.innerHTML =
            email_name_1 + "\u200B.\u200B" + email_name_2 + " \u200B@ \u200B" +
            email_serv_1 + "\u200B.\u200B" + email_serv_2;
    }

    // set css classes on overlay
    {
        var el = document.getElementById ("overlay");

        el.addEventListener ('onvisible', function (e) {

            t.ui    .classList.add ("overlay");
            t.body  .classList.add ("noscroll");

        }, false);

        el.addEventListener ('onhidden', function (e) {

            t.ui    .classList.remove ("overlay");
            t.body  .classList.remove ("noscroll");

        }, false);
    }
}

UI.prototype = {

    constructor:    UI,

    touch:          false,  // touch device ?

    body:           null,
    ui:             null,

    parseButtonStateRef: function (el) {

        var out = {

            value:              null,
            value_ext:          null,
            value_readonly:     false,
        };

        var attr = el.getAttribute ("button-state");

        if (attr) {
            attr = attr.trim ();

            if (attr && attr.length > 0 &&
                (attr.charAt (0)                === '[') &&
                (attr.charAt (attr.length - 1)  === ']')
            ){
                attr = attr.substring (1, attr.length - 1);

                out.value_readonly = true;
            }

            if (attr === "on")                  out.value = "on";
            if (attr === "off" || attr === "")  out.value = "off";

            if (attr && attr.length > 0 &&
                (attr.charAt (0)                === '{') &&
                (attr.charAt (attr.length - 1)  === '}')
            ){
                attr = attr.substring (1, attr.length - 1);

                out.value_ext = attr;
            }
        }

        return out;
    },

    setButtonState: function (el, state, propagate) {

        // unfortunately out JS minifier doesn't support ES6 so
        // this is the way to handle optional parameters ..

        propagate = (typeof propagate === 'undefined') ? true : propagate;

        var t = this;

        // safety check
        if (el.classList.contains ("button-hover") ||
            el.classList.contains ("button-press")) {

            var button_state = t.parseButtonStateRef (el);

            if (!button_state.value_readonly) {

                /*
                if (propagate === true) {

                    if (button_state.value_ext) {

                        var targets = t.body.querySelectorAll (button_state.value_ext);

                        for (var i = 0; i < targets.length; i ++) {

                            t.setButtonState (targets [i], state, false);
                        }
                    }
                }
                */

                // console.log ("Button : " + el.id + " State > " + state);

                el.setAttribute ("button-state", state);
            }

            // clear buttons selected by "button-clear" attribute

            if (propagate === true) {

                var button_clear = el.getAttribute ("button-clear");

                if (button_clear !== null) {

                    var targets = t.body.querySelectorAll (button_clear);

                    for (var i = 0; i < targets.length; i ++) {

                        if (targets [i] !== el) {

                            if (t.getButtonState (targets [i]) === "on") {
                                t.setButtonState (targets [i], "off", false);
                            }
                        }
                    }
                }
            }

            if (state === "on") {

                if (propagate === true) {

                    var button_set = el.getAttribute ("button-set-on");

                    if (button_set !== null) {

                        var targets = t.body.querySelectorAll (button_set);

                        for (var i = 0; i < targets.length; i ++) {

                            if (targets [i] !== el) {

                                t.setButtonState (targets [i], state, false);
                            }
                        }
                    }
                }

                t.showButtonTargets (el, "button-target", true);
            }

            if (state === "off") {

                if (propagate === true) {

                    var button_set = el.getAttribute ("button-set-off");

                    if (button_set !== null) {

                        var targets = t.body.querySelectorAll (button_set);

                        for (var i = 0; i < targets.length; i ++) {

                            if (targets [i] !== el) {

                                t.setButtonState (targets [i], state, false);
                            }
                        }
                    }
                }

                t.showButtonTargets (el, "button-target", false);
            }
        }
    },

    getButtonState: function (el) {

        var t = this;

        var button_state = this.parseButtonStateRef (el);

        // console.log ("getButtonState > parseButtonStateRef > " + attr);

        if (button_state.value === "on" ||
            button_state.value === "off") {

            return button_state.value;

        } else
        if (button_state.value_ext !== null) {

            var target = t.body.querySelector (attr);

            if (target) {

                var button_state_ext = this.parseButtonStateRef (target);

                if (button_state_ext.value === "on" ||
                    button_state_ext.value === "off") {

                    return button_state_ext.value;
                }
            }
        }

        return "off";
    },

    showButtonTargets: function (el, attr, on) {

        var t = this;

        var sel = el.getAttribute (attr);

        if (sel) {

            var targets;

            if (sel.trim () === "<this>") {

                targets = [el]; } else {
                targets = t.body.querySelectorAll (sel);
            }

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
    },

    clearButtonEvents: function (b) {

        b.removeEventListener ("mouseenter",    b.___button_listener_mouseenter);
        b.removeEventListener ("mouseleave",    b.___button_listener_mouseleave);
        b.removeEventListener ("mousedown",     b.___button_listener_mousedown);
        b.removeEventListener ("mouseup",       b.___button_listener_mouseup);
    },

    initButton: function (b) {

        var t = this;

        t.clearButtonEvents (b);

        // init state if missing ..
        if (b.getAttribute ("button-state") === null) {
            b.setAttribute ("button-state", "off");
        }

        if (b.classList.contains ("button-hover")) {

            b.___button_listener_mouseleave = function (e) { t.setButtonState (e.target, "off"); }
            b.___button_listener_mouseenter = function (e) {

                t.setButtonState            (e.target, "on");
                t.transformButtonByScrolls  (e.target);
            }

            b.___button_listener_mousedown = function (e) {

                if (e.target.___callback_open_lightbox) {
                    e.target.___callback_open_lightbox (e);
                }
            }

            b.addEventListener ("mouseenter",   b.___button_listener_mouseenter);
            b.addEventListener ("mouseleave",   b.___button_listener_mouseleave);
            b.addEventListener ("mousedown",    b.___button_listener_mousedown);

        } else
        if (b.classList.contains ("button-press")) {

            b.___button_listener_mousedown = function (e) {

                var el = e.target;

                var state = t.getButtonState (el);

                if (state === "on")     { t.setButtonState (el, "off"); } else
                if (state === "off")    { t.setButtonState (el, "on");  }
            }

            b.___button_listener_mouseup = function (e) {

                var time = new Date ().getTime ();

                if (e.target.___button_listener_mouseup_time) {

                    var delta = time - e.target.___button_listener_mouseup_time;

                    if (delta > 100 && delta < 500) {

                        // e.preventDefault ();

                        if (e.target.___callback_open_lightbox) {
                            e.target.___callback_open_lightbox (e);
                        }
                    }
                }

                e.target.___button_listener_mouseup_time = time;
            }

            b.addEventListener ("mousedown",        b.___button_listener_mousedown);
            b.addEventListener ("mouseup",          b.___button_listener_mouseup);
        }

        if (!b.___callback_open_lightbox) {
            b.___callback_open_lightbox = function (e) {

                // console.log ("LIGHTBOX >> OPEN");
            }
        }
    },

    transformButton: function (b) {

        var t = this;

        // transforms hover button to press button
        if (b.classList.contains ("button-hover")) {

            // console.log ("transformButton >> " + b.id);

            t.clearButtonEvents (b);

            b.classList.remove  ("button-hover");
            b.classList.add     ("button-press");

            t.initButton (b);
        }
    },

    transformButtonByScrolls: function (b) {

        var t = this;

        if (b.classList.contains ("button-hover")) {

            var attr = b.getAttribute ("button-scroll");

            if (attr !== null) {

                var h = window.innerHeight;

                var scrolls = t.body.querySelectorAll (attr);

                for (var i = 0; i < scrolls.length; i ++) {

                    var s = scrolls [i];

                    var r = s.getBoundingClientRect ();

                    if ((r.top + r.height) > h) {

                        t.transformButton (b);

                        break;
                    }
                }
            }
        }
    },

    updateButtons: function () {

        var t = this;

        var buttons = t.body.querySelectorAll (".button-hover, .button-press");

        for (var i = 0; i < buttons.length; i ++) {

            var b = buttons [i];

            // console.log ("button : " + b.id + " class : " + b.className);

            if (t.touch) {
                t.transformButton   (b); } else {
                t.initButton        (b);
            }
        }
    },
}
