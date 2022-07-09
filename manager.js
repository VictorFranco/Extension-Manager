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
            checks[index] = document.getElementById("check".concat(index));
            checks[index].addEventListener("click", pressed);
        };
        extensions.forEach(callback);
    });
}
var html_extension = function (extension, index) {
    return "<div class=\"row\" id=\"row".concat(index, "\">").concat(icon_(extension) +
        name_(extension.name) +
        button_(index, extension.enabled), "</div>");
};
var name_ = function (name) {
    return "<div class=\"div_ext\">".concat(name, "</div>");
};
var icon_ = function (extension) {
    var _a;
    var img = extension.icons.filter(function (item) { return item.size == 128; })[0];
    return "<img src=\"".concat((_a = img.url) !== null && _a !== void 0 ? _a : "", "\">");
};
var button_ = function (i, check) {
    var checked = check ? "checked" : "";
    return "<input id=\"check".concat(i, "\" type=\"checkbox\" ").concat(checked, ">\n            <label for=\"check").concat(i, "\"></label>");
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
        var row = document.getElementById("row".concat(index));
        var name = extension.name.toUpperCase();
        var is_similar = name.indexOf(input.value.toUpperCase()) > -1;
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
                toggle = document.getElementById("check".concat(index));
                toggle.checked = state;
            });
    };
    extensions.forEach(callback);
}
