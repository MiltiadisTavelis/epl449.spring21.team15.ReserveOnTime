function popUpMessage(text, type) {
    var message = document.createElement('div');
    message.setAttribute("class", "alert alert-" + type + " text-center popup");
    message.setAttribute("role", "alert");
    message.textContent = text;
    var container = document.getElementById("contents");
    container.appendChild(message);

    $(".popup").delay(4000).fadeOut(function() {
        $(this).remove();
    });
}