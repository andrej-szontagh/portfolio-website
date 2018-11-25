
/* global body */
/* global Utils */
/* global ButtonsBase */

// TODO: use Enumify !
// https://github.com/rauschma/enumify

const ButtonsStates = Object.freeze ({

    ON:     Symbol ("on"),
    OFF:    Symbol ("off")
});

const ButtonsStatesStrings = Object.freeze ({

    [ButtonsStates.ON]:     "on",
    [ButtonsStates.OFF]:    "off"
});

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
        }

        // safety check
        if (el.classList.contains ("button-hover") ||
            el.classList.contains ("button-press")) {

            let s   = ButtonsState._parseButtonState (el);
            let str = ButtonsStatesStrings [state];

            if (!s.value_readonly) {

                // console.log ("Button : " + el.id + " State > " + state);

                el.setAttribute ("button-state", str);
            }

            // clear buttons selected by "button-clear" attribute
            propagateFn ("button-clear", function (target) {

                if (t.getButtonState (target) ===   ButtonsStates.ON) {
                    t.setButtonState (target,       ButtonsStates.OFF, false);
                }
            });

            propagateFn ("button-set-" + str, function (target) {

                t.setButtonState (target, state, false);
            });

            t.showButtonTargets (el, "button-target", state);
        }
    }

    getButtonState (el) {

        let t = this;

        let s = ButtonsState._parseButtonState (el);

        if (s.value_ext !== null) {

            let target = body.querySelector (attr);
            if (target) {

                s = ButtonsState._parseButtonState (target);
            }
        }

        return s.value;
    }

    showButtonTargets (el, attr, state) {

        // placeholder ..
    }

    static _checkBracets (str, brace_left, brace_right) {

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

    static _parseButtonState (el) {

        let out = {

            value:              null,
            value_ext:          null,
            value_readonly:     false,
        };

        let attr = el.getAttribute ("button-state");
        if (attr) {

            let o;

            o = ButtonsState._checkBracets (attr, "[", "]");

            out.value_readonly  = o.contained;
            out.value           = (o.modified === "on") ? ButtonsStates.ON : ButtonsStates.OFF;

            o = ButtonsState._checkBracets (o.modified, "{", "}");

            out.value_ext = o.contained ? o.modified : null;
        }

        return out;
    }
}
