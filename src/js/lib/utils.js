
String.prototype.hashCode = function () {

    // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript

    var hash = 0, i, chr;

    if (this.length === 0) return hash;

    for (i = 0; i < this.length; i++) {

        chr   = this.charCodeAt (i);
        hash  = ((hash << 5) - hash) + chr;

        // Convert to 32bit integer
        hash |= 0;
    }

    return hash;
};
