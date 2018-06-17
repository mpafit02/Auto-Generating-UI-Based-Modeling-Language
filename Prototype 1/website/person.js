// var Ajv = require('ajv');
// var ajv = Ajv({allErrors: true});
// var validate = ajv.compile(userSchema);
// var valid = validate(user);
// if (valid) {
//   console.log('User data is valid');
// } else {
//   console.log('User data is INVALID!');
//   console.log(validate.errors);
// }

var data;
var json;

$(function () {
    data = $.ajax({
        url: "schema.json",
        dataType: "json",
        type: "get",
        cache: false,
        success: function (data) {
            json = data;
            document.getElementById("app").innerHTML =
                `
                <main role="main" style = " margin: 6px">
                <form>
                <legend>${data.description}</legend>
                ${create(data.properties.elasticityPolicies)}
                </form>
                </main>   
                `;
        }
    });
});

function create(link) {
    var hasReference = false;
    var components = "";
    var layout = "";
    var key = Object.keys(link);
    var val = Object.values(link);
    for (i in key) {
        if (key[i] === "id") {
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
            layout += "<p><div class='border border-primary rounded' style = 'padding: 6px'>" + create(p) + "</div></p>";
        } else if (typeof val[i] === "object") { // object
            hasReference = false;
            layout += "<p><div class='border border-danger rounded' style = 'padding: 6px'><label >" + key[i] + "</label>" + create(val[i]) + "</div>";
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
        } else if (key[i] === "type") {
            components += "<input class='form-control' placeholder = '" + val[i] + "'>";
        }
    }
    if (!hasReference) {
        layout += components;
    }
    return layout;
}

// function displayButtons(data) {
//     var keys = data.required;
//     var out = "<div class='bd-sidebar' style = 'position: fixed; top: 0; right: 0; margin: 12px'><nav><div class = 'btn-group-vertical' align = 'center'>";
//     for (j in keys) {
//         out += "<button id = '" + keys[j] + "' type= 'button' class='btn btn-danger btn-lg'>" + keys[j] + "</button>";
//     }
//     out += "</div></nav></div>";
//     return out;
// }




// document.getElementById('version').addEventListener("click", function () {
//     document.getElementById("app").innerHTML +=
//         `
//     ${create(json.properties.version)}
//     `;
// });
// document.getElementById('elasticityPolicies').addEventListener("click", function () {
//     document.getElementById("app").innerHTML +=
//         `
//     ${create(json.properties.elasticityPolicies)}
//     `;
// });

// var json;
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
//                 ${displayButtons(data)}
//                 <main role="main" style = "width: 80%; margin: 12px">
//                 <form>
//                 <legend>Elasticity Policies</legend>
//                 ${create(data.properties.elasticityPolicies)} 
//                 </form>
//                 </main>   
//                 `;

//             function create(link) {
//                 var hasReference = false;
//                 var components = "";
//                 var layout = "";
//                 var key = Object.keys(link);
//                 var val = Object.values(link);
//                 for (i in key) {
//                     if (key[i] === "id") {
//                         // Do something
//                     } else if (key[i] === "enum") { // enum
//                         layout += "<select class='form-control'>";
//                         for (j in key[i]) {
//                             layout += "<option>" + val[i][j] + "</option>";
//                         }
//                         layout += "</select>";
//                     } else if (val[i].constructor == Array) { // oneOf
//                         if (key[i] === "oneOf") {
//                             for (j in link[key[i]]) {
//                                 if (typeof val[i] != "undefined") {
//                                     var path = val[i][j].$ref;
//                                     var p = json;
//                                     if (typeof path != "undefined") {
//                                         var keywords = path.substring(2, path.length).split("/");
//                                         for (i in keywords) {
//                                             p = p[keywords[i]];
//                                         }
//                                         layout += "<p><div class='border border-danger rounded' style = 'padding: 8px'><label> Choice: " + j + "</label>" + create(p) + "</div></p>";
//                                     }
//                                 }
//                             }
//                         } else if (key[i] === "required") {
//                             // Do something
//                         }
//                     } else if (typeof val[i] === "object") { // object
//                         hasReference = false;
//                         layout += "<p><div class='border border-danger rounded' style = 'padding: 12px'><label >" + key[i] + "</label>" + create(val[i]) + "</div>";
//                     } else if (key[i] === '$ref') { // items
//                         var path = link.$ref;
//                         var p = json;
//                         if (typeof path != "undefined") {
//                             var keywords = path.substring(2, path.length).split("/");
//                             for (i in keywords) {
//                                 p = p[keywords[i]];
//                             }
//                             layout += create(p);
//                         }
//                         hasReference = true;
//                     } else if (val[i] === "boolean") {
//                         components += "<label class='form-control form-check-label'><input type = 'checkBox'></label>";
//                     } else if (key[i] === "type") {
//                         components += "<div class='col-form-label'><input class='form-control' style = 'width: 40%' placeholder = '" + val[i] + "'></div>";
//                     }
//                 }
//                 if (!hasReference) {
//                     layout += components;
//                 }
//                 return layout;
//             }

