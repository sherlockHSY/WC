#!/usr/bin/env node
var argv = require('yargs')
    .boolean(['x'])
    .argv;
const { linesNum, wordsNum, lettersNum, getFilePath,readDir,complexData,showWeb } = require('./handleCommand');

//获取用户输入的指令
//支持的指令 -c -w -l -s -a -x

var breakError;
const readCommand = (async () => {
    try {
  
        if (argv.x) {
            //指令为-x
            return showWeb()
        }
        
        if (argv.s && argv.s === true) {
            //递归查找文件夹下的文件
            readDir(argv);
        }
        else if (argv.s && argv.s !== true) {
            //判断后面是否有带的其它指令
            return console.log('请输入其它指令（除-s之外）');
        }
        else {
            
            //获取文件名
            let lastCommandKey = Object.keys(argv)[Object.keys(argv).length-2];
            let fileName = argv[lastCommandKey];
            let filePath = getFilePath(fileName)
            if (argv.c) {
                //指令为-c
                linesNum(fileName,filePath)
            }
            if (argv.w) {
                //指令为-w
                wordsNum(fileName,filePath)
            }
            if (argv.l) {
                //指令为-l
                lettersNum(fileName,filePath)
            }
            if (argv.a) {
                //指令为-a
                complexData(fileName,filePath)
            }
            
        }
        breakError = false
    } catch (e) {
        breakError = true
        console.log(e.message)
    }
})()

