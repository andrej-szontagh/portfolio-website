
function loadJSON (filepath, callback) {

    var xobj = new XMLHttpRequest ();
    
    xobj.overrideMimeType ("application/json");
    
    // Replace 'appDataServices' with the path to your file
    xobj.open ('GET', filepath, true);
    
    xobj.onreadystatechange = function () {
        
        if (xobj.readyState == 4 && xobj.status == "200") {
              
            // Required use of an anonymous callback as .open will NOT return a value 
            // but simply returns undefined in asynchronous mode

            callback (JSON.parse (xobj.responseText));
        }
    };
    
    xobj.send (null);
}
