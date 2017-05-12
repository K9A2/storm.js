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
    xmlFilePath: "./config.xml",
    indexFilePath: "./md/index.md"
};

/**
 * Get the target parameter specified by name from url.
 *
 * @param name Target parameter name
 * @returns {null}
 */
function getQueryString(name) {
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
 * Get categories array from config.xml
 *
 * @param xmlFilePath File path to config.xml
 */
function getCategories(xmlFilePath) {
    //todo: Add categories at the head of each page.
    var categories = new Array();

    $.ajax({
        url: xmlFilePath,
        async: false,
        error: function () {
            alert("Unable to reach the xml config file.");
        },
        success: function (xml) {
            $(xml).find("category").find("category-item").each(function (index) {
                var itemText = $(this).children("item-text");
                //console.log(itemText.text());
                //note: The usage of js array
                categories.push(itemText.text());
            })
        }
    });

    // for (var i = 0; i < categories.length; i++) {
    //     //console.log(categories[i]);
    //     alert(categories[i]);
    // }

    for (var i = 0; i < categories.length; i++) {
        document.write("" + categories[i] + "");
    }

    return categories;
}

/**
 * Print the post list stored in "index.md".
 *
 * @param indexFilePath File path to "index.md"
 */
function getPostList() {
    $.get(settings.indexFilePath, function (data) {
        $("#post-list").append(marked(data));
        $("pre").addClass("prettyprint linenums");
        $("title").html($("h1").html());
        $("a").attr("target", "_blank");
    });
}

function getHeader() {
    //getBlogConfig(xmlFilePath);
    //getCategories(xmlFilePath);

    var xmlFilePath = settings.xmlFilePath;
    var indexFilePath = settings.indexFilePath;

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

//todo: 返回顶部
function returnToTop() {

}
