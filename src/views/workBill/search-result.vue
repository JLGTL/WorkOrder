<template>
    <div class="listCont">
        <Head :title="title" @back="back" :filterShow="false"/>
        <div class="list" :class="{'noMore':noMore}">
            <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore" bottomPullText="上拉加载" bottomDropText="释放加载">
            <main>
                <div class="searchCont">
                    <p class="flex" style="margin-bottom: 0.1rem">
                        <img src="../../assets/images/clock_icon.png" class="clock_icon selectedTime"/>
                        <span class="typeTitle">时间&ensp;:&ensp;</span>
                        <span v-if="startDate">{{startDate | noHour}}-{{endDate | noHour}}</span>
                        <span v-else>全部</span>
                    </p>
                    <p class="flex typeListCont">
                      <span class="flex">
                          <img src="../../assets/images/icon_type@2x.png" class="executePeople_icon selectedTypes"/>
                          <span class="typeTitle">类型&ensp;:&ensp;</span>
                      </span>
                      <span>
                          <ul class="typeList" v-if="orderTypeText && orderTypeText.length>0">
                              <li v-for="item in orderTypeText">{{item}}</li>
                          </ul>
                          <ul class="typeList" v-else>
                              <li>全部</li>
                          </ul>
                      </span>
                    </p>
                </div>
                <div class="tab-list">
					<div class="nodata" v-if="searchDetails.length==0">
						<img src="../../assets/images/group2.png">
						<p class="tips">暂时没有任务哦~</p>
					</div>
                    <div class="tab-list-item p-lr" @click="enterDetail(0,item.id)" v-for="item in searchDetails">
                        <div class="tag_normal" v-if="item.importantType_txt == '普通'">普通</div>
                        <div class="tag_important" v-if="item.importantType_txt == '重要'">重要</div>
                        <div class="tag_danger" v-if="item.importantType_txt == '紧急'">紧急</div>
                        <div class="list-item-title flex">
							<p>{{item.woTypeName}}&ensp;|&ensp;<span class="color-gray">{{item.title}}</span></p>
							<p class="sign_invalid sign_status" v-if="item.status_text=='已失效'">{{item.status_text}}</p>
							<p class="sign_outtime sign_status" v-if="item.status_text=='已延误'">{{item.status_text}}</p>
							<p class="sign_outtime sign_status" v-if="item.status_text=='已延迟'">{{item.status_text}}</p>
							<p class="sign_important sign_status" v-if="item.status_text=='处理中'">{{item.status_text}}</p>
							<p class="sign_normal sign_status" v-if="item.status_text!='已失效'&&item.status_text!='已延误'&&item.status_text!='已延迟'&&item.status_text!='处理中' " >{{item.status_text}}</p>
						</div>
                        <p class="list-item-time flex"><span>{{item.date_text}} {{item.time_text}} {{item.week_text}} 截止</span></p>
                        <p class="list-item-create flex">
                            <span class="flex" v-if="my_type == 1"><img src="../../assets/images/executepeople_icon.png" class="executePeople_icon" />
                                <i>{{item.creator_name}}</i>创建
                            </span>
                            <span class="flex" v-else><img src="../../assets/images/executepeople_icon.png" class="executePeople_icon" />
                                <span v-if="item.executor_name">
                                    <i>{{item.executor_name}}</i>
                                    <i v-if="item.status_text == '待验收' || item.status_text == '待确认' || item.status_text == '已完成'">执行完成</i>
                                    <i v-else>执行</i>
                                </span>
                                <span v-else>
                                     <i>无执行人</i>
                                </span>
                            </span>
                            <span class="flex" v-if="item.comment_num>0"><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">{{item.comment_num}}</i><i>条动态</i></span>
                            <span class="flex" v-else><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">0</i><i>条动态</i></span>
                        </p>
                    </div>
                </div>
            </main>
            </mt-loadmore>
        </div>
    </div>
