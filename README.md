# Storm.js

Yet another blog framework for github.io, written in front-end languages purely. Our goal is to build a fast and simple front-end oriented blog framework for any static web host such as github.io. So there are some special features we support, which include:
+ A markdown to html converter, which means you can just simply write you post in a markdown document and place it in a specific directory.
+ Easy to be modified, as it is relatively simple with completed document.
+ Excellent compatibility in all static host, such as github.io, etc.
+ Provide a ready-to-use project file. As long as you have a web server and a editor, you can develop you own website base on our work, whatever you are using Windows, Linux or Mac.

There are more interesting and useful features are under developing and testing currently. Just can`t wait to add them.

## Usage

For developers, you can make full use of it by following steps below:
+ Clone it from our repository at [here](https://github.com/K9A2/storm.js.git) to anywhere you like.
+ Open it in an editor or IDE.
+ Read the documents in the dictionary *doc* if you want.
+ Enjoy developing it.

For daily use, you should follow steps below:
+ Write your new idea in a markdown file, and place it in directory **md**.
+ Update the **index.md** in the same directory. Add link to your new post as the example shows.
+ Upload **index.md** and **yourpost.md** to your remote host. Of course, you can upload it with **git** for **github.io**, or **filezilla** for **other host**.

**IMPORTANT: Make sure there is only *one* H1(i.e. # SAMPLE_HEADLINE) in your markdown document, as the program will look for the first H1 and used it to set the title of *page.html*.**

## Acknowledgemet

Currently, this project applied many other open-souce projects. Below is a completed list of applied open-souce project:

|Projcet Name|Original Author|Projcet Address|
|------------|---------------|---------------|
|jQuery|John Resig|https://jquery.com/|
|Marked|chjj|https://github.com/chjj/marked|
|GitHub CSS|sindresorhus|https://github.com/sindresorhus/github-markdown-css|
|Google Code Prettifer|Google|https://github.com/google/code-prettify|

And font used:

|Font Name|Original Author|Project Address|
|---------|---------------|---------------|
|Souce Code Pro|Adobe|https://github.com/adobe-fonts/source-code-pro|

Thanks for their creative work again, which gave me a lot of help during the coding process. **For some of project files applied in my project, I had done a lot of modifications,** so that they could be more capable of settling down the problems I met.

If you have any problems while using it, please file an issue [here](https://github.com/K9A2/storm.js/issues), or you can directily contact with by sending an e-mail to: *lin-jinting@outlook.com*. 

I am pleased to receive your advise and help you.

## Change log
See the change log [here](./doc/changelog.md).

## Licence

This project is under the **MIT Licence**. See the full text of this licence [here](https://en.wikipedia.org/wiki/MIT_License).