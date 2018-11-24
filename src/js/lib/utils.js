
const GOLDEN_RATIO      = 1.61803398875;
const GOLDEN_RATIO_SQRT = Math.sqrt (GOLDEN_RATIO);

class Utils {

    constructor () {

        var t = this;
    }

    static loadJSON (filepath, callback) {

        let xobj = new XMLHttpRequest ();

        xobj.overrideMimeType ("application/json");

        // Replace "appDataServices" with the path to your file
        xobj.open ("GET", filepath, true);

        xobj.onreadystatechange = function () {

            if (xobj.readyState == 4 && xobj.status == "200") {

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

        if (str.length === 0) return hash;

        for (i = 0; i < str.length; i++) {

            chr   = str.charCodeAt (i);
            hash  = ((hash << 5) - hash) + chr;

            // Convert to 32bit integer
            hash |= 0;
        }

        return hash;
    }
}
