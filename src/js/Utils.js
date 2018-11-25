
const GOLDEN_RATIO      = 1.61803398875;
const GOLDEN_RATIO_SQRT = Math.sqrt (GOLDEN_RATIO);

class Utils {

    constructor () {

        var t = this;
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

    static forEachArray (array, fn) {

        if (array) {

            for (let i = 0; i < array.length; i ++) {

                if (fn (array [i], i)) {

                    return;
                }
            }
        }
    }

    static forEachNodeList (nodelist, fn) {

        if (nodelist) {

            for (let i = 0; i < nodelist.length; i ++) {

                if (fn (nodelist.item (i), i)) {

                    return;
                }
            }
        }
    }

    static forEachObject (dict, fn) {

        let i = 0;
        for (var key in dict) {

            if (dict.hasOwnProperty (key)) {

                if (fn (key, dict [key], i ++)) {

                    return;
                }
            }
        }
    }

    static loadJSON (filepath, callback) {

        let xobj = new XMLHttpRequest ();

        xobj.overrideMimeType ("application/json");

        // Replace "appDataServices" with the path to your file
        xobj.open ("GET", filepath, true);

        xobj.onreadystatechange = function () {

            if (xobj.readyState === 4 &&
                xobj.status     === 200) {

                // Required use of an anonymous callback as .open will NOT return a value
                // but simply returns undefined in asynchronous mode

                callback (JSON.parse (xobj.responseText));
            }
        };

        xobj.send (null);
    }

    static hashCode (str) {

        // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript

        let hash = 0, i, chr;

        for (i = 0; i < str.length; i ++) {

            chr   = str.charCodeAt (i);
            hash  = ((hash << 5) - hash) + chr;

            // Convert to 32bit integer
            hash |= 0;
        }

        return hash;
    }
}
