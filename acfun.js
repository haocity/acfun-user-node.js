var http = require('http');
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'database'
});
var web='http://www.acfun.tv/usercard.aspx?uid='
//开始ID
var start=549600
//爬取的数量 建议一次不要太大
var number=200000
//每次爬取间隔时间
var time=100
var end=start+number
connection.connect();
for(var i=0;i<=number;i++){
  setTimeout(getjsonx,time);
}

function getjsonx(){
  start++
  if (start==end) { 
   console.log('completed!!')
  connection.end()
  }
http.get(web+start, function(res) {
  var jsonx=''
  res.on('data', function(data) {
   jsonx+=data
  })
 res.on('end',function(){
  jsony=JSON.parse(jsonx)
  //if判断是否成功
  if (jsony.success) {
    console.log('success')
    acfunuser=jsony.userjson 
    //执行mysql操作函数 database请替换数据库名称 user请替换表名称
    connection.query("INSERT INTO `database`.`user` (`uid`, `name`, `level`, `currExp`, `sign`, `posts`, `comments`, `follows`, `fans`, `lastLoginDate`, `regTime`, `comeFrom`, `views`) VALUES ("+acfunuser.uid+",'"+acfunuser.name+"',"+ acfunuser.level+","+ acfunuser.currExp+",'"+ acfunuser.sign+"',"+acfunuser.posts+", "+acfunuser.comments+","+acfunuser.follows+","+acfunuser.fans+",'"+acfunuser.lastLoginDate+"','"+acfunuser.regTime+"','"+acfunuser.comeFrom+"',"+ acfunuser.views+")", function(err, rows, fields) {
      //if (err) throw err;
    console.log('uid: '+acfunuser.uid+'  mysql write success');
     });
  }
  else{
    //用户不存在啦
    console.log('eero user not found')
  }
 })

}).on('error', function(e) {
  //网络错误 没有获取到数据
  console.error(e);
  console.log('eero web server not found')
})



}
