
/* global body */
/* global Utils */
/* global ButtonsBase */

class ButtonsState extends ButtonsBase {

    constructor () {

        super ();
    }

    setButtonState (el, state, propagate = true) {

        let t = this;

        function propagateFn (attr, fn) {

            if (propagate === true) {

                let a = el.getAttribute (attr);
                if (a !== null) {

                    Utils.forEachNodeList (body.querySelectorAll (a), function (target, i) {

                        if (target !== el) {

                            fn (target);
                        }
                    });
                }
            }
        };

        // safety check
        if (el.classList.contains ("button-hover") ||
            el.classList.contains ("button-press")) {

            let button_state = ButtonsState.parseButtonStateRef (el);

            if (!button_state.value_readonly) {

                // console.log ("Button : " + el.id + " State > " + state);

                el.setAttribute ("button-state", state);
            }

            // clear buttons selected by "button-clear" attribute
            propagateFn ("button-clear", function (target) {

                if (t.getButtonState (target) === "on") {
                    t.setButtonState (target, "off", false);
                }
            });

            if (state === "on") {

                propagateFn ("button-set-on", function (target) {

                    t.setButtonState (target, state, false);
                });

                t.showButtonTargets (el, "button-target", true);
            }

            if (state === "off") {

                propagateFn ("button-set-off", function (target) {

                    t.setButtonState (target, state, false);
                });

                t.showButtonTargets (el, "button-target", false);
            }
        }
    }

    getButtonState (el) {

        let t = this;

        let button_state = ButtonsState.parseButtonStateRef (el);

        // console.log ("getButtonState > parseButtonStateRef > " + attr);

        if (button_state.value === "on" ||
            button_state.value === "off") {

            return button_state.value;

        } else
        if (button_state.value_ext !== null) {

            let target = body.querySelector (attr);

            if (target) {

                let button_state_ext = ButtonsState.parseButtonStateRef (target);

                if (button_state_ext.value === "on" ||
                    button_state_ext.value === "off") {

                    return button_state_ext.value;
                }
            }
        }

        return "off";
    }

    static checkBracets (str, brace_left, brace_right) {

        // https://medium.com/nodesimplified/javascript-pass-by-value-and-pass-by-reference-in-javascript-fcf10305aa9c
        // we use "input" as a wrapper to be able to modify the string

        str = str.trim ();

        if (str.length > 0 &&
            str.charAt (0)              === brace_left &&
            str.charAt (str.length - 1) === brace_right)
        {
            str = str.substring (1, str.length - 1);
            str = str.trim ();

            return { contained: true, modified: str };
        }

        return { contained: false, modified: str };
    }

    static parseButtonStateRef (el) {

        let out = {

            value:              null,
            value_ext:          null,
            value_readonly:     false,
        };

        let attr = el.getAttribute ("button-state");
        if (attr) {

            let o;

            o = ButtonsState.checkBracets (attr, "[", "]");

            out.value_readonly  = o.contained;
            out.value           = (o.modified === "on") ? "on" : "off";

            o = ButtonsState.checkBracets (o.modified, "{", "}");

            out.value_ext = o.contained ? o.modified : null;
        }

        return out;
    }

    showButtonTargets (el, attr, on) {

        // placeholder ..
    }
}
