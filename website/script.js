// General Variables
var json = undefined;
var active = false;
var hasEnum = false;
var hasAdditionalProperties = false;
var hasUniqueItems = false;
var objectName = "";
var returnContent = "";
var idCounter = 0;
var inputCounter = 0;
var selectCounter = 0;
var minItems = Number.MIN_VALUE;
var minProperties = Number.MIN_VALUE;
var minProperties = Number.MAX_VALUE;
var minimum = Number.MIN_VALUE;
var maximum = Number.MAX_VALUE;
var items = [];
var oneOfCases = [];
var selectCases = [];
var required = [];
var output = {};
var outputData = {};

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
                <input type="button" class='btn btn-primary btn-sm' id="dwn-btn" value="Download Form" style='position:absolute;right:8px;'/>
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
                    layout += "<li><button id = '" + arr[i] + "-btn' type='button' class='btn btn-link bg-dark btn-sm' data-toggle='modal' data-target='#" + arr[i] + "-modal'>" + arr[i] + "</button></li>";
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
                return output;
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
                    // Check if there is enum, minItems, minProperties, minimum, maximum in the val array
                    var temp = Object.keys(val[i]);
                    for (j in temp) {
                        if (temp[j] === "enum") {
                            hasEnum = true;
                        }
                        if (temp[j] === "minItems") {
                            minItems = Object.values(val[i])[j];
                        }
                        if (temp[j] === "minProperties") {
                            minProperties = Object.values(val[i])[j];
                        }
                        if (temp[j] === "maxProperties") {
                            maxProperties = Object.values(val[i])[j];
                        }
                        if (temp[j] === "minimum") {
                            minimum = Object.values(val[i])[j];
                        }
                        if (temp[j] === "maximum") {
                            maximum = Object.values(val[i])[j];
                        }
                    }
                    // ----------------Cases----------------
                    if (key[i] === "id") { // id
                        var path = json;
                        var id = "";
                        var keywords = val[i].substring(2, val[i].length).split("/");
                        for (i in keywords) {
                            id = keywords[i];
                            path = path[keywords[i]];
                        }
                        output[id] = path;
                    } else if (key[i] === "required") { // required
                        required = val[i];
                    } else if (key[i] === "uniqueItems") { // uniqueItems
                        hasUniqueItems = val[i];
                    } else if (key[i] === "additionalProperties") { // additionalProperties
                        hasAdditionalProperties = val[i];
                    } else if (key[i] === "items") { // items
                        layout += create(val[i]);
                    } else if (key[i] === "properties") { // properties
                        layout += create(val[i]);
                    } else if (key[i] === "oneOf") { // oneOf
                        layout += oneOfCase(val[i]);
                    } else if (key[i] === "enum") { // enum
                        layout += "<h6><label for='label-" + objectName + "'>" + upperCaseFirst(objectName) + "</label></h6>";
                        layout += enumCase(val);
                    } else if (typeof val[i] === "object") { // object
                        objectName = key[i];
                        layout += create(val[i]);
                    } else if (key[i] === '$ref') { // $ref
                        layout += itemCase(data);
                    } else if (val[i] === "boolean") { // boolean
                        layout += "<p><label class='checkbox-container'>" + upperCaseFirst(objectName) + "<input type='checkbox' name='" + objectName + "'><span class='checkbox-checkmark'></span></label></p>";
                    } else if (key[i] === "type" && val[i] != "array" && val[i] != "object" && !hasEnum) { // string integer
                        layout += inputCase(val[i]);
                    }
                }
                return layout;
            }

            //---------------------------DIALOGS--------------------------

            // Base Dialog
            function BaseDialog(id) {
                var layout = "";
                // var dialog = id + '-dialog';
                // Modal
                layout += "<div class='modal fade' id='" + id + "-modal' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>";
                layout += "<div class='modal-dialog' role='document'>";
                layout += "<div class='modal-content'>";
                // Header
                layout += "<div class='modal-header'>";
                layout += "<h5 class='modal-title' id='exampleModalLabel'>" + id + "</h5></div>";
                // Body         
                // action='/action_page.php' method='POST'
                layout += "<form id='form-" + id + "'>";
                layout += "<div class='modal-body'>" + create(json.properties[id]) + "</div>";
                // Footer
                layout += "<div class='modal-footer'>";
                layout += "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>";
                layout += "<button type='submit' class='btn btn-primary'>Submit</button>";
                layout += "</div></form></div></div></div>";
                // layout = "<dialog id='" + dialog + "' class='dialog-content bg-light'>";
                // // Header
                // layout += "<h4 class='modal-title modal-header'>" + id + "</h4>";
                // // Body
                // // action='/action_page.php' method='POST'
                // layout += "<form id='form-" + id + "'>";
                // layout += "<div class='modal-body'>" + create(json.properties[id]) + "</div>";
                // // Footer
                // layout += "<div class='modal-footer'>";
                // layout += "<button type='reset' id='" + id + "-cancel' class='btn btn-secondary'>Cancel</button>";
                // layout += "<button type='submit' class='btn btn-primary'>Submit</button>";
                // layout += "</div></form></dialog>";
                return layout;
            }

            // Nested Dialog
            function NestedDialog(id, path) {
                var layout = "";

                // Modal
                layout += "<div class='modal fade' id='" + id + "-modal' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>";
                layout += "<div class='modal-dialog' role='document'>";
                layout += "<div class='modal-content'>";
                // Header
                layout += "<div class='modal-header'>";
                layout += "<h5 class='modal-title' id='exampleModalLabel'>" + id + "</h5></div>";
                // Body         
                // action='/action_page.php' method='POST'
                layout += "<form id='form-" + id + "'>";
                layout += "<div class='modal-body'>" + create(path) + "</div>";
                // Footer
                layout += "<div class='modal-footer'>";
                layout += "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>";
                layout += "<button type='submit' class='btn btn-primary'>Submit</button>";
                layout += "</div></form></div></div></div>";

                // var dialog = id + '-dialog';
                // // Nested Dialog
                // layout += "<dialog id='" + dialog + "' class='dialog-content bg-light'>";
                // // Header
                // layout += "<h4 class='modal-title modal-header'>" + id.substring(0, id.length - 2) + "</h4>";
                // // Body
                // layout += "<div class='modal-body'>" + create(path) + "</div>";
                // // Footer
                // layout += "<div class='modal-footer'>";
                // layout += "<button id='" + id + "-cancel' class='btn btn-secondary' type='reset'>Cancel</button>";
                // layout += "<button id='" + id + "-done' type='button' class='btn btn-primary'>Done</button>";
                // layout += "</div></dialog>";
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
                    layout += "<div class='reveal-" + title + "' style='opacity:0; max-height: 0; overflow: hidden;'>";
                    layout += create(path);
                    layout += "</div>";
                }
                layout += "</form>";
                layout += "</div class='modal fade'>";
                // Footer
                layout += "<div class='modal-footer'>";
                layout += "<button id='" + id + "-cancel' class='btn btn-secondary' type='reset'>Cancel</button>";
                layout += "<button id='" + id + "-done' type='button' class='btn btn-primary'>Done</button>";
                layout += "</div></dialog>";
                return layout;
            }


            //-------------------------------Cases--------------------------------
            // Input Case
            function inputCase(data) {
                var layout = "";
                var min = "";
                var max = "";
                var isRequired = false;
                for (j in required) {
                    if (required[j] === objectName) {
                        isRequired += true;
                    }
                }
                if (data === "number") {
                    min += "min='" + minimum + "'";
                    max += "max='" + maximum + "'";
                }
                if (isRequired) {
                    layout += "<h6><label for='label-" + objectName + "'>" + upperCaseFirst(objectName) + " *</label></h6>";
                    layout += "<input id='in-" + objectName + "' class='form-control' name='" + objectName + "' type='" + data + "' placeholder='" + data + "' " + min + max + "required><br>";
                } else {
                    layout += "<h6><label for='label-" + objectName + "'>" + upperCaseFirst(objectName) + "</label></h6>";
                    layout += "<input id='in-" + objectName + "' class='form-control' name='" + objectName + "' type='" + data + "' placeholder='" + data + "' " + min + max + "><br>";
                }
                return layout;
            }
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
                layout += "<p><h6><label for='label-" + id + "'>" + upperCaseFirst(id) + "</label></h6><button id = '" + id + "-" + idCounter + "-btn' type='button' class='btn btn-primary btn-sm'>New " + id + "</button></p>";
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
                    layout += "<h6><label for='label-" + objectName + "'>" + upperCaseFirst(objectName) + "</label><div id='returnContent'></div></h6><button id = '" + id + "-btn' type='button' class='btn btn-primary btn-sm'>Select</button>";
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
            // for (var i = 0; i < json.required.length; i++) {
            //     buttonBaseFunction(json.required[i]);
            // }

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
            // function buttonBaseFunction(id) {
            //     (function () {
            //         var btn = id + '-btn';
            //         var dialog = id + '-dialog';
            //         var cancel = id + '-cancel';
            //         var formDialog = document.getElementById(dialog);
            //         // Creat
            //         document.getElementById(btn).addEventListener('click', function () {
            //             formDialog.showModal();
            //         });
            //         // Cancel
            //         document.getElementById(cancel).addEventListener('click', function () {
            //             unckeckRadioButtons();
            //             formDialog.close();
            //         });
            //         // Submit
            //         $(formDialog).submit(function () {
            //             outputData = output;
            //             $(id).serializeObject();
            //             alert(id + " Submitted");
            //         });
            //     })();
            // }

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

            // Start file download.
            document.getElementById("dwn-btn").addEventListener("click", function () {
                var filename = "data.json";
                download(filename, outputData);
            }, false);

            // Download Form Data
            function download(filename, outputData) {
                var element = document.createElement('a');
                element.setAttribute('href', "data:" + "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(outputData)));
                element.setAttribute('download', filename);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            }

            // Upper Case First Character
            function upperCaseFirst(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        }
    });
});