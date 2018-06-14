$(function () {
    data = $.ajax({
        url: "schema.json",
        dataType: "json",
        type: "get",
        cache: false,
        success: function (data) {

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


            document.getElementById("app").innerHTML =
                `         
                <main role="main" align="center" style = "margin: 30px auto;">
                <h1 class="bd-title" id="content">Form</h1>
                <br>
                ${create(data.properties)}
                ${displayKeys()}  
                </main>   
                `;

            function create(data) {
                var out = "<form><div class='form-group'>";
                var key = Object.keys(data);
                var val = Object.values(data);
                for (i in val) {
                    if (typeof val[i] === "object") {
                        out = out + "<h3>" + key[i] + create(val[i]) + "</h3>";
                    } else if (key[i] === "type") {
                        out += "<label><input class='form-control' placeholder = '" + val[i] + "'></label>";
                    }
                }
                out += "</div></form>"
                return out;
            }

            function displayKeys() {
                var keys = Object.keys(data);
                var out = "<div class='bd-sidebar' style = 'position: fixed; top: 0; left: 0; margin: 30px;'><nav><div class = 'btn-group-vertical' align = 'center'>";
                for (i in keys) {
                    out += "<button type='button' class='btn btn-danger btn-lg'>" + keys[i] + "</button>";
                }
                out += "</div></nav></div>"
                return out;
            }

        }
    });
});





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