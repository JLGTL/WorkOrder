<template>
    <div>
        <Head v-if="!isShare" :title="title" @back="back" :isBack="true" :hasShare="canSee" :hasBorder="true" @share="share"/>
        <div class="nodata nodata-back" v-if="showShareBack">
        	<img src="../../assets/images/group1.png">
        	<p class="tips">努力加载中。。。</p>
        </div>

		<div class="nodata nodata-back" v-if="authority">
			<img src="../../assets/images/group1.png">
			<p class="tips">您没有权限查看此工单</p>
		</div>
		<div class="nodata nodata-back" v-if="!canSee">
			<img src="../../assets/images/group1.png">
			<p class="tips" v-if="!canSeeNote">无权查看</p>
			<p class="tips" v-if="canSeeNote">{{canSeeNote}}</p>
			
		</div>
		

		<main v-if="workDetails" :class="[isShare?'shareMain':'']">
            <div class="single-order">
                <div class="tag_normal" v-if="workDetails.importantType == 1">普通</div>
                <div class="tag_important" v-if="workDetails.importantType == 2">重要</div>
                <div class="tag_danger" v-if="workDetails.importantType == 3">紧急</div>
                <div class="single-order-title flex"><p>{{workDetails.title}}</p>
                    <p class="noborder order-status" v-if="workDetails.status!=5">
                        <span class="sign_normal" v-if="workDetails.statusName == '待派发'">{{workDetails.statusName}}</span>
                        <span class="sign_normal" v-if="workDetails.statusName == '待确认'">{{workDetails.statusName}}</span>
                        <span class="sign_normal" v-if="workDetails.statusName == '待验收'">{{workDetails.statusName}}</span>
                        <span class="sign_important" v-if="workDetails.statusName == '处理中'">{{workDetails.statusName}}</span>
                        <span class="sign_delay" v-if="workDetails.statusName == '已延迟'">{{workDetails.statusName}}</span>
                        <span class="sign_invalid" v-if="workDetails.statusName == '已失效'">{{workDetails.statusName}}</span>
                    </p>
					<p class="noborder order-status completedTip" v-if="workDetails.status==5"><img src="../../assets/images/completedimg@2x.png" alt=""></p></div>
                <p class="single-order-period flex">
                    <img src="../../assets/images/clock_icon.png" class="clock_icon"/>
                    <span>任务周期&ensp;:&ensp;</span><span>{{workDetails.beginTime | noSecond}}-{{workDetails.endTime | noSecond}}</span><span></span>
                </p>
                <p class="single-order-create flex">
                  <span class="flex">
                      <img src="../../assets/images/executepeople_icon.png" class="executePeople_icon"/>
                      <span>创建人&ensp;:&ensp;</span><i v-if="workDetails.creatorInfo">&emsp;{{workDetails.creatorInfo.name}}&emsp;{{workDetails.creatorInfo.mobile}}</i></span>
                </p>
                <p class="single-order-create flex" v-if="workDetails.statusName == '已完成' && workDetails.useTimes">
                  <span class="flex">
                      <img src="../../assets/images/completedtimes@2x.png" class="executePeople_icon"/>
                      <span>处理时长&ensp;:&ensp;</span><i>{{workDetails.useTimes}}</i></span>
                </p>
                <p class="single-order-create flex" v-if="workDetails.statusName == '已完成'">
                  <span class="flex">
                      <img src="../../assets/images/icon_star@2x.png" class="executePeople_icon"/>
                      <span>工单评星&ensp;:&ensp;</span>
                      <!--<van-rate v-model="detailStar" :count="5" :size="12"/>-->
                      <span class="van-rate">
                          <i v-for="it in detailStar" class="van-icon van-icon-star van-rate__item" data-index="2" style="color: rgb(255, 210, 30); font-size: 12px;"></i>
                          <i v-for="it in (5-detailStar)" class="van-icon van-icon-star-o van-rate__item" data-index="2" style="color: rgb(199, 199, 199);; font-size: 12px;"></i>
                      </span>
                  </span>
                </p>
            </div>
            <div class="tabCont">
                <van-tabs v-model="active">
                    <span class="haveStep" v-if="haveStep"></span>
                    <van-tab title="工单">
                        <van-cell style="padding:0.5px 15px;"></van-cell>
                        <div>
                            <van-cell title="工单描述" class="afternone flex input_cell">
                                <template slot="icon">
                                    <img src="../../assets/images/describe_icon.png" class="describeIcon"/>
                                </template>
                            </van-cell>
                            <van-cell>
                                <div class="workDescribe">
                                    <p>{{workDetails.description}}</p>
                                </div>
                            </van-cell>
                            <van-cell class="afternone flex input_cell">
                                <template slot="title">
                                    <span class="custom-text">附件</span>
                                </template>
                                <template slot="icon">
                                    <img src="../../assets/images/upload_icon.png" class="icon"/>
                                </template>
                                <!--<img src="../../assets/images/addImg@2x.png" class="icon addpicBtn"/>-->
                            </van-cell>
                            <van-cell style="padding-bottom: 0.5rem;">
                                <p class="gray" v-if="workDetails.questionFiles.length == 0">暂无附件</p>
                                <p class="quest-img flex" v-if="workDetails.questionFiles.length > 0">
                                    <span v-for="(file,fileIndex) in workDetails.questionFiles" v-if="file.type == 1"><img @click="seeImg(fileIndex,'q')" v-lazy="file.url"/></span>
                                    <span v-for="(file,fileIndex) in workDetails.questionFiles" v-if="file.type == 2"><img src="../../assets/images/面授.png" @click="seeVideo(file.url)"/></span>
                                </p>
                            </van-cell>
                            <div class="operatePeople">
                                <div class="copyPeople flex">
                                    <img src="../../assets/images/dispatch_icon.png" class="icon"/>
                                    <span class="">执行人</span>
                                    <p class="dispathPeople flex gray" v-if='workDetails.executorInfo && workDetails.executorInfo.name'>{{workDetails.executorInfo.name}}</p>
									<p class="dispathPeople flex gray" v-else>无执行人</p>
                                </div>
                                <van-cell style="padding:0.5px 15px;"></van-cell>
                                <div class="copyPeople flex" @click="openCopyList">
                                    <img src="../../assets/images/share_icon.png" class="icon"/>
                                    <span class="">抄送人</span>
                                    <p class="dispathPeople flex gray"><img src="../../assets/images/head.png"/>{{workDetails.wocopy.length}}人</p>
                                </div>
                            </div>

                            <div class="work" v-if="workDetails.statusName == '待验收' || workDetails.statusName == '已完成'">
                                <van-cell title="结果说明" class="afternone flex input_cell">
                                    <template slot="icon">
                                        <img src="../../assets/images/resultnote@2x.png" class="describeIcon"/>
                                    </template>
                                </van-cell>
                                <van-cell>
                                    <div class="workDescribe">
                                        <p v-if="workDetails.finishDesc">{{workDetails.finishDesc}}</p>
                                        <p v-else>暂无说明</p>
                                    </div>
                                </van-cell>
                                <van-cell class="afternone flex input_cell">
                                    <template slot="title">
                                        <span class="custom-text">附件</span>
                                    </template>
                                    <template slot="icon">
                                        <img src="../../assets/images/upload_icon.png" class="icon"/>
                                    </template>
                                    <!--<img src="../../assets/images/addImg@2x.png" class="icon addpicBtn"/>-->
                                </van-cell>
                                <van-cell style="padding-bottom: 0.5rem;" v-if="workDetails.answerFiles">
                                    <p class="gray" v-if="workDetails.answerFiles.length == 0">暂无附件</p>
                                    <p class="quest-img flex" v-if="workDetails.answerFiles.length > 0">
                                        <span v-for="(file,fileIndex) in workDetails.answerFiles" v-if="file.type == 1"><img :src="file.url" @click="seeImg(fileIndex,'a')"/></span>
                                        <span v-for="(file,fileIndex) in workDetails.answerFiles" v-if="file.type == 2"><img src="../../assets/images/面授.png" @click="seeVideo(file.url)"/></span>
                                    </p>
                                </van-cell>
                            </div>
                            <!--待派发，待确认有拒绝说明-->
                            <div class="leaveWord" v-if="(workDetails.statusName == '待派发' || workDetails.statusName == '待确认') && workDetails.isReturn==1 && workDetails.returnDesc">
                                <h2 class="leaveWord-title flex">
                                    <span class="refuseTip"><img src="../../assets/images/refusenote@2x.png" alt="">拒绝说明</span>
                                </h2>
                                <ul class="leaveWord-list">
                                    <li class="leaveWord-list_li flex">
                                        <div class="list_li_left">
                                            <img src="../../assets/images/head.png" v-if="!workDetails.executorInfo.avatar"/>
                                            <img :src="workDetails.executorInfo.avatar" v-if="workDetails.executorInfo.avatar"/>
                                        </div>
                                        <div class="list_li_right flex">
                                            <p><span class="name">{{workDetails.executorInfo.name}}</span></p>
                                            <p class="work">{{workDetails.refuseTime | formatCreateTime}}</p>
                                        </div>
                                    </li>
                                    <p class="refuse_detail">{{workDetails.returnDesc}}</p>
                                </ul>
                            </div>
                            <!--处理中有不通过说明-->
                            <div class="leaveWord" v-if="unpassReason && workDetails.statusName == '处理中'">
                                <h2 class="leaveWord-title flex">
                                    <span class="refuseTip"><img src="../../assets/images/refusenote@2x.png" alt="">验收不通过说明</span>
                                </h2>
                                <ul class="leaveWord-list">
                                    <li class="leaveWord-list_li flex">
                                        <div class="list_li_left">
                                            <img src="../../assets/images/head.png" />
                                        </div>
                                        <div class="list_li_right flex">
                                            <p><span class="name">{{workDetails.creatorInfo.name}}</span></p>
                                            <p><span class="date">{{unpassTime}}</span></p>
                                        </div>
                                    </li>
                                    <p class="refuse_detail">{{unpassDesc}}</p>
                                </ul>
                            </div>
							<!--都有留言-->
							<div class="leaveWord">
							    <h2 class="leaveWord-title flex">
							        <span>留言</span>
							        <span class="leaveword-num"><i>{{comments.length}}</i>条动态<img src="../../assets/images/leaveWord.png"  @click="setComments"/></span>
							    </h2>
								<div class="nodata nodata-little" v-if="comments.length==0">
									<img src="../../assets/images/group8.png">
									<p class="tips">暂时没有留言哦~</p>
								</div>
							    <ul class="leaveWord-list">
							        <li class="leaveWord-list_li flex" v-for="item in comments" @click="replayComment(item.userId,item.userName)">
							            <div class="list_li_left">
							                <img :src="item.avatar" v-if="item.avatar"/>
							                <img src="../../assets/images/head.png" v-if="!item.avatar"/>
							            </div>
							            <div class="list_li_right flex">
							                <p>
												<span class="name">{{item.userName}}</span>
												<span class="date">{{item.createTime | formatCreateTime}}</span>
											</p>
							                <p class="work" v-if="!item.toId">{{item.content}}</p>
											<p class="work" v-if="item.toId">回复&ensp;<span>{{item.toName}}</span>&ensp;{{item.content}}</p>
											<b class="line"></b>
							            </div>
							        </li>
							    </ul>
							</div>

                        </div>
                    </van-tab>
                    <van-tab title="跟进" style="position: relative">
                        <van-cell style="padding:0.5px 15px;">
                        </van-cell>
                        <div class="step-list">
                            <div class="step-list-item" v-for="item in workDetails.logs" v-if="workDetails.logs">
                                <div class="step-list-content">
                                    <p>
                                        <img v-if="item.avatar" :src="item.avatar"/>
                                        <img v-else src="../../assets/images/head.png"/>
                                        <span>{{item.userName}}</span>
                                    </p>
                                    <p>{{item.description}}</p>
                                    <p>{{item.createTime | getdate}}<span v-if="item.type == 2" class="editLogs" @click="editLogs(item.id)" style="display: none;">编辑</span></p>
                                </div>
                                <div class="step-circle"></div>
                                <div class="step-line"></div>
                            </div>
                        </div>
                        <div class="nodata nodata-little nologs" v-if="workDetails.logs.length==0">
                            <img src="../../assets/images/group6.png">
                            <p class="tips">暂时没有跟进哦~</p>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </main>
		<comments
		  v-show="showComments"
		  :woId="woId"
		  :userName="userName"
		  :toId="toId"
		  :toName="toName"
		  @closeCommentPanel="initDetails"
		/>
		<div class="imgPreview" v-show="previewImg" @click="closePreview()"><img :src="previewImg" alt=""></div>
		<div class="imgPreview videoPreview" v-show="previewVideo">
			<Head title="视频播放" @back="closePreview2()"/>
			<video :src="previewVideo" controls="controls"></video>
		</div>
		<!--抄送人列表-->
		<van-popup v-model="ShowCopyList" position="bottom" :overlay="true">
			<div class="list-item2">
				<p class="van-cell flex depart-one" v-for="item in workDetails.wocopy">
						<img v-lazy="item.avatar" alt="" class="headImg" v-if="item.avatar"/>
						<img src="../../assets/images/head.png"  class="headImg" v-if="!item.avatar"/>

					<span class="depart-user-name">{{item.name}}</span>
					<span class="depart-user-title" v-if="item.type==1">直属领导</span>
				</p>
			</div>
		</van-popup>
		<!--抄送人列表END-->
    </div>
