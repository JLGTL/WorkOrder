<template>
    <div class="listContainer">
		<Head :title="title" @back="back" :filterShow="true" @filter="filter" v-if="!timeFilter"/>
		<Head :title="title" :isBack='false' @back="backToList" :filterShow="false"  v-if="timeFilter"/>

            <main>
                <nav-tab :tabLists="tabLists" @getList="getLists" ref='navtab'>
                    <template slot="1">
                        <div class="tab-list">
                            <div class="list" :class="{'haveLoaded':haveLoaded,'noMore':noMore}">
                                <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
                                <div class="tab-list-item p-lr" v-for="item in inProcessData" v-if="inProcessData.length>0">
                                    <div v-if="item.status == 2 && tabActiveIndex == 1" @click="enterDetail(1,item.id)">
                                        <div class="tag_normal" v-if="item.importantType == '普通'">普通</div>
                                        <div class="tag_important" v-if="item.importantType == '重要'">重要</div>
                                        <div class="tag_danger" v-if="item.importantType == '紧急'">紧急</div>
                                        <div class="list-item-title flex"><p>{{item.typename}}&ensp;|&ensp;<span class="color-gray">{{item.title}}</span></p><p class="sign_normal sign_status">待确认</p></div>
                                        <p class="list-item-time flex"><span>{{item.endTime | dataTimes}} {{item.time}} {{item.weekday}} 截止</span></p>
                                        <p class="list-item-create flex">
                                            <span class="flex"><img src="../../assets/images/executepeople_icon.png" class="executePeople_icon" />
                                            <i v-if="item.name">{{item.name}}</i><i v-if="item.name">创建</i>
                                            <i v-if="!item.name">无创建人</i>
                                            </span>
                                            <span class="flex" v-if="item.commentnum>0"><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">{{item.commentnum}}</i><i>条动态</i></span>
                                            <span class="flex" v-else><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">0</i><i>条动态</i></span>
                                        </p>
                                    </div>
                                    <div v-if="item.status == 3 && tabActiveIndex == 2" @click="enterDetail(2,item.id)">
                                        <div class="tag_normal" v-if="item.importantType == '普通'">普通</div>
                                        <div class="tag_important" v-if="item.importantType == '重要'">重要</div>
                                        <div class="tag_danger" v-if="item.importantType == '紧急'">紧急</div>
                                        <div class="list-item-title flex"><p>{{item.typename}}&ensp;|&ensp;<span class="color-gray">{{item.title}}</span></p>
                                            <p class="sign_important sign_status">处理中</p>
                                        </div>
                                        <p class="list-item-time flex"><span>{{item.endTime | dataTimes}} {{item.time}} {{item.weekday}} 截止</span></p>
                                        <p class="list-item-create flex">
                                            <span class="flex"><img src="../../assets/images/executepeople_icon.png" class="executePeople_icon" />
                                            <i v-if="item.name">{{item.name}}</i><i v-if="item.name">创建</i>
                                            <i v-if="!item.name">无创建人</i>
                                            </span>
                                            <span class="flex" v-if="item.commentnum>0"><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">{{item.commentnum}}</i><i>条动态</i></span>
                                            <span class="flex" v-else><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">0</i><i>条动态</i></span>
                                            <span class="time"><i>计时 </i><i class="sign_important">{{item.sj}}</i></span>
                                        </p>
                                    </div>
                                    <div v-else-if="item.status == 4 && tabActiveIndex == 2" @click="enterDetail(3,item.id)">
                                        <div class="tag_normal" v-if="item.importantType == '普通'">普通</div>
                                        <div class="tag_important" v-if="item.importantType == '重要'">重要</div>
                                        <div class="tag_danger" v-if="item.importantType == '紧急'">紧急</div>
                                        <div class="list-item-title flex"><p>{{item.typename}}&ensp;|&ensp;<span class="color-gray">{{item.title}}</span></p>
                                            <p class="sign_normal sign_status">待验收</p>
                                        </div>
                                        <p class="list-item-time flex"><span>{{item.endTime | dataTimes}} {{item.time}} {{item.weekday}} 截止</span></p>
                                        <p class="list-item-create flex">
                                            <span class="flex"><img src="../../assets/images/executepeople_icon.png" class="executePeople_icon" />
                                            <i v-if="item.name">{{item.name}}</i><i v-if="item.name">创建</i>
                                            <i v-if="!item.name">无创建人</i>
                                            </span>
                                            <span class="flex" v-if="item.commentnum>0"><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">{{item.commentnum}}</i><i>条动态</i></span>
                                            <span class="flex" v-else><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">0</i><i>条动态</i></span>
                                        </p>
                                    </div>
                                    <div v-else-if="item.status == 3 && tabActiveIndex == 3" @click="enterDetail(4,item.id)">
                                        <div class="tag_normal" v-if="item.importantType == '普通'">普通</div>
                                        <div class="tag_important" v-if="item.importantType == '重要'">重要</div>
                                        <div class="tag_danger" v-if="item.importantType == '紧急'">紧急</div>
                                        <div class="list-item-title flex"><p>{{item.typename}}&ensp;|&ensp;<span class="color-gray">{{item.title}}</span></p><p class="sign_outtime sign_status">已延误</p></div>
                                        <p class="list-item-time flex"><span>{{item.endTime | dataTimes}} {{item.time}} {{item.weekday}} 截止</span></p>
                                        <p class="list-item-create flex">
                                            <span class="flex"><img src="../../assets/images/executepeople_icon.png" class="executePeople_icon" />
                                            <i v-if="item.name">{{item.name}}</i><i v-if="item.name">创建</i>
                                            <i v-if="!item.name">无创建人</i>
                                            </span>
                                            <span class="flex" v-if="item.commentnum>0"><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">{{item.commentnum}}</i><i>条动态</i></span>
                                            <span class="flex" v-else><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">0</i><i>条动态</i></span>
                                            <span class="time" v-if="item.endTime!='0000-00-00 00:00:00'"><i>计时 </i><i class="sign_outtime">{{item.sj}}</i></span>
                                        </p>
                                    </div>
                                    <div v-else-if="item.status == 5 && tabActiveIndex == 4" @click="enterDetail(5,item.id)" class="flex hasCompleted">
                                        <div>
                                            <div class="tag_normal" v-if="item.importantType == '普通'">普通</div>
                                            <div class="tag_important" v-if="item.importantType == '重要'">重要</div>
                                            <div class="tag_danger" v-if="item.importantType == '紧急'">紧急</div>
                                            <div class="list-item-title list-item-title2 flex"><p>{{item.typename}}&ensp;|&ensp;<span class="color-gray">{{item.title}}</span></p></div>
                                            <p class="list-item-time flex"><span>{{item.endTime | dataTimes}} {{item.time}} {{item.weekday}} 截止</span></p>
                                            <p class="list-item-create flex">
												<span class="flex"><img src="../../assets/images/executepeople_icon.png" class="executePeople_icon" />
												<i v-if="item.name">{{item.name}}</i><i v-if="item.name">创建</i>
												<i v-if="!item.name">无创建人</i>
												</span>
                                                <span class="flex" v-if="item.commentnum>0"><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">{{item.commentnum}}</i><i>条动态</i></span>
                                                <span class="flex" v-else><img src="../../assets/images/leaveWord.png" class="leaveWord_icon" /><i class="blue">0</i><i>条动态</i></span>
                                            </p>
                                        </div>
                                        <div class="sign_default"></div>
                                    </div>
                                </div>
                                <div class="noResult" v-if="noResult">
                                    <img src="../../assets/images/group2.png" alt="">
                                    <p>暂时没有任务哦~</p>
                                </div>
                                </mt-loadmore>
                            </div>

                        </div>
                    </template>
                </nav-tab>
            </main>
        <FilterSlide :filterShow="timeFilter" :searchType="searchType" @closeFilter="closeFilter"></FilterSlide>
    </div>
