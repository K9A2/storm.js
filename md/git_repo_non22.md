# 如何在非 22 端口的主机上创建 git 仓库并共享

很多情况下，我们需要在我们自建的远程主机上面创建在线 git 仓库。同时，由于安全原因，目标主机的 ssh 端口往往被设置成非 22 端口。这给我们创建 git 仓库带来了一定的麻烦，需要一些特殊手段才能满足我们的需求。

假定已经装好了 git。所以就直接从添加 git 专用 user 开始。

+ 创建一个名为 git 的用户，专门用来进行 git 相关操作：sudo adduser git
+ 产生 ssh 公钥的方法见 git 官方文档：[生成 SSH 公钥](https://git-scm.com/book/zh/v1/%E6%9C%8D%E5%8A%A1%E5%99%A8%E4%B8%8A%E7%9A%84-Git-%E7%94%9F%E6%88%90-SSH-%E5%85%AC%E9%92%A5)，就可以不用每次 push 都输入密码了
+ mkdir 创建一个空文件夹，命名为 XXX.git
+ 使用 git 在刚才创建的文件夹中创建一个裸仓库：sudo git init --bare sample.git
+ 修改仓库所有者：sudo chown -R git:git sample.git，或者 chmod 修改文件夹权限
+ 在 git clone 的地址前面加上 ssh://，例如 git clone ssh://git@10.137.20.113:2222/root/test.git 来 clone 新创建的仓库到你自己的电脑上

在成功地手动执行完以上代码之后，我们可以在远程主机的仓库文件夹下面放置一个 shell 脚本，通过执行这个脚本来创建仓库，这样就可以节省不少功夫：

```shell
# 传入的第一个参数为 $1。$0 为当前文件名。
new_dir=$1
mkdir $new_dir
git init --bare $new_dir
chmod 755 $new_dir
echo "新文件夹为："$new_dir
echo "复制以下代码至控制台即可克隆新仓库："
# 把服务器信息修改成你自己的
echo "git clone ssh://git@123.456.789.111:8888/~/git_repository/"$new_dir
```

这样，在远程主机的仓库文件夹里面执行：`./new_repo.sh dir_name`就可以创建新仓库了。在你自己的机子上执行给出来的命令就可以直接 clone 新仓库了，前提是你已经用 rsa_key 实现了免密登录，否则需要手动输入密码才能继续 clone 过程。

## 参考材料

+ [搭建Git服务器 - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/00137583770360579bc4b458f044ce7afed3df579123eca000)
+ [肖楠 - 处理git clone命令的非标准SSH端口连接](http://nanxiao.me/git-clone-ssh-non-22-port/)
