checkSession("m", true)

window.addEventListener("load", function() {
    var checkboxes = document.getElementsByClassName("check");
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", function() {
            let day = this.id.split("-")[1]
            document.getElementById("time-" + day).disabled = !this.checked
        })
    }
})