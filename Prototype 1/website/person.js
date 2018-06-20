var json;
var active = false;
var items = [];
var hasEnum = false;
var stack = [];

$(function () {
    json = $.ajax({
        url: "person-schema.json",
        dataType: "json",
        type: "get",
        cache: false,
        success: function (json) {
            document.getElementById("app").innerHTML =
                `
                <div class='sidenav'>
                <h1>${json.description}</h1>
                ${sideNavBar(json.required)}
                </div>
                ${createPropertiesDialog(json.required)}
            `;

            for (var i = 0; i < json.required.length; i++) {
                buttonFunction(json.required[i]);
            }

            for (var i = 0; i < items.length; i++) {
                buttonItemsFunction(items[i]);
            }

            function buttonFunction(id) {
                (function () {
                    var btn = id + '-btn';
                    var dialog = id + '-dialog';
                    var cancel = id + '-cancel';
                    var formDialog = document.getElementById(dialog);
                    // Creat
                    document.getElementById(btn).addEventListener('click', function () {
                        formDialog.showModal();
                    });
                    // Cancel
                    document.getElementById(cancel).addEventListener('click', function () {
                        formDialog.close();
                    });
                    // Submit
                    $(formDialog).submit(function () {
                        alert(id + " Submitted");
                    });
                })();
            }

            function buttonItemsFunction(id) {
                (function () {
                    var btn = id + '-btn';
                    var dialog = id + '-dialog';
                    var cancel = id + '-cancel';
                    var done = id + '-done';
                    var formDialog = document.getElementById(dialog);
                    // Creat
                    document.getElementById(btn).addEventListener('click', function () {
                        formDialog.showModal();
                    });
                    // Cancel
                    document.getElementById(cancel).addEventListener('click', function () {
                        formDialog.close();
                    });
                    // Done
                    document.getElementById(done).addEventListener('click', function () {
                        formDialog.close();
                        //Do something
                    });
                })();
            }

            function sideNavBar(arr) {
                var layout = "";
                for (var i = 0; i < arr.length; i++) {
                    layout += "<p><button id = '" + arr[i] + "-btn' class='btn btn-link'>" + arr[i] + "</button></p>";
                }
                return layout;
            }

            function createPropertiesDialog(arr) {
                var output = "";
                for (var i = 0; i < arr.length; i++) {
                    output += PropertiesDialog(arr[i]);
                }
                return output
            }

            function PropertiesDialog(id) {
                var layout;
                var dialog = id + '-dialog';
                layout = "<dialog id='" + dialog + "' class='dialog-content'>";
                layout += "<h4 class='modal-title modal-header'>" + id + "</h4><form><fieldset><div class='modal-body'>" + create(json.properties[id].properties) + "</div>";
                layout += "<div class='modal-footer'><button id='" + id + "-cancel' class='btn btn-secondary btn-sm' type='reset'>Cancel</button>";
                layout += "<button type='submit' class='btn btn-primary btn-sm'>Submit</button></div></fieldset></form></dialog>";
                return layout;
            }

            function ItemDialog(id, path) {
                var layout;
                var dialog = id + '-dialog';
                layout = "<dialog id='" + dialog + "' class='dialog-content'>";
                layout += "<h4 class='modal-title modal-header'>" + id + "</h4><form><fieldset><div class='modal-body'>" + create(path.properties) + "</div>";
                layout += "<div class='modal-footer'><button id='" + id + "-cancel' class='btn btn-secondary btn-sm' type='reset'>Cancel</button>";
                layout += "<button id='" + id + "-done' type='button' class='btn btn-primary btn-sm'>Done</button></div></fieldset></form></dialog>";
                return layout;
            }

            function create(data) {
                var layout = "";
                var key = Object.keys(data);
                var val = Object.values(data);
                for (i in key) {
                    var temp = Object.keys(val[i]);
                    for (j in temp) {
                        if (temp[j] === "enum") {
                            hasEnum = true;
                        }
                    }
                    if (key[i] === "items") {
                        layout += create(val[i]);
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
                        hasEnum = false;
                    } else if (typeof val[i] === "object") { // object
                        layout += "<p><div class='border border-primary rounded' style = 'padding: 4px'><label>" + key[i] + "</label>" + create(val[i]) + "</div></p>";
                    } else if (val[i] === "$ref") { // oneOf
                        var path = val[i];
                        var keywords = path.substring(2, path.length).split("/");
                        var p = json;
                        for (i in keywords) {
                            p = p[keywords[i]];
                        }
                        layout += "<p><div class='border border-secondary rounded' style = 'padding: 4px'>" + create(p) + "</div></p>";
                    } else if (key[i] === '$ref') { // items
                        var path = data.$ref;
                        var p = json;
                        var id;
                        var keywords = path.substring(2, path.length).split("/");
                        for (i in keywords) {
                            id = keywords[i];
                            p = p[keywords[i]];
                        }
                        items.push(id);
                        layout += "<p><button id = '" + id + "-btn' type= 'button' class='btn btn-primary btn-sm'>add</button></p>";
                        layout += ItemDialog(id, p);
                    } else if (val[i] === "boolean") {
                        layout += "<label class='form-control form-check-label'><input type = 'checkBox'></label>";
                    } else if (key[i] === "type" && val[i] != "array" && val[i] != "object" && !hasEnum) {
                        layout += "<input class='form-control' placeholder = '" + val[i] + "'>";
                    }
                }
                return layout;
            }
        }
    });
});