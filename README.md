# 软件工程-作业：实现WC.exe的功能

**更多项目内容可见**  [博客](https://www.cnblogs.com/sherlocksy/p/11588216.html)

## 运行要求

- Node.js
- git

## 使用教程

1. 在代码所在文件夹打开   `git bash` 
2. 输入 `npm link`
3. 输入 `npm install`
4. 输入 `wc -command file` 即可运行程序

## 支持的命令

- `-c` : 返回文件字符数
- `-l` : 返回文件行数
- `-w` : 返回文件单词数
- `-a` : 复杂统计，返回文件代码行数、空行数、注释行数
- `-s` : 递归查找文件夹下的文件，支持通配符 `*` 、`?` 
- `-x` : 显示web界面。