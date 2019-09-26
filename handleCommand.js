/**
 * handleCommand.js
 * 处理指令
 */

const fs = require("fs")
const readline = require('readline')
const path = require('path')
const { httpServer } = require('./webView')

//抽象出读取文件流的方法，逐行读取文件，返回文件intput流
const readLineHandle = (filePath) => {
    let input = fs.createReadStream(filePath)
    return readline.createInterface({
        input: input
    })
}
//返回文件的绝对路径
const getFilePath = (fileName) => {
    return path.join(__dirname, fileName)
}
// -l 指令 ，返回文件行数
const linesNum = (fileName, filePath) => {

    const rl = readLineHandle(filePath)
    let lines = 0
    // 逐行加一
    rl.on('line', (line) => {
        lines++;
    })
    rl.on('close', () => {
        console.log(`${fileName}文件的行数为: ${lines}`)
    })
}

// -w 指令，返回文件的词数
const wordsNum = (fileName, filePath) => {

    const rl = readLineHandle(filePath)
    let words = []
    // 对逐行的内容操作，以空格为分界计算单词数，压入单词栈
    rl.on('line', (line) => {
        const currentLineArr = line.trim().split(' ')
        const currentLine = currentLineArr.length === 0 ? line : currentLineArr
        words = [...words, ...currentLine]
    })
    rl.on('close', () => {
        console.log(`${fileName}文件的单词数为: ${words.length}`)
    })
}

// -c 指令，返回文件字符数
const lettersNum = (fileName, filePath) => {

    const rl = readLineHandle(filePath)
    let words = []
    // 对逐行的内容操作，以空格为分界计算单词数，压入单词栈
    rl.on('line', (line) => {
        const currentLineArr = line.trim().split(' ')
        const currentLine = currentLineArr.length === 0 ? line : currentLineArr
        words = [...words, ...currentLine]
    })
    rl.on('close', () => {
        // 逐行读取结束时，对单词栈的逐个单词长度累加，得字符数
        const wordsNum = words.reduce((acc, val) => {
            return acc + val.length
        }, 0)
        console.log(`${fileName}文件的字符数为: ${wordsNum}`)
    })
}

//递归处理该目录的函数
function fileDisplay(argv, filePath, fileType, wildcardCharacter) {
    //根据文件路径读取文件，返回文件列表
    var files;
    try {

        files = fs.readdirSync(filePath);
    } catch (error) {

        return console.log('请选择一个文件夹');
    }
    //遍历读取到的文件列表
    var breakFlag = false;
    for (let i = 0; i < files.length; i++) {
        var fileName = files[i];
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, fileName);
        //获取文件信息
        const stats = fs.statSync(filedir);
        //判断文件类型
        let isFile = stats.isFile();//是文件
        let isDir = stats.isDirectory();//是文件夹
        if (isFile) {
            //判断文件类型
            if (fileType === null) {
                //如果没有指定文件类型，则默认所有类型的文件
                if (argv.c) {
                    //指令为-c
                    linesNum(fileName, filedir)
                }
                if (argv.w) {
                    //指令为-w
                    wordsNum(fileName, filedir)
                }
                if (argv.l) {
                    //指令为-l
                    lettersNum(fileName, filedir)
                }
                if (argv.a) {
                    //指令为-a
                    complexData(fileName, filedir)
                }

                //判断是否有通配符，若为? 则结束循环
                if (wildcardCharacter === '?') {
                    breakFlag = true;
                }

            } else {
                //有指定文件类型，只操作同类型文件
                if (fileType === ('.' + fileName.split('.')[1])) {

                    if (argv.c) {
                        //指令为-c
                        linesNum(fileName, filedir)
                    }
                    if (argv.w) {
                        //指令为-w
                        wordsNum(fileName, filedir)
                    }
                    if (argv.l) {
                        //指令为-l
                        lettersNum(fileName, filedir)
                    }
                    if (argv.a) {
                        //指令为-a
                        complexData(fileName, filedir)
                    }

                    //判断是否有通配符，若为? 则结束循环
                    if (wildcardCharacter === '?') {
                        breakFlag = true;
                    }
                }
            }
        }
        if (isDir) {
            if (fileName !== 'node_modules') {//忽略掉node_modules文件夹，没必要
                fileDisplay(argv, filedir, fileType, wildcardCharacter);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }

        }

        if (breakFlag === true) { break; }
    }
}

// -s 指令， 递归处理目录下符合条件的文件，以及对通配符做处理
const readDir = (argv) => {

    let lastCommandKey = Object.keys(argv)[Object.keys(argv).length - 2];
    //获取文件夹的名
    let value = argv[lastCommandKey];
    //判断value最终值是文件夹还是通配符 * ?， 如果不是这两者，则抛错，参数不符合命令
    let mactchResult = value.match(/[\*\?]/g);
    // console.log(mactchResult);
    let wildcardCharacter;
    let fileType;
    let fileDir;
    if (mactchResult) {
        //匹配到通配符
        //获取文件夹目录
        let arr = value.split(/[\*\?]/g);
        fileType = arr[1];
        fileDir = path.join(__dirname, arr[0]);
        // console.log(fileDir)
        wildcardCharacter = mactchResult[0]

    }
    else {
        fileDir = path.join(__dirname, value);
        fileType = null;
        wildcardCharacter = null;

    }
    //递归处理该目录
    // console.log(wildcardCharacter)
    fileDisplay(argv, fileDir, fileType, wildcardCharacter)

}


// -a 返回更复杂的数据，包括（代码行 / 空行 / 注释行）
const complexData = (fileName, filePath) => {
    const rl = readLineHandle(filePath);
    let nullLinesNums = 0;
    let codeLinesNums = 0;
    let lines = 0;
    let annotationLinesNums = 0;
    rl.on('line', (line) => {
        //统计文件空行数
        if (line.split(/^(\s*)\r\n/g)[0] === '') {
            nullLinesNums++;
        }
        //统计总行数
        lines++;
        //统计注释行数
        if (line.match(/\/\//g) || line.match(/\/\*/g) || line.match(/\*\//g)) {
            annotationLinesNums++;
        }
    })
    rl.on('close', () => {
        codeLinesNums = lines - annotationLinesNums
        console.log(`${fileName}文件的空行数为: ${nullLinesNums}`)
        console.log(`${fileName}文件的代码行数为: ${codeLinesNums}`)
        console.log(`${fileName}文件的注释行数为: ${annotationLinesNums}`)

    })
}

// -x 显示图形界面
const showWeb = () => {
    //调用函数
    httpServer()
}

exports = module.exports = {
    getFilePath,
    linesNum,
    wordsNum,
    lettersNum,
    readDir,
    complexData,
    showWeb
}