//             function displayButtons(data) {
//                 var keys = data.required;
//                 var out = "<div class='bd-sidebar' style = 'position: fixed; top: 0; right: 0; margin: 12px'><nav><div class = 'btn-group-vertical' align = 'center'>";
//                 for (i in keys) {
//                     out += "<button type='button' class='btn btn-danger btn-lg'>" + keys[i] + "</button>";
//                 }
//                 out += "</div></nav></div>"
//                 return out;
//             }
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
//         if (typeof val[i] === "object" && key[i] != 'items') {
//             hasReference = false;
//             layout += "<p><div class='border border-danger rounded' style = 'padding: 12px'><label >" + key[i] + "</label>" + create(val[i]);
//         } else if (key[i] === "type" && val[i] === "array") {
//             var path = link.items.$ref;
//             var p = json;
//             if (typeof path != "undefined") {
//                 var keywords = path.substring(2, path.length).split("/");
//                 for (i in keywords) {
//                     p = p[keywords[i]];
//                 }
//                 layout += create(p);
//             }
//             hasReference = true;
//             layout += "</div></div>";
//         } else {
//             if (val[i] === "boolean") {
//                 components += "<label class='form-check-label'><input type = 'checkBox'></label>";
//             } else {
//                 components += "<div class='col-form-label'><input class='form-control' style = 'width: 40%' placeholder = '" + val[i] + "'></div></div></p>";
//             }
//         }
//     }
//     if (!hasReference) {
//         layout += components;
//     } else {
//         //....
//     }
//     return layout;
// }
// }
// });
// });

// NOT WORKING
// else if (key[i] === "oneOf") {
//     for (j in val[i]) {
//             var path = link.oneOf[j].$ref;
//             console.log(path);
//             var p = json;
//             if (typeof path != "undefined") {
//                 var keywords = path.substring(2, path.length).split("/");
//                 for (i in keywords) {
//                     p = p[keywords[i]];
//                 }
//                 layout += create(p);
//             }

//     }
//     hasReference = true;
//     layout += "</div></div>";
// } 

// $(function () {
//     data = $.ajax({
//         url: "schema.json",
//         dataType: "json",
//         type: "get",
//         cache: false,
//         success: function (data) {
//             document.getElementById("app").innerHTML =
//                 `         
//                 <main role="main" style = "margin: 20px">
//                 <br>
//                 <form><legend>Form</legend><fieldset>
//                 ${create(data)} 
//                 </fieldset></form>
//                 </main>   

//                 `;

//             function create(data) {
//                 var path = data.properties;
//                 var hasReference = false;
//                 var components = "";
//                 var layout = "";
//                 var key = Object.keys(data);
//                 var val = Object.values(data);
//                 for (i in key) {
//                     if (typeof val[i] === "object" && key[i] != 'items') {
//                         hasReference = false;
//                         layout += "<div class='border border-danger rounded form-group row' style = 'margin: 12px'><label class='my-1' style ='padding: 12px'>" + key[i] + "</label>" + create(val[i]);
//                     } else if (key[i] === "type" && val[i] === "array") {
//     //path = .... // create(path); **********************************************
//                         console.log(data.items.$ref);
//                         hasReference = true;
//                         layout += "</div></div>";
//                     } else {
//                         if (val[i] === "boolean") {
//                             components += "<label class='form-check-label'><input type = 'checkBox'></label>";
//                         } else {
//                             components += "<div class='col-sm-5 col-form-label'><input class='form-control form-control' id='colFormLabelSm' placeholder = '" + val[i] + "'></div></div>";
//                         }
//                     }
//                 }
//                 if (!hasReference) {
//                     layout += components;
//                 } else {
//                     //....
//                 }
//                 return layout;
//             }

