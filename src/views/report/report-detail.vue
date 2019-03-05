<template>
    <div class='reportDetail'>
		<div class="menu" v-if="showMenu"><Menu @close='closeMenu'/></div>
        <Head :title="title" @back="back"/>
        <main>
            <div class="date">
                <span>{{selectTime}}</span>
                <span @click="filter">{{startTime}}-{{endTime}}</span>
            </div>
            <div class="content">
                <div class="content-title">
                    <span class="content-title-head">
                        <img class="rank-img" src="../../assets/images/rank-first.png" v-if="rankNum==0"/>
                        <img class="rank-img" src="../../assets/images/rank-second.png" v-if="rankNum==1"/>
                        <img class="rank-img" src="../../assets/images/rank-third.png" v-if="rankNum==2"/>
                        <img :src="avatar" v-if="avatar"/>
                        <img src="../../assets/images/head.png" v-else/>
                    </span>
                    <span>{{userName}}</span>的工单
                </div>
                <m-echarts ref="echarts" :dataList="dataList"></m-echarts>
            </div>
        </main>
		<!--时间筛选-->
		<!-- <van-popup v-model="timeFilter" position="top" :overlay="true" class="FilterSlide">
			<FilterSlide type="time" @backReport="backReport" 
			 :searchType="searchType" :timeData="timeData" @searchByTime="searchByTime"></FilterSlide>
		</van-popup> -->
        <!--时间筛选-->
		<div v-if="timeFilter" class="FilterSlide2">
			<FilterSlide type="time" @backReport="backReport" 
			 :searchType="searchType" :timeData="timeData" @searchByTime="searchByTime"></FilterSlide>
		</div>
        <!-- <Foot @getWork='getWork' @getReport='getReport' type='bb'></Foot> -->
    </div>
</template>

