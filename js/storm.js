/**
 * Created by K9A2S on 2017/4/12.
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}
function RedirectTo404() {
    window.location = "./404.html";
}