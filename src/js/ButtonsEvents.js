
class ButtonsEvents extends ButtonsActions {

    constructor () {

        super ();
    }

    initButton (b) {

        super.initButton (b);
        
        var t = this;

        t.clearButtonEvents (b);

        if (b.classList.contains ("button-hover")) {

            b.___button_listener_mouseleave = function (e) {

                clearTimeout (e.target.___button_listener_mouseenter_timeout);

                t.setButtonState (e.target, "off");
            }

            b.___button_listener_mouseenter = function (e) {

                clearTimeout (e.target.___button_listener_mouseenter_timeout);

                function enter() {

                    t.setButtonState            (e.target, "on");
                    t.transformButtonByScrolls  (e.target);
                }

                // short timeout so the buttons don't get triggered accidentally
                e.target.___button_listener_mouseenter_timeout = setTimeout (enter, 100);
            }

            b.___button_listener_mousedown = function (e) {

                if (e.target.___callback_open) {
                    e.target.___callback_open (e);
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

                        if (e.target.___callback_open) {
                            e.target.___callback_open (e);
                        }
                    }
                }

                e.target.___button_listener_mouseup_time = time;
            }

            b.addEventListener ("mousedown",        b.___button_listener_mousedown);
            b.addEventListener ("mouseup",          b.___button_listener_mouseup);
        }

        if (!b.___callback_open) {
            b.___callback_open = function (e) {

                // console.log ("CALLBACK OPEN");
            }
        }
    }

    clearButtonEvents (b) {

        b.removeEventListener ("mouseenter",    b.___button_listener_mouseenter);
        b.removeEventListener ("mouseleave",    b.___button_listener_mouseleave);
        b.removeEventListener ("mousedown",     b.___button_listener_mousedown);
        b.removeEventListener ("mouseup",       b.___button_listener_mouseup);
    }
}