</template>
<script>
    import Head from "@/components/head";
    import NavTab  from "@/components/nav-tab";
    import FilterSlide  from "@/components/filter-slide";
    export default {
        name: "myExecuteList",
        components: {Head,NavTab,FilterSlide},
        data() {
            return {
                title : "我执行的",
                active : "",
                defaultTab : 1,
                tabLists : [{text:"待确认",count:''},{text:"进行中",count:''},{text:"已延误",count:''},{text:"已完成",count:''}],
                showTabIndex : 1,
                filterShow : false,
                searchType:'1',
                className : "filterPop",
                startDate : "2018-12-01",
                endDate : "2019-01-06",
                inProcessData : [],
                timeFilter:false,
                searchData:'',
                userId:'', // 用户id
                allLoaded: false, //是否加载完成
                searchCondition:{//分页属性
                    pageNo:1,
                    pageSize:10
                },
                tabActiveIndex:1,
                noResult:true,
                haveLoaded:true,//未加载完成
				timer:null,
                noMore:false,//无更多数据
            }
        },
        created () {

        },
        mounted(){
        },
		beforeRouteEnter(to, from, next){
			console.log(from)
			next(vm => {
				vm.userId = window.localStorage.getItem('userId');
				if(from.name!='OrderDetails' && from.name!='SendDepeartmentPeople'){
					vm.active = '';
					vm.defaultTab = 1;
					vm.showTabIndex = 1;
					vm.filterShow = false;
					vm.searchType = '1';
					vm.className = 'filterPop';
					vm.inProcessData = [];
					vm.timeFilter = false;
					vm.searchData = '';
					vm.allLoaded = false;
					vm.searchCondition = {
						pageNo:1,
						pageSize:10
					};
					vm.tabActiveIndex = 1;
					vm.noResult = true;
					vm.haveLoaded = true;
					clearInterval(vm.timer);
					vm.timer = null;
					vm.getLists(1);
					console.log('before')

					vm.$refs.navtab.defaultTab = 0;

				}else if(from.name == 'SendDepeartmentPeople'){
                    vm.active = '';
                    vm.defaultTab = 2;
                    vm.showTabIndex = 2;
                    vm.filterShow = false;
                    vm.searchType = '1';
                    vm.className = 'filterPop';
                    vm.inProcessData = [];
                    vm.timeFilter = false;
                    vm.searchData = '';
                    vm.allLoaded = false;
                    vm.searchCondition = {
                        pageNo:1,
                        pageSize:10
                    };
                    vm.tabActiveIndex = 2;
                    vm.noResult = true;
                    vm.haveLoaded = true;
                    clearInterval(vm.timer);
                    vm.timer = null;
                    vm.getLists(2);
                    console.log('before')

                    vm.$refs.navtab.defaultTab = 1;
                }else{
					clearInterval(vm.timer);
					vm.timer = null;
					vm.searchCondition = {
						pageNo:1,
						pageSize:10
					};
					vm.getLists(vm.tabActiveIndex);
					vm.$refs.navtab.defaultTab = vm.tabActiveIndex-1;
				}
			})
		},
		beforeRouteLeave(to, from, next){
			if(to.name!='OrderDetails'){
				clearInterval(this.timer);
				this.timer = null;
				this.inProcessData = [];
			}
			next()
		},
        filters:{
            dataTimes(d){
                let date = d.split(' ')[0];
                let time = date.split('-')[1]+'月'+date.split('-')[2]+'日';
                return time
            },
        },
        methods: {
            back () {
                this.$router.push({
                	path:'/',
                	query:{
                		menuOpen:'0',//不打开目录
                		userId:localStorage.getItem('userId')
                	}
                })
            },
			backToList(){
				this.timeFilter = false;
			},
            selectTab (index) {
                this.defaultTab = index;
            },
            filter () {
                this.timeFilter = true;
            },
            resetFilter () {

            },
            cancel () {
                this.filterShow = false;
            },
            closeFilter(val){
                this.searchData = val;
                this.$router.push({
                    query:{
                        searchDate: val
                    },
                    path:'/search-result'
                })
                this.initSearch();
                this.timeFilter = false;
            },
            getLists(index){
				clearInterval(this.timer);
				this.timer = null;
				this.inProcessData = [];
				this.searchCondition.pageNo = 1;
                this.haveLoaded = true;
                this.tabActiveIndex = index;
                this.initList(index);
                this.initTabList();
				console.log('getLists')
                console.log(this.tabActiveIndex);

            },
            initTabList(){
				console.log('initTabList')
                let self = this;
                let data = {
                    uid:self.userId,
                    type:'execute'
                }
                this.axios({
                    url:'api/v1.0/gettypesinfo',
                    method:'post',
                    data:data
                }).then(function(res){
                    console.log(res);
                    var data = res.data.data;
                    self.tabLists[0].count = data.confirmednum;
                    self.tabLists[1].count = data.processnum;
                    self.tabLists[2].count = data.morra;
                    self.tabLists[3].count = data.finish;
                })
            },
            initList(type){
				clearInterval(this.timer);
				this.timer = null;
                let self = this;
                var page = self.searchCondition.pageNo;
                let data = {
                    uid:self.userId,
                    genre:type,
                    page:page
                }
                this.axios({
                    url:'/api/v1.0/typeexecute',
                    method:'post',
                    data:data
                }).then(function (res) {
                    console.log(res);
                    let data = res.data.data;
                    if(data.length>0){
                        self.noResult = false
                    }else{
                        self.noResult = true
                    }
                    if(self.searchCondition.pageNo == 1){
                        self.inProcessData=res.data.data;
                    }else{
                        res.data.data.forEach((item)=>{
                            self.inProcessData.push(item);
                        })
                    }
                    self.haveLoaded = false;
                    var loadPage = (self.searchCondition.pageNo)*10
                    if(loadPage>=res.data.total){
                        self.isHaveMore(false);
                        self.noMore = true;
                    }else{
                        self.isHaveMore(true);
                        self.noMore = false;
                    }

                    if(self.inProcessData.length>0){
                        self.inProcessData.forEach((item)=>{
                            if(type == 2 && item.status == 3){//处理中
                                self.$set(
                                    item,"sj",self.getRemainderTime2(item.confirmTime)
                                );
                                console.log(222)
                            }else if(type == 3 && item.status == 3){//已延误
                                self.$set(
                                    item,"sj",self.getRemainderTime2(item.endTime)
                                );
                                console.log(333)

                            }
                        })
                        self.timer = setInterval(function () {
                            self.inProcessData.forEach((item)=>{
                                if(type == 2 && item.status == 3){//处理中
                                    self.$set(
                                        item,"sj",self.getRemainderTime2(item.confirmTime)
                                    );
									console.log(222)
                                }else if(type == 3 && item.status == 3){//已延误
                                    self.$set(
                                        item,"sj",self.getRemainderTime2(item.endTime)
                                    );
									console.log(333)

                                }
                            })
                        },1000);
                    }
                })
            },
            enterDetail(index,id){
                this.$router.push({
                    query:{
                        orderId:id,
//                        tabType:index
                    },
                    path:'/orderdetails'
                })
            },
            getRemainderTime2(startTime){
				if(!startTime){
					return ''
				}
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
            loadTop() { //组件提供的下拉触发方法
                this.searchCondition.pageNo = 1;
                this.searchCondition.pageSize = 10;
                this.inProcessData = [];
                this.initTabList();
                this.initList(this.tabActiveIndex);
                this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
            },
            loadBottom() {
                this.searchCondition.pageNo+=1;
                this.initList(this.tabActiveIndex);
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
        background:url("../../assets/images/group.png") top left no-repeat;
        background-size:7.5rem  1.55rem;
        padding-top:0.94rem;
        height: 100%;
        width:100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
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
        border-bottom: 1px solid #EEF1F6;
    }
	.tab-list-item:last-child{
		border: none!important;
	}
    .list-item-title p{
        text-align: left;
    }
	.list-item-title>p.sign_status {
		text-align: right;
	}
    .noResult{
        padding:2rem 0;
    }
    .noResult p{
        font-size:0.32rem;
        font-family: PingFangSC-Regular;
        font-weight:500;
        color:rgba(153,156,170,1);
    }
    .noResult img{
        width:2.4rem;
        height:2.4rem;
    }
    .listContainer{
        width:100%;
        height:100%;
        position: relative;
        box-sizing: border-box;

    }
    .list{
        width:100%;
        height:100%;
        box-sizing: border-box;
        overflow:scroll;
        -webkit-overflow-scrolling: auto;
    }
    .haveLoaded{
        display: none;
    }

    /*.mint-loadmore{*/
        /*min-height: 100%;*/
    /*}*/
</style>
