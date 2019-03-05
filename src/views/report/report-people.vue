<template>
    <div class='reportPeople'>
		<div class="menu" v-if="showMenu"><Menu @close='closeMenu'/></div>
        <Head :title="title" :name="name" @back="back" :filterShow="true" @filter="filter2"/>
        <main>
            <div class="date">
                <span>{{selectTime}}</span>
                <span @click="filter">{{startTime}}-{{endTime}}</span>
            </div>
            <div class="content">
                <div class="workOrder-report">
                    <div class="title">
                        <span>工单统计表</span> 
                        <span class="workOrder-name">{{name}}</span>
                    </div>
                    <div class="workOrder-rate flex">
                        <dl>
                            <dt class="workOrder-num">{{totalOrder}}</dt>
                            <dd>总工单</dd>
                        </dl>
                        <dl>
                            <dt>{{finishOrder}}</dt>
                            <dd>已完成</dd>
                        </dl>
                        <dl>
                            <dt>{{percentage}}%</dt>
                            <dd>完成率</dd>
                        </dl>
                    </div>
                    <Report ref="children" :reportList="reportList"></Report>
                </div>
                <div class="workOrder-list">
                    <div class="title">
                        <span>工单完成榜</span>
                        <span class="workOrder-name">{{department}}</span>
                    </div>
					<div class="toggleSwitch">
						<span v-if="toggleSwitch" @click="change(true)">
							由高到低
						    <!-- <toggle-switch v-model="toggleSwitch" @change="change"></toggle-switch> -->
						</span>
						<span v-if="!toggleSwitch" @click="change(false)">
							由低到高
						    <!-- <toggle-switch v-model="toggleSwitch" @change="change"></toggle-switch> -->
						</span>
						<span class="change-icon"></span>
					</div>
                    <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="getOrderCount(1)"
			            v-if="!noData"
                        >
                        <van-cell v-for="(item,index) in orderList"  :key="item.id">
                            <div class="workOrder-list-item flex" @click="reportDetail(item.id,item.name,item.avatar,index)">
                                <div class="left flex">
                                    <img class="rank-img" src="../../assets/images/rank-first.png" v-if="index==0"/>
                                    <img class="rank-img" src="../../assets/images/rank-second.png" v-if="index==1"/>
                                    <img class="rank-img" src="../../assets/images/rank-third.png" v-if="index==2"/>
                                    <img :src="item.avatar" v-if="item.avatar"/>
                                    <img src="../../assets/images/head.png" v-else/>
                                    <div>
                                        <p>{{item.name}}</p>
                                        <p>{{item.title}}</p>
                                    </div>
                                </div>
                                <div class="middle">
                                    {{item.orderNum}}
                                </div>
                                <!-- <div class="right">
                                    <p>9</p>
                                    <p><img src="../../assets/images/no-praise.png"/></p>
                                </div> -->
                            </div>
                        </van-cell>
                    </van-list>
                    <div v-if="noData" class="nodata">
                        <p class="tips">没有数据哦～</p>
                    </div>
                    
                </div>
            </div>
        </main>
		<!--时间筛选-->
		<div v-if="timeFilter" class="FilterSlide2">
			<FilterSlide type="time" @backReport="backReport" 
			 :searchType="searchType" :timeData="timeData" @searchByTime="searchByTime"></FilterSlide>
		</div>
		<!--右上角筛选-->
		<van-popup v-model="depFilter" position="top" :overlay="true" class="FilterSlide">
			<FilterSlide type="dep" @backReport="backReport" 
			 :searchType="searchType"  @searchByType='searchByType'></FilterSlide>
		</van-popup>
		<!--筛选部门-->
		<van-popup v-model="selectDep" position="right" :overlay="true" class="FilterSlide">
			<sel-dep @back='backReport' selectlist='' copyPeopleColums=''/>
		</van-popup>
		<!--筛选员工-->
		<van-popup v-model="selectSta" position="right" :overlay="true" class="FilterSlide">
			<sel-sta @back='backReport' selectlist='' copyPeopleColums=''/>
		</van-popup>
        <Foot @addWorkBill='addWorkBill' @getWork='getWork' type='bb'></Foot>
    </div>
