// index.js
// 获取应用实例
const app = getApp()
const{ connect } = require('../../utils/mqtt')
const mqttHost = 'www.everybody.icu'//服务器域名
const mqttPort = 8084 //服务器端口
const deviceSubTopic = '/mysmart/sub' //设备订阅Topic，小程序发布命令topic
const devicePubTopic = '/mysmart/pub' //设备订阅Topic
const mpSubTopic = devicePubTopic
const mpPubTopic = deviceSubTopic

//获取当前系统日期和时间
var util = require('../../utils/util.js');//参数是util.js所在的路径，参照自个儿的
Page({
  data: {
    client:null,
    //infusionStartTime:0,//输液开始时间
    Speed:0,
    Time:0,//输液剩余时间
    Marg:0,//液体剩余量
    Hum:0,
    Temp:0,
    EN:false,//警示关闭
    Caution:false,
    //picker
    pickerData:["葡萄糖","血液","营养药液","氯化钠"],
    pickerIndex:0
      
    },   
    pickerClick: function (event) {
      console.log(event.detail.value);
      this.setData({
        pickerIndex: event.detail.value,
      });
    },
    
     
  
  
  //系统时间
  // xxx.js
  
    
  onLoad :function () {
    
   
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var currenTime= util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      currenTime: currenTime
    });
  },
  
  /*onLoad: function (res){
    var that = this
    wx.showModal({
      title: '警告',
      content: '输液已完成',
      cancelText:'取消',
      confirmText:'确定',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定时在这里面删除')
        }
    
        elseif (res.cancel) {
          console.log('用户点击取消啥也不干')
        }
      }
    })
  },
  showToast(){
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000//持续的时间
    })
  },*/


  //警示灯发送数据
 onLEDChange(event){
     const that = this
     console.log(event.detail.value);
     const sw = event.detail.value

     that.setData({EN:sw})
     if(sw){
       that.data.client.publish(mpPubTopic,JSON.stringify({
         target:"EN",
         value:1
       }),
       function (err){
         if(!err){
           console.log('开始加热');
         }
       }
                              )
           }
     else{
      that.data.client.publish(mpPubTopic,JSON.stringify({
        target:"EN",
        value:0
      }),
      function (err){
        if(!err){
          console.log('关闭加热');
        }
      }
       )
     }
  },   
//警示

onCautionChange(event){
  const that = this
  console.log(event.detail.value);
  const sw = event.detail.value

     that.setData({Caution:sw})
     if(sw){
       that.data.client.publish(mpPubTopic,JSON.stringify({
         target:"Caution",
         value:1
       }),
       function (err){
         if(!err){
           console.log('开始警示');
         }
       }
                              )
           }
     else{
      that.data.client.publish(mpPubTopic,JSON.stringify({
        target:"Caution",
        value:0
      }),
      function (err){
        if(!err){
          console.log('关闭警示');
        }
      }
       )
     }


  },
  // 事件处理函数
  //接受数据
onShow(){
  const that = this
  that.setData({
   client:connect(`wxs://${mqttHost}:${mqttPort}/mqtt`)
     })
    that.data.client.on('connect',function(params) {
      console.log('成功连接到mqtt服务器')
      wx.showToast({
        title: '连接成功',
        icon:'success',
        mask:true
      
      })
      /*
      that.data.caution.true('',function(res){
      if(res=1){
        wx.showModal({
          title: '提示',
            content: '输液已完成',
          success (res) {
            if (res.confirm) {
              //这里是点击确认执行事件
            } else if (res.cancel) {
                  //这里是点击取消执行事件
            }
           }
        })
      }
      })
      */
      that.data.client.subscribe(mpSubTopic,function(err){
        if(!err){
          console.log('成功订阅设备上行数据Topic')
        }

      })
  })
    that.data.client.on('message',function(topic,message){
      console.log(topic);
      
      
      let dataFromDev = {}
    try {
      dataFromDev = JSON.parse(message)
     console.log(dataFromDev);
     //数据类型
       that.setData({

        Speed:dataFromDev.Speed,//当前滴速
        Time:dataFromDev.Time,//剩余时间
        Marg:dataFromDev.Marg,//剩余量
        Hum:dataFromDev.Hum,//湿度
        Temp:dataFromDev.Temp,//温度
        EN:dataFromDev.EN,//加热
        caution:dataFromDev.caution//警告
      })
    } catch(error){
      //console.log(error);
      console.log('失败',error);
    }
      
    })
}
  
})
