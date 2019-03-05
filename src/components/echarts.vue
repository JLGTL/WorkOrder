<template>
  <div class="echartCont">
    <div id="myEchart" style="width: 100%;height: 400px;"></div>
  </div>
</template>
<script>
  export default {
    name: 'hello',
    // props: ['dataList'],
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted(){
    //   this.drawCircle();
    },
    methods: {
      drawCircle(dataList){
        // 基于准备好的dom，初始化echarts实例
        let myEchart = this.$echarts.init(document.getElementById('myEchart'))
        // 绘制图表
        
        var option =   {
          title: {
            text: '任务共'+dataList.total+'个',
            // text: '任务共30个',
            left: 'center'
          },
          tooltip : {
           trigger: 'item',
            show:false,
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color:['#A7F8DD', '#C5D1F6','#608BF7','#FD5578','#F9F082'],
          legend: {
            // top: 'bottom',
            top:"80%",
            z:100,
            selected:{'进行中':true},
            left: 'center',
            data: ['已完成','待确认', '进行中','已延误','待验收']
          },
          series : [
            {
              type: 'pie',
            // radius: [0, '30%'],
              center: ['50%', '40%'],
              selectedMode: 'single',
              data:[
                {value:dataList.finish,name: '已完成',labelLine:{show:true},label:{show:true}},
                {value:dataList.confirm, name: '待确认',labelLine:{show:true},label:{show:true}},
                {value:dataList.todo, name: '进行中',labelLine:{show:true},label:{show:true}},
                {value:dataList.outdate, name: '已延误',labelLine:{show:true},label:{show:true}},
                {value:dataList.check, name: '待验收',labelLine:{show:false},label:{show:true}}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              labelLine: {
                normal: {
                  show: true,
                  formatter:'{c}',
                },

              },
              label:{
//                textStyle:{
//                  color:'#373D46'
//                }
                normal: {
                  position:'inner',
                //  formatter: '{a|{b}}\n{hr|}\n{per|{d}%}',
                  formatter:'{d}%',
                  rich: {
                    a: {
                      color: '#373D46',
                      fontSize: 11,
                      lineHeight: 20,
                      align: 'center'
                    },
                    hr: {
                      width: '100%',
                      height: 0,
                      alien:'center'
                    },
                    per: {
                      color: '#fff',
                      align: 'center',
                      fontSize: 15,
                    }
                  }
                },
              },
            }
          ]
        };

        myEchart.dispatchAction({type: 'pieSelect',name:'进行中'});

        var opt = option.series[0];
lineHide(opt);
//数据为零时隐藏线段
function lineHide(opt) {
    opt.data.forEach((item)=>{
        if (item.value == 0) {
            item.labelLine.show = false;
            item.label.show = false;
        }
    });
}
    myEchart.setOption(option);

      }
    }
  }
</script>
<style scoped>
.echartCont{
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