<script>
import Head from '@/components/head'
import Foot from '@/components/footer'
import mEcharts from '@/components/echarts'
import Menu from "@/components/menu";
import FilterSlide  from "@/components/filter-report";
import selDep  from "@/components/select-depeartment-inreport";
import selSta  from "@/components/select-staff-inreport";
export default {
  name: 'report-detail',
  components: {
      Head,
      mEcharts,
      Foot,
	  Menu,
	  FilterSlide,
	  selDep,
	  selSta
  },
  data () {
      return {
        title:'报表',
        showMenu:false,
        timeFilter:false,//时间筛选
        searchType:'3',
        depFilter:false,//类型筛选
        selectDep:false,//筛选部门
        selectSta:false,//筛选员工
        userName:this.$route.query.name,
        avatar:this.$route.query.avatar,
        rankNum:this.$route.query.rankNum,
        dataList:{},
        startTime:this.$route.query.startTime,
        endTime:this.$route.query.endTime,
        selectTime:this.$route.query.selectTime,
        date:this.$route.query.timeType,
        timeData:{},//显示的时间
      }
  },
  created () {

  },
    mounted(){
        this.getData();
    },
  methods: {
     back () {
        this.$router.go(-1);
    },
    //时间筛选
	searchByTime(data){
        this.backReport();
        console.log(data)
        this.startTime=data.startTime.split(' ')[0];
        this.endTime=data.endTime.split(' ')[0];
        this.selectTime=data.selectTime;
        this.date=data.timeType;
        var date1 = new Date(this.startTime)
        var date2 = new Date(this.endTime);
        var s1 = date1.getTime(),s2 = date2.getTime();
        var total = (s2 - s1)/1000;
        var totalDay = parseInt(total / (24*60*60));//计算整数天数
        if(totalDay==0){
            this.dateList=['0:00','4:00','8:00','12:00','16:00','20:00','24:00']
            this.getData();
        }else if(totalDay<7){
            this.dateList=[];
            this.dateList.push(this.startTime) ;
            for(var i=0;i<totalDay;i++){
                date1.setDate(date1.getDate() + 1);
                var averageDay=date1.toLocaleDateString().replace(/\//g, ".");
                console.log(date1.toLocaleDateString().replace(/\//g, "."));
                this.dateList.push(averageDay) ;
            }
            this.getData();
        }else{
            this.dateList=[];
            this.dateList.push(this.startTime) ;
            var dayNum=Math.floor(totalDay/6);
            var remainderDay=totalDay%6;
            for(var i=0;i<6;i++){
                if(i==5){
                    date1.setDate(date1.getDate() + dayNum+remainderDay);
                }else{
                    date1.setDate(date1.getDate() + dayNum);
                }
                var averageDay=date1.toLocaleDateString().replace(/\//g, ".");
                this.dateList.push(averageDay) ;
            }
            this.getData();
        }
	},
	//类型筛选
	searchByType(data){
		this.backReport();
		console.log(data)
		if(data=='dep'){
			//部门
			this.selectDep = true;
		}else if(data=='sta'){
			//员工
			this.selectSta = true;
		}
	},
	//筛选组件返回
	backReport(){
		this.timeFilter = false;
		this.depFilter = false;
		this.selectDep = false;
		this.selectSta = false;
	},
	//时间筛选
	filter () {
        this.timeFilter = true;
        this.timeData.startTime=this.startTime;
        this.timeData.endTime=this.endTime;
        this.timeData.selectTime=this.selectTime;
        this.timeData.timeType=this.$route.query.timeType;
	},
	//类型筛选
	filter2 () {
	    this.depFilter = true;
	},
	//跳转工单
	getWork(){
		this.$router.push({
			path:'/',
			query:{
				userId:localStorage.getItem('userId'),
				menuOpen:'0'
			}
		})
	},
	closeMenu(){
		this.showMenu = false;
    },
    getReport(){
        this.$router.push({
            path:'/ReportPeople'
        })
    },
    getData(){
        var self = this;
        var timeQuantum=[];
        timeQuantum.push(this.startTime);
        timeQuantum.push(this.endTime);
    	var data={
    	    id:this.$route.query.userIds,
            date:this.date,
            dateList:timeQuantum
    	}
        self.axios({
            url:'/api/v1.0/wostaticdetail',
            method:'post',
    		data:data
        }).then(function (res) {
            console.log(res);
    		if(res.data.code=='200'){
                self.dataList.check=res.data.data.check;
                self.dataList.confirm=res.data.data.confirm;
                self.dataList.finish=res.data.data.finish;
                self.dataList.outdate=res.data.data.outdate;
                self.dataList.todo=res.data.data.todo;
                self.dataList.total=res.data.data.total;
                self.$refs.echarts.drawCircle(self.dataList);
    		}
        })
    }
  }
}
</script>

<style scoped>
    main {
        /* margin-bottom:1.2rem; */
		min-height: calc(100vh - 54px - 0.8rem);
		background: #fff;
    }
.date{
    width:100%;
    height:0.8rem;
    line-height:0.8rem;
    color:#fff;
    font-size:14px;
    font-weight:bold;
    background: -webkit-linear-gradient(left top, #8EB1FF , #91CBFF); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(bottom right, #8EB1FF, #91CBFF); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(bottom right, #8EB1FF, #91CBFF); /* Firefox 3.6 - 15 */
    background: linear-gradient(to bottom right, #8EB1FF , #91CBFF); /* 标准的语法 */
}
.date span:nth-child(2){
    padding-left:0.26rem;
}
.content{
    padding:0.2rem 0.25rem;
	min-height: calc(100vh - 54px - 0.8rem);
	background: #fff;
	box-sizing: border-box;
}
.content-title{
    height: 100px;
    font-size: 0.35rem;
    color: #4A88FB;
    line-height: 100px;
    text-align: left;
}
.content-title .content-title-head{
    width: 50px;
    height: 60px;
    float: left;
    position: relative;
    top: 9%;
    margin: 0 10px;
}
.content-title-head img{
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 100%;
    margin: 0 10px;
}
.content-title-head img.rank-img{
    position: absolute;
    top: -1px;
    left: -14px;
}
.workOrder-report,.workOrder-list{
    background:#fff;
    border-radius:0.1rem;
}
.workOrder-report .title,.workOrder-list .title{
    color:#333;
    font-size:15px;
	position: relative;
    margin:0 0.34rem;
    border-bottom:1px solid #eee;
    height:0.78rem;
    line-height:0.78rem;
	font-weight:600;
}
.workOrder-list .title span{
	position: absolute;
	right: 0;
	font-weight: normal;
	font-size: 12px;
}
    .workOrder-rate{
        margin:0 0.34rem;
        border-bottom:1px solid #eee;
        justify-content: space-around;
        align-items: center;
    }
.workOrder-rate dt{
    font-size:15px;
    color:#608BF7;
    font-family:Hiragino Kaku Gothic StdN W8;
    font-weight:bold;
}
.workOrder-rate dd{
    font-size:14px;
    color:#333333;
    margin:0;
}
    .workOrder-list{
        margin-top:0.2rem;
    }
    .workOrder-list-item{
        justify-content: space-between;
        align-items: center;
        padding:0.2rem 0.3rem;
    }
    .left{
        justify-content: flex-start;
        align-items: center;
        text-align: left;
    }
.left p:nth-child(1){
    color:#4A88FB;
    font-size:14px;
}
    .left p:nth-child(2){
        color:#999CAA;
        font-size:12px;
    }
    .middle{
        font-size:20px;
        color:#608BF7;
        font-family: Hiragino Kaku Gothic StdN W8;
    }
    .right p{
        font-size:12px;
        color:#999CAA;
        line-height:0.4rem;
    }
    .right img{
        width:0.25rem;
        height:0.24rem;
    }
    .report-memo{
        text-align:right;
		padding-right: 20px;
		padding-top: 10px;
    }
.report-memo i{
     display:inline-block;
     position:relative;
     width:12px;
     height:12px;
     border-radius:6px;
    vertical-align:middle;
 }
.report-memo i:before{
    content:'';
    display:inline-block;
    position:absolute;
    width:8px;
    height:8px;
    border-radius:4px;
    top:2px;
    left:2px
}
.report-memo i:nth-child(1){
    border:1px solid #50E3C2;
}
.report-memo i:nth-child(1):before{
    background:#50E3C2;
}
.report-memo i:nth-child(2){
    border:1px solid #92C7FF;
}
.report-memo i:nth-child(2):before{
    background:#92C7FF;
}
.menu{
		position: fixed;
		top:0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 101;
		background: #fff;
	}
	.FilterSlide{
		width: 100%;
		height: 100%;
	}
    .FilterSlide2{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0,0,0,0.7);
		z-index: 100;
	}
</style>
