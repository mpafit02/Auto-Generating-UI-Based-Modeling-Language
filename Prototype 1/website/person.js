// Variables
var json = undefined;
var objectName = "";
var active = false;
var hasEnum = false;
var items = [];
var stack = [];
var idCounter = 0;
var inputCounter = 0;

// Main
$(function () {
    json = $.ajax({
        url: "person-schema.json",
        dataType: "json",
        type: "get",
        cache: false,
        success: function (json) {
            document.getElementById("app").innerHTML =
                `
                <nav class="navbar navbar-expand-lg navbar-dark fixed-top top-nav">
                <h1 class='title'>${json.description}</h1>
                </nav>
                <nav class='sidenav'>
                ${sideNavigationBar(json.required)}
                </nav>
                <main class='main'>
                ${createBaseDialog(json.required)}
                </main>
            `;
            // Side Navigation Bar
            function sideNavigationBar(arr) {
                var layout = "<ul>";
                for (var i = 0; i < arr.length; i++) {
                    layout += "<li><button id = '" + arr[i] + "-btn' class='btn btn-link'>" + arr[i] + "</button></li>";
                }
                layout += "</ul>";
                return layout;
            }

            // Check for key press actions in base dialogs
            for (var i = 0; i < json.required.length; i++) {
                buttonBaseFunction(json.required[i]);
            }

            // Check for key press actions in nested dialogs
            for (var i = 0; i < items.length; i++) {
                buttonNestedFunction(items[i]);
            }

            // Function for buttons in Base Dialogs
            function buttonBaseFunction(id) {
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

            // Function for buttons in Nested Dialogs
            function buttonNestedFunction(id) {
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
                        alert(id.substring(0, id.length - 2) + " Submitted");
                        formDialog.close();
                    });
                })();
            }

            // Create Base Dialog
            function createBaseDialog(arr) {
                var output = "";
                for (var i = 0; i < arr.length; i++) {
                    output += BaseDialog(arr[i]);
                }
                return output
            }
            method = 'POST'

            // Base Dialog
            function BaseDialog(id) {
                var layout = "";
                var dialog = id + '-dialog';
                // Dialog
                layout = "<dialog id='" + dialog + "' class='dialog-content'>";
                // Header
                layout += "<h4 class='modal-title modal-header'>" + id + "</h4>";
                // Body
                // Correct: -------------layout += "<form action='/action_page.php' method='POST'>";--------------
                layout += "<form>";
                layout += "<div class='modal-body'>" + create(json.properties[id]) + "</div>";
                // Footer
                layout += "<div class='modal-footer'>";
                layout += "<button type='reset' id='" + id + "-cancel' class='btn btn-secondary'>Cancel</button>";
                layout += "<button type='submit' class='btn btn-primary'>Submit</button>";
                layout += "</div></form></dialog>";
                return layout;
            }

            // Nested Dialog
            function NestedDialog(id, path) {
                var layout = "";
                var dialog = id + '-dialog';
                // Nested Dialog
                layout = "<dialog id='" + dialog + "' class='dialog-content'>";
                // Header
                layout += "<h4 class='modal-title modal-header'>" + id.substring(0, id.length - 2) + "</h4>";
                // Body
                layout += "<div class='modal-body'>" + create(path) + "</div>";
                // Footer
                layout += "<div class='modal-footer'>";
                layout +="<button id='" + id + "-cancel' class='btn btn-secondary ' type='reset'>Cancel</button>";
                layout += "<button id='" + id + "-done' type='button' class='btn btn-primary'>Done</button>";
                layout += "</div></dialog>";
                return layout;
            }

            // Create Elements
            function create(data) {
                var layout = "";
                // Find the keys and the values
                var key = Object.keys(data);
                var val = Object.values(data);
                for (i in key) {
                    // Check if there is enum in the val array
                    var temp = Object.keys(val[i]);
                    for (j in temp) {
                        if (temp[j] === "enum") {
                            hasEnum = true;
                        }
                    }
                    // ----------------Cases----------------
                    if (key[i] === "id") { // id
                        // Ignore
                    } else if (key[i] === "required") { // required
                        // Ignore
                    } else if (key[i] === "items") { // items
                        layout += create(val[i]);
                    } else if (key[i] === "properties") { // properties
                        layout += create(val[i]);
                    } else if (key[i] === "oneOf") { // oneOf
                        layout += create(val[i]);
                    } else if (key[i] === "enum") { // enum
                        layout += "<select class='form-control'>";
                        for (j in val[i]) {
                            layout += "<option>" + val[i][j] + "</option>";
                        }
                        layout += "</select>";
                        hasEnum = false;
                    } else if (typeof val[i] === "object") { // object
                        objectName = key[i];
                        layout += "<p><label>" + key[i] + "</label>" + create(val[i]) + "</p>";
                    } else if (key[i] === '$ref') { // items
                        var ref = data.$ref;
                        var path = json;
                        var id;
                        var keywords = ref.substring(2, ref.length).split("/");
                        for (i in keywords) {
                            id = keywords[i];
                            path = path[keywords[i]];
                        }
                        id += "-" + idCounter;
                        items.push(id); 
                        idCounter++;
                        layout += "<p><button id = '" + id + "-btn' type='button' class='btn btn-primary btn-sm'>+add</button></p>";
                        layout += NestedDialog(id, path);
                    } else if (val[i] === "boolean") { // boolean
                        layout += "<label class='form-control form-check-label'><input type = 'checkBox'></label>";
                    } else if (key[i] === "type" && val[i] != "array" && val[i] != "object" && !hasEnum) { // string integer
                        var id = "in-" + inputCounter;
                        layout += "<input id='" + id + "'class='form-control' name='" + objectName + "' placeholder='" + val[i] + "'>";
                        inputCounter++;
                    }
                }
                return layout;
            }
        }
    });
});