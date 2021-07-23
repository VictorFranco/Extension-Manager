var container = document.getElementById("container");
var input = document.getElementById("search");
var all_enabled = document.getElementById("all_enabled");
var all_disabled = document.getElementById("all_disabled");
var div = document.createElement("DIV");
var btn_close = document.getElementById("close");
var checks = [];
var extensions = [];
input.addEventListener("keyup", search);
all_enabled.addEventListener("click", activate_desactivate);
all_disabled.addEventListener("click", activate_desactivate);
btn_close.addEventListener("click", function () { return window.close(); });
load();
function load() {
    chrome.management.getAll(function (array) {
        extensions = array;
        /*    <---Create HTML structure--->    */
        var html_elements = extensions.map(html_extension).reduce(function (a, b) { return a + b; });
        /*    <---Update DOM--->    */
        container.innerHTML = html_elements;
        var callback = function (_, index) {
            checks[index] = document.getElementById("check" + index);
            checks[index].addEventListener("click", pressed);
        };
        extensions.forEach(callback);
    });
}
var html_extension = function (extension, index) {
    return "<div class=\"row\" id=\"row" + index + "\">" + (icon(extension) +
        name_(extension.name) +
        button(index, extension.enabled)) + "</div>";
};
var name_ = function (name) {
    return "<div class=\"div_ext\">" + name + "</div>";
};
var icon = function (extension) {
    var src = "";
    extension.icons.forEach(function (ext_icon) {
        if (ext_icon.size == 128)
            src = ext_icon.url;
    });
    return "<img src=\"" + (src || "") + "\">";
};
var button = function (i, check) {
    var checked = check ? "checked" : "";
    return "<input id=\"check" + i + "\" type=\"checkbox\" " + checked + ">\n            <label for=\"check" + i + "\"></label>";
};
function pressed() {
    var input;
    input = window.event.target;
    var id = input.id;
    var num = Number(id.split("check")[1]);
    var id_ext = extensions[num].id;
    input = document.getElementById(id);
    chrome.management.setEnabled(id_ext, input.checked);
}
function search() {
    var callback = function (extension, index) {
        var row = document.getElementById("row" + index);
        var nombre = extension.name.toUpperCase();
        var is_similar = nombre.indexOf(input.value.toUpperCase()) > -1;
        row.style.display = is_similar ? "" : "none";
    };
    extensions.forEach(callback);
}
function activate_desactivate() {
    var toggle;
    var btn = window.event.target;
    var state = btn.id == "all_enabled";
    var callback = function (extension, index) {
        if (chrome.runtime.id != extension.id)
            chrome.management.setEnabled(extension.id, state, function () {
                toggle = document.getElementById("check" + index);
                toggle.checked = state;
            });
    };
    extensions.forEach(callback);
}
