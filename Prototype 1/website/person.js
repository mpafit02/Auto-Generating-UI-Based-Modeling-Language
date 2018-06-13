$(function () {
    var data = $.ajax({
        url: "person.json",
        dataType: "json",
        type: "get",
        cache: false,
        success: function (data) {
            console.log(data.definitions);

            function personTemplate(person) {
                return `
                    <div class = "person">
                    <img class = "person-photo" src = "${person.photo}">
                    <h2 class = "person-name">${person.name} ${person.surname} <span class = "person-gender">(${person.gender})</span></h2>
                    </div>
                `
            }
            document.getElementById("app").innerHTML =
            `
            <nav>
            <div class="btn-group-vertical">
                <button type="button" class="btn btn-primary btn-lg">Marios Pafitis</button>
                <button type="button" class="btn btn-primary btn-lg">Jhoanna Georgiou</button>
                <button type="button" class="btn btn-primary btn-lg">Patricia Milou</button>
            </div>
            </nav>
            <h1 class = "app-title"><strong>Interns 2018</strong></h1>
            ${data.map(personTemplate).join('')}
            <p class = "footer">We have ${data.length} interns.</p>
            `
        }
    });
});