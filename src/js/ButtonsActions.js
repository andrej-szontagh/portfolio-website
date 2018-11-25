
/* global body */
/* global ButtonsState */
/* global ButtonsStates */

class ButtonsActions extends ButtonsState {

    constructor () {

        super ();
    }

    showButtonTargets (el, attr, state) {

        super.showButtonTargets (el, attr, state);

        let t = this;

        let sel = el.getAttribute (attr);

        if (sel) {

            let targets = [];

            sel = sel.trim ();

            let len = sel.length;

            // check if referencing itself ..
            sel = ButtonsActions._cutoffToken (sel, "<this>");
            if (sel.length != len) {

                targets.push (el);
            }

            if (sel) {

                let elements = body.querySelectorAll (sel);
                if (elements) {

                    // convert to array first (NodeList)
                    targets = targets.concat (Array.prototype.slice.call (elements));
                }
            }

            if (targets != null) {
                targets.forEach (function (target, i) {

                    ButtonsActions._showTargetByState (target, state);
                });
            }
        }
    }

    static _cutoffToken (str, token) {

        let i = str.indexOf (token);
        if (i >= 0) {

            // cut off the token
            str = str.substr (0, i) + str.substr (i + token.length);
            str = str.trim ();
        }

        return str;
    }

    static _showTargetByState (target, state) {

        if (state === ButtonsStates.ON) {

            ButtonsActions._showTarget (target); } else {
            ButtonsActions._hideTarget (target);
        }
    }

    static _showTarget (target) {

        target.classList.remove ("hidden");
        target.classList.add    ("visible");

        target.dispatchEvent (new Event ("onvisible"));
    }

    static _hideTarget (target) {

        target.classList.remove ("visible");
        target.classList.add    ("hidden");

        target.dispatchEvent (new Event ("onhidden"));
    }
}
