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
var defaultSetting = {
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
                //todo: note it, the usage of find() and each().
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
                //todo: note it
                categories.push(itemText.text());
            })
        }
    });

    // for (var i = 0; i < categories.length; i++) {
    //     //console.log(categories[i]);
    //     alert(categories[i]);
    // }

    return categories;
}

/**
 * Print the post list stored in "index.md".
 *
 * @param indexFilePath File path to "index.md"
 */
function getPostList(indexFilePath) {
    $.get(indexFilePath, function (data) {
        $(".markdown-body").append(marked(data));
        $("pre").addClass("prettyprint linenums");
        $("title").html($("h1").html());
        $("a").attr("target", "_blank");
    });
}
