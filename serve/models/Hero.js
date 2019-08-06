const mongoose=require('mongoose');
const schema=new mongoose.Schema({
    name:{type:String},
    avatar:{type:String},
    title:{type:String},
    categories:[{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}],    //定义关联的其他数据模型
    scores:{    //各项状态描述
        difficult:{type:Number},
        skills:{type:Number},
        attack:{type:Number},
        survice:{type:Number},
    },
    skills:[{   //技能描述，，多个技能
        icon:{type:String},
        name:{type:String},
        description:{type:String},
        tips:{type:String}
    }],
    items1:[{type:mongoose.SchemaTypes.ObjectId,ref:'Item'}],   //顺风出装
    items2:[{type:mongoose.SchemaTypes.ObjectId,ref:'Item'}],    //逆风出装
    usageTips:{type:String},    //使用技巧
    battleTips:{type:String},   //对抗技巧
    teamTips:{type:String},     //团战技巧
    parteners:[{                // 搭档
        hero:{type:mongoose.SchemaTypes.ObjectId,ref:'Hero'},
        description:{type:String}
    }]

})
module.exports=mongoose.model('Hero',schema);