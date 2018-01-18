/*
 *
 * Javascript Library for storm.js
 *
 * Project address: https://github.com/K9A2/storm.js
 *
 * Copyright stormlin, contact me at lin-jinting@outlook.com
 * or file an issue on GitHub.
 *
 */

/**
 * Default settings for this project. All relative path is from the side of root.
 *
 * @type {{categoriesPath: string, indexPath: string, postPath: string, title: string, motto: string}}
 */
var settings = {
    categoriesPath: "./conf/categories.xml",
    indexPath: "./md/index.md",
    postPath: "./conf/posts.xml",
    title: "stormlin",
    motto: "On the way to be perfect"
};

/**
 * Page names and URLs for links in navigation bar.
 *
 * @type {Array}
 */
var navPages = [];
navPages = [
    index = {
        url: "./index.html",
        name: "首页"
    },
    category = {
        url: "./category.html",
        name: "分类"
    },
    about = {
        url: "./page.html?name=about",
        name: "关于我"
    },
    dogFood = {
        url: "http://u4813096.viewer.maka.im/k/OQHMX6E6?from=timeline",
        name: "狗粮合集"
    }
];

/**
 * 实现点击返回页面顶部功能，来自 http://blog.csdn.net/zhyh1986/article/details/8644899
 */
$(function () {
    var $backToTopEle = $('#toTop'), $backToTopFun = function () {
        var st = $(document).scrollTop(), winh = $(window).height();
        (st > 200) ? $backToTopEle.fadeIn('slow') : $backToTopEle.fadeOut('slow');
        //IE6下的定位
        if (!window.XMLHttpRequest) {
            $backToTopEle.css("top", st + winh - 166);
        }
    };
    $('#toTop').click(function () {
        $("html, body").animate({scrollTop: 0}, 1200);
    });
    $backToTopEle.hide();
    $backToTopFun();
    $(window).bind("scroll", $backToTopFun);
    $('#catalogWord').click(function () {
        $("#catalog").slideToggle(600);
    })
});

function getTOC(id) {
    var linkBase = window.location.href;
    var i = 0;
    var toc = $('#toc');
    var headers = $("#content :header");
    headers.each(function () {
        var indent = 'indent_4';
        if ($(this).prop("tagName") === "H2") {
            indent = 'indent_none';
        } else if ($(this).prop("tagName") === "H3") {
            indent = 'indent_3';
        } else {
            return true;
        }
        $(this).attr("id", i);
        var list = $('<li></li>', {
            class: indent
        });
        var link = $('<a>', {
            text: this.innerHTML.toString(),
            title: this.innerHTML.toString(),
            href: linkBase + '#' + i
        }).appendTo(list);
        list.appendTo($('#toc'));
        var old = '<li><a href="' + linkBase + '#' + i++ + '" class="' + indent + '">' + this.innerHTML.toString() + '</a></li>';
        // toc.append(old);
    });
}

/**
 * Get file content with given file path
 *
 * @param filePath
 */
function getFileContent(filePath) {
    var fileReader = new FileReader();
    // 读取成功的回调函数
    fileReader.onload = (function (ev) {
        console.log(ev.target.result);
    });
    fileReader.readAsText(filePath, "utf-8");
}

/**
 * Get the target parameter specified by name from url.
 *
 * @param name Target parameter name
 * @returns {null}
 */
function getParaValue(name) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);

    if (result !== null) return result[2];

    return null;
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
 * Get the blog poster.
 */
function getBlogPoster() {

    var poster = '<h1>' + settings.title + '</h1>';
    poster += '<h2>' + settings.motto + '</h2>';
    $("#blog-info").append(poster);

}

/**
 * Return the text for target category name
 *
 * @param categoryName Require category
 * @returns string Category-Text
 */
function getCategoryTextByName(categoryName) {

    var text = "";

    $.ajax({
        url: settings.categoriesPath,
        dataType: "xml",
        type: "GET",
        async: false,
        error: function () {
            alert("Unable to reach the category file.");
        },
        success: function (xml) {
            $(xml).find("categories").find("category-item").each(function () {
                var item = $(this).children("name").text();
                if (item === categoryName) {
                    text = $(this).children("text").text();
                    return text;
                }
            })
        }
    });

    return text;
}

