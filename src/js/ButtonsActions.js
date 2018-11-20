
class ButtonsActions extends ButtonsState {

    constructor () {

        super ();
    }

    showButtonTargets (el, attr, on) {

        super.showButtonTargets (el, attr, on);
        
        var t = this;

        var sel = el.getAttribute (attr);

        if (sel) {

            var targets = [];

            sel = sel.trim ();

            // check if the string contains the "self" token

            var selftoken = "<this>";

            var thisindex = sel.indexOf (selftoken);
            if (thisindex >= 0) {

                // cut off the self token
                sel = sel.substr (0, thisindex) + sel.substr (thisindex + selftoken.length);
                sel = sel.trim ();

                targets.push (el);
            }

            if (sel) {

                var elements = body.querySelectorAll (sel);
                if (elements) {

                    // convert to array first (NodeList)
                    targets = targets.concat (Array.prototype.slice.call (elements));
                }
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
    }
}
