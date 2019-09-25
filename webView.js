var http = require('http');
var fs = require('fs');
var URL = require('url');
const readline = require('readline')
const path = require('path')


// async function httpServer()  {

// }


const httpServer = (async () => {
  var server = http.createServer();
  server.on('request', function (req, res) {
    console.log('收到请求，路径是：' + req.url)
    //获取到的url是端口号的后面  /开头的路径
    //Content-Type 告诉对象发送的数据内容是什么类型
    res.setHeader('Content-Type', 'text/plain;charset=utf-8')
    var url = req.url;
    if (url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      // 如果url=‘/’ ,读取指定文件下的html文件，渲染到页面。
      fs.readFile('./index.html', 'utf-8', function (err, data) {
        if (err) {
          throw err;
        }
        res.end(data);
      });
    }
    var parseObj = URL.parse(req.url, true);
    console.log(parseObj);
    if (parseObj.pathname === '/getInfo') {
      var fileName = parseObj.query.name
      console.log(fileName)
      res.writeHead(200, { "Content-Type": 'text/plain', 'charset': 'utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS' });
      //返回所有统计结果
      var filePath = path.join(__dirname, fileName)
      let input = fs.createReadStream(filePath)
      let output = readline.createInterface({
        input: input
      });
      let nullLinesNums = 0;
      let codeLinesNums = 0;
      let lines = 0;
      let annotationLinesNums = 0;
      let words = []
      // 逐行加一
      output.on('line', (line) => {
        lines++;
        const currentLineArr = line.trim().split(' ')
        const currentLine = currentLineArr.length === 0 ? line : currentLineArr
        words = [...words, ...currentLine];
        if (line.split(/^(\s*)\r\n/g)[0] === '') {
          nullLinesNums++;
        }

        //统计注释行数
        if (line.match(/\/\//g) || line.match(/\/\*/g) || line.match(/\*\//g)) {
          annotationLinesNums++;
        }
      })
      output.on('close', () => {


        const wordsNum = words.reduce((acc, val) => {
          return acc + val.length
        }, 0)
        codeLinesNums = lines - annotationLinesNums
        console.log(`${fileName}文件的行数为: ${lines}`)
        console.log(`${fileName}文件的单词数为: ${words.length}`)
        console.log(`${fileName}文件的字符数为: ${wordsNum}`)
        console.log(`${fileName}文件的空行数为: ${nullLinesNums}`)
        console.log(`${fileName}文件的代码行数为: ${codeLinesNums}`)
        console.log(`${fileName}文件的注释行数为: ${annotationLinesNums}`)
        var data = lines + '-' + words.length + '-' + wordsNum + '-' + nullLinesNums + '-' + codeLinesNums + '-' + annotationLinesNums
        res.end(data);
        console.log(data)
      })
    }
    if (parseObj.pathname === '/background.png') {
      //设置请求的返回头type,content的type类型列表见上面
      res.setHeader("Content-Type", "image/png");
      //格式必须为 binary 否则会出错
      var content = fs.readFileSync('./background.png', "binary");
      res.writeHead(200, "Ok");
      res.write(content, "binary"); //格式必须为 binary，否则会出错
      res.end();
    }
    //返回到前端的参数，必须是字符串或者二进制，不能是其它类型
  })
  server.listen(8080, function () {
    console.log('服务器启动成功了')
  })
})();
var cmd = require('child_process');
// 使用默认浏览器打开
cmd.exec('start http://localhost:8080/');
exports = module.exports = {
  httpServer
}
