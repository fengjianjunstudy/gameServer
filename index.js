var express = require('express');
var app = express();

var expressWs = require('express-ws')(app);
var util = require('util');
app.use(express.static('./static'));
var isGrouped = false;
var questionDatas = require('./questionDatas');
console.log(questionDatas[0])
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
            data:{
                timeOut:120,
                userID:'abc2',
                groupInfo:[
                    {
                        groupIndex:0,
                        userList:[
                            {
                                userID:"abc"+count++,
                                userName:"abc"+count++
                            },
                            {
                                userID:"abc"+count++,
                                userName:"abc"+count++
                            }
                        ]
                    },
                    {
                        groupIndex:1,
                        userList:[{
                            userID:"abc"+count++,
                            userName:"abc"+count++
                        }]
                    },
                    {
                        groupIndex:2,
                        userList:[{
                            userID:"abc"+count++,
                            userName:"abc"+count++
                        }]
                    },
                    {
                        groupIndex:3,
                        userList:[]
                    }
                ]
            }
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
                    userName:"abc"+count++,
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
                    fatCatInfoList:[
                        {
                            "groupIndex":0,
                            "weight":1800
                        },
                        {
                            "groupIndex":1,
                            "weight":1800
                        },
                        {
                            "groupIndex":2,
                            "weight":1800
                        },
                        {
                            "groupIndex":3,
                            "weight":1800
                        }
                    ]
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
                    configInfo:{
                        diffucityFood:[
                            {
                                diffucity:2,
                                score:100,
                                food:[0,1,2]
                            },
                            {
                                diffucity:3,
                                score:200,
                                food:[3,4,5]
                            },
                            {
                                diffucity:4,
                                score:300,
                                food:[6,7,8]
                            }
                        ],
                        catConf:[
                            {
                                mixWeight:100,
                                maxWeight:300,
                                catModle:0
                            },
                            {
                                mixWeight:300,
                                maxWeight:500,
                                catModle:1
                            },
                            {
                                mixWeight:500,
                                maxWeight:99999,
                                catModle:2
                            }
                            
                        ],
                        blowConf:[
                            {
                                "minCount": 0,
                                "maxCount": 5,
                                "bowl": 0,
                                "catAnimal": 0,
                                "eatFoodSpeed": 1.5
                            },
                            {
                                "minCount": 6,
                                "maxCount": 10,
                                "bowl": 1,
                                "catAnimal": 1,
                                "eatFoodSpeed": 1
                            },
                            {
                                "minCount": 11,
                                "bowl": 2,
                                "catAnimal": 1,
                                "eatFoodSpeed": 1
                            }

                        ],
                    },
                    teamList:[
                        {
                            "userID": 'abc1',
                            "userName": "123",
                            "score":1231
                        },
                        {
                            "userID": 'abc2',
                            "userName": "123",
                            "score":1231
                        },
                        {
                            "userID": 'abc3',
                            "userName": "123",
                            "score":1231
                        }
                    ],
                    fatCatInfoList:[
                        {
                            "groupIndex":0,
                            "weight":1800
                        },
                        {
                            "groupIndex":1,
                            "weight":1800
                        },
                        {
                            "groupIndex":2,
                            "weight":1800
                        },
                        {
                            "groupIndex":3,
                            "weight":1800
                        }
                    ]
                }
            }
            ws.send(JSON.stringify(d2))
        },23000)
        //下发第一题
        setTimeout(function(){
            var d2 = {
                action:'5286',
                data:{
                    realQuestionInfo:questionDatas[0],
                    rightQuestionCount:0,
                    totalQuestionCount:0
                }
            }
            ws.send(JSON.stringify(d2))
        },25000)

        //游戏结束
        setTimeout(function(){
            var data = {
                action:'5288',
                data:{
                    MVPUserID:'abc2',
                    timeOut:30,
                    groupAccountList:[],
                    rankIndex:1,

                }
            }
        },300*1000)

    },
    /***
     * 学生端跳过答题
     */
    '1264':function(ws){
        var d2 = {
            action:'5286',
            data:{
                realQuestionInfo:questionDatas[0],
                rightQuestionCount:0,
                totalQuestionCount:0
            }
        }
        ws.send(JSON.stringify(d2))
    },
    /***
     * 学生端答题 
     */
    '1265':function(ws,msg){
        var d2 = {
            action:'5286',
            data:{
                RealQuestionInfo:questionDatas[0],
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
        actionHandles[data.action](ws,msg)
    }
  });
})

app.listen(8888,function(err){
    console.log('监听1')
})