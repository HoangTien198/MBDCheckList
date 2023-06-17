$("#btnLogin").click(function () {
    login();
});
$("#username").keyup(function (event) {
    if (event.keyCode === 13) {
        login();
    }
});
$("#password").keyup(function (event) {
    if (event.keyCode === 13) {
        login();
    }
});