</template>

<script>
    import Head from '@/components/head'
    import { Toast,Dialog,ImagePreview } from 'vant';
	import { parseTime} from "@/utils/index";
	import comments from "@/components/comments";
	import apiConfig from '../../../config/api.config.js'
    export default {
        name: 'no-workorder-detail',
        components: {Head,comments},
        data () {
            return {
                title: '工单详情',
				isShare:false,//是否为分享出去的
                active: 0,
                submit: true,
                orderId : '',
                userId:'',
                workDetails:'',
                haveStep:false,//是否有跟进
                setlogs:false,
                isEmpty:true,//跟进
                reason:'', //跟进内容
                refuseShow:false,
                isRefuse:true,//拒绝
                refuseReason:'',//拒绝内容
                tabType:'',//状态来源
                isComplete:false, // 处理中状态 完成工单开关
                isShow:false,//完成开关下显示
				showComments: false,
				//userId: this.$route.query.userId,//当前登录人id
				userName: "",//当前登录人姓名
				woId: this.$route.query.orderId,//工单ID
				toId:'',//被回复的留言id
				toName:'',//被回复的留言者姓名
				previewImg:'',
				previewVideo:'',
				showShareBack:false,//分享进来的时候，显示加载中
				authority:false,//分享进来的时候，有没有权限
                detailStar:0,//详情评星
				ShowCopyList:false,
                unpassReason:false,//是否有不通过说明
                unpassDesc:'',//不通过说明
                unpassTime:'',//不通过时间
				isPush:false,
				canSee:true,//查看工单
				canSeeNote:'',
            }
        },
		beforeRouteEnter(to, from, next){
			console.log("======to========")
			console.log(to)
			console.log("======from========")
			console.log(from)
			next(vm => {
				if(!from.name){
					vm.isPush = true;
				}else{
					vm.isPush = false;
				}
			})
		},
        created () {
			if(this.$route.query.share && this.$route.query.share=='WX'){
				this.isShare = true;
			}
			if(!this.isShare){
				//不是分享的
				this.orderId = this.$route.query.orderId;
				this.userId = window.localStorage.getItem('userId');
				this.initDetails();
			}else{
				//分享进来的
				let self = this;
				this.orderId = this.$route.query.orderId;

				this.showShareBack = true;//显示背景
				if (!this.$route.query.userId) {
					//没有userId 去登录
					window.location.href ="https://cas.huatu.com/login?service="+apiConfig.baseURL+"/api/v1.0/logincallback?id="+this.orderId;
				} else{
					let userId = this.$route.query.userId;
					this.userId = userId;
					let isCreator = this.$route.query.isCreator;//创建人
					let isExecutor = this.$route.query.isExecutor;//执行人
					let isCopyperson = this.$route.query.isCopyperson;//抄送人
					if(isCreator=='1'){
						//创建人
						self.$router.push({
							path:'/createdetails',
							query:{
								orderId:this.orderId,
								userId:userId,
								share:'WX'
							}
						})
					}else if(isExecutor=='1'){
						//执行人
						self.$router.push({
							path:'/orderdetails',
							query:{
								orderId:this.orderId,
								userId:userId,
								share:'WX'
							}
						})
					}else if(isCopyperson=='1'){
						// 抄送人
						this.showShareBack = false;//显示背景
						this.initDetails();
					}else{
						//没有权限
						this.authority = true;
					}
				}
			}

        },
        watch:{
            active:function () {
                if(this.active == 0){
                    this.submit = true
                }else if(this.active == 1){
                    this.submit = false
                    this.editwoLogs();
                    this.haveStep = false;
                }
            }
        },
        filters:{
            noHour(val){
                var time = val.split(' ')[0];
                return time;
            },
            noSecond(val){
                var val = val.replace(/-/g,'.');
                var year = val.split(' ')[0];
                var hour = val.split(' ')[1].substr(0,5);
                return year+' '+hour;
            },
			formatCreateTime(data){
				if (!data) return ''
				return parseTime(data,"{m}月{d}日 {h}:{i}");
			},
            /**
             * 格式化时间戳
             */
            getdate(dateTime) {
                var now = new Date(dateTime*1000),
                    y = now.getFullYear(),
                    m = now.getMonth() + 1,
                    d = now.getDate();
                var day = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
                var time = day.replace(/-/g, ".").split(' ')[0]+' '+day.replace(/-/g, ".").split(' ')[1].substr(0,5);
                return time;
            },
        },
        methods: {
			openCopyList(){
				this.ShowCopyList = true;
			},
            back () {
				if(this.isPush){
					this.$router.push({
						path:'/',
						query:{
							userId:localStorage.getItem('userId'),
							menuOpen:'0'
						}
					})
				}else{
					this.$router.go(-1);
				}
            },
			share(){
				let url = apiConfig.baseURL2+'/h5/mycopyOrder?orderId='+this.woId+'&share=WX';
				if(window.htoa){//安卓
					window.htoa.wxShare("{'title':'"+this.workDetails.title+"','content':'"+this.workDetails.description+"','url':'"+url+"'}");
				}else if(window.webkit.messageHandlers){
					window.webkit.messageHandlers.Workorder.postMessage({FunctionName:'Share',title:this.workDetails.title,content:this.workDetails.description,url:url});
				}
			},
            //编辑跟进
            editwoLogs(){
                let self = this;
                var data = {
                    id:self.orderId,
                    userId:self.userId,
                }
                self.axios({
                    url:'/api/v1.0/seewologs',
                    method:'post',
                    data:data
                }).then(function (res) {
                    self.initDetails();
                })
            },
            initDetails(){
                let self = this;
				this.showComments = false;
                let data = {
                    userId:this.userId,
                    id:this.orderId
                }
                self.axios({
                    url:'api/v1.0/wodetail',
                    method:'post',
                    data:data
                }).then(function(res){
					if(res.data.code=='200'){
						console.log('========initDetails========');
						console.log(res);
						let canSee = false;
						res.data.data.wocopy.forEach(copy=>{
							console.log(copy.copyperson+'=========='+self.userId)
							if(parseInt(self.userId) == parseInt(copy.copyperson)){
								canSee = true;
							}
						})
						self.canSee = canSee;
						res.data.data.beginTimes = res.data.data.beginTime.split(' ')[0].replace(/-/g,'.');
						res.data.data.endTimes = res.data.data.endTime.split(' ')[0].replace(/-/g,'.');
						//self.$nextTick(function () {
						self.workDetails = res.data.data;
						self.haveStep = res.data.data.isRemind;
						self.title = res.data.data.statusName;
						self.comments = res.data.data.comments;
						if(self.workDetails.submitTime != null && self.workDetails.submitTime != ''){
						    self.workDetails.useTimes = self.getRemainderTime(self.workDetails.confirmTime,self.workDetails.submitTime);
						}
						self.detailStar = parseInt(res.data.data.starLevel);
						if(self.workDetails.isReturn == 1){
						    self.unpassReason = true;
						    self.unpassDesc = self.workDetails.unpassDesc;
						}
						self.unpassTime = self.workDetails.refuseTime;
					}else{
						self.canSee = false;
						self.canSeeNote = res.data.message;
						Toast(res.data.message)
					}
                })
            },
			//留言
			setComments() {
			  this.toId = "";
			  this.toName = "";
			  this.showComments = true;
			},
			replayComment(id, name) {
			  this.toId = id;
			  this.toName = name;
			  this.showComments = true;
			},

			seeImg(index,type){
			    // this.previewImg = url;
				let data = [];
				let imgList = [];
				if(type=='q'){
					//问题
					imgList = this.workDetails.questionFiles;
				}else{
					imgList = this.workDetails.answerFiles;
				}
				let length = 0;
				let cur = 0;
				imgList.forEach((item,index2)=>{
					if(index==index2){
						cur = length;
					}
					if(item.type=='1'){
						data.push(item.url)
						length++;
					}
				})
				ImagePreview(data,cur)
			},
			seeVideo(url){
				this.previewVideo = url;
			},
			closePreview(){
			    this.previewImg = '';
			},
			closePreview2(){
			    this.previewVideo = '';
			},
            //计算时长
            getRemainderTime (startTime,endTime){
                var s1 = new Date(startTime.replace(/-/g, "/")),
                    //var s1 = startTime,
                    s2 = new Date(endTime.replace(/-/g, "/")),
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
                return day+'天 '+hour+'时'+minute+'分'+second+'秒';
            },
        }
    }