</template>

<script>
import Head from '@/components/head'
import Report from '@/components/report'
import Foot from '@/components/footer'
import Menu from "@/components/menu";
import FilterSlide  from "@/components/filter-report";
import selDep  from "@/components/select-depeartment-inreport";
import selSta  from "@/components/select-staff-inreport";
import ToggleSwitch from '@/components/toggle-switch'
export default {
    name: 'report-people',
    components: {
        Head,
        Report,
        Foot,
        Menu,
        FilterSlide,
        selDep,
        selSta,
        ToggleSwitch
    },
    data () {
        return {
            title:'报表',
            name:'',
            showMenu:false,
            timeFilter:false,//时间筛选
            searchType:'3',
            depFilter:false,//类型筛选
            selectDep:false,//筛选部门
            selectSta:false,//筛选员工
            isComplete:false, // 是否完成
            toggleSwitch:true,
            loading: false,
            finished: false,
            noData:false,
            startTime:"",
            endTime:"",
            selectTime:'',
            objType:'other',
            selectObj:'2',
            date:'day',
            page:'1',
            sort:'',
            SortByHigh:false,
            showStaffIdList:eval(localStorage.getItem('showStaffIdList')),
            depIdList :eval(localStorage.getItem('depIdList')),
            finishOrder:'',
            totalOrder:'',
            percentage:'',
            orderList:[],
            dateList:[],
            allDateList:[],
            reportList:[],
            selectType:'',//员工筛选 or 部门筛选
            timeData:{},//显示的时间
			department:'',

        }
    },
    created () {
		if(this.$route.query.type){
			this.selectType = this.$route.query.type;
        }
                this.defaultTime();

    },
    mounted(){
        // this.defaultTime();
        // this.getOrderCount();
        },
	beforeRouteEnter(to, from, next){
		console.log(to)
		next(vm => {
			if(from.name!='ReportDetail' && from.name!='selectDepInReport' && from.name!='selectStaInReport'){
				localStorage.removeItem('depList');
				localStorage.removeItem('depIdList');
				localStorage.removeItem('showStaffList');
				localStorage.removeItem('showStaffIdList');
			}
		})
	},	
methods: {
    back(){//ios退出
        this.showStaffIdList='';
        this.depIdList='';
        this.$router.push({
            path:'/',
            query:{
                menuOpen:'0',//不打开目录
                userId:localStorage.getItem('userId')
            }
        })
    },

    //默认时间
    defaultTime(){
        var day = new Date();
        this.startTime = this.getdate(day.getTime()/1000);//开始时间
        this.endTime= this.getdate(day.getTime()/1000);//结束时间
        this.selectTime='今日';
        var currentDate = new Date();
        var timesStamp = currentDate.getTime();
        var currenDay = currentDate.getDay();
        var chartStartTime = new Date(timesStamp + 24 * 60 * 60 * 1000 * ( - (currenDay + 6) % 7));
        this.dateList.push(this.getdate(chartStartTime.setDate(chartStartTime.getDate())/1000)) ;
        for(var i=0;i<6;i++){
            var nextDay = chartStartTime.setDate(chartStartTime.getDate() + 1);
            nextDay = this.getdate(nextDay/1000);
            this.dateList.push(nextDay) ;
        }
    },
	//时间筛选
	searchByTime(data){
        this.backReport();
        console.log(data)
        this.startTime=data.startTime.split(' ')[0];
        this.endTime=data.endTime.split(' ')[0];
        this.selectTime=data.selectTime;
        this.date=data.timeType;
        var date1 = new Date(this.startTime.replace(/\./g, "/"))
        var date2 = new Date(this.endTime.replace(/\./g, "/"));
        var s1 = date1.getTime(),s2 = date2.getTime();
        var total = (s2 - s1)/1000;
        var totalDay = parseInt(total / (24*60*60));//计算整数天数
        if(this.startTime==this.endTime){
            this.dateList=[];
            this.allDateList=[];
            if(this.date=='day'){
                var currentDate = new Date();
                var timesStamp = currentDate.getTime();
                var currenDay = currentDate.getDay();
                var chartStartTime = new Date(timesStamp + 24 * 60 * 60 * 1000 * ( - (currenDay + 6) % 7));
                this.dateList.push(this.getdate(chartStartTime.setDate(chartStartTime.getDate())/1000)) ;
                for(var i=0;i<6;i++){
                    var nextDay = chartStartTime.setDate(chartStartTime.getDate() + 1);
                    nextDay = this.getdate(nextDay/1000);
                    this.dateList.push(nextDay) ;
                }
            }else{
                // var currentDate = new Date();
                // var timesStamp = currentDate.getTime();
                var currenDay = date1.getDay();
                var chartStartTime = new Date(s1 + 24 * 60 * 60 * 1000 * ( - (currenDay + 6) % 7));
                // this.dateList.push(this.getdate(chartStartTime.setDate(chartStartTime.getDate())/1000)) ;
                this.allDateList.push(this.getdate(chartStartTime.setDate(chartStartTime.getDate())/1000)) ;
                for(var i=0;i<6;i++){
                    var nextDay = chartStartTime.setDate(chartStartTime.getDate() + 1);
                    nextDay = this.getdate(nextDay/1000);
                    this.allDateList.push(nextDay) ;
                }
                this.dateList.push(this.startTime) ;
            }
            this.getOrderCount(0);
        }else if(totalDay<7 && totalDay>0){
            this.dateList=[];
            this.allDateList=[];
            this.dateList.push(this.startTime) ;
            for(var i=0;i<totalDay;i++){
                var averageDay=date1.setDate(date1.getDate() + 1);
                averageDay = this.getdate(averageDay/1000);
                console.log(date1.toLocaleDateString().replace(/\//g, "."));
                this.dateList.push(averageDay) ;
            }
            var currenDay = date1.getDay();
            var chartStartTime = new Date(s1);
            // this.dateList.push(this.getdate(chartStartTime.setDate(chartStartTime.getDate())/1000)) ;
            this.allDateList.push(this.getdate(chartStartTime.setDate(chartStartTime.getDate())/1000)) ;
            for(var i=0;i<6;i++){
                var nextDay = chartStartTime.setDate(chartStartTime.getDate() + 1);
                nextDay = this.getdate(nextDay/1000);
                this.allDateList.push(nextDay) ;
            }
            this.getOrderCount(0);
        }else{
            this.dateList=[];
            this.dateList.push(this.startTime) ;
            var dayNum=Math.floor(totalDay/6);
            var remainderDay=totalDay%6;
            var averageDay;
            for(var i=0;i<6;i++){
                if(i==5){
                    averageDay=date1.setDate(date1.getDate() + dayNum+remainderDay);
                }else{
                    averageDay=date1.setDate(date1.getDate() + dayNum);
                }
                averageDay = this.getdate(averageDay/1000);
                this.dateList.push(averageDay) ;
            }
            this.getOrderCount(0);
        }
	},
	//类型筛选
	searchByType(data){
		this.backReport();
		console.log(data)
		if(data=='dep'){
			//部门
            // this.selectDep = true;
            this.$router.push({
					path:'/selectDepInReport',
					query:{
						selectType:this.selectType
					}
				})
		}else if(data=='sta'){
			//员工
            // this.selectSta = true;
            this.$router.push({
					path:'/selectStaInReport',
					query:{
						selectType:this.selectType
					}
				})
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
        this.timeData.timeType=this.date;
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
	//跳转新增工单
	addWorkBill(){
		this.showMenu = true;
	},
	closeMenu(){
		this.showMenu = false;
    },
    changeComplete(){
        if(this.isComplete){
            this.isShow = true
        }else{
            this.isShow = false
        }
    },
    //排序按钮
    change(data){
        console.log(data);
		if(data){
			this.toggleSwitch = false;
		}else{
			this.toggleSwitch = true;
		}
        this.SortByHigh=data;
        this.getOrderCount(0);
    },
    //获取工单统计
    getOrderCount(firstPage){//ios退出
        var self = this;
    	var data={
    	    objType:self.objType,
            objId:localStorage.getItem('userId'),
            date:self.date,
            dateList:self.dateList
        }
        if(self.SortByHigh){
            data.sort="sortBy";
        }
        if(firstPage==0){
            data.page=1;
            self.orderList = [];
        }else{
            data.page=self.page;
        }
        if(localStorage.getItem('showStaffIdList')){
            data.objType='member';
            data.objId=this.showStaffIdList;
            if(this.showStaffIdList.length==1){
                this.toggleSwitch=false;
            }else{
                this.toggleSwitch=true;
            }
        }else if(localStorage.getItem('depIdList')){
            data.objType='department';
            data.objId=this.depIdList;
        }
        if(self.date=='other'){
            data.allDateList=self.allDateList;
        }
        self.axios({
            url:'/api/v1.0/wostatic',
            method:'post',
    		data:data
        }).then(function (res) {
            console.log(res);
    		if(res.data.code=='200'){
                self.finishOrder=res.data.data.finish;
                self.totalOrder=res.data.data.total;
                self.percentage=res.data.data.percentage;
                if(self.date=='other'){
                    self.reportList=res.data.data.allDateList;
                }else{
                    self.reportList=res.data.data.staticList;
                }
                self.name=res.data.data.name;
                self.department=res.data.data.teamName;
                self.$refs.children.getTotalCount(self.reportList);
                let newData = res.data.data.list;
                self.loading = false;
                if(self.page == 1){
                    self.orderList = [];
                    console.log(res.data);
                    console.log('del=======')
                }
                console.log(self.orderList);
                self.page ++;
                if (newData.length>0){
                    newData.forEach(item=>{
                        self.orderList.push(item)
                    });
                    if (newData.length < 20) {
                        self.finished = true;
                    }
                }else{
                    self.finished = true;
                }
                if(self.orderList.length==0){
                    self.noData = true;
                }else{
                    self.noData = false;
                }
                console.log(self.orderList);
    		}
        })
    },
    /**
     * 格式化时间戳
     */
    getdate(dateTime,isEnd) {
        var now = new Date(dateTime*1000),
            y = now.getFullYear(),
            m = now.getMonth() + 1,
            d = now.getDate();
        var day = y + "." + (m < 10 ? "0" + m : m) + "." + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
//                var time = day.replace(/-/g, ".").split(' ')[0];
        if(isEnd){
            var time = day.split(' ')[0];
        }else{
            var time = day.split(' ')[0];
        }

        return time;
    },
    reportDetail(id,name,avatar,index){
        this.$router.push({
            path:'/reportDetail',
            query:{
                userIds:id,
                name:name,
                avatar:avatar,
                rankNum:index,
                selectTime:this.selectTime,
                startTime:this.startTime,
                endTime:this.endTime,
                timeType:this.date,
            }
        })
    }

  }
}
</script>

<style scoped>
    main {
        margin-bottom:1.2rem;
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
	text-align: left;
}

.workOrder-name{
    float: right;
    font-weight: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 140px;
    text-align: right;
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
    .workOrder-list-item div img{
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 100%;
        margin: 0 10px;
    }
    .workOrder-list-item div img.rank-img{
        position: absolute;
        top: 6px;
        left: 5px;
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
    .padding_no{
        padding:0;
    }
    .nodata{
        margin-top: 0;
    }
    .nodata p{
        line-height: 60px;
    }
	.toggleSwitch{
		text-align: right;
		margin-top: 10px;
		color: #608BF7;
		font-size: 13px;
		padding-right: 20px;
		margin-right: 0.34rem;
		position: relative;
		line-height: 15px;
	}
	.toggleSwitch .change-icon{
		position: absolute;
		top: 0;
		right: 0;
		width: 13.5px;
		height: 15px;
		background: url(../../assets/images/change.png) 0 0 no-repeat;
		background-size:100% 100%;
	}
</style>
