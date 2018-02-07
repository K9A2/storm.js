/**
 * 这里是整个 APP 的入口。在完成文件验证之后，将调用主题附带的 generate.js 来负责具体生成过程
 */
!(function () {

    // 文件操作相关
    var fse = require("fs-extra");

    // 系统设置
    var config = require("./src/config/config.json");

    // 加载博客信息
    var posts = require("./src/draft/description").posts;
    var pages = require("./src/draft/description").pages;

    // 清空输出文件夹
    if (!fse.emptyDirSync("./src/out")) {
        console.log("清空输出文件夹");
        fse.removeSync(".out");
        fse.emptyDirSync("./out");
    }

    // 自定义的生成过程
    var generator = require("./src/theme/default/generate");
    generator.generate(posts, pages, fse, config);

})();