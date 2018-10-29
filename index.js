var express = require('express');
var app = express();

var expressWs = require('express-ws')(app);
var util = require('util');
app.use(express.static('./static'));
var isGrouped = false;
var actionHandles = {
    /***
     * 加载成功
     */
    '1263':function(ws){
        console.log('加载成功')
        var count = 0;
        //进入分组
        var data = {
            action:"5290",
            data:[{
                userID:"abc"+count++,
                userName:"khf",
                groupIndex:0
            },{
                userID:"abc"+count++,
                userName:"khf",
                groupIndex:0
            }]
        }
        ws.send(JSON.stringify(data))
        // 有学生进入分组
        var timer = setInterval(function(){
            console.log('1111')
            if(isGrouped){
                clearInterval(timer);
                return ;
            }
            var index = Math.floor(4*Math.random())
            var d = {
                action:"5283",
                data:{
                    userID:'abc'+count++,
                    userName:"abc",
                    groupIndex:index
                }
            }
            ws.send(JSON.stringify(d))
        },2000)
        //分组结束 进入倒计时
        setTimeout(function(){
            isGrouped = true;
            var d1 = {
                action:'5284',
                data:{
                    timeOut:3,
                    fatCatInfoList:[],
                    catWeight:1800
                }
            }
            ws.send(JSON.stringify(d1))
        },20000)
        //游戏开始
        setTimeout(function(){
            var d2 = {
                action:'5285',
                data:{
                    timeOut:3,
                    finishGuide:0,
                    configInfo:{},
                    foodConfigList:[],
                    teamList:[],
                    score:10000
                }
            }
            ws.send(JSON.stringify(d2))
        },23000)
        //下发第一题
        setTimeout(function(){
            var d2 = {
                action:'5286',
                data:{
                    RealQuestionInfo:{},
                    rightQuestionCount:0,
                    totalQuestionCount:0
                }
            }
            ws.send(JSON.stringify(d2))
        },25000)

    },
    /***
     * 学生端跳过答题
     */
    '1264':function(ws){
        var d2 = {
            action:'5286',
            data:{
                RealQuestionInfo:{},
                rightQuestionCount:0,
                totalQuestionCount:0
            }
        }
        ws.send(JSON.stringify(d2))
    },
    /***
     * 学生端答题 
     */
    '1265':function(ws){
        var d2 = {
            action:'5286',
            data:{
                RealQuestionInfo:{},
                rightQuestionCount:0,
                totalQuestionCount:0
            }
        }
        ws.send(JSON.stringify(d2))
    },
    /****
     * 引导完成
     */
    '1266':function(ws){

    }
}

app.ws('/ws', function(ws, req) {
  util.inspect(ws);
  ws.on('message', function(msg) {
    var data = JSON.parse(msg)
    console.log(data)
    if(typeof actionHandles[data.action] == 'function'){
        actionHandles[data.action](ws)
    }
  });
})

app.listen(8888,function(err){
    console.log('监听1')
})