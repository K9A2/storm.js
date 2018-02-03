/**
 * 本文件负责生成过程的具体操作
 */
exports.generate = function (posts, pages, fse, config) {

    var fs = require("fs");

    var marked = require("marked");

    console.log("开始生成过程");

    // 博客文章的生成过程
    posts.forEach(post => {
        var template = fs.readdirSync("./theme/" + config.theme + "")
        var content = fs.readFileSync("./draft/" + post.name + "/" + post.name + ".md", "utf8");
        // 写入文章主题
        content.replace("{{markdown}}", marked(content));
        // 写入标题
        content.replace("{{title}}", post.title);
        // 写入时间
        content.replace("{{date}}", post.date);
        // 写入标签
        // var tagString = post.tag;
        var tagArray = post.tag.toString().split(",");
        var tagList = "";
        tagArray.forEach(tag => {
            tag = tag.trim();
            tagList = tagList + '<a href="./tag.html?tag=' + tag + '">' + tag + '</a>';
        });
        content.replace("{{tag}}", tagList);
        // 写入输出文件夹
        fs.writeFileSync("./out/" + post.name + ".html", content, "utf8");
    });

    // 博客页面的生成过程

    console.log("生成过程结束");

};