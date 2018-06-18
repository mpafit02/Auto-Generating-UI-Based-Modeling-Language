var json;
var active = false;

$(function () {
    data = $.ajax({
        url: "person-schema.json",
        dataType: "json",
        type: "get",
        cache: false,
        success: function (data) {
            json = data;
            document.getElementById("app").innerHTML =
                `
                <main role="main" style = " margin: 6px">
                <form>
                ${showDialog(json.required)}
                <legend>${data.description}</legend>
                ${selectDialog(json.required)}
                </form>
                <menu>
                </menu>
            `;
            
            for (var i = 0; i < json.required.length; i++) {
                buttonFunction(json.required[i]);
            }

            function buttonFunction(id) {
                (function () {
                    var btn = id + '-btn';
                    var dialog = id + '-dialog';
                    var cancel = id + '-cancel';
                    var formDialog = document.getElementById(dialog);
                    //Creat
                    document.getElementById(btn).addEventListener('click', function () {
                        formDialog.showModal();
                    });
                    //Cancel
                    document.getElementById(cancel).addEventListener('click', function () {
                        formDialog.close();
                    });
                    //Submit
                    $(formDialog).submit(function () {
                        alert(id + " Submitted");
                    });
                })();
            }
        }

    });
});


function selectDialog(arr) {
    var layout = "";
    for (var i = 0; i < arr.length; i++) {
        layout += "<p><button id = '" + arr[i] + "-btn'  class='btn btn-primary'>" + arr[i] + "</button></p>";
    }
    return layout;
}

function showDialog(arr) {
    var layout = "";
    var section = "";
    var menu = "";
    var output = "";
    for (var i = 0; i < arr.length; i++) {
        var id = arr[i];
        var dialog = id + '-dialog';
        layout = "<dialog id='" + dialog + "'><form method='dialog'>";
        section = "<section><h1>" + id + "</h1><p>" + create(json.properties[id].properties) + "</p></section>";
        menu = "<menu><button id='" + id + "-cancel' class='btn btn-primary' type='reset'>Cancel</button><button type = 'submit' class='btn btn-primary'>Submit</button></menu></form></dialog>";
        output += layout + section + menu;
    }
    return output;
}

function create(link) {
    var hasReference = false;
    var components = "";
    var layout = "";
    var key = Object.keys(link);
    var val = Object.values(link);
    for (i in key) {
        if (key[i] === "items") {
            layout += "<p><button id = 'item-btn' type= 'button'>+item</button></p>";
        } else if (key[i] === "id") {
            // Do something
        } else if (key[i] === "required") {
            // Do something
        } else if (key[i] === "enum") { // enum
            layout += "<select class='form-control'>";
            for (j in key[i]) {
                layout += "<option>" + val[i][j] + "</option>";
            }
            layout += "</select>";
        } else if (key[i] === "$ref") { // oneOf
            var path = val[i];
            var keywords = path.substring(2, path.length).split("/");
            var p = json;
            for (i in keywords) {
                p = p[keywords[i]];
            }
            layout += "<p><div class='border border-secondary rounded' style = 'padding: 4px'>" + create(p) + "</div></p>";
        } else if (typeof val[i] === "object") { // object
            hasReference = false;
            layout += "<p><div class='border border-primary rounded' style = 'padding: 4px'><label>" + key[i] + "</label>" + create(val[i]) + "</div></p>";
        } else if (key[i] === '$ref') { // items
            var path = link.$ref;
            var p = json;
            if (typeof path != "undefined") {
                var keywords = path.substring(2, path.length).split("/");
                for (i in keywords) {
                    p = p[keywords[i]];
                }
                layout += create(p);
            }
            hasReference = true;
        } else if (val[i] === "boolean") {
            components += "<label class='form-control form-check-label'><input type = 'checkBox'></label>";
        } else if (key[i] === "type" && val[i] != "array" && val[i] != "object") {
            components += "<input class='form-control' placeholder = '" + val[i] + "'>";
        }
    }
    if (!hasReference) {
        layout += components;
    }
    return layout;
}


// layout += "<select class='form-control'>";
//             var tempKey = Object.keys(val[i]);
//             for (j in tempKey) {
//                 layout += "<option>" + tempKey[j] + "</option>";
//             }
//             layout += "</select>";

// $(function () {
//     data = $.ajax({
//         url: "schema.json",
//         dataType: "json",
//         type: "get",
//         cache: false,
//         success: function (data) {
//             json = data;
//             document.getElementById("app").innerHTML =
//                 `
//                 <main role="main" style = " margin: 6px">
//                 <form>
//                 <legend>${data.description}</legend>
//                 ${create(data.properties)}
//                 </form>
//                 </main>   
//                 `;
//         }
//     });
// });

// function create(link) {
//     var hasReference = false;
//     var components = "";
//     var layout = "";
//     var key = Object.keys(link);
//     var val = Object.values(link);
//     for (i in key) {
//         if (key[i] === "id") {
//             // Do something
//         } else if (key[i] === "required") {
//             // Do something
//         } else if(key[i] == "items"){
//             layout += "<p><button id = 'item-btn' type= 'button' class='btn'>add item</button></p>";   
//         }else if (key[i] === "enum") { // enum
//             layout += "<select class='form-control'>";
//             for (j in key[i]) {
//                 layout += "<option>" + val[i][j] + "</option>";
//             }
//             layout += "</select>";
//         } else if (key[i] === "$ref") { // oneOf
//             var path = val[i];
//             var keywords = path.substring(2, path.length).split("/");
//             var p = json;
//             for (i in keywords) {
//                 p = p[keywords[i]];
//             }
//             layout += "<p><div class='border border-secondary rounded' style = 'padding: 4px'>" + create(p) + "</div></p>";
//         } else if (typeof val[i] === "object") { // object
//             hasReference = false;
//             layout += "<p><div class='border border-primary rounded' style = 'padding: 4px'><label>" + key[i] + "</label>" + create(val[i]) + "</div>";
//         } else if (key[i] === '$ref') { // items
//             var path = link.$ref;
//             var p = json;
//             if (typeof path != "undefined") {
//                 var keywords = path.substring(2, path.length).split("/");
//                 for (i in keywords) {
//                     p = p[keywords[i]];
//                 }
//                 layout += create(p);
//             }
//             hasReference = true;
//         } else if (val[i] === "boolean") {
//             components += "<label class='form-control form-check-label'><input type = 'checkBox'></label>";
//         } else if (key[i] === "type" && val[i] != "array") {
//             components += "<input class='form-control' placeholder = '" + val[i] + "'>";
//         }
//     }
//     if (!hasReference) {
//         layout += components;
//     }
//     return layout;
// }