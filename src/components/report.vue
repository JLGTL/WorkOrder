<template>
    <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
</template>
<script>
export default {
    name: 'chart',
    props: ['reportList'],
    data () {
        return {
            msg: 'Welcome to Your Vue.js App',
            totalCount:[],
            finishCount:[],
            timeDate:[]
        }
    },
    // computed: {
    // // 计算属性的 getter
    //     totalCount: function () {
    //     // `this` 指向 vm 实例
    //         var count=[];
    //         for(var i=0;i<this.reportList.length;i++){
    //             count.push(this.reportList[i].totalCount);
    //         }
    //         return count;
    //     }
        
    // },
    mounted(){
        
    },
    methods: {
        getTotalCount(reportList){
            this.totalCount=[];
            this.finishCount=[];
            this.timeDate=[];
            for(var i=0;i<reportList.length;i++){
                var objTotalCount={};
                var objFinishCount={};
                objTotalCount.value=reportList[i].totalCount;
                objTotalCount.symbol='circle';
                objTotalCount.symbolSize=8;
                objFinishCount.value=reportList[i].finishCount;
                objFinishCount.symbol='circle';
                objFinishCount.symbolSize=8;
                this.totalCount.push(objTotalCount);
                this.finishCount.push(objFinishCount);
                this.timeDate.push(reportList[i].date);
            }
            console.log(this.timeDate);
            this.drawLine();
        },
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表åç
            var option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        },
                    }
                },
                legend: {
                    data:['工单数','已完成'],
                    icon: "circle",
                    top:"3%",
                    itemWidth:10,
                    itemHeight:10,
                    left:'right',
                },
                color: ["#0080ff","#4cd5ce"],
                grid: {
                    left: '3%',
                    right: '6%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.timeDate,
                        axisLine: {
                            onZero: false,
                            lineStyle: {
                                color: '#999CAA'//此处为横轴坐标颜色
                            }
                        },
                    },

                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLine: {
                            onZero: true,
                            lineStyle: {
                                color: '#999CAA' //此处为纵轴坐标颜色
                            }
                        },
                    }
                ],
                series : [

                    {
                        name:'工单数',
                        type:'line',
                        smooth:true,
                        // symbol: 'circle',
                        // symbolSize:1,
                        itemStyle: {
                            normal: {   //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                color: '#7ED321',  //背景渐变色
                                lineStyle: {        // 系列级个性化折线样式
                                    width: 1,
                                    type: 'solid',
                                    color: "#7ED321"
                                }
                            },
                            emphasis: {
                                color: '#4fd6d2',
                                lineStyle: {        // 系列级个性化折线样式
                                    width:2,
                                    type: 'dotted',
                                    color: "#4fd6d2" //折线的颜色
                                }
                            }
                        },//线条样式
                        symbolSize:8, //折线点的大小
                        areaStyle: {normal: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                        offset: 0, color: '#E8FCFB' // 0% 处的颜色
                                    }, {
                                        offset: 0.5, color: '#E7FDFA' // 100% 处的颜色
                                    }, {
                                        offset: 1, color: '#fff' // 100% 处的颜色
                                    }]
                                ),  //背景渐变色
                                lineStyle: {        // 系列级个性化折线样式
                                    width: 1,
                                    type: 'solid',
                                    color: "#7ED321"
                                }
                        }},
                        data:this.totalCount,
                        // data:[1,1,1,1,1,1,0]

                    },
                    {
                        name:'已完成',
                        type:'line',
                        smooth:true,
                        // symbol: 'circle',
                        // symbolSize:1,
                        itemStyle: {
                            normal: { //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                color: '#608BF7', //背景渐变色
                                lineStyle: {        // 系列级个性化折线样式
                                    width: 1,
                                    type: 'solid',
                                    color: "#608BF7" //折线的颜色
                                }
                            },
                            emphasis: {
                                color: '#0180ff',
                                lineStyle: {        // 系列级个性化折线样式
                                    width: 1,
                                    type: 'dotted',
                                    color: "0180ff"
                                }
                            }
                        },//线条样式
                        symbolSize:8, //折线点的大小
                        areaStyle: {
                            normal: { //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                        offset: 0, color: '#A7D4FF' // 0% 处的颜色
                                    }, {
                                        offset: 0.4, color: '#EBF7FE' // 100% 处的颜色
                                    }, {
                                        offset: 1, color: '#fff' // 100% 处的颜色
                                    }]
                                ), //背景渐变色
                                lineStyle: {        // 系列级个性化折线样式
                                    width: 1,
                                    type: 'solid',
                                    color: "#608BF7" //折线的颜色
                                }
                            },},
                        data:this.finishCount,
                        // data:[0,0,0,0,0,0,0]

                    }
                ]
            };
            var opt1 = option.series[0];
            var opt2 = option.series[1];
            lineHide(opt1,opt2);
            //数据为零时隐藏线段
            function lineHide(opt1,opt2) {
                opt1.data.forEach((item,index)=>{
                    opt2.data.forEach((item2,index)=>{
                        if (item.value == item2.value) {
                            item.symbolOffset=['-25%', 0];
                            item2.symbolOffset=['25%', 0];
                        }
                    })
                });
            }
            myChart.setOption(option);
        },
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
