
class Animations {

    constructor () {

        var t = this;

        t.triggers = [];
    }

    applyAnimations () {

        let t = this;

        // this is a nasty part that needs to be done once ..

        let items = document.getElementsByTagName ("*");

        // collect elements ..

        for (let i = items.length; i--;) {

            let el = items.item (i);

            let cs = window.getComputedStyle (el);

            let anim_play = cs.getPropertyValue ("--anim-play");

            if (anim_play) {

                // OPTIMIZE: we do this for every element that has the same animation, but we can process it once and reuse data !

                let anim_init       = cs.getPropertyValue ("--anim-init");
                let anim_class      = cs.getPropertyValue ("--anim-class");
                let anim_trigger    = cs.getPropertyValue ("--anim-trigger");
                let anim_edge       = cs.getPropertyValue ("--anim-edge");
                let anim_delay_min  = cs.getPropertyValue ("--anim-delay-min");
                let anim_delay_max  = cs.getPropertyValue ("--anim-delay-max");

                // console.log ("----------------------------------------------------------------------------------");
                // console.log ("element           : " + el.nodeName);
                // console.log ("element.id        : " + el.id);
                // console.log ("--anim-play       : " + anim_play);
                // console.log ("--anim-init       : " + anim_init);
                // console.log ("--anim-class      : " + anim_class);
                // console.log ("--anim-trigger    : " + anim_trigger);
                // console.log ("--anim-edge       : " + anim_edge);
                // console.log ("--anim-delay-min  : " + anim_delay_min);
                // console.log ("--anim-delay-max  : " + anim_delay_max);

                let skip = false;

                for (let j = 0; j < t.triggers.length; j ++) {

                    let l = t.triggers [j];

                    if (l.target            .contains (el)      &&
                        l.anim_play         === anim_play       &&
                        l.anim_init         === anim_init       &&
                        l.anim_class        === anim_class      &&
                        l.anim_trigger      === anim_trigger    &&
                        l.anim_edge         === anim_edge       &&
                        l.anim_delay_min    === anim_delay_min  &&
                        l.anim_delay_max    === anim_delay_max
                    ) {

                        skip = true;
                        break;

                    } else
                    if (el.contains (l.target) &&
                        l.anim_play         === anim_play       &&
                        l.anim_init         === anim_init       &&
                        l.anim_class        === anim_class      &&
                        l.anim_trigger      === anim_trigger    &&
                        l.anim_edge         === anim_edge       &&
                        l.anim_delay_min    === anim_delay_min  &&
                        l.anim_delay_max    === anim_delay_max
                    ) {

                        t.triggers.splice (j, 1);
                        break;
                    }
                }

                if (!skip) {

                    let target = el;

                    t.triggers.push ({

                        target,
                        anim_play,
                        anim_init,
                        anim_class,
                        anim_trigger,
                        anim_edge,
                        anim_delay_min,
                        anim_delay_max,
                    });
                }
            }
        }

        //console.log ("t.triggers.length : " + t.triggers.length);

        // Initialize
        for (let i = 0; i < t.triggers.length; i ++) {

            let l = t.triggers [i];

            // console.log ("----------------------------------------------------------------------------------");
            // console.log ("element           : " + el.nodeName);
            // console.log ("element.id        : " + el.id);
            // console.log ("--anim-play       : " + anim_play);
            // console.log ("--anim-init       : " + anim_init);
            // console.log ("--anim-class      : " + anim_class);
            // console.log ("--anim-trigger    : " + anim_trigger);
            // console.log ("--anim-edge       : " + anim_edge);
            // console.log ("--anim-delay-min  : " + anim_delay_min);
            // console.log ("--anim-delay-max  : " + anim_delay_max);

            // initialization (to avoid additional loops)

            if (l.anim_init) {

                l.target.classList.add (l.anim_init);
            }

            if (l.anim_delay_min && l.anim_delay_max) {

                let anim_delay_min  = parseFloat (l.anim_delay_min);
                let anim_delay_max  = parseFloat (l.anim_delay_max);

                l.target.style.setProperty ("animation-delay",
                    (anim_delay_min + (anim_delay_max - anim_delay_min) * Math.random ()) + "s");
            }

            l.anim_trigger  = (l.anim_trigger === "self") ? l.target : document.getElementById (l.anim_trigger);
            l.anim_edge     = (l.anim_edge) ? parseFloat (l.anim_edge) : 0.0;
        }

        // in the case object is already in the viewport
        t.onScroll ();

        window.addEventListener ("resize", function (e) { t.onScroll (); });
        window.addEventListener ("scroll", function (e) { t.onScroll (); });

        // to make sure that this is not called twice !
        this.applyAnimations = null;
    }

    onScroll () {

        let t = this;

        let triggers_new = [];

        for (let i = 0; i < t.triggers.length; i ++) {

            let l = t.triggers [i];

            let target          = l.target;
            let anim_trigger    = l.anim_trigger;
            let anim_init       = l.anim_init;
            let anim_class      = l.anim_class;
            let anim_play       = l.anim_play;
            let anim_edge       = l.anim_edge;

            // console.log ("onScroll >> trigger : " + trigger.id + " target : " + target.id + " anim_play : " + anim_play);

            if (Animations.isInViewport (l.anim_trigger, l.anim_edge)) {

                // remove init class from the element
                if (l.anim_init) {

                    l.target.classList.remove (l.anim_init);
                }

                if (anim_class) {

                    l.target.classList.add (l.anim_class);

                    // console.log ("isInViewport >> trigger : " + trigger.id + " target : " + l.target.id + " anim_class : " + l.anim_class);

                } else {

                    l.target.style.setProperty ("animation-name", l.anim_play);

                    // console.log ("isInViewport >> trigger : " + trigger.id + " target : " + l.target.id + " anim_play : " + l.anim_play);
                }

            } else {

                // try next time
                triggers_new.push (l);
            }
        }

        // remove triggered elements (one shot invocation)
        t.triggers = triggers_new;
    }

    static isInViewport (element, edge) {

        let h = window.innerHeight;                 // viewport height
        let r = element.getBoundingClientRect ();   // elements bounding rect in viewport coordinates

        // console.log ("top    : " + r.top);
        // console.log ("bottom : " + r.bottom);
        // console.log ("height : " + h);

        // add extra margin to the viewport to ensure that
        // big enough portion of the object is already visible

        let e = h * Math.min (edge, 0.4); // relative viewport factor, max 40%

        let top     = r.top     - e;
        let bottom  = r.bottom  - e;

        h = h - e*2;

        return (!((top > h) || (bottom < 0)));
    }
}