/**
 * Get categories array from categories.xml
 */
function getCategories() {

    var categories = [];

    $.ajax({
        url: settings.categoriesPath,
        async: false,
        error: function () {
            alert("Unable to reach the categories file.");
        },
        success: function (xml) {
            $(xml).find("categories").find("category-item").each(function () {
                var category = {
                    name: $(this).children("name").text(),
                    text: $(this).children("text").text()
                };
                categories.push(category);
            })
        }
    });

    categories.sort(by("name"));
    categories.reverse();

    return categories;

}

/**
 * Print the post list stored in "index.md".
 */
function getIndexPostList() {

    var requestedPost = [];

    $.ajax({
        url: settings.postPath,
        async: false,
        error: function (e) {
            alert("Unable to reach the post list file.");
            console.log(e.message);
        },
        success: function (xml) {
            $(xml).find("posts").find("post-item").each(function () {
                var categoryItem = {
                    id: $(this).children("id").text(),
                    name: $(this).children("name").text(),
                    title: $(this).children("title").text(),
                    category: $(this).children("category").text(),
                    date: $(this).children("date").text(),
                    description: $(this).children("description").text()
                };
                requestedPost.push(categoryItem);
            })
        }
    });

    requestedPost.sort(by("date"));
    requestedPost.reverse();

    return requestedPost;
}

/**
 * Get all requested post links.
 *
 * @param categoryName Target category
 */
function getPostListWithCategory(categoryName) {

    var requestedPost = [];

    $.ajax({
        url: settings.postPath,
        async: false,
        error: function (e) {
            alert("Unable to reach the post list file.");
            console.log(e.message);
        },
        success: function (xml) {
            $(xml).find("posts").find("post-item").each(function () {
                var categoryItem = {
                    id: $(this).children("id").text(),
                    name: $(this).children("name").text(),
                    title: $(this).children("title").text(),
                    category: $(this).children("category").text(),
                    date: $(this).children("date").text(),
                    description: $(this).children("description").text()
                };

                if (categoryItem.category === categoryName) {
                    requestedPost.push(categoryItem);
                }
            })
        }
    });

    requestedPost.sort(by("date"));
    requestedPost.reverse();

    return requestedPost;

}

/**
 * Get post object
 *
 * @param postName Post name
 * @returns {*} Target post
 */
function getPostByName(postName) {

    var requestedPost = null;

    $.ajax({
        url: settings.postPath,
        async: false,
        error: function (e) {
            alert("Unable to reach the post list file.");
            console.log(e.message);
        },
        success: function (xml) {
            $(xml).find("posts").find("post-item").each(function () {
                var post = {
                    id: $(this).children("id").text(),
                    name: $(this).children("name").text(),
                    title: $(this).children("title").text(),
                    category: $(this).children("category").text(),
                    date: $(this).children("date").text(),
                    description: $(this).children("description").text()
                };

                if (post.name === postName) {
                    requestedPost = post;
                }
            })
        }
    });

    return requestedPost;

}

/**
 * Print target post list
 *
 * @param posts Target post list
 */
function printPostList(posts) {

    if (posts.length === 0) {
        new RedirectTo404();
    } else {
        for (var i = 0; i < posts.length; i++) {

            var item = '<div class="post-item">' +
                '           <a class="postLink" href="./post.html?name=' + posts[i].name + '">' +
                posts[i].title +
                '           </a>' +
                '           <p class="date_and_category">' +
                posts[i].date +
                '               <a href="./category.html?category=' + posts[i].category + '">' +
                getCategoryTextByName(posts[i].category) +
                '               </a>' +
                '           </p>' +
                '           <a href="post.html?name=' + posts[i].name + '">' +
                '               <p class="description">' +
                posts[i].description +
                '               </p>' +
                '           </a>' +
                '       </div>';

            $("#main").append(item);
        }
    }

}

