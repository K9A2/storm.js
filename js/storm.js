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

    return requestedPost;

}

//todo: 获取导航条
function getNavBar() {

}

//todo: 返回顶部
function returnToTop() {

}
