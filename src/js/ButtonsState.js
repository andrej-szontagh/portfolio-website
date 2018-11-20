
class ButtonsState extends ButtonsBase {

    constructor () {

        super ();
    }

    setButtonState (el, state, propagate) {

        var t = this;

        // unfortunately out JS minifier doesn't support ES6 so
        // this is the way to handle optional parameters ..

        propagate = (typeof propagate === 'undefined') ? true : propagate;

        // safety check
        if (el.classList.contains ("button-hover") ||
            el.classList.contains ("button-press")) {

            var button_state = t.parseButtonStateRef (el);

            if (!button_state.value_readonly) {

                /*
                if (propagate === true) {

                    if (button_state.value_ext) {

                        var targets = body.querySelectorAll (button_state.value_ext);

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

                    var targets = body.querySelectorAll (button_clear);

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

                        var targets = body.querySelectorAll (button_set);

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

                        var targets = body.querySelectorAll (button_set);

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
    }

    getButtonState (el) {

        var t = this;

        var button_state = this.parseButtonStateRef (el);

        // console.log ("getButtonState > parseButtonStateRef > " + attr);

        if (button_state.value === "on" ||
            button_state.value === "off") {

            return button_state.value;

        } else
        if (button_state.value_ext !== null) {

            var target = body.querySelector (attr);

            if (target) {

                var button_state_ext = this.parseButtonStateRef (target);

                if (button_state_ext.value === "on" ||
                    button_state_ext.value === "off") {

                    return button_state_ext.value;
                }
            }
        }

        return "off";
    }

    parseButtonStateRef (el) {

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
    }

    showButtonTargets (el, attr, on) {

        // placeholder ..
    }
}
