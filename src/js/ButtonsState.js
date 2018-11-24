
/* global body */
/* global ButtonsBase */

class ButtonsState extends ButtonsBase {

    constructor () {

        super ();
    }

    setButtonState (el, state, propagate) {

        let t = this;

        // unfortunately out JS minifier doesn't support ES6 so
        // this is the way to handle optional parameters ..

        propagate = (typeof propagate === "undefined") ? true : propagate;

        // safety check
        if (el.classList.contains ("button-hover") ||
            el.classList.contains ("button-press")) {

            let button_state = t.parseButtonStateRef (el);

            if (!button_state.value_readonly) {

                /*
                if (propagate === true) {

                    if (button_state.value_ext) {

                        let targets = body.querySelectorAll (button_state.value_ext);

                        for (let i = 0; i < targets.length; i ++) {

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

                let button_clear = el.getAttribute ("button-clear");

                if (button_clear !== null) {

                    let targets = body.querySelectorAll (button_clear);

                    for (let i = 0; i < targets.length; i ++) {

                        let g = targets.item (i);
                        if (g !== el) {

                            if (t.getButtonState (g) === "on") {
                                t.setButtonState (g, "off", false);
                            }
                        }
                    }
                }
            }

            if (state === "on") {

                if (propagate === true) {

                    let button_set = el.getAttribute ("button-set-on");

                    if (button_set !== null) {

                        let targets = body.querySelectorAll (button_set);

                        for (let i = 0; i < targets.length; i ++) {

                            let g = targets.item (i);
                            if (g !== el) {

                                t.setButtonState (g, state, false);
                            }
                        }
                    }
                }

                t.showButtonTargets (el, "button-target", true);
            }

            if (state === "off") {

                if (propagate === true) {

                    let button_set = el.getAttribute ("button-set-off");

                    if (button_set !== null) {

                        let targets = body.querySelectorAll (button_set);

                        for (let i = 0; i < targets.length; i ++) {

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

        let t = this;

        let button_state = this.parseButtonStateRef (el);

        // console.log ("getButtonState > parseButtonStateRef > " + attr);

        if (button_state.value === "on" ||
            button_state.value === "off") {

            return button_state.value;

        } else
        if (button_state.value_ext !== null) {

            let target = body.querySelector (attr);

            if (target) {

                let button_state_ext = this.parseButtonStateRef (target);

                if (button_state_ext.value === "on" ||
                    button_state_ext.value === "off") {

                    return button_state_ext.value;
                }
            }
        }

        return "off";
    }

    parseButtonStateRef (el) {

        let out = {

            value:              null,
            value_ext:          null,
            value_readonly:     false,
        };

        let attr = el.getAttribute ("button-state");

        if (attr) {
            attr = attr.trim ();

            if (attr && attr.length > 0 &&
                (attr.charAt (0)                === "[") &&
                (attr.charAt (attr.length - 1)  === "]")
            ){
                attr = attr.substring (1, attr.length - 1);

                out.value_readonly = true;
            }

            out.value = (attr === "on") ? "on" : "off";

            if (attr && attr.length > 0 &&
                (attr.charAt (0)                === "{") &&
                (attr.charAt (attr.length - 1)  === "}")
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