</template>
<script>
    import Head from "@/components/head";
    import NavTab  from "@/components/nav-tab";
    export default {
        name: "SearchResult",
        components: {Head,NavTab},
        data() {
            return {
                title : "搜索结果",
                startDate : '',
                endDate : '',
                orderTypeId:'',
                orderTypeText:'',
                my_type:'',
                userId:'',
                searchDetails:[],
                allLoaded: false,
                searchCondition:{//分页属性
                    pageNo:1,
                    pageSize:10
                },
                noMore:false,//无更多数据
            }
        },
        created () {
            this.userId = window.localStorage.getItem('userId');
            this.startDate = this.$route.query.startDate;
            this.endDate = this.$route.query.endDate;
			console.log(this.startDate)
			console.log(this.endDate)
            //this.orderTypeId = this.$route.query.orderTypeId;
            this.my_type = this.$route.query.my_type;
            this.orderTypeText = this.$route.query.orderTypeText;
            console.log(this.orderTypeText);
            let orderIds = this.$route.query.orderTypeId;
			if(orderIds){
				orderIds.forEach((item,index)=>{
				    if(index == orderIds.length-1){
				        this.orderTypeId += item;
				    }else{
				        this.orderTypeId += item+','
				    }

				})
			}

        },
        mounted(){
            var self = this;
            this.initSearch();
        },
        filters:{
            dataTimes(d){
                let date = d.split(' ')[0];
                let time = date.split('-')[1]+'月'+date.split('-')[2]+'日';
                return time
            },
            noHour(val){
                return val.split(' ')[0].replace(/-/g,'.');
            },
            getRemainderTime (startTime){
                var s1 = new Date(startTime.replace(/-/g, "/")),
                    //var s1 = startTime,
                    s2 = new Date(),
                    runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
                var year = Math.floor(runTime / 86400 / 365);
                runTime = runTime % (86400 * 365);
                var month = Math.floor(runTime / 86400 / 30);
                runTime = runTime % (86400 * 30);
                var day = Math.floor(runTime / 86400);
                runTime = runTime % 86400;
                var hour = Math.floor(runTime / 3600);
                if(hour<9){
                    hour = '0'+hour
                }
                runTime = runTime % 3600;
                var minute = Math.floor(runTime / 60);
                if(minute<9){
                    minute = '0'+minute
                }
                runTime = runTime % 60;
                var second = runTime;
                if(second<9){
                    second = '0'+second
                }
                return day+'天 '+hour+':'+minute+':'+second;
            },

        },
        methods: {
            back () {
                this.$router.go(-1);
            },
//             enterDetail(index,id){
// //
//             },
			enterDetail(index,id){
				var self = this;
				let userId = localStorage.getItem('userId');
				 var data={
				     'userId':userId,
					 'id':id
				 }
				 self.axios({
				    url:'/api/v1.0/getusertypeforwo',
				    method:'post',
				    data:data
				 }).then(function(res){
				    console.log(res);
				    if(res.data.code=='200'){
						// self.comments = res.data.data;
						if(res.data.data.isCreator=='1'){
							//创建人
							self.$router.push({
								path:'/createdetails',
								query:{
									orderId:id
								}
							})
						}else if(res.data.data.isExecutor=='1'){
							//执行人
							self.$router.push({
								path:'/orderdetails',
								query:{
									orderId:id
								}
							})
						}else if(res.data.data.isCopyperson=='1'){
							//抄送人
							self.$router.push({
								path:'/mycopyOrder',
								query:{
									orderId:id
								}
							})
						}
					}
				})
			},
            getRemainderTime (startTime){
                var s1 = new Date(startTime.replace(/-/g, "/")),
                    //var s1 = startTime,
                    s2 = new Date(),
                    runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
                var year = Math.floor(runTime / 86400 / 365);
                runTime = runTime % (86400 * 365);
                var month = Math.floor(runTime / 86400 / 30);
                runTime = runTime % (86400 * 30);
                var day = Math.floor(runTime / 86400);
                runTime = runTime % 86400;
                var hour = Math.floor(runTime / 3600);
                if(hour<10){
                    hour = '0'+hour
                }
                runTime = runTime % 3600;
                var minute = Math.floor(runTime / 60);
                if(minute<10){
                    minute = '0'+minute
                }
                runTime = runTime % 60;
                var second = runTime;
                if(second<10){
                    second = '0'+second
                }
                return day+'天 '+hour+':'+minute+':'+second;
            },
            /**
             * 加载搜索结果
             */
            initSearch(){
                var self = this;
                var data = {
                    start_time : self.startDate,
                    end_time : self.endDate,
                    woType:self.orderTypeId,
                    my_type:self.my_type,
                    uid:self.userId
                };
                console.log(data);
                data.page = self.searchCondition.pageNo;
                data.page_size = self.searchCondition.pageSize;
                console.log(data);
                self.axios({
                    url:'api/v1.0/search',
                    method:'post',
                    data:data
                }).then(function (res) {
                    console.log(res);
                    var date = res.data.data.data;
                    date.forEach((item)=>{
                        self.searchDetails.push(item);
                    })
                    var loadPage = (self.searchCondition.pageNo)*10
                    if(loadPage>=res.data.data.total){
                        self.isHaveMore(false);
                        self.noMore = true;
                    }else{
                        self.isHaveMore(true);
                        self.noMore = false;
                    }
                })
            },
            loadTop() { //组件提供的下拉触发方法
                this.searchCondition.pageNo = 1;
                this.searchCondition.pageSize = 10;
                this.searchDetails = [];
                this.initSearch();
                this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
            },
            loadBottom() {
                this.searchCondition.pageNo+=1;
                this.initSearch();
                this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
            },
            isHaveMore(isHaveMore){
                if(isHaveMore){
                    this.allLoaded = false;
                }else{
                    this.allLoaded = true;
                }
            },
        },
    }
