module.exports=app=>{
    const express=require('express');
    let  AdminUser=require('../../models/AdminUser');
    const assert=require('http-assert');
    let  jwt=require('jsonwebtoken');

    const router=express.Router({   
        mergeParams:true    //保证子路由可以访问父级路由上传递过来的参数
    });  //子路由

    // const req.Model=require('../../models/Category');    //数据模型
    router.post('/',async  (req,res)=>{         //点击保存时
        const model= await req.Model.create(req.body);
        res.send(model);
    })
    router.put('/:id',async  (req,res)=>{           //操作编辑按钮
        const model= await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send(model);        
    })
    router.delete('/:id',async  (req,res)=>{        //操作删除按钮
       await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success:true,
        });
    })  
     router.get('/',async (req,res,next)=>{
             const token=String(req.headers.authorization || "").split(" ").pop();
             assert(token,401,'请提供 jwt token')
             const {id}=jwt.verify(token,app.get('secret')); //从请求头中获取token并解密
             assert(id  ,401,'无效的jwt token')
             req.user=await AdminUser.findById(id)       //通过解密后的id寻找用户
             assert(req.user,401,'用户不存在')
             await next();
        }, async (req,res)=>{
            const queryOptions={};
            if(req.Model.modelName==='Category'){   //过滤关联的父级元素
                queryOptions.populate='parent'
            }
            const items=await req.Model.find().setOptions(queryOptions).limit(10);
            res.send(items);
    })

    router.get('/:id', async (req,res)=>{
        const model=await req.Model.findById(req.params.id)
        res.send(model);
    })
    app.use('/admin/api/rest/:resource',async (req,res,next)=>{
        const token=String(req.headers.authorization || "").split(" ").pop();
        assert(token,401,'请提供 jwt token')
        const {id}=jwt.verify(token,app.get('secret')); //从请求头中获取token并解密
        assert(id  ,401,'无效的jwt token')
        req.user=await AdminUser.findById(id)       //通过解密后的id寻找用户
        assert(req.user,401,'用户不存在')
        await next();
   },async (req,res,next)=>{     //中间件
        const modelName=require('inflection').classify(req.params.resource) //将传过来的接口最后一个单词转换成
                                                                            //大写字母开头并为单数形式与数据模型配合使用
        req.Model=require(`../../models/${modelName}`)
        next();
    },router)    //将子路由挂载上去


    const multer=require('multer');     //中间件
    const upload=multer({dest:__dirname+"/../../uploads"})  //设置图片上传的地址
    app.post('/admin/api/upload',upload.single('file'),async(req,res)=>{//'upload.single()'规定只能上传一个文件
        const file=req.file;
        file.url=`http://localhost:2021/uploads/${file.filename}`
        res.send(file)
    })


    app.post('/admin/api/login',async (req,res)=>{
        const {username,password}=req.body;
        const User=await AdminUser.findOne({username});       //通过浏览器传过来的用户名在Adminuser模型中查找对应的字段是否存在
        console.log(User)
        assert(User,422,'用户不存在')
        // if(!User){
        //     return res.status(422).send({
        //         message:'用户不存在'
        //     })
        // }
        if(User.password===password){
            // let  jwt=require('jsonwebtoken');
            let  jwt=require('jsonwebtoken');
            const token=jwt.sign({id:User._id},app.get('secret'))   //生成token
            res.send({token})
        }else{
            // assert(User,422,'密码不正确')
            return res.status(422).send({
                message:'密码错误'
            })
        }
        //返回token
       
    })

    //错误处理函数
    app.use(async (err,req,res,next)=>{
        console.log(err)
        res.status(err.statusCode||500).send({
            message:err.message
        })
    })
}