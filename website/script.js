// General Variables
var json = undefined;
var active = false;
var hasEnum = false;
var hasAdditionalProperties = false;
var hasUniqueItems = false;
var objectName = "";
var returnContent = "";
var modalLayout = "";
var existingItems = "";
var parent = "";
var idCounter = 0;
var inputCounter = 0;
var selectCounter = 0;
var itemMap = new Map();
var minItems = Number.MIN_VALUE;
var minProperties = Number.MIN_VALUE;
var minProperties = Number.MAX_VALUE;
var minimum = Number.MIN_VALUE;
var maximum = Number.MAX_VALUE;
var items = [];
var selectModal = [];
var selectCases = [];
var required = [];
var nestedModal = [];
var editModal = [];
var outputData = {};
var formContent = {};
var innerObject = {};
// -----------------------------------JSON upload---------------------------------------
// Upload File
function uploadFile(event) {
    var input = event.target;
    var txt = "";
    var reader = new FileReader();
    reader.onload = function () {
        var file = reader.result;
        var isValidJSON = isValid(file);
        if (isValidJSON) {
            txt += "<p><div style='font-weight: 700;'>Upload file: </div></p>";
            txt += "<i class='fa fa-file-text-o'style='font-size:30px; color:white;'></i>";
            txt += " " + input.files[0].name + "<br>";
            txt += "<input type='button' id='upload-btn' class='btn btn-primary float-right' value='Upload'>";
            json = JSON.parse(file);
            document.getElementById("output").innerHTML = txt;
            document.getElementById("upload-btn").addEventListener("click", function () {
                createPage();
                $("#upload-card").fadeOut();
            });
        } else {
            txt += "<div style='color:#ff2045;'>";
            txt += "<p><div style='font-weight: 700;'>Not valid: </div></p>";
            txt += "<i class='fa fa-file-text-o'style='font-size:30px;'></i>";
            txt += " " + input.files[0].name + "<br>";
            txt += "<br>Upload a valid JSON file!</div>";
            document.getElementById("output").innerHTML = txt;
        }
    };
    reader.readAsText(input.files[0]);
};
// Validate JSON file
function isValid(file) {
    try {
        JSON.parse(file);
        return true;
    } catch (e) {
        return false;
    }
}
// Create Page
function createPage() {
    document.getElementById("app").innerHTML = `
<nav class="navbar fixed-top top-nav text-light" style='background-color: rgba(30,30,30,0.6);'>
<div class="navbar-brand mb-0 h1 text-light">${json.description}</div>
<input type="button" class='btn btn-primary btn-sm float-right' id="dwn-btn" value='Save'>
</nav>
<input type='button' class='btn btn-lg btn-dark centered' data-toggle='modal' data-target='#Properties-modal' value='New Properties'>
${BaseModal("Properties", json.properties)}
<div id='modalLayout'></div>
`;
    // -------------------------------Methods------------------------------------
    // Add the modals
    document.getElementById('modalLayout').innerHTML = modalLayout;
    // Uncheck Radio Buttons     
    function unckeckRadioButtons() {
        for (i in selectCases) {
            $('#select-' + selectCases[i])[0].checked = false;
            var other = $('#select-' + selectCases[i]).val();
            $('.reveal-' + other).show().css({
                'opacity': '0',
                'max-height': '0',
                'overflow': 'hidden'
            });
        }
    }
    // Check for key press actions in nested modal
    for (i in nestedModal) {
        buttonNestedFunction(nestedModal[i]);
    }
    // Check for key press actions in select modal
    for (i in selectModal) {
        buttonSelectFunction(selectModal[i]);
    }
    // Function for submit buttons in Nested Modal
    function buttonNestedFunction(id) {
        var btn = id + '-btn';
        var modal = id + '-modal';
        var formid = id + '-form';
        document.getElementById(btn).addEventListener("click", function () {
            var form = document.getElementById(formid);
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                if (itemMap.has(id)) {
                    itemMap.set(id, itemMap.get(id) + 1);
                } else {
                    itemMap.set(id, 1);
                }
                var layout = "<div class='btn-group btn-space' role='group'>";
                layout += "<button type='button' id='" + id + "-" + itemMap.get(id) + "-btn' class='btn btn-outline-primary btn-sm' data-toggle='modal' data-target='#" + id + "-modal'>" + upperCaseFirst(id) + " " + itemMap.get(id) + "</button>";
                layout += "<button type='button' id='" + id + "-" + itemMap.get(id) + "-delete-btn' class='btn btn-outline-danger btn-sm'>";
                layout += "<i class='fa fa-trash-o' style='font-size:18px' aria-hidden='true'></i></button></div>";
                document.getElementById(id + "-existing-items").innerHTML += layout;
                formContent[id + "-" + itemMap.get(id)] = $(form).serializeArray();
                event.preventDefault();
                $('#' + modal).modal('hide');
            }
            form.classList.add('was-validated');
        });
    }
    // Function for submit buttons in Select Modal
    function buttonSelectFunction(id) {
        var modal = id + '-modal';
        var btn = id + '-btn';
        var cancel = id + '-cancel';
        'use strict';
        document.getElementById(btn).addEventListener("click", function () {
            $('#' + modal).modal('hide');
        });
        document.getElementById(cancel).addEventListener('click', function () {
            unckeckRadioButtons();
            $('#' + modal).modal('hide');
        });
    }
    // Display the dialog which is selected in oneOf case
    $("input").on("click", function () {
        var id = $("input:checked").val();
        if (id == undefined) {
            id = "";
        }
        document.getElementById('returnContent').innerHTML = id;
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
    // Save form button
    document.getElementById('save-form-btn').addEventListener("click", function () {
        $("#base-form").submit(function (event) {
            console.log($(this).serializeArray());
            event.preventDefault();
        });
    });
    // Upper Case First Character
    function upperCaseFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    //---------------------------DIALOGS--------------------------
    // Base Modal
    function BaseModal(id, path) {
        var layout;
        // Modal
        layout = "<div class='modal fade' id='" + id + "-modal' role='dialog'>";
        layout += "<div class='modal-dialog modal-lg'>";
        layout += "<div class='modal-content'>";
        // Header
        layout += "<div class='modal-header'>";
        layout += "<h5 class='modal-title'>" + id + "</h5></div>";
        // Body 
        var formid = "base-form";
        layout += "<form id='" + formid + "' class='needs-validation' novalidate>";
        layout += "<div class='modal-body'>" + create(path, formid) + "</div>";
        // Footer
        layout += "<div class='modal-footer'>";
        layout += "<input type='button' class='btn btn-secondary' data-dismiss='modal' value='Cancel'>";
        layout += "<input type='submit' class='btn btn-primary' id='save-form-btn' form='" + formid + "' value='Submit'>";
        layout += "</div></form></div></div></div>";
        return layout;
    }

    // Nested Modal
    function NestedModal(id, path) {
        nestedModal.push(id);
        var layout;
        // Modal
        layout = "<div class='modal fade' id='" + id + "-modal' role='dialog' >";
        layout += "<div class='modal-dialog modal-lg'>";
        layout += "<div class='modal-content'>";
        // Header
        layout += "<div class='modal-header'>";
        layout += "<h5 class='modal-title'>" + id + "</h5></div>";
        // Body 
        var formid = id + "-form";
        layout += "<form id='" + formid + "' class='needs-validation' novalidate>";
        layout += "<div class='modal-body'>" + create(path, formid) + "</div>";
        // Footer
        layout += "<div class='modal-footer'>";
        layout += "<input type='button' class='btn btn-secondary' data-dismiss='modal' value='Cancel'>";
        layout += "<input type='button' id='" + id + "-btn' class='btn btn-primary' value='Create " + upperCaseFirst(id) + "'>";
        layout += "</div></form></div></div></div>";
        return layout;
    }

    // Select Modal
    function SelectModal(id, data) {
        var layout = "";
        var title = "";
        // Modal
        layout = "<div class='modal fade' id='" + id + "-modal' role='dialog' >";
        layout += "<div class='modal-dialog modal-lg'>";
        layout += "<div class='modal-content'>";
        // Header
        layout += "<div class='modal-header'>";
        layout += "<h5 class='modal-title'>" + id + "</h5></div>";
        // Body 
        layout += "<div class='modal-body'>";
        var formid = id + "-select-form";
        layout += "<form id='" + formid + "' class='needs-validation' novalidate>";
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
            layout += create(path, formid);
            layout += "</div>";
        }
        layout += "</div>";
        // Footer
        layout += "<div class='modal-footer'>";
        layout += "<input type='button' id='" + id + "-cancel' class='btn btn-secondary' value='Cancel'>";
        layout += "<input type='button' id='" + id + "-btn' class='btn btn-primary' value='Create " + upperCaseFirst(id) + "'>";
        layout += "</div></form></div></div></div>";
        return layout;
    }
    //------------------------------Element Creation----------------------------
    // Create Elements
    function create(data, formid) {
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
            if (key[i] === "id" && typeof val[i] != "object") { // id
                var path = json;
                var id = "";
                var keywords = val[i].substring(2, val[i].length).split("/");
                for (i in keywords) {
                    id = keywords[i];
                    path = path[keywords[i]];
                }
            } else if (key[i] === "required") { // required
                required = val[i];
            } else if (key[i] === "uniqueItems") { // uniqueItems
                hasUniqueItems = val[i];
            } else if (key[i] === "additionalProperties") { // additionalProperties
                hasAdditionalProperties = val[i];
            } else if (key[i] === "items") { // items
                layout += create(val[i], formid);
            } else if (key[i] === "properties") { // properties
                layout += create(val[i], formid);
            } else if (key[i] === "oneOf") { // oneOf
                layout += oneOfCase(val[i], formid);
            } else if (key[i] === "enum") { // enum
                layout += "<h6><label for='label-" + objectName + "'>" + upperCaseFirst(objectName) + "</label></h6>";
                layout += enumCase(val, formid);
            } else if (typeof val[i] === "object") { // object
                objectName = key[i];
                layout += create(val[i], formid);
            } else if (key[i] === '$ref') { // $ref
                layout += itemCase(data, formid);
            } else if (val[i] === "boolean") { // boolean
                layout += "<p><label for='id-" + objectName + "' class='checkbox-container'>" + upperCaseFirst(objectName);
                layout += "<input id='id-" + objectName + "' type='checkbox' name='" + objectName + "' form='" + formid + "'><span class='checkbox-checkmark'></span></label></p>";
            } else if (key[i] === "type" && val[i] != "array" && val[i] != "object" && !hasEnum) { // string integer
                layout += inputCase(val[i], formid);
            }
        }
        return layout;
    }

    //-------------------------------Cases--------------------------------
    // Input Case
    function inputCase(data, formid) {
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
            layout += "<h6><label for='id-" + objectName + "'>" + upperCaseFirst(objectName) + " *</label></h6>";
            layout += "<input id='id-" + objectName + "' class='form-control form-control-sm' name='" + objectName + "' type='" + data + "' autocomplete='off' placeholder='Enter " + upperCaseFirst(objectName) + "...' " + min + max + " form='" + formid + "' required>";
        } else {
            layout += "<h6><label for='id-" + objectName + "'>" + upperCaseFirst(objectName) + "</label></h6>";
            layout += "<input id='id-" + objectName + "' class='form-control form-control-sm' name='" + objectName + "' type='" + data + "' autocomplete='off' placeholder='Enter " + upperCaseFirst(objectName) + "...' " + min + max + " form='" + formid + "'>";
        }
        layout += "<div class='invalid-feedback'>Please choose a " + objectName + ".</div>";
        return layout + "<br>";
    }
    // Item Case
    function itemCase(data, formid) {
        var layout = "";
        var ref = data.$ref;
        var path = json;
        var id;
        var keywords = ref.substring(2, ref.length).split("/");
        for (i in keywords) {
            id = keywords[i];
            path = path[keywords[i]];
        }
        layout += "<p><h6><label for='id-" + id + "'>" + upperCaseFirst(id) + "</label></h6>";
        layout += "<div id='" + id + "-existing-items'></div>";
        layout += "<input type='button' name='" + id + "' id='" + id + "-create-btn' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#" + id + "-modal' value='New " + upperCaseFirst(id) + "'></p>";
        modalLayout = NestedModal(id, path) + modalLayout;
        return layout;
    }
    // oneOf Case
    function oneOfCase(data, formid) {
        var layout = "";
        if (Object.keys(data[0]) == "$ref") {
            layout += "<h6><label for='id-" + objectName + "'>" + upperCaseFirst(objectName) + "</label><div id='returnContent'></div></h6>";
            layout += "<input type='button' class='btn btn-primary btn-sm' data-toggle='modal' data-target='#" + objectName + "-modal' value='Select'></p>";
            selectModal.push(objectName);
            modalLayout = SelectModal(objectName, data) + modalLayout;
        } else {
            layout += create(data, formid);
        }
        return layout;
    }
    // Enum Case
    function enumCase(val, formid) {
        var layout = "";
        layout += "<select name='" + objectName + "' class='form-control form-control-sm' form='" + formid + "'>";
        for (j in val[i]) {
            layout += "<option>" + val[i][j] + "</option>";
        }
        layout += "</select><br>";
        hasEnum = false;
        return layout;
    }
}