</script>
<style scoped>
	.shareMain{
		margin-top:-54px;
	}
    .step-list {
        padding: 0 0.26rem 0 1.08rem;
        margin-bottom: 0.2rem;
        /*border-top: 1px solid #EEF1F6;*/
        background: #fff;
        overflow: hidden;
    }

    .step-list-item {
        height:2.08rem;
        float: none;
        display: block;
        font-size: 14px;
        line-height: 18px;
        padding: 14px 10px 14px 0;
        box-sizing: border-box;
        position: relative;
        border-top: 1px solid #EEF1F6;
    }

    .step-list-item p:first-child {
        margin-top: 0;
    }

    .step-list .step-list-item:first-child {
        border: none;
    }

    .step-list .step-list-item:last-child .step-line {
        height: calc(100% - 0.9rem);
    }

    .step-list-content {
        text-align: left;
    }

    .step-list-content p {
        margin-top: 0.2rem;
    }

    .step-list-content p:nth-child(1) img {
        width: 0.52rem;
        height: 0.52rem;
        vertical-align: middle;
        margin-right: 0.16rem;
        -webkit-border-radius:50%;
        -moz-border-radius:50%;
        border-radius:50%;
    }

    .step-list-content p:nth-child(1) span {
        vertical-align: middle;
        color: #333;
        font-size: 15px;
    }

    .step-list-content p:nth-child(2) {
        font-size: 14px;
        color: #333;
    }

    .step-list-content p:nth-child(3) {
        font-size: 12px;
        color: #999CAA;
    }

    .step-circle {
        position: absolute;
        top: 0.5rem;
        left: -0.55rem;
        border: 1px solid #608BF7;
        width: 0.2rem;
        height: 0.2rem;
        border-radius: 0.1rem;
        box-sizing: border-box;
    }

    .step-circle:before {
        position: absolute;
        display: block;
        content: "";
        width: 0.1rem;
        height: 0.1rem;
        border-radius: 0.05rem;
        background: #608BF7;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
    }
    .step-line {
        position: absolute;
        left: -0.47rem;
        top: 0.7rem;
        width: 0.02rem;
        height: calc(100% - 0.2rem);
        background: #608BF7;
    }
    .largeBtn {
        width: 4.8rem;
        margin: 0 auto;
    }
    .floatBtn{
        position:fixed;
        bottom:0.78rem;
        left:1.35rem;
        z-index:80;
    }
    .order-level{
        position: absolute;
        left: 0.35rem;
        top:0;
    }
    .quest-img{
        margin-top:0.28rem;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .quest-img span{
        width:calc(100%/3);
        display: inline-block;
        text-align: center;
    }
    .quest-img img{
        width:1.88rem;
        height:1.88rem;
        /*margin-right:0.44rem;*/
        border-radius: 10px;
    }
    .operatePeople {
        background: #fff;
    }
    .copyPeople {
        height: 0.9rem;
        box-sizing: border-box;
        justify-content: space-between;
        padding: 0.2rem 0.3rem;
        background: #fff;
        align-items: center;
        color: #323233;
        font-size: 14px;
    }
    .copyPeople > i {
        margin-right: 0.1rem;
    }

    .copyPeople p {
        flex: 1;
        text-align: right;
        margin: 0;
    }
    .dispathPeople {
        justify-content: flex-end;
        align-items: center;
    }
    .dispathPeople img {
        width: 0.52rem;
        height:  0.52rem;
        margin-right:0.16rem;
    }
    .btnGroup{
        width: 100%;
        height:1rem;
        position: fixed;
        bottom:0;
        /*background: #fff;*/
    }
    .btnGroup button{
        width:2.5rem;
        height:0.88rem;
        box-sizing: border-box;
    }
    .btnGroup button:nth-child(1){
        margin-right: 0.2rem;

    }
    .btnGroup button:nth-child(2){
        background: url('../../assets/images/disagreebtn@2x.png');
        -webkit-background-size:cover;
        background-size:cover;
        box-shadow: 0px 2px 20px 0px #D4E2FB;
    }
    main{
        /* padding-bottom: 1.5rem; */
		/*padding-bottom: 20px;*/
        /*background: #fff;*/
        padding-bottom: 0;
    }
    .icon_enter{
        color: #999CAA;
        margin-left: 0.1rem;
    }
    .work{
        /*border-top: 0.2rem solid #f2f2f2;*/
        /*background: #fff;*/
        margin-top:0.2rem;
    }

    .work p {
        margin: 0;
    }
    .workDescribe-inner{
        height: 2.48rem;
        padding: 0 0.12rem;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 0.1rem;
        position: relative;
    }
    .workDescribe-inner textarea {
        display: inline-block;
        outline: none;
        border: none;
        width: 100%;
        height: calc(100% - 0.6rem);
        resize: none;
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
    }
    .workDescribe-inner span {
        position: absolute;
        right: 0.12rem;
        bottom: 0.08rem;
    }
    .addpicBtn{
        position: relative;
        top:0.08rem;
    }
    .leaveWord{
        margin: 0.2rem 0rem;
        border-radius: 0.1rem;
        background: #fff;
        padding: 0.24rem 0.23rem 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        /*border-top: 0.2rem solid #F6F7FB;*/
    }
    .leaveWord-title{
        justify-content: space-between;
        align-items: center;
        margin:0;
        font-size:0.28rem;
        /*padding:0 0.2rem;*/
        color:#333;
    }
    .leaveWord-title img{
        width:0.3rem;
        height:0.3rem;
        display:inline-block;
        margin-bottom:-0.04rem;
        margin-left:0.18rem;
    }
    .leaveword-num{
        color:#999CAA;
        font-size:0.28rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
    }
    .leaveWord-list{
        margin-top:0.28rem;
        overflow:hidden;
    }
    .leaveWord-list_li{
        margin-bottom:0.12rem;
    }
    .list_li_left{
        margin-right:0.14rem;
    }
    .list_li_left img{
        width: 0.9rem;
        height: 0.9rem;
        border-radius: 50%;
    }
    .info-list .leaveWord-list_li{
        justify-content:space-between;
    }
    .list_li_right{
        flex-grow:1;
        justify-content: center;
        flex-direction: column;
        line-height:0.4rem;
        font-size:0.28rem;
        text-align:left;
    }
    .list_li_right p{
        margin:0;
    }
    .list_li_right p:nth-child(1){
        display:flex;
        justify-content: space-between;
    }
    .list_li_right p:nth-child(1) .name{
        color:#333;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 0.28rem;
    }
    .list_li_right p:nth-child(1) .date{
        color:#999CAA;
        font-size:0.24rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
    }
    .list_li_right p:nth-child(2){
        font-size:0.28rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(153,156,170,1);
    }
    .list_li_right p:nth-child(3) i:after{
        content:"|";
        display:inline-block;
        padding:0 0.1rem;
    }
    .list_li_right p:nth-child(3) i:last-child:after{
        content:"";
        display:inline-block;
        padding:0;
    }
	.list_li_right b.line{
		display: block;
		height: 1px;
		background: #EEF1F6;
		margin-left: 5vw;
		margin-right: 2vw;
		margin-top: 10px;
	}

	.list_li_right p.work span{
		color: #608BF7;
	}
	.leaveWord-list_li:last-child .list_li_right b.line{
		background: transparent;
	}
    .padding_no{
        padding:0;
    }
    .submitBtn,.btnGroup{
        width:100%;
        height:0.88rem;
        padding:0 0.35rem;
        position: fixed;
        bottom: 0.5rem;
        left: 0;
        box-sizing: border-box;
        z-index: 1;
    }
    .submitBtn button{
        height:0.88rem;
        border-radius: 0.1rem;
    }
    .btnGroup button{
        width:2.5rem;
        height:0.88rem;
        box-sizing: border-box;
    }
    .btnGroup button:nth-child(1){
        margin-right: 0.2rem;
    }
    .btnGroup button:nth-child(2){
        background: url('../../assets/images/disagreebtn@2x.png');
        -webkit-background-size:cover;
        background-size:cover;
        box-shadow: 0px 2px 20px 0px #D4E2FB;
    }
    .tabCont{
        position: relative;
    }
    .haveStep{
        display: block;
        position: absolute;
        z-index: 99;
        right: 1.25rem;
        top:0.25rem;
        width: 6px;
        height:6px;
        -webkit-border-radius:50%;
        -moz-border-radius:50%;
        border-radius:50%;
        background: #ff0000;
    }

    /****提示****/
    .dialog-textarea{
        border-radius:5px;
        border:1px solid rgba(238,238,238,1);
        font-size: 12px;
        line-height: 16px;
        color: #C1C2C5;
        margin: 0 10px;
        margin-top: 7px;
        text-align: left;
    }
    .isEmpty,.isRefuse,.isEditEmpty{
        border-color: #FD6562;
    }
    .dialog-textarea textarea{
        min-height: 44px;
        width: 100%;
        border: none;
        box-sizing: border-box;
    }
	.imgPreview{
	    position: fixed;
	    width: 100%;
	    height:100%;
	    z-index: 102;
	    background:rgba(0,0,0,1);
	    top:0;
	    left:0;
	}
	.imgPreview img{
	    width:100%;
	    height:7rem;
	    display: inline-block;
	    position: absolute;
	    top:52%;
	    left:0;
	    margin-top:-3.5rem;
	}
	.videoPreview video{
		width: 100%;
		max-height: calc(100vh - 54px);
		margin-top: 54px;
	}
	.nodata-little{
		margin-top: 10px;
	}
	.nodata-little img{
		width: 90px;
		margin: 0 auto;
	}
	.nodata-little p{
		text-align: center;
		padding-top: 15px;
		padding-bottom: 15px;
	}
	.completedTip img{
	    width: 0.83rem;
	    height: 0.62rem;
	    position: absolute;
	    right: 0.38rem;
	    top: 0.65rem;
	}
	.nodata-back{
		position: fixed;
		z-index: 1003;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		margin: 0;
		padding-top: 30vw;
	}
</style>
