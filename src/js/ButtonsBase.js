
class ButtonsBase {

    constructor () {

        // console.log ("init Buttons");

        let t = this;

        t.touch = false;
        t.ui    = document.getElementById ("ui");

        // detect touch device !

        // https://codeburst.io/the-only-way-to-detect-touch-with-javascript-7791a3346685

        // this seems to be the only realiable method since you still can have devices supporting and
        // actively using both touch and other pointer devices so the only way to know for sure that the user is
        // going to touch is to use listen for actual touch events.

        // problem with this method is that we don't know until user touches ..

        window.addEventListener ('touchstart', function onFirstTouch () {

            // console.log ("User touched !");

            t.touch = true;

            t.updateButtons ();

            // we only need to know once that a human touched the screen, so we can stop listening now
            window.removeEventListener ('touchstart', onFirstTouch, false);

        }, false);

        t.updateButtons ();
    }

    updateButtons () {

        let t = this;

        let buttons = body.querySelectorAll (".button-hover, .button-press");

        for (let i = 0; i < buttons.length; i ++) {

            let b = buttons [i];

            // console.log ("button : " + b.id + " class : " + b.className);

            if (t.touch) {

                t.transformButton   (b); } else {
                t.initButton        (b);
            }
        }
    }

    initButton (b) {

        let t = this;

        // init state if missing ..
        if (b.getAttribute ("button-state") === null) {
            b.setAttribute ("button-state", "off");
        }

        // init visibility state if missing ..
        if (b.classList.contains    ("hidden")  === false &&
            b.classList.contains    ("visible") === false) {
            b.classList.add         ("visible");
        }
    }

    transformButton (b) {

        let t = this;

        // transforms hover button to press button
        if (b.classList.contains ("button-hover")) {

            // console.log ("transformButton >> " + b.id);

            t.clearButtonEvents (b);

            b.classList.remove  ("button-hover");
            b.classList.add     ("button-press");

            t.initButton (b);
        }
    }

    transformButtonByScrolls (b) {

        let t = this;

        // if the scroll is not fitting into screen
        // transform connected button to press button ..

        if (b.classList.contains ("button-hover")) {

            let attr = b.getAttribute ("button-scroll");

            if (attr !== null) {

                let h = window.innerHeight;

                let scrolls = body.querySelectorAll (attr);

                for (let i = 0; i < scrolls.length; i ++) {

                    let s = scrolls [i];

                    let r = s.getBoundingClientRect ();

                    if (r.height > h) {

                        t.transformButton (b);
                        break;
                    }
                }
            }
        }
    }
}
