# 在Ubuntu 16.04下安装配置VS Code、CLion以及Idea

## 缘起

博主以前是在Windows下做软件开发的，现在因为需要在Linux下面对FloodLight控制器进行二次开发，所以就转投Linux阵营了。

FloodLight是是用Java写的，故一款用来进行Java开发的IDE就很有必要。而且博主本身对算法很感兴趣，经常会上LeetCode写点算法题，所以一款趁手的C/C++语言IDE也是很有必要。

在Windows下，博主一般都用VS来开发C/C++程序，用Idea来开发Java程序。故在转投Linux之后仍想使用原来的IDE。然而微软比较小气，Linux下只有VSC而没有VS，故只能用VSC。幸而Linux下有Idea，不然就要用Eclipse了。

Linux下面安装软件还是相当麻烦的。故在这里记录下博主自己配置开发环境的方法，免得博主自己不记得了。

## 安装配置VS Code（VSC）

在Linux下安装VSC需要进行以下三步工作：

1. 下载VSC安装文件。下载地址：VSC下载地址。博主自己使用的是Ubuntu 16.04，故选择deb版本。
2. 安装VSC。可以用dpkg命令（博主将压缩包命名为code.deb，dpkg -i code.deb）进行安装。

也可以直接打开deb文件，系统会弹出窗口，点击安装即可。

如何在dpkg命令中指定软件的安装位置？`dpkg -i –instdir=安装位置 安装包名字`

详情参见百度百科中有关dpkg的解释dpkg的解释。

## 安装配置CLion

在Linux下安装CLion需要完成以下几步工作：

1. 在如下地址下载CLion，CLion下载地址。大家不要做坏事哟。
2. 下载完成即可获得一个包含CLion的tar.gz压缩文件，解压之。可以在终端用tar -xzvf clion.tar.gz来解压（假定文件名为clion.tar.gz）。也可以双击打开，直接拖出来。
3. 把解压后的文件放到你想要安装的地方，就可以开始安装过程了。在bin目录中打开终端，填入./clion.sh即可。有关CLion安装的详细信息，参见CLion目录下的Install-Linux-tar.txt文件。

## 如何解压tar文档？

```bash
tar -xzvf .tar.gz
    tar [-cxtzjvfpPN] 文件与目录 .... 
    参数： 
    -c ：建立一个压缩文件的参数指令(create 的意思)； 
    -x ：解开一个压缩文件的参数指令！ 
    -t ：查看 tarfile 里面的文件！ 
    特别注意，在参数的下达中， c/x/t 仅能存在一个！不可同时存在！ 
    因为不可能同时压缩与解压缩。 
    -z ：是否同时具有 gzip 的属性？亦即是否需要用 gzip 压缩？ 
    -j ：是否同时具有 bzip2 的属性？亦即是否需要用 bzip2 压缩？ 
    -v ：压缩的过程中显示文件！这个常用，但不建议用在背景执行过程！ 
    -f ：使用档名，请留意，在 f 之后要立即接档名喔！不要再加参数！
```

## 安装配置Idea

在Linux下安装Idea需要完成以下几步工作：

1. 到以下地址下载Idea安装包：下载地址。
2. 将得到的tar.gz文件解压。方法同CLion。
3. 把解压后的文件夹复制到你想要安装的位置。在bin目录中打开终端，输入如下命令：./idea.sh。详情参见说明文档：Install-Linux-tar.txt。

## 安装OpenJDK

重要：Idea不需要系统“安装了”JDK，只要在新建工程文件的时候选择解压后的JDK文件夹就可以使用此版本的JDK了。有关OpenJDK和SunJDK之间的差别，参考知乎文章OpenJDK和SunJDK有啥区别？

在Linux下安装OpenJDK需要完成以下几步工作：

1. 检查系统是否安装了JDK。在终端下输入java -version，如果有java的版本信息，则证明系统已经安装了JDK。否则就没有。
2. 如果系统没有安装JDK，则可使用此命令安装OpenJDK：sudo apt install openjdk-8-jre-headless。
