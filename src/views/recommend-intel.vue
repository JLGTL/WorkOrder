<template>
    <div>
        <Head :title="title" @back="back" :hasBorder="true"/>
        <main>
            <div class="backGrey searchBox">
				<form action="javascript:return true">
					<van-search placeholder="请输入问题" v-model="searchValue" :show-action='isShowAction' @cancel="onCancel"
					@focus="isShowAction=true" @search="onSearch" id="myBox" class="search" autocomplete="off">
						<template slot="left-icon">
							<img src="../assets/images/search_icon.png" class="icon"/>
						</template>
					</van-search>
				</form>
            </div>
            <!-- <div class="intel-list flex" v-show="!isShowAction"> -->
            <div class="intel-list flex" v-show="!isShowAction">
                <h2 class="list-title" v-if="!searchValue">热门推荐<i></i></h2>
				<div :class="[searchValue?'intel-main2':'intel-main']">
					<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore" v-if="searchValue">
						<div class="intel-list-item  flex" v-for="(item,index) in hotLists" @click="enterDetail(item.id)" >
							<p class="intel-title">{{item.title}}</p>
							<p class="intel-memo">{{item.description}}</p>
						</div>
					</mt-loadmore>
					<div v-if="!searchValue">
						<div class="intel-list-item  flex" v-for="(item,index) in hotLists" @click="enterDetail(item.id)" >
							<p class="intel-title">{{item.title}}</p>
							<p class="intel-memo">{{item.description}}</p>
						</div>
					</div>
				</div>
				<div class="nodata" v-if="hotLists.length==0">
					<img src="../assets/images/group6.png">
					<p class="tips">没有相关内容哦～</p>
				</div>
            </div>
            <div class="intel-list flex" v-show="isShowAction">
                <h2 class="list-title">搜索历史</h2>
				<div class="nodata" v-if="searchLists.length==0">
					<img src="../assets/images/group6.png">
					<p class="tips">暂无搜索历史～</p>
				</div>
                <div class="history-list-item  flex m" v-for="(item,index) in searchLists">
                    <span class="list-text" @click="initSearch(item.content,1)">{{item.content}}</span>
                    <van-icon name="cross" @click="delHistory(item.id,index)"/>
                </div>
                <div class="delete-history" @click="delHistory()" v-if="searchLists.length!=0">
                    <!--<van-icon name="delete" color="#999CAA"/>-->
                    <span class="clearhistory"><img src="../assets/images/trash@2x.png"></img></span>
                    <span class="list-text">清空搜索历史</span>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
    import Head from "@/components/head";
    export default {
        components: {Head},
        data() {
            return {
                title: "热门知识",
                searchValue: "",
                isShowAction: false,
                hotLists:[],
				allLoaded: false,
				searchCondition:{//分页属性
				    pageNo:1,
				    pageSize:10
				},
                searchLists: [],
            }
        },
        mounted(){
            this.initSearch();
        },
		watch:{
			isShowAction(val,old){
				if(val){
					this.getHistory()
				}
			}
		},
        methods: {
            back() {
                this.$router.push({
                	path:'/',
                	query:{
                		menuOpen:'0',//不打开目录
                		userId:localStorage.getItem('userId')
                	}
                })
            },
            onCancel() {
				this.searchValue = '';
                this.isShowAction = false;
				this.initSearch(this.searchValue,1)
            },
            onSearch(){
                this.initSearch(this.searchValue,1)
            },
            enterDetail(id){
                this.$router.push({
                    path:'/recommendinteldetail',
					query:{
						recommendId:id
					}
                })
            },
			loadTop() { //组件提供的下拉触发方法
			    this.searchCondition.pageNo = 1;
			    this.searchCondition.pageSize = 10;
			    this.initSearch(this.searchValue,this.searchCondition.pageNo);
			    this.$refs.loadmore.onTopLoaded();// 固定方法，查询完要调用一次，用于重新定位
			},
			loadBottom() {
			    this.searchCondition.pageNo+=1;
			    this.initSearch(this.searchValue,this.searchCondition.pageNo);
			    this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
			},
			isHaveMore(isHaveMore){
			    if(isHaveMore){
			        this.allLoaded = false;
			    }else{
			        this.allLoaded = true;
			    }
			},
            initSearch(val,page){
                if(val == undefined){
                    val = ''
                }
                if(page == undefined){
                    page = 1
                }
                let self = this;
                let data={
					userId:localStorage.getItem('userId'),
                    title:val,
                    page:page
                }
                console.log(data);
                this.axios({
                    url:'/api/v1.0/hotpopular',
                    method:'post',
                    data:data
                }).then(function(res){
                    console.log(res);
					self.isShowAction = false;
					if(res.data.total==0){

					}
					if (page==1) {
						self.hotLists = res.data.data;
					} else{
						if(res.data.data.length>0){
							res.data.data.forEach(item=>{
								self.hotLists.push(item)
							})
						}
					}
					var loadPage = (self.searchCondition.pageNo)*10
					if(loadPage>=res.data.data.total){
						console.log('true')
						self.isHaveMore(false);
					}else{
						self.isHaveMore(true);
					}
                })
            },
			//获取历史记录列表
			getHistory(){
				let self = this;
				let data = {
					userId:localStorage.getItem('userId')
				}
				this.axios({
				    url:'/api/v1.0/searchlog',
				    method:'post',
				    data:data
				}).then(function(res){
				    console.log(res.data);
					if(res.data.code=='200'){
						self.isShowAction = true;
						self.searchLists = res.data.data;
					}else{
						self.isShowAction = true;
						self.searchLists = [];
					}

				})
			},
			//删除历史记录
			delHistory(id,index){
				if(!id){
					id = '';
					index = '';
				}
				let self = this;
				let data = {
					userId:localStorage.getItem('userId'),
					id:id,
				}
				this.axios({
				    url:'/api/v1.0/delsearchlog',
				    method:'post',
				    data:data
				}).then(function(res){
				    console.log(res.data);
					if(res.data.code=='200'){
						if(id==''){
							self.searchLists = [];
						}else{
							self.searchLists.splice(index,1);
						}
					}else{
						Toast(rea.data.message)
					}

				})
			}
        }
    }