/**
 * Print post list with specific category
 *
 * @param posts Posts to be printed
 * @param category Category name
 */
function printCategoryUnit(posts, category) {

    if (posts.length === 0) {
        new RedirectTo404();
    } else {
        var categoryUnit = '<div class="categoryUnit">' +
            '                   <h1 class="categoryTitle">' +
            '                       /* class ' + category + ' */' +
            '                   </h1>';
        for (var i = 0; i < posts.length; i++) {
            categoryUnit += '   <div class="categoryPostUnit">' +
                '                   <p class="categoryDate">' +
                posts[i].date +
                '                   </p>';
            categoryUnit += '       <a href="./post.html?name=' + posts[i].name + '" class="categoryLink">' +
                posts[i].title + '' +
                '                   </a>' +
                '               </div>';
        }
        categoryUnit += '   </div>';

        $("#post-list").append(categoryUnit);
    }

}

/**
 * Get navigation bar on page
 */
function getNavBar() {

    var container = '<div class="container">' +
        '                <div id="icon">' +
        '                    <a href="./index.html">' +
        '                        <img id="avatar" src="img/icon.jpg">' +
        '                    </a>' +
        '                </div>' +
        '                <div id="list">' +
        '                    <ul class="nav-list">';
    for (var i = 0; i < navPages.length; i++) {
        container += '           <li class="nav-list-item"><a href="' + navPages[i].url + '">' + navPages[i].name + '</a></li>';
    }
    container += '           </ul>' +
        '                </div>' +
        '           </div>';

    $("#nav").append(container);

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
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        }
        else {
            throw ("error");
        }
    }
};

/**
 * Get footer
 */
function getFooter() {

    var today = new Date();
    var footerText = '';
    footerText += '<div id="footer">' +
        '              <p>Copyright © 2014 - ' + today.getFullYear() + ' stormlin.</p>' +
        '              <p>All Rights Reserved.</p>';
    footerText += '    <p>' +
        '                  <a href="http://www.miitbeian.gov.cn">备案号：粤ICP备16029958号-1</a>' +
        '              </p>' +
        '          </div>';

    $("body").append(footerText);

}

/**
 * Adjust div#main to make the page height at least one page height
 */
function adjustMainHeight() {

    if (window.innerHeight) {
        var windowHeight = window.innerHeight;
    }
    else if ((document.body) && (document.body.clientHeight)) {
        var winHeight = document.body.clientHeight;
    }
    var main = $("#main");
    var outerHeight = main.outerHeight(true);
    var innerHeight = main.height();
    var rem = parseInt(window.getComputedStyle(document.documentElement)["fontSize"]);
    var title = $("#blog-info");
    if (title === null) {
        alert("null");
        if ((outerHeight + 3 * rem) < windowHeight) {
            alert("in");
            var sub = windowHeight - (outerHeight + $("#footer").outerHeight());
            main.height(innerHeight + sub);
        }
    } else {
        alert("not null");
        alert(outerHeight);
        if ((outerHeight + title.outerHeight()) < windowHeight) {
            alert("in");
            alert("windowHeight: " + windowHeight);
            alert("outerHeight: " + outerHeight);
            alert("footerHeight: " + $("#footer").outerHeight());
            var sub = windowHeight - (outerHeight + $("#footer").outerHeight());
            alert("innerheight: " + innerHeight);
            alert("sub: " + sub);
            alert(innerHeight + sub);
            main.height(innerHeight + sub);
        }
    }

}

/**
 *
 */
function printPostAndAdjustHeight() {


    var postName = getParaValue("name");
    //获取文章信息
    var post = getPostByName(postName);
    //渲染文章标题
    $("#title").html("Hello world!");
    //获取并渲染写入文章正文
    $.get("./md/" + postName + ".md").success(function (content) {
        $(".markdown-body").append(marked(content));
        $("pre").addClass("prettyprint linenums");
        $("title").html($("h1").html());
    }).error(RedirectTo404);

}