</script>

<style scoped>
    main{
        position:relative;
        padding-top:0.2rem;
    }
    .blue {
        color: #0f78d8;
    }
    .filter-title{
        width:100%;
        height:0.91rem;
        background:#EEF1F6;
        padding-left:0.35rem;
        line-height:0.91rem;
        text-align:left;
        font-size:14px;
    }
    .filterPop-wrapper{
        height:calc(100vh - 54px);
        width:100%;
        position:fixed;
        top:54px;
        z-index:100;
        background:#000000;
        opacity:0.4;
    }
    .filterPop{
        position:absolute;
        top:0;
        left:0;
        background:#fff;
        width:100%;
        z-index:102;
    }
    .filter-date{
        width:100%;
        padding:0 0.25rem;
        box-sizing: border-box;
    }
    .filter-date-top,.filter-date-bottom{
        width:100%;
        padding:0.2rem 0;
        border-bottom:1px solid #EEEEEE;
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
    .filter-date-top span.active,.filter-date-bottom span.active{
        color:#fff;
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
    }
    .tab-list-item{
        border-bottom: 1px solid #EEF1F6!important;
    }
    .list-item-title p{
        text-align: left;
    }
    .searchCont{
        margin: 0 12.5px 0.2rem;
        min-height:1.2rem;
        height:auto;
        border-radius:10px ;
        background: #fff;
        box-sizing: border-box;
        padding: 0.2rem 0.1rem;
    }
    .typeListCont{
        position: relative;
        text-align: left;
    }
    .typeList{
        float: right;
        width: 100%;
        height:auto;
        box-sizing: border-box;
    }
    .typeList li{
        display: inline-block;
        padding-right: 0.2rem;
    }
    .typeTitle{
        /*width:0.79rem;*/
        width:auto;
        white-space: nowrap;
    }
    .listCont{
        width:100%;
        height:100%;
        box-sizing: border-box;
    }
    .list{
        width:100%;
        height:100%;
        box-sizing: border-box;
        overflow:scroll;
        -webkit-overflow-scrolling: auto;
    }
    .tab-list{
        padding:0 0.24rem;
        box-sizing: border-box;
    }
    .selectedTypes{
        height: 0.28rem;
        top: 0.03rem;
        position: relative;
        margin-right: 0.18rem;
    }
    .selectedTime{
        position: relative;
        top: 0.02rem;
    }
	.tab-list-item:last-child{
		border-bottom: 0px!important;
	}
</style>
