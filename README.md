# node-cli
node 命令行开发

## color
控制台输出颜色化，效果图:

![效果图](./color/color.png)

## dict
使用推酷上用的有道词典查询接口，实现输入单词进行查询。

## shebang
设置不同的默解释程序，再不同node环境下运行。

## sync-github
一键同步到github上， [原理](http://www.jianshu.com/p/19d2f3a3b5d8)大致为：

1. 使用浏览器书签获取需要保存的页面的title和url，然后发送到后端
2. 获取相关title和url，先保存到本地文件，然后提交到github上

点击查看[已经上传的书签](./sync-github/bookmark.md)
