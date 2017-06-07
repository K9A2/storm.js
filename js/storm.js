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

//Default settings
var settings = {
    categoriesPath: "./conf/categories.xml",
    indexPath: "./md/index.md",
    postPath: "./conf/posts.xml",
    title: "stormlin",
    motto: "Yet another full stack developer."
};

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
 * Get the blog configs.
 *
 * @param xmlFilePath File path to xml config file.
 */
function getBlogConfig(xmlFilePath) {
    $.ajax({
        url: xmlFilePath,
        dataType: "xml",
        type: "GET",
        error: function () {
            alert("Unable to reach the config file.");
        },
        success: function (xml) {
            $(xml).find("config").each(function () {
                var title = "<h1>" + $(this).children("title").text() + "</h1>";
                var motto = "<p>" + $(this).children("motto").text() + "</p>";
                $(".markdown-body").append(title + motto);
                //note: The usage of find() and each().
//                var item = $(this).find("category").find("category-item").children("item-text").text();
//                alert(item + i);
            })
        }
    });
}

/**
 * Return the text for target category name
 *
 * @param categoryName Require category
 * @returns text Category-Text
 */
function getCategoryTextByName(categoryName) {

    var text;

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
                var item = $(this).children("item-id").text();
                if (item === categoryName) {
                    text = $(this).children("item-text").text();
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
    //todo: Add categories at the head of each page.

    $.ajax({
        url: settings.categoriesPath,
        async: false,
        error: function () {
            alert("Unable to reach the categories file.");
        },
        success: function (xml) {
            $(xml).find("categories").find("category-item").each(function () {
                var itemText = $(this).children("item-text").text();
                var itemName = $(this).children("item-id").text();
                //console.log(itemText.text());
                //note: The usage of js array
                //categories.push(itemText.text());
                $(".nav-list").append('<li class="nav-list-item"><a href="./category.html?category=' + itemName + '">' + itemText + '</a></li>');
            })
        }
    });

}

/**
 * Print the post list stored in "index.md".
 */
function getPostList() {
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

function getHeader() {

    var xmlFilePath = settings.xmlFilePath;
    var indexFilePath = settings.indexPath;

    $.ajax({
        url: xmlFilePath,
        dataType: "xml",
        async: true,
        type: "GET",
        error: function () {
            alert("Unable to reach the config file.");
        },
        success: function (xml) {
            $(xml).find("config").each(function () {
                var title = "<h1>" + $(this).children("title").text() + "</h1>";
                var motto = "<p>" + $(this).children("motto").text() + "</p>";
                $("#title").append(title + motto);
                //note: The usage of find() and each().
//                var item = $(this).find("category").find("category-item").children("item-text").text();
//                alert(item + i);
            })
        }
    });

    //var categories = new Array();

    //note: The execute sequence of js
    $.ajax({
        url: xmlFilePath,
        async: true,
        error: function () {
            alert("Unable to reach the xml config file.");
        },
        success: function (xml) {
            $(xml).find("category").find("category-item").each(function () {
                var itemText = $(this).children("item-text");
                //console.log(itemText.text());
                //note: The usage of js array
                //categories.push(itemText.text());
                $("#categories").append("<li class='categories-item'><a href='#'>" + itemText.text() + "</a></li>");
            });
        }
    });

}

//todo: 获取符合目的 category 的所有文章的链接
//note: 不要使用在 xml 文件中用 ------- 来做表格
/**
 * Get all requested post links
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
 * Print target post list
 *
 * @param posts Target post list
 */
function printPostList(posts) {

    if (posts.length === 0) {
        new RedirectTo404();
    } else {
        for (var i = 0; i < posts.length; i++) {
            var category = '<a href="./category.html?category=' + posts[i].category + '">' + getCategoryTextByName(posts[i].category) + '</a>';
            var item = '<div class="post-item"><a class="postLink" href="';
            item += './post.html?name=' + posts[i].name + '">' + posts[i].title + '</a>' + '<p class="date_and_category">';
            item += posts[i].date + category + '</p><p class="description">' + posts[i].description + '</p></div>';
            $("#main").append(item);
        }
    }

}

//todo: 获取导航条
function getNavBar() {

}

//todo: 返回顶部
function returnToTop() {

}

/**
 * Sorti by something
 * @param name Element attribute
 * @returns {Function} Sorting algorithm
 */
var by = function(name){
    return function(o, p){
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
    var footerText = '<div id="footer">' + '<p>Copyright © 2014 - 2017 stormlin.</p><p>All Rights Reserved.</p>' + '<a href="http://www.miitbeian.gov.cn">备案号：粤ICP备16029958号-1</a></div>';
    $("body").append(footerText);
}
