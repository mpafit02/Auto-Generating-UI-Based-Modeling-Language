// Variables
var json = undefined;
var active = false;
var hasEnum = false;
var objectName = "";
var returnContent = "";
var idCounter = 0;
var inputCounter = 0;
var selectCounter = 0;
var items = [];
var oneOfCases = [];
var selectCases = [];

// Main
$(document).ready(function () {
    json = $.ajax({
        url: "person-schema.json",
        dataType: "json",
        type: "get",
        cache: false,
        success: function (json) {
            document.getElementById("app").innerHTML =
                `
                <nav class="navbar navbar-expand-lg bg-dark fixed-top top-nav">
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
                    layout += "<li><button id = '" + arr[i] + "-btn' class='btn btn-link bg-dark'>" + arr[i] + "</button></li>";
                }
                layout += "</ul>";
                return layout;
            }

            // Create Base Dialog
            function createBaseDialog(arr) {
                var output = "";
                for (var i = 0; i < arr.length; i++) {
                    output += BaseDialog(arr[i]);
                }
                return output
            }

            // Uncheck Radio Buttons
            function unckeckRadioButtons() {
                for (i in selectCases) {
                    var other = $('#select-' + selectCases[i]).val();
                    $('.reveal-' + other).show().css({
                        'opacity': '0',
                        'max-height': '0',
                        'overflow': 'hidden'
                    });
                }
            }

            // Display the dialog which is selected in oneOf case
            $("input").on("click", function () {
                var id = $("input:checked").val();
                returnContent = id;
                $('.reveal-' + id).show().css({
                    'opacity': '1',
                    'max-height': 'inherit',
                    'overflow': 'visible'
                });
                for (i in selectCases) {
                    var other = $('#select-' + selectCases[i]).val();
                    if (other != id) {
                        $('.reveal-' + other).show().css({
                            'opacity': '0',
                            'max-height': '0',
                            'overflow': 'hidden'
                        });
                    }
                }
            });

            //------------------------------Element Creation----------------------------

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
                    } else if (key[i] === "uniqueItems") { // uniqueItems
                        // Ignore
                    } else if (key[i] === "additionalProperties") { // additionalProperties
                        var hasAdditionalProperties = val[i];
                    } else if (key[i] === "items") { // items
                        layout += create(val[i]);
                    } else if (key[i] === "properties") { // properties
                        layout += create(val[i]);
                    } else if (key[i] === "oneOf") { // oneOf
                        layout += oneOfCase(val[i]);
                    } else if (key[i] === "enum") { // enum
                        layout += "<h6><label for='label-" + objectName + "'>" + objectName + "</label></h6>";
                        layout += enumCase(val);
                    } else if (typeof val[i] === "object") { // object
                        objectName = key[i];
                        // layout += "<h6><label for='" + objectName + "'>" + objectName + "</label></h6>";
                        layout += create(val[i]);
                    } else if (key[i] === '$ref') { // $ref
                        layout += itemCase(data);
                    } else if (val[i] === "boolean") { // boolean
                        layout += "<p><label class='checkbox-container'>" + objectName + "<input type='checkbox' name='" + objectName + "'><span class='checkbox-checkmark'></span></label></p>";
                    } else if (key[i] === "type" && val[i] != "array" && val[i] != "object" && !hasEnum) { // string integer
                        layout += "<h6><label for='label-" + objectName + "'>" + objectName + "</label></h6>";
                        layout += "<input id='in-" + objectName + "'class='form-control' name='" + objectName + "' placeholder='" + val[i] + "'><span class='error'>This field is required</span>	<br>";
                    }
                }
                return layout;
            }


            //---------------------------DIALOGS--------------------------

            // Base Dialog
            function BaseDialog(id) {
                var layout = "";
                var dialog = id + '-dialog';
                // Dialog
                layout = "<dialog id='" + dialog + "' class='dialog-content bg-light'>";
                // Header
                layout += "<h4 class='modal-title modal-header'>" + id + "</h4>";
                // Body
                // Correct: -------------layout += "<form id='contact' action='/action_page.php' method='POST'>";--------------
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
                layout = "<dialog id='" + dialog + "' class='dialog-content bg-light'>";
                // Header
                layout += "<h4 class='modal-title modal-header'>" + id.substring(0, id.length - 2) + "</h4>";
                // Body
                layout += "<div class='modal-body'>" + create(path) + "</div>";
                // Footer
                layout += "<div class='modal-footer'>";
                layout += "<button id='" + id + "-cancel' class='btn btn-secondary' type='reset'>Cancel</button>";
                layout += "<button id='" + id + "-done' type='button' class='btn btn-primary'>Done</button>";
                layout += "</div></dialog>";
                return layout;
            }

            // Select Dialog
            function SelectDialog(id, data) {
                var layout = "";
                var dialog = id + '-dialog';
                var title = "";
                // Nested Dialog
                layout = "<dialog id='" + dialog + "' class='dialog-content bg-light'>";
                // Header
                layout += "<h4 class='modal-title modal-header'>" + id.substring(0, id.length - 2) + "</h4>";
                // Body
                layout += "<div class='modal-body'>";
                layout += "<form action=''>";
                for (i in data) {
                    var ref = data[i].$ref;
                    var path = json;
                    var keywords = ref.substring(2, ref.length).split("/");
                    for (i in keywords) {
                        title = keywords[i];
                        path = path[keywords[i]];
                    }
                    layout += "<label class='radio-container'><h5>" + title + "</h5><input id='select-" + title + "' type='radio' name='oneOf' value='" + title + "'><span class='radio-checkmark'></span></label>";
                    selectCases.push(title);
                    layout += "<div class='reveal-" + title + "' style='opacity:0;max-height: 0;overflow: hidden;'>";
                    layout += create(path);
                    layout += "</div>";
                }
                layout += "</form>";
                layout += "</div>";
                // Footer
                layout += "<div class='modal-footer'>";
                layout += "<button id='" + id + "-cancel' class='btn btn-secondary' type='reset'>Cancel</button>";
                layout += "<button id='" + id + "-done' type='button' class='btn btn-primary'>Done</button>";
                layout += "</div></dialog>";
                return layout;
            }


            //-------------------------------Cases--------------------------------
            // Item Case
            function itemCase(data) {
                var layout = "";
                var ref = data.$ref;
                var path = json;
                var id;
                var keywords = ref.substring(2, ref.length).split("/");
                for (i in keywords) {
                    id = keywords[i];
                    path = path[keywords[i]];
                }
                layout += "<p><h6><label for='label-" + id + "'>" + id + "</label></h6><button id = '" + id + "-" + idCounter + "-btn' type='button' class='btn btn-primary btn-sm'>New " + id + "</button></p>";
                id += "-" + idCounter;
                items.push(id);
                idCounter++;
                layout += NestedDialog(id, path);
                return layout;
            }

            // oneOf Case
            function oneOfCase(data) {
                var layout = "";
                if (Object.keys(data[0]) == "$ref") {
                    var id = 'select-' + selectCounter;
                    layout += "<h6><label for='label-" + objectName + "'>" + objectName + "</label><div id='returnContent'></div></h6><button id = '" + id + "-btn' type='button' class='btn btn-primary btn-sm'>Select</button>";
                    selectCounter++;
                    oneOfCases.push(id);
                    layout += SelectDialog(id, data);
                } else {
                    layout += create(data);
                }
                return layout;
            }

            // Enum Case
            function enumCase(val) {
                var layout = "";
                layout += "<select class='form-control'>";
                for (j in val[i]) {
                    layout += "<option>" + val[i][j] + "</option>";
                }
                layout += "</select><br>";
                hasEnum = false;
                return layout;
            }

            //------------------------------Key Press----------------------------

            // Check for key press actions in base dialogs
            for (var i = 0; i < json.required.length; i++) {
                buttonBaseFunction(json.required[i]);
            }

            // Check for key press actions in nested dialogs
            for (var i = 0; i < items.length; i++) {
                buttonNestedFunction(items[i]);
            }

            // Check for key press actions in SELECT dialogs
            for (var i = 0; i < oneOfCases.length; i++) {
                buttonSelectFunction(oneOfCases[i]);
            }

            //----------------------------Button Actions--------------------------

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
                        unckeckRadioButtons();
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
                        unckeckRadioButtons();
                        formDialog.close();
                    });
                    // Done
                    document.getElementById(done).addEventListener('click', function () {
                        alert(id.substring(0, id.length - 2) + " Submitted");
                        formDialog.close();
                    });
                })();
            }

            // Function for buttons in Select Dialogs
            function buttonSelectFunction(id) {
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
                        unckeckRadioButtons();
                        formDialog.close();
                    });
                    // Done
                    document.getElementById(done).addEventListener('click', function () {
                        $("#returnContent").html(returnContent);
                        alert(id.substring(0, id.length - 2) + " Submitted");
                        formDialog.close();
                    });
                })();
            }
        }
    });
});