</script>
<style>
	.depart-list .van-cell{
		color: #3D3E43;
	}
	.intel-list-item {
	    background: #fff;
	    flex-direction: column;
	    padding: 0.2rem 0.12rem;
	    margin-bottom: 0.3rem;
	    justify-content: center;
	    border-radius: 0.1rem;
	    align-items: flex-start;
	    border-bottom: 1px solid #f2f2f2;
	}
</style>
<style scoped>
    .intel-list {
        flex-direction: column;
        padding: 0 0.26rem;
    }

    .intel-list-item {
        background: #fff;
        flex-direction: column;
        padding: 0.2rem 0.12rem;
        margin-bottom: 0.3rem;
        justify-content: center;
        border-radius: 0.1rem;
        align-items: flex-start;
        border-bottom: 1px solid #f2f2f2;
    }
    p, h2 {
        margin: 0;
        width: 100%;
    }

    .list-title {
        text-align: left;
        color: #608BF7;
        font-size: 15px;
        margin-left: 0.14rem;
        /*margin-top: 0.1rem;*/
        margin-bottom: 0.1rem;
        position: relative;
    }

    .list-title i {
        display: inline-block;
        background: url("../assets/images/hot.png") no-repeat;
        width: 0.4rem;
        height: 0.2rem;
        position: absolute;
        left: 1.3rem;
        top: 0.06rem;
        background-size: contain;
    }

    .intel-title {
        color: #373D46;
        font-size: 14px;
        text-align: left;
        margin-bottom: 0.1rem;
    }

    .intel-memo {
        color: #999CAA;
        font-size: 14px;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .backGrey {
        background: #F6F7FB;
    }

    .backGrey .van-search {
        background: #F6F7FB !important;
        padding: 0.22rem 0.25rem;

    }

    .backGrey .van-search .van-cell {
        border-color: #EEE7E7;
        height: 0.68rem;
        line-height: 0.6rem;
    }
    .van-cell__left-icon{
        margin-top:3px;
    }
    .history-list-item {
        width: 100%;
        color: #999CAA;
        font-size: 14px;
        padding: 0.2rem 0.24rem;
        background: #fff;
        justify-content: space-between;
        align-items: center;
        margin-left: -0.26rem;
        margin-right: -026rem;
    }

    .delete-history {
        margin: 0 auto;
        margin-top: 0.64rem;
    }
    .clearhistory img{
        width:0.26rem;
        height:0.3rem;
        display: inline-block;
        position: relative;
        top: 0.05rem;
    }
    .list-text {
        vertical-align: text-top;
        margin-left: 0.1rem;
        color: #999CAA;
        font-size: 14px;
		width: 100%;
		overflow: hidden;
		text-align: left;
		text-overflow: ellipsis;
		white-space: nowrap;
    }
    .van-search__action{
        color:#608BF7;
    }
	.icon{
		width: 12px;
		height: 14px;
		margin-top: 5px;
		margin-right: 8px;
	}
	.intel-main{
		position: fixed;
		right: 0.26rem;
		left: 0.26rem;
		box-sizing: border-box;
		top: calc(108px + 0.6rem);
		bottom: 0;
		overflow-y: scroll;
	}
	.intel-main2{
		top: calc(70px + 0.6rem);

	}
</style>
