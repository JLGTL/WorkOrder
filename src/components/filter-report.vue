<template>
    <div class="filterContainer">
        <!--筛选顶部弹框-->
		<Head :title="title" @back="back"/>
        <div class="filterPop-wrapper"></div>
        <div class="filterPop">
            <p class="filter-title" v-if="type=='time'">日期</p>
            <div class="filter-date" v-if="type=='time'">
                <div class="filter-date-top">
                    <div class="flex">
                        <span :class="{'active':item.isChecked}" @click="getTimes(index)" v-for="(item,index) in timeSelects">{{item.name}}</span>
                    </div>
                    <p class="dateTime" @click="dateSelect()" :class="{'active':dateTimeSelect}">{{selectTime}} {{startDate}}-{{endDate}}</p>
                </div>
               <!-- <div class="filter-date-bottom">
                    <p class="filter-title">工单类型</p>
                    <div class="flex orderType">
                        <div v-for="(item,index) in orderTypeList" ><span :class="{'active':item.isChecked}" @click="getOrderType(index,item.id)">{{item.name}}</span></div>
                    </div>
                </div> -->
                <div class="operation flex">
                    <label @click="resetFilter">重置</label>
                    <label @click="commit">确定</label>
                </div>
            </div>
			
			<div class="filter-date" v-if="type=='dep'">
			    <div class="searchType" @click="search('dep')">按部门查询</div>
			    <div class="searchType" @click="search('sta')">按成员查询</div>
			</div>
        </div>
        <van-popup position="bottom" :overlay="true" v-model="modalStartShow">
            <van-datetime-picker
                v-model="currentDate"
                type="date"
                title="选择开始时间"
                @cancel="cancelBtn"
                @confirm="confirmBtn"
				:formatter="formatter"
            />
        </van-popup >
        <van-popup position="bottom" :overlay="true" v-model="modalEndShow" >
            <van-datetime-picker
                v-model="currentDate"
                type="date"
                title="选择结束时间"
                :min-date = "minDate"
                @confirm = "confirmEndTime"
                @cancel = "cancelEndBtn"
				:formatter="formatter"
            />
        </van-popup >
    </div>
