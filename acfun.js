var http = require('http');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'acfun' //数据库名
});
var web='http://www.aixifan.com/usercard.aspx?uid='
//start 为开始用户uid  number指用户数量 timefrequency为每次请求时间间隔
var start=0
var number=70*10000
var timefrequency=10
var end=start+number
connection.connect();
var myInterval=setInterval(getjson,10,start)
function getjson(){
var nowuid=start
//这里偷懒了下 直接在请求到指定数量后5s关闭链接
if (nowuid>=end) {clearTimeout(myInterval);setTimeout(function(){console.log("completed!!");connection.end()},5000)}
//http.get请求
http.get(web+start, function(res) {
  var jsonx=''
  res.on('data', function(data) {
   jsonx+=data
  })
 res.on('end',function(){
  jsony=JSON.parse(jsonx);
  if (jsony.success) {
    acfunuser=jsony.userjson
    //下面的acfun为 database ,user为tablename
    connection.query("INSERT INTO `acfun`.`user` (`uid`, `name`, `level`, `currExp`, `sign`, `posts`, `comments`, `follows`, `fans`, `lastLoginDate`, `regTime`, `comeFrom`, `views`) VALUES ("+acfunuser.uid+",'"+acfunuser.name+"',"+ acfunuser.level+","+ acfunuser.currExp+",'"+ acfunuser.sign+"',"+acfunuser.posts+", "+acfunuser.comments+","+acfunuser.follows+","+acfunuser.fans+",'"+acfunuser.lastLoginDate+"','"+acfunuser.regTime+"','"+acfunuser.comeFrom+"',"+ acfunuser.views+")", function(err, rows, fields) {
      //if (err) throw err;
    console.log('uid: '+acfunuser.uid+'  mysql write success');
     });
  }
  else{
     console.log('uid: '+nowuid+'  eero user not found')
  }
 })

 

}).on('error', function(e) {
  console.error(e);
  console.log('eero web server not found')
})
start++
}
