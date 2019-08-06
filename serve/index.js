var express=require('express');
const app=express();
app.set('secret','liumouyan')   //自定义
app.use(require('cors')())  //跨域
app.use(express.json())
app.use('/uploads',express.static(__dirname+'/uploads'))
require('./plugin/db')(app);
require('./routes/admin')(app)
app.listen(2021,function(){
    console.log('http://locahost:2021')
})