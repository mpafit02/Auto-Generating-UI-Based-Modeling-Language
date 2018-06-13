$(function () {
    var data = $.ajax({
        url: "person-schema.json",
        dataType: "json",
        type: "get",
        cache: false,
        success: function (data) {
            console.log(data);
            var keys = Object.keys(data);

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


            //Check if there is an object in the array


            // HTML

            document.getElementById("app").innerHTML =
                `
            <main role="main" align="center" style = "margin: 30px auto;">
            <h1 class="bd-title" id="content">Interns 2018</h1>
            <br>
                <form>
                    ${nestedObjects(data.properties)}
                </form>
            </main>
            
            <div class="bd-sidebar" style = "position: fixed; top: 0; left: 0; margin: 30px;">
            <nav>
                <div class="btn-group-vertical" align="center">
                    ${displayKeys()}
                </div>
                </nav>
            </div>
            `;

            function nestedObjects(data) {
                var out = "";
                var key = Object.keys(data);
                var val = Object.values(data);
                for (i in val) {
                    if (typeof val[i] === "object") {
                        out = out + "<h3>" + key[i] + "</h3>" + nestedObjects(val[i]);
                    } else {
                        out += "<div class='form-group'><label align = 'left'>" + key[i] + "<input class='form-control' placeholder = '" + val[i] + "'></label></div>";
                    }
                }
                return out;
            }

            function displayKeys() {
                var out = "";
                for (i in keys) {
                    out += "<button type='button' class='btn btn-danger btn-lg'>" + keys[i] + "</button>";
                }
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