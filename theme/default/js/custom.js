/**
 * 实现点击返回页面顶部功能，来自 http://blog.csdn.net/zhyh1986/article/details/8644899
 */
$(function () {
    var $backToTopEle = $('#toTop'),
        $backToTopFun = function () {
            var st = $(document).scrollTop(),
                winh = $(window).height();
            (st > 200) ? $backToTopEle.fadeIn('slow'): $backToTopEle.fadeOut('slow');
            if (!window.XMLHttpRequest) {
                $backToTopEle.css("top", st + winh - 166);
            }
        };
    $('#toTop').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 1200);
    });
    $backToTopEle.hide();
    $backToTopFun();
    $(window).bind("scroll", $backToTopFun);
    $('#catalogWord').click(function () {
        $("#catalog").slideToggle(600);
    });
});

function getTOC(id) {
    // 去除连接中的锚点
    var linkBase = document.location.href;
    var j = linkBase.length;
    for (; j > 0; j--) {
        if (linkBase.charAt(j) === '#') {
            break;
        }
    }
    if (j !== linkBase.length) {
        linkBase = linkBase.substring(0, j);
    }

    var i = 0;
    var toc = $('#toc');
    var headers = $("#content :header");
    headers.each(function () {
        var indent = 'indent_4';
        if ($(this).prop("tagName") === "H2") {
            indent = 'indent_2';
        } else if ($(this).prop("tagName") === "H3") {
            indent = 'indent_3';
        } else if ($(this).prop("tagName") === "H4") {
            indent = 'indent_4';
        } else if ($(this).prop("tagName") === "H5") {
            indent = 'indent_5';
        } else if ($(this).prop("tagName") === "H6") {
            indent = 'indent_6';
        }
        $(this).attr("id", i);
        var box = $('<div></div>', {
            class: 'linkBox'
        });
        var list = $('<li></li>', {
            class: indent
        });
        var link = $('<a>', {
            text: this.innerHTML.toString(),
            title: this.innerHTML.toString(),
            href: linkBase + '#' + i++
        }).appendTo(list);
        list.appendTo(box);
        box.appendTo(toc);
    });
}

/**
 * Get the target parameter specified by name from url.
 *
 * @param name Target parameter name
 * @returns {string}
 */
function getParaValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);

    if (result !== null) { // noinspection Annotator
        return result[2];
    }
}

/**
 * Redirect to 404 page if the target page not found.
 *
 * @constructor
 */
function RedirectTo404() {
    window.location = "./404.html";
}

/**
 * Sort by something
 *
 * @param name Element attribute
 * @returns {Function} Sorting algorithm
 */
var by = function (name) {
    return function (o, p) {
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a > b ? -1 : 1;
            }
            return typeof a > typeof b ? -1 : 1;
        } else {
            throw ("error");
        }
    };
};