//             function displayKeys(data) {
//                 var keys = data;
//                 var out = "<div class='bd-sidebar' style = 'position: fixed; top: 0; left: 0; margin: 30px;'><nav><div class = 'btn-group-vertical' align = 'center'>";
//                 for (i in keys) {
//                     out += "<button type='button' class='btn btn-danger btn-lg'>" + keys[i] + "</button>";
//                 }
//                 out += "</div></nav></div>"
//                 return out;
//             }

//         }
//     });
// });



// var out = "<form><div class='form-group'>";
//                 var key = Object.keys(data);
//                 var val = Object.values(data);
//                 for (i in val) {
//                     if (typeof val[i] === "object" && key[i] != 'items') {
//                         out = out + "<h3>" + key[i] + create(val[i]) + "</h3>";
//                     } else {
//                         if (key[i] === "items") {
//                             out = out + key[i].toString() + " " + val[i]
//                             console.log(data.items.$ref);
//                         } else if (key[i] === "type") {
//                             out += "<label><input class='form-control' placeholder = '" + val[i] + "'></label>";
//                         }
//                     }
//                 }
//                 out += "</div></form>"
//                 return out;


// var keys = Object.keys(data);
// var values = Object.values(data);

// //Get keys
// console.log(keys);
// for (i in keys) {
//     console.log(typeof keys[i]);
// }

// //Get values
// console.log(values);
// for(i in values){
//     console.log(typeof values[i]);
// }

// for (i in keys) {
//     console.log(keys[i] + ": " + values[i]);
// }

// document.getElementById("app").innerHTML =
//     `
//         <nav>
//         <div class="btn-group-vertical">
//             <button type="button" class="btn btn-primary btn-lg">Marios Pafitis</button>
//             <button type="button" class="btn btn-primary btn-lg">Jhoanna Georgiou</button>
//             <button type="button" class="btn btn-primary btn-lg">Patricia Milou</button>
//         </div>
//         </nav>
//         <h1 class = "app-title"><strong>Interns 2018</strong></h1>
//         ${data}
//   `


// function personTemplate(person) {
//     return `
//                     <div class = "person">
//                     <img class = "person-photo" src = "${person.photo}">
//                     <h2 class = "person-name">${person.name} ${person.surname} <span class = "person-gender">(${person.gender})</span></h2>
//                     </div>
//                 `
// }


// $(function () {
//     var data = $.ajax({
//         url: "person.json",
//         dataType: "json",
//         type: "get",
//         cache: false,
//         success: function (data) {
//             console.log(data.definitions);

//             function personTemplate(person) {
//                 return `
//                     <div class = "person">
//                     <img class = "person-photo" src = "${person.photo}">
//                     <h2 class = "person-name">${person.name} ${person.surname} <span class = "person-gender">(${person.gender})</span></h2>
//                     </div>
//                 `
//             }
//             document.getElementById("app").innerHTML =
//             `
//             <nav>
//             <div class="btn-group-vertical">
//                 <button type="button" class="btn btn-primary btn-lg">Marios Pafitis</button>
//                 <button type="button" class="btn btn-primary btn-lg">Joanna Georgiou</button>
//                 <button type="button" class="btn btn-primary btn-lg">Patricia Milou</button>
//             </div>
//             </nav>
//             <h1 class = "app-title"><strong>Interns 2018</strong></h1>
//             ${data.map(personTemplate).join('')}
//             <p class = "footer">We have ${data.length} interns.</p>
//             `
//         }
//     });
// });