</template>
<script>
	import Head from '@/components/head'
    import { Toast } from 'vant';
    export default {
        props:['searchType','type','timeData'],
		components:{Head},
        data() {
            return {
				title:'报表',
                userId:'',
                modalStartShow:false,
                modalEndShow:false,
                dateTimeSelect:false,
                selectVal:'',
                selectEndVal:'',
                currentDate: new Date(),
                minDate:'',
                timeSelects:[
                    {
                        name:'今日',
                        isChecked:false,
                        timeType:'day'
                    },{
                        name:'本周',
                        isChecked:true,
                        timeType:'week'

                    },{
                        name:'本月',
                        isChecked:false,
                        timeType:'month'
                    },
                ],
                startDate:'开始日期', //按钮开始时间
                endDate:'结束日期', //按钮结束时间
                selectStartTime:'',
                selectEndTime:'',
                selectTime:'',
                timeType:'other',
                // orderTypeList:[],
                orderTypeId:[],
                orderTypeText:[],
            }
        },
        created () {
            this.userId = window.localStorage.getItem('userId');
            // this.getTimes(0);
            // this.commit();
        },
        mounted(){
            // this.getOrderList();
            if(this.timeData){
                if(this.timeData.timeType=='day'){
                    this.getTimes(0)
                }else if(this.timeData.timeType=='week'){
                    this.getTimes(1)
                }else if(this.timeData.timeType=='month'){
                    this.getTimes(2)
                }else{
                    this.selectStartTime=this.timeData.startTime;
                    this.selectEndTime=this.timeData.endTime;
                    this.getTimes(3)
                }
            }
            
        },
        methods: {
			back(){
				this.$emit("backReport")
			},
			formatter(type, value) {
				console.log(type)
				if (type === 'year') {
					return `${value}年`;
				} else if (type === 'month') {
					return `${value}月`
				}else if (type === 'day') {
					return `${value}日`
				}else if (type === 'hour') {
					return `${value}时`
				}else if (type === 'minute') {
					return `${value}分`
				}
				return value;
			},
			search(type){
				this.$emit("searchByType",type);
			},
            resetFilter(){
                // this.timeSelects.forEach((item)=>{
                //     item.isChecked= false;
                // })
                // this.dateTimeSelect = false;
                this.getTimes(0);
            },
            commit(){
                if(this.selectEndTime == '' && this.orderTypeId == ''){
                    Toast('请选择筛选条件');
                }else{
					let data = {
						startTime:this.selectStartTime,
                        endTime:this.selectEndTime,
                        selectTime:this.selectTime,
                        timeType:this.timeType
					}
                    this.$emit('searchByTime',data);
                }
            },
            dateSelect(){
                this.modalStartShow = true;
            },
            onSelect(){
                this.modalStartShow = false
            },
            cancelBtn(){
                this.modalStartShow = false
            },
            cancelEndBtn(){
                this.modalEndShow = false;
            },
            confirmBtn(value){
                var selectDate = this.getNowFormatDate(value).split(' ')[0];
                console.log(selectDate);
                this.startDate = selectDate.replace(/-/g,'.');
                this.selectStartTime = this.startDate+' 00:00:00';
                this.minDate = new Date(selectDate);
                this.modalStartShow = false;
                this.modalEndShow = true;

            },
            changeVal(picker, value, index){
                this.selectVal = picker.getValues();
            },
            confirmEndTime(value){
                var selectDate = this.getNowFormatDate(value).split(' ')[0];
                this.endDate = selectDate.replace(/-/g,'.');
                this.selectEndTime = this.endDate+' 23:59:59';
                this.modalStartShow = false;
                this.modalEndShow = false;
                this.timeSelects.forEach((item)=>{
                    item.isChecked = false;
                });
                this.selectTime="";
                this.timeType='other';
                this.dateTimeSelect = true;
            },
            changeEndVal(picker,value,index){
                this.selectEndVal = picker.getValues()
            },
            /**
             * 格式化时间
             */
            getNowFormatDate(date) {
                var seperator1 = "-";
                var seperator2 = ":";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                if (hours >= 0 && hours <= 9) {
                    hours = "0" + hours;
                }
                if (minutes >= 0 && minutes <= 9) {
                    minutes = "0" + minutes;
                }
                if (seconds >= 0 && seconds <= 9) {
                    seconds = "0" + seconds;
                }

                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + hours + seperator2 + minutes
                    + seperator2 + seconds;
                return currentdate;
            },
            getTimes(time){

                var self = this;
                var now = new Date(); //当前日期
                var nowDayOfWeek = now.getDay(); //今天本周的第几天
                var nowDay = now.getDate(); //当前日
                var nowMonth = now.getMonth(); //当前月
                var nowYear = now.getYear(); //当前年
                nowYear += (nowYear < 2000) ? 1900 : 0;
                var startTime='';
                var endTime='';
                self.timeSelects.forEach((item)=>{
                    item.isChecked = false;
                });
                self.dateTimeSelect = false;
                if(time<3){
                    self.timeSelects[time].isChecked = true;
                    self.selectTime=self.timeSelects[time].name;
                    self.timeType=self.timeSelects[time].timeType;
                }
                if(time == 0){
                    var day = new Date();
                    startTime = this.getdate(day.getTime()/1000);//开始时间
                    endTime = this.getdate(day.getTime()/1000);//结束时间

                }else if(time == 1){
                    var currentDate = new Date();
                    var timesStamp = currentDate.getTime();
                    var currenDay = currentDate.getDay();
                    var dates = [];
                    for (var i = 0; i < 7; i++) {
                        dates.push(new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/\//g, '.'));
                    }
                    startTime = new Date(timesStamp + 24 * 60 * 60 * 1000 * ( - (currenDay + 6) % 7)).toLocaleDateString().replace(/\//g, '.')+' 00:00:00';
                    endTime = new Date(timesStamp + 24 * 60 * 60 * 1000 * ( 6- (currenDay + 6) % 7)).toLocaleDateString().replace(/\//g, '.')+' 23:59:59';
                }else if(time == 2){
                    var day = new Date();
                    day.setDate(1);//本月第一天
                    day.setMonth(day.getMonth()+1);//下个月
                    day.setDate(day.getDate() - 1);//下个月第一天减1得到本月最后一天
                    var monthStartDate = new Date(nowYear, nowMonth, 1);
                    var monthEndDate = new Date(nowYear, nowMonth, self.getMonthDays(nowMonth));
                    startTime = this.getdate(monthStartDate/1000);
                    endTime = this.getdate(monthEndDate/1000,true);
                }else if(time == 3){
                    self.timeType='other';
                    startTime = this.selectStartTime;
                    endTime = this.selectEndTime;
                }
                console.log(startTime);
                console.log(endTime);
                this.selectStartTime = startTime;
                this.selectEndTime = endTime;
                this.startDate=startTime.split(' ')[0];
                this.endDate=endTime.split(' ')[0];
            },
            //获得某月的天数
            getMonthDays(myMonth){
                var now = new Date(); //当前日期
                var nowYear = now.getYear(); //当前年
                nowYear += (nowYear < 2000) ? 1900 : 0;
                var monthStartDate = new Date(nowYear, myMonth, 1);
                var monthEndDate = new Date(nowYear, myMonth + 1, 1);
                var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
                return days;
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
                    var time = day.split(' ')[0] + ' 23:59:59';
                }else{
                    var time = day.split(' ')[0] + ' 00:00:00';
                }

                return time;
            },
        },
    }
</script>

<style scoped>
    .filter-title{
        width:100%;
        height:0.91rem;
        background:#EEF1F6;
        padding-left:0.35rem;
        line-height:0.91rem;
        text-align:left;
        font-size:14px;
        box-sizing: border-box;
    }
    .filterPop-wrapper{
        height:calc(100vh - 54px);
        width:100%;
        position:fixed;
        top:54px;
        z-index:100;
        background:rgba(0,0,0,0);
        /*opacity:0.4;*/
    }
    .filterPop{
        position:absolute;
        top:54px;
        left:0;
        background:#fff;
        width:100%;
        z-index:102;
        height:calc(100vh - 54px);
        overflow: hidden;
		background: transparent;
    }
    .filter-date{
        width:100%;
        box-sizing: border-box;
    }

    .filter-date-top,.filter-date-bottom{
        width:100%;
        padding:0.2rem 0;
        border-bottom:1px solid #EEEEEE;
        background:#fff;
    }
    .filter-date-top span,.filter-date-bottom span{
        display:inline-block;
        width:1.6rem;
        border-radius:0.4rem;
        height:0.6rem;
        line-height:0.6rem;
        font-size:14px;
        color:#999CAA;
        background:#F6F7FB;
    }
    .filter-date-top span.active,.filter-date-bottom span.active,.filter-date-bottom .orderType div span.active{
        color:#fff;
        background: -webkit-linear-gradient(left top, #8EB1FF , #91CBFF); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(bottom right, #8EB1FF, #91CBFF); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(bottom right, #8EB1FF, #91CBFF); /* Firefox 3.6 - 15 */
        background: linear-gradient(to bottom right, #8EB1FF , #91CBFF); /* 标准的语法 */
    }
    .filter-date-top .active{
        color:#fff;
        border-color:#fff;
        background: -webkit-linear-gradient(left top, #8EB1FF , #91CBFF); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(bottom right, #8EB1FF, #91CBFF); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(bottom right, #8EB1FF, #91CBFF); /* Firefox 3.6 - 15 */
        background: linear-gradient(to bottom right, #8EB1FF , #91CBFF); /* 标准的语法 */
    }
    .dateTime {
        font-size: 14px;
        color: #999CAA;
        text-align: center;
        margin-top:0.3rem;
        height:0.6rem;
        line-height:0.6rem;
        border:1px solid rgba(96,139,247,1);
        font-size: 0.28rem;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(96,139,247,1);
    }
    .filter-date-bottom div,.filter-date-top div{
        justify-content: space-around;
        align-items: center;
    }
    .filter-date-bottom-title{
        color:#333;
        font-size:14px;
        padding-left:0.1rem;
        text-align: left;
        height:0.6rem;
        line-height:0.6rem;
        margin-bottom:0.2rem;
    }
    .operation{
        height:0.9rem;
        padding:0 0.15rem;
        font-size:14px;
        color:#333;
        justify-content: space-between;
        align-items: center;
        background:#fff;
    }
    .tab-list-item{
        border-bottom: 1px solid #EEF1F6!important;
    }
    .list-item-title p{
        text-align: left;
    }
    .orderType{
        width:100%;
        max-height:calc(100vh - 6rem);
        flex-wrap: wrap;
        padding:0.3rem 0.25rem 0;
        box-sizing: border-box;
        justify-content: flex-start;
        overflow: auto;
    }
    .orderType div{
        width:calc(100%/3);
        text-align: center;
        margin-bottom:0.2rem;
    }
    .orderType div span{
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }
    .filterContainer{
        width:100%;
        /*height:100%;*/
        overflow: auto;
        box-sizing: border-box;
    }
    .filter-date-top{
        padding-left:0.25rem;
        padding-right:0.25rem;
        box-sizing: border-box;
    }
    .filter-date-bottom{
        padding:0;
    }
    .filter-date-bottom div{
        justify-content: flex-start;
    }
	.searchType{
		width: 100%;
		line-height: 45px;
		background: #fff;
	}
	.searchType:hover{
		background: #EEF1F6;
	}
</style>
