<template>
    <div>
        <Head v-if="!isShare" :title="workDetails.statusName" @back="back" :isBack="isBack" :hasShare="canSee" :hasBorder="true" :hasMore="sendPeople&&canSee" @selectPeople="selectPeople" @share="share"/>
        <div class="nodata nodata-back" v-if="!canSee">
        	<img src="../../assets/images/group1.png">
        	<p class="tips" v-if="!canSeeNote">无权查看</p>
        	<p class="tips" v-if="canSeeNote">{{canSeeNote}}</p>
        </div>
		<main :class="[isShare?'shareMain':'',noBottom?'noBottom':'']" v-if="workDetails">
            <div class="single-order">
                <div class="tag_normal" v-if="workDetails.importantType == 1">普通</div>
                <div class="tag_important" v-if="workDetails.importantType == 2">重要</div>
                <div class="tag_danger" v-if="workDetails.importantType == 3">紧急</div>
                <div class="single-order-title flex"><p>{{workDetails.title}}</p>
                    <p class="noborder order-status" v-if="workDetails.statusName != '已完成'">
                        <span class="sign_normal" v-if="workDetails.statusName == '待确认'">{{workDetails.statusName}}</span>
                        <span class="sign_normal" v-if="workDetails.statusName == '待验收'">{{workDetails.statusName}}</span>
                        <span class="sign_important" v-if="workDetails.statusName == '处理中'">{{workDetails.statusName}}</span>
                        <span class="sign_delay" v-if="workDetails.statusName == '已延迟'">{{workDetails.statusName}}</span>
                    </p>
                    <p class="noborder order-status completedTip" v-if="workDetails.statusName == '已完成'"><img src="../../assets/images/completedimg@2x.png" alt=""></p>
            </div>
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
                                <p class="gray" v-if="workDetails.questionFiles && workDetails.questionFiles.length == 0">暂无附件</p>
                                <p class="quest-img flex" v-if="workDetails.questionFiles && workDetails.questionFiles.length > 0">
                                    <span v-for="(file,index2) in workDetails.questionFiles" v-if="file.type == 1"><img v-lazy="file.url" @click="seeImg(index2,'q')"/></span>
                                    <span v-for="(file,index2) in workDetails.questionFiles" v-if="file.type == 2"><img src="../../assets/images/面授.png" @click="seeVideo(file.url)"/></span>
                                    <!--<img v-for="item in workDetails.questionFiles src="../../assets/images/面授.png" v-if="file.type==2" @click="seeVideo(item.url)"/>-->
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
                            <div class="work" v-if="workDetails.statusName == '处理中' || workDetails.statusName == '已延迟'">
                                <van-cell class="padding_no">
                                    <van-cell-group>
                                        <van-switch-cell v-model="isComplete" title="完成工单" size="0.36rem" @change="changeComplete()"/>
                                    </van-cell-group>
                                </van-cell>
                                <van-cell class="padding_no" v-if="isShow">
                                    <van-cell-group>
                                        <van-switch-cell v-model="isOpen" title="是否公开" size="0.36rem"/>
                                    </van-cell-group>
                                </van-cell>
                                <van-cell title="结果说明" class="afternone flex input_cell" v-if="isShow">
                                    <template slot="icon">
                                        <img src="../../assets/images/resultnote@2x.png" class="describeIcon"/>
                                    </template>
                                </van-cell>
                                <van-cell v-if="isShow">
                                    <div class="workDescribe">
                                        <div class="workDescribe-inner">
                                            <textarea placeholder="请填写结果说明" v-model='description' maxlength='500'></textarea>
                                            <span>{{inputNum}}/500</span>
                                        </div>
                                    </div>
                                </van-cell>
                                <van-cell class="flex input_cell" @click="pickFiletype()" v-if="isShow">
                                    <template slot="title">
                                        <span class="custom-text">上传附件</span>
                                        <!-- <i class="gray">最多添加6张照片，10M以内</i> -->
                                    </template>
                                    <template slot="icon">
                                        <img src="../../assets/images/upload_icon.png" class="icon"/>
                                    </template>
                                    <i class="add"></i>
                                </van-cell>
                                <van-cell class="pic_cell" v-if="isShow">
                                    <ul class="upload-list flex input_cell">
                                        <li class="upload-list-item" v-for="(item,index) in fileImg">
                                            <img v-lazy="item.content" alt="" v-if="item.type=='pic'"  @click="seeImg2(index,'upload')"/>
											<img src="../../assets/images/面授.png" alt="" v-if="item.type=='video'" @click="seeVideo(item.content)"/>
                                            <i class="delPic" @click="delPicture(index)"></i>
                                        </li>
										<li class="upload-list-item" v-for="(item,index) in oldfileImg">
										    <img v-lazy="item.url" alt="" v-if="item.type=='1'" @click="seeImg2(index,'old')"/>
										    <img src="../../assets/images/面授.png" alt="" v-if="item.type=='2'" @click="seeVideo(item.url)"/>
											<i class="delPic" @click="delOldPicture(item.id,index)"></i>
										</li>
                                    </ul>
                                </van-cell>
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
                                        <span class="custom-text">上传附件</span>
                                    </template>
                                    <template slot="icon">
                                        <img src="../../assets/images/upload_icon.png" class="icon"/>
                                    </template>
                                    <!--<img src="../../assets/images/addImg@2x.png" class="icon addpicBtn"/>-->
                                </van-cell>
                                <van-cell style="padding-bottom: 0.5rem;" v-if="workDetails.answerFiles">
                                    <p class="gray" v-if="workDetails.answerFiles.length == 0">暂无附件</p>
                                    <p class="quest-img flex" v-if="workDetails.answerFiles.length > 0">
                                        <span v-for="(file,index2) in workDetails.answerFiles" v-if="file.type == 1"><img v-lazy="file.url" @click="seeImg(index2,'a')"/></span>
                                        <span v-for="(file,index2) in workDetails.answerFiles" v-if="file.type == 2"><img src="../../assets/images/面授.png" @click="seeVideo(file.url)"/></span>

                                    </p>
                                </van-cell>
                            </div>
                            <div class="leaveWord" v-if="unpassReason && (workDetails.statusName == '处理中' || workDetails.statusName == '已延迟')">
                                <h2 class="leaveWord-title flex">
                                    <span class="refuseTip"><img src="../../assets/images/refusenote@2x.png" alt="">验收不通过说明</span>
                                </h2>
                                <ul class="leaveWord-list">
                                    <li class="leaveWord-list_li flex">
                                        <div class="list_li_left">
                                            <img :src="workDetails.creatorInfo.avatar" v-if="workDetails.creatorInfo.avatar"/>
                                            <img src="../../assets/images/head.png" v-else/>
                                        </div>
                                        <div class="list_li_right flex">
                                            <p><span class="name">{{workDetails.creatorInfo.name}}</span></p>
                                            <p><span class="date">{{unpassTime}}</span></p>
                                        </div>
                                    </li>
                                    <p class="refuse_detail">{{unpassDesc}}</p>
                                </ul>
                            </div>
                            <div class="leaveWord">
                                <h2 class="leaveWord-title flex" v-if="workDetails.comments">
                                    <span>留言</span>
                                    <span class="leaveword-num"><i>{{workDetails.comments.length}}</i>条动态<img src="../../assets/images/leaveWord.png"  @click="setComments"/></span>
                                </h2>
                                <div class="nodata nodata-little" v-if="workDetails.comments && workDetails.comments.length==0">
                                    <img src="../../assets/images/group8.png">
                                    <p class="tips">暂时没有留言哦~</p>
                                </div>
                                <ul class="leaveWord-list" v-if="workDetails.comments">
                                    <li class="leaveWord-list_li flex" v-for="item in workDetails.comments" @click="replayComment(item.userId,item.userName)">
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
                                    <p>{{item.createTime | getdate}} <span v-if="item.type == 2 && item.isMylog && workDetails.status!='1' && workDetails.status!='5'" class="editLogs" @click="editLogs(item.id,item.description)">编辑</span></p>
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

            <div class="submitBtn" v-if="!submit && workDetails.status!='1' &&workDetails.status!='5'">
                <van-button round type="infoRound" @click="setlog()" size="large">写跟进</van-button>
            </div>
            <!--<div v-if="submit">-->
                <!--<div v-if="workDetails.statusName == '待确认'">-->
                    <!--<div class="btnGroup">-->
                        <!--<van-button round type="infoRound" @click="accept()" class="">通过</van-button>-->
                        <!--<van-button round type="infoRound" @click="unaccept()" class="">不通过</van-button>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div v-else-if="workDetails.statusName == '处理中' || workDetails.statusName == '已延迟'">-->
                    <!--<div class="submitBtn" :class="{'unFixed':unFixed}">-->
                        <!--<van-button round type="infoRound" @click="subAcceptance" size="large">提交验收</van-button>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        </main>
        <!--跟进弹窗-->
        <van-dialog
            v-model="setlogs"
            show-cancel-button
            confirmButtonText='确定'
            :before-close="writeLog"
        >
            <div class="dialog-title">写跟进</div>
            <div :class="isEmpty?'dialog-textarea isEmpty':'dialog-textarea'">
                <textarea placeholder="跟进内容不能为空" v-model="reason" @input='isEmpty=false'></textarea>
            </div>
        </van-dialog>
        <!--编辑跟进弹窗-->
        <van-dialog
            v-model="editlogs"
            show-cancel-button
            confirmButtonText='确定'
            :before-close="writeLogEdit"
        >
            <div class="dialog-title">编辑跟进</div>
            <div :class="isEditEmpty?'dialog-textarea isEditEmpty':'dialog-textarea'">
                <textarea placeholder="" v-model="eidtMessage" @input='isEditEmpty=false'></textarea>
            </div>
        </van-dialog>
        <!--拒绝弹窗-->
        <van-dialog
            v-model="refuseShow"
            show-cancel-button
            confirmButtonText='确定'
            :before-close="refuseModal"
        >
            <div class="dialog-title">拒绝说明</div>
            <div :class="isRefuse?'dialog-textarea isRefuse':'dialog-textarea'">
                <textarea placeholder="拒绝内容不能为空" v-model="refuseReason" @input='isRefuse=false'></textarea>
            </div>
            <!--<p class="refuseStyle">今日可拒收{{refuseNum}}次</p>-->
        </van-dialog>
        <!--选择附件类型-->
        <van-popup v-model="showFiletype" position="bottom" :overlay="true" >
            <ul class="fileType">
            	<li @click="confirmFiletype('0')" v-if="picLength<9">
            		<!-- <van-uploader :after-read="onReadPic" :oversize='tips' accept="image/*" :max-size='fileSize'>
            		   图片
            		</van-uploader> -->
            		图片
            		<input type="file" accept="image/*" :max-size='fileSize' @change="onReadPic1" ref='img'/>

            		<i></i>
            	</li>
            	<li @click="confirmFiletype1('0')" v-if="picLength>=9">
            		   图片
            		<i></i>
            	</li>

            	<!-- <li @click="confirmFiletype('1')" v-if="videoLength<1">
            		短视频
            		<input type="file" accept="video/*" :max-size='fileSize' @change="onReadVideo1($event)"/>
            		<i></i>
            	</li>
            	<li @click="confirmFiletype1('1')" v-if="videoLength>=1">
            		   短视频
            		<i></i>
            	</li> -->
            </ul>
        </van-popup>
        <!--选择附件类型END-->
        <comments
            v-show="showComments"
            :woId="woId"
            :userName="userName"
            :toId="toId"
            :toName="toName"
            @closeCommentPanel="getDetail"
        />
        <!--执行人-->
        <van-popup v-model="showExecutePeople" position="right" :overlay="false">
            <sel-people @back='backFromsel(1)' :workType="workType" :executor='userId' @selectExecute='confirmExecutePeople'/>
        </van-popup>
        <!--执行人END-->
        <div class="imgPreview" v-show="previewImg" @click="closePreview()"><img :src="previewImg" alt=""></div>
        <div class="imgPreview videoPreview" v-show="previewVideo">
            <Head title="视频播放" @back="closePreview2()"/>
            <video :src="previewVideo" controls="controls" id="video"></video>
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
        <div v-if="submit">
            <div v-if="workDetails.statusName == '待确认'">
                <div class="btnGroup">
                    <van-button round type="infoRound" @click="accept()" class="">通过</van-button>
                    <van-button round type="infoRound" @click="unaccept()" class="">不通过</van-button>
                </div>
            </div>
            <div v-else-if="workDetails.statusName == '处理中' || workDetails.statusName == '已延迟'">
                <div class="submitBtn" :class="{'unFixed':unFixed}">
                    <van-button round type="infoRound" @click="subAcceptance" size="large">提交验收</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Head from '@/components/head'
    import { Toast,Dialog,ImagePreview } from 'vant';
    import { parseTime,fileResizetoFile} from "@/utils/index";
    import comments from "@/components/comments";
    import selPeople from "@/components/select-depeartment-people";
    import apiConfig from '../../../config/api.config.js';
    export default {
        name: 'executeDetails',
        components: {Head,comments,selPeople},
        data () {
            return {
                title: '',
                isShare:false,
                fileSize:1048576,//文件大小限制
                showFiletype:false,
                fileColums:['图片','短视频','PDF'],
                fileImg:[],
				oldfileImg:[],
				oldfileIds:[],//老图ids
                pic:[],
                pdf:[],
                video:[],
                active: 0,
                submit: true,
                orderId : '',
                userId:'',
                workDetails:'',
                activeTabIndex:'',//上级页面tab选中项
                haveStep:false,//是否有跟进
                setlogs:false,
                editlogs:false,
                editLogId:'', //跟进id
                isEmpty:false,//跟进
                isEditEmpty:false,//跟进编辑
                reason:'', //跟进内容
                refuseShow:false,
                isRefuse:true,//待确认状态 拒绝
                refuseReason:'',//拒绝内容
                eidtMessage:'',//跟进编辑内容
                tabType:'',//状态来源
                isComplete:false, // 处理中状态 完成工单开关
                isShow:false,//完成开关下显示
                isOpen:true, //是否公开
                description:'',//提交结果说明
                showComments: false,
                userName: "",//当前登录人姓名
                woId: this.$route.query.orderId,//工单ID
                toId:'',//被回复的留言id
                toName:'',//被回复的留言者姓名
                sendPeople:false,//指派人
                showExecutePeople:false,
                workType:'', //工单类型
                executePeople:'',//转交人name
                executor:'', //转交人id
                isBack:true,
                previewImg:'',
                previewVideo:'',
				tip:'文件大小不能超过10MB',
				videoLength:0,
				picLength:0,
				videoSrc:'',//
                detailStar:0,//详情评星
                returnCount:0,//拒绝次数
				ShowCopyList:false,
                screenHeight:document.body.clientHeight,
                unFixed:false,//按钮不定位
                unpassReason:false,//是否有不通过说明
                unpassDesc:'',//不通过说明
                unpassTime:'',//不通过时间
                noBottom:false,//底部间距
				isPush:false,
				canSee:true,
                oldTextVal:'',//输入框内容
                isFirst:true,//是否第一次
				canSeeNote:'',
            }
        },
        created () {
            if(this.$route.query.share && this.$route.query.share=='WX'){
                this.isShare = true;
            }
            this.orderId = this.$route.query.orderId;
            this.tabType = this.$route.query.tabType;
            this.userId = window.localStorage.getItem('userId');
            this.userName = window.localStorage.getItem('userName');
            if(this.$route.query.showStaffId && this.$route.query.showStaffName){
                this.executor = this.$route.query.showStaffId;
                this.executePeople = this.$route.query.showStaffName;
                this.sendOthers();
            }
//            if(this.$route.query.activeTabIndex){
//                this.activeTabIndex = this.$route.query.activeTabIndex;
//            }
            console.log(this.executor);
            console.log(this.executePeople);
        },
        mounted(){
            this.initDetails();
            this.getDetail();
            var self = this;
            window.onresize = () => {
                return (() => {
                    window.screenHeight = document.body.clientHeight;
                    self.screenHeight = window.screenHeight
                })()
            }
        },
		beforeRouteEnter(to, from, next){
			next(vm => {
				if(!from.name){
					vm.isPush = true;
				}else{
					vm.isPush = false;
				}
			})
		},
        watch:{
			oldfileIds: {
		　　　　handler(newValue, oldValue) {
		　　　　　　for (let i = 0; i < newValue.length; i++) {
		　　　　　　　　if (oldValue[i] != newValue[i]) {
		　　　　　　　　　　console.log(newValue)
		　　　　　　　　}
		　　　　　　	}
		　　　　	},
	　　　　		deep: true
			},
            active:function () {
                if(this.active == 0){
                    this.submit = true;
                    if(this.workDetails.statusName == '待验收'){
                        this.noBottom = true;
                    }
                }else if(this.active == 1){
					this.submit = false
                    this.editwoLogs();
                    this.haveStep = false;
                    this.noBottom = false;
                }
                console.log(this.submit);
            },
            screenHeight (curVal,oldVal) {
                if(curVal < oldVal){
                    this.unFixed = true;
                    //$("#submitBtn").css("position","static");
                }else{
                    this.unFixed = false;
                    //$("#submitBtn").css("position","fixed");
                }
            },
            description(){
                var self = this;
                if(this.description.length == 500){
//                    var data = this.description.split('');
//                    let oldDate = this.description;
//                    let lastDate = data[this.description.length-1];
//                    let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
//                    let newDate = oldDate.substr(0,oldDate.length-1)+''+lastDate.replace(pattern,'.');
//                    console.log(newDate);
//                    this.description = newDate;
//                    return false;
                    if(self.isFirst){
                        self.oldTextVal = self.description;
                        self.isFirst = false;
                    }else{
                        self.description = self.oldTextVal;
                    }

                }

            }
        },
        computed:{
            inputNum(){//输入字数
                let num = 0;
                num = this.description.split('').length;
                return num;
            },
			oldfileLength(){
				if(this.oldfileIds){
					return this.oldfileIds.length;
				}else{
					return 0;
				}
			}
        },
        filters:{
            noHour(val){
				if(!val){
					return ''
				}
                var time = val.split(' ')[0];
                return time;
            },
            noSecond(val){
				if(!val){
					return ''
				}
                var val = val.replace(/-/g,'.');
                var year = val.split(' ')[0];
                var hour = val.split(' ')[1].substr(0,5);
                return year+' '+hour;
            },
            formatCreateTime(data){
				if(!data){
					return ''
				}
                return parseTime(data,"{m}月{d}日 {h}:{i}");
            },
            /**
             * 格式化时间戳
             */
            getdate(dateTime) {
				if(!dateTime){
					return ''
				}
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
            tips(){
                Toast('文件大小不能超过10MB');
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
//                this.$router.push({
//                    query:{
//                        activeTabIndex : this.activeTabIndex
//                    },
//                    path:'/myexecute'
//                })
            },
            //编辑跟进
            editwoLogs(){
                let self = this;
                var data = {
                    id:this.orderId,
                    userId:this.userId,
                }
                self.axios({
                    url:'/api/v1.0/seewologs',
                    method:'post',
                    data:data
                }).then(function (res) {
                    self.initDetails();
                    self.getDetail();
                })
            },
            initDetails(){
                let self = this;
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
						console.log(res);
						if(parseInt(self.userId) != parseInt(res.data.data.executor)){
							self.canSee = false;
						}
						self.title = res.data.data.statusName;
						res.data.data.beginTimes = res.data.data.beginTime.split(' ')[0].replace(/-/g,'.');
						res.data.data.endTimes = res.data.data.endTime.split(' ')[0].replace(/-/g,'.');
						//self.$nextTick(function () {
						self.workDetails = res.data.data;
						self.haveStep = res.data.data.isRemind;
						if(self.workDetails.statusName == '处理中' || self.workDetails.statusName == '已延迟'){
						    self.sendPeople = true;
							self.workDetails.answerFiles.forEach((item)=>{
							    self.oldfileIds.push(item.id);
							    if(item.type == 1){
							        self.workDetails.answerFiles.type = 'pic'
							        self.picLength += 1;
							    }else if(item.type == 2){
							        self.workDetails.answerFiles.type = 'video'
							        self.videoLength += 1;
							    }
							})
							self.oldfileImg = self.workDetails.answerFiles;
						}
						self.workType = self.workDetails.woType;
						if(self.workDetails.submitTime != null && self.workDetails.submitTime != ''){
						    self.workDetails.useTimes = self.getRemainderTime(self.workDetails.confirmTime,self.workDetails.submitTime);
						}
						if(self.workDetails.logs){
						    self.workDetails.logs.forEach((item)=>{
						        if(item.userId == self.userId){
						            item.isMylog = true
						        }else{
						            item.isMylog = false
						        }
						    })
						}
						self.detailStar = parseInt(res.data.data.starLevel);
						self.returnCount = parseInt(res.data.data.returnCount);
						//剩余拒绝次数
						self.refuseNum = 2 - self.returnCount
						if(self.refuseNum<0){
						    self.refuseNum = 0
						}
						//不通过原因
						if(self.workDetails.isReturn == 1){
						    self.unpassReason = true;
						    self.unpassDesc = self.workDetails.unpassDesc;
						}
						self.unpassTime = self.workDetails.refuseTime;
						//设置底部距离
						if(self.workDetails.statusName == '已完成'){
						    self.noBottom = true;
						}
						if(self.workDetails.statusName == '待验收' && self.active == 0){
						    self.noBottom = true;
						}
					}else{
						self.canSee = false;
						self.canSeeNote = res.data.message;
						Toast(res.data.message)
					}
                })
            },

            /**
             * 待确认状态
             */
            //接收
            accept(){
                let self = this;
                let data = {
                    id:self.orderId,
                    executor:self.userId,
//                    executorName:self.userName
                }
                console.log(data);
                Dialog.confirm({
                    title: '确认通过',
//                    message: '弹窗内容'
                }).then(() => {
                    self.axios({
                        url:'/api/v1.0/woconfirm',
                        method:'post',
                        data:data
                    }).then(function (res) {
                        console.log(res);
                        Toast('接收通过');
                        // self.$router.go(-1);
						if(self.isPush){
							self.$route.push({
								path:'/',
								query:{
									userId:localStorage.getItem('userId'),
									menuOpen:'0'
								}
							})
						}else{
							self.$router.go(-1);
						}
                    })
                }).catch(() => {
                    // on cancel
                });

            },
            //写跟进
            setlog(){
                this.setlogs = true;
            },
            //编辑跟进
            editLogs(id,words){
                this.editlogs = true;
                this.isEditEmpty = false;
                this.editLogId = id;
                this.eidtMessage = words;
            },
            //提交跟进
            writeLog(action, done) {
                let self = this;
                if (action === 'confirm') {
                    //setTimeout(done, 1000);
                    if(self.reason==''){
                        self.isEmpty = true;
                        done(false);

                    }else{
                        let data = {
                            id:self.orderId,
                            userId:self.userId,
                            message:self.reason,
                        };
                        this.axios({
                            url:'api/v1.0/writelog',
                            method:'post',
                            data:data,
                        }).then(function(res){
                            if(res.data.code == 200){
                                Toast('添加成功');
                                self.reason = '';
                                self.editwoLogs();
                                self.initDetails();
                                done();
                            }
                        })

                    }
                } else {
                    self.reason = '';
                    self.isEmpty = false;
                    done();
                }
            },
            //编辑跟进
            writeLogEdit(action, done) {
                let self = this;
                if (action === 'confirm') {
                    //setTimeout(done, 1000);
                    if(self.eidtMessage==''){
                        self.isEditEmpty = true;
                        done(false);

                    }else{
                        let data = {
                            userId:self.userId,
                            logId:self.editLogId,
                            message:self.eidtMessage
                        }
                        console.log(data);
                        self.axios({
                            url:'api/v1.0/editlog',
                            method:'post',
                            data:data
                        }).then(function (res) {
                            if(res.data.code == 200){
                                Toast('编辑成功');
                                self.eidtMessage = '';
                                self.initDetails();
                                done();
                            }
                        })

                    }
                } else {
                    done();
                }
            },
            //拒绝
            unaccept(){
                if(this.returnCount >= 2){
                    Toast('拒绝次数超过上限');
                    this.refuseShow = false;
                }else{
                    this.refuseShow = true;
                }
            },
            refuseModal(action, done) {
                let self = this;
                if (action === 'confirm') {
                    //setTimeout(done, 1000);
                    if(self.refuseReason==''){
                        self.isRefuse = true;
                        done(false);

                    }else{
                        let data = {
                            id:self.orderId,
                            executor:self.userId,
//                            executorName:self.userName,
                            returnDesc:self.refuseReason
                        };
                        this.axios({
                            url:'api/v1.0/worefuse',
                            method:'post',
                            data:data,
                        }).then(function(res){
                            if(res.data.code == 200){
                                let refuseText = '拒收成功，今日还可拒收'+(self.refuseNum - 1)+'次'
                                Toast(refuseText);
                                // self.$router.go(-1);
								if(self.isPush){
									self.$route.push({
										path:'/',
										query:{
											userId:localStorage.getItem('userId'),
											menuOpen:'0'
										}
									})
								}else{
									self.$router.go(-1);
								}
                                done();
                            }
                        })

                    }
                } else {
                    done();
                }
            },
            /**
             * 处理中状态
             */
            //完成开关
            changeComplete(){
                if(this.isComplete){
                    this.isShow = true
                }else{
                    this.isShow = false
                }
            },
            //提交验收
            subAcceptance(){
                let self = this;
                let pic = [];//数组格式 file文件form表单提交 图片
                // let pdf = [];//数组格式 file文件form表单提交 pdf
                let video = [];//数组格式 file文件form表单提交 shipin
                let isGroom = '';
                console.log(self.fileImg);
				let forms = new FormData();
				if(self.isOpen){
				    isGroom = 1
                }else{
				    isGroom = 0
                }
                if(!self.description){
				    Toast('结果说明不能为空');
				    return false;
                }
                console.log(isGroom);
				self.fileImg.forEach(item=>{
					if(item.type=='pic'){
						console.log(item.file)
						forms.append('pic[]',item.file);
					}
					if(item.type=='video'){
						forms.append('video',item.file);
					}
				})
				forms.append('fileIds',JSON.stringify(self.oldfileIds));
				forms.append('id',self.orderId)
				forms.append('executor',self.userId)
				forms.append('finishDesc',self.description)
				forms.append('groom',isGroom);

//                 let data = {
//                     id : self.orderId,
//                     executor: self.userId,
//                     finishDesc:self.description,
//                     pic:JSON.stringify(pic),
//                     // pdf:JSON.stringify(pdf),
//                     video:JSON.stringify(video),
//                     groom: self.isOpen,
//                 };
                console.log(JSON.stringify(forms));
                self.axios({
                    url:'api/v1.0/wosubmit',
                    data:forms,
                    method:'post',
					headers: {
						'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
					},
                }).then(function(res){
                    console.log(res);
                    if(res.data.code == 200){
                        Toast('提交成功');
                        // self.$router.go(-1);
						if(self.isPush){
							self.$route.push({
								path:'/',
								query:{
									userId:localStorage.getItem('userId'),
									menuOpen:'0'
								}
							})
						}else{
							self.$router.go(-1);
						}
                    }
                })

            },
            //选择文件类型
            pickFiletype() {
                this.showFiletype = !this.showFiletype;
            },
            confirmFiletype(type) {
            	this.showFiletype = !this.showFiletype;
            	if(window.htoa){//安卓
            		if(type=='1'){
            			console.log('======选择录像========')
            			if(localStorage.getItem('cancelUpload')=='1'){
            				document.getElementById("video").value = '';
            				localStorage.setItem('cancelUpload','0');
            			}
            			window.htoa.setImageOrVideo("2");
            		}else{
            			console.log('======选择拍照========')
            			if(localStorage.getItem('cancelUpload')=='1'){
            				document.getElementById("video").value = '';
            				localStorage.setItem('cancelUpload','0');
            			}
            			window.htoa.setImageOrVideo("1");
            		}
            	}
            },
            cancelFiletype() {
                this.showFiletype = !this.showFiletype;
            },
			confirmFiletype1(type){
				if(type==0){
					Toast('图片最多上传9张');
					this.showFiletype = false;
				}
				if(type==1){
					Toast('视频最多上传一个');
					this.showFiletype = false;
				}
			},
            onReadPic(file){
            	console.log(file)
                //添加图片
            	let item = file;
            	item.type="pic";
            	this.picLength++;
            	this.fileImg.push(item);
            },
            onReadVideo(file) {
            	console.log(file)
                //短视频
            	let item = file;
            	item.type="video";
            	this.videoLength=1;
            	this.fileImg.push(item);
            },
            onReadPic1(e) {
            	let self = this;
            	let item = {};
            	var files = e.target.files[0]
            	let content = '';
            	let canvas = document.createElement("canvas");
            	if (!e || !window.FileReader) return  // 看支持不支持FileReader
            	let reader = new FileReader()
            	reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
            	reader.onloadend = function () {
            	  content = this.result
            	  //添加图片
            		let result = this.result;
            		let img = new Image();
            		img.src = result;
            		var str = navigator.userAgent.toLowerCase();
            		var ver =str.match(/cpu iphone os (.*?) like mac os/);
            		let useCanvas = true;
            		if(ver){
            			let type = parseInt(ver[1].replace(/_/g,".").split('.')[0]);
            			if(type<=10){
            				useCanvas = false;
            			}
            		}else{
            			useCanvas = false;
            		}

            		img.onload = function () {
            			let Orientation;
            			let ctx = canvas.getContext("2d");
            			canvas.width = img.width;
            			canvas.height = img.height;
            			if(useCanvas){
            				self.EXIF.getData(img, function(){
            					console.log(self.EXIF.getAllTags(this))
            					Orientation = self.EXIF.getTag(this, 'Orientation')
            					// alert(self.EXIF.getTag(this, 'Orientation'))
            					 //修复ios上传图片的时候 被旋转的问题
            					  if(Orientation != "" && Orientation != 1 && Orientation){
            						switch(Orientation){
            						  case 6://需要顺时针（向左）90度旋转
            						  console.log(666)
            								canvas.width = img.height;
            								canvas.height = img.width;
            								ctx.rotate(Math.PI / 2);
            								ctx.drawImage(img, 0, -img.height, img.width, img.height);
            								break;
            						  case 8://需要逆时针（向右）90度旋转
            						  console.log(888)

            								canvas.width = img.height;
            								canvas.height = img.width;
            								ctx.rotate(3 * Math.PI / 2);
            								ctx.drawImage(img, -img.width, 0, img.width, img.height);
            								break;
            						  case 3://需要180度旋转
            						  console.log(333)

            								ctx.rotate(Math.PI);
            								ctx.drawImage(img, -img.width, -img.height, img.width, img.height);
            								break;
            						}
            						var dataurl=canvas.toDataURL('image/*',0.8);//canvase 转为base64
            						var blob = self.dataURLtoFile(dataurl,files.name);//base64转为blog
            						console.log(blob)
            						item = {
            							file:blob,
            							content:dataurl
            						}
            						item.type="pic";
            						self.picLength++;
            						console.log(item.file.size)

            					}else{
            				  // ctx.drawImage(img, 0, 0, img.width, img.height);
            						  item = {
            							  file:files,
            							  content:content
            						  }
            						  item.type="pic";
            						  self.picLength++;
            						  console.log(item.file.size)

            					}
            				})
            			}else{
            				  // ctx.drawImage(img, 0, 0, img.width, img.height);
            				  item = {
            					  file:files,
            					  content:content
            				  }
            				  item.type="pic";
            				  self.picLength++;
            				  console.log(item.file.size)

            			}
						let type = '';
						if(ver){
							type = parseInt(ver[1].replace(/_/g,".").split('.')[0]);
						}
            			if(ver && type<=10){
            				if(item.file.size/1024/1024 >=5){
            					Toast('单张图片最大支持5M，请重新选择')
            					self.picLength--;
            					return false;
            				}else{
            					self.fileImg.push(item);
            				}
            			}else if(item.file.size/1024/1024 >=5){
            				fileResizetoFile(item.file,0.3,function(res){//第二个参数范围是 0~1 用于调整图片质量
            						//newfile.push(res);//这个newfile是我其他代码里定义的一个数组 把压缩的图片Blob一个个放进去\
            						item.file = res;
            						console.log(res)
            						if(item.file.size/1024/1024 >=5){
            							Toast('单张图片最大支持5M，请重新选择')
            							self.picLength--;
            							return false;
            						}else{
            							self.fileImg.push(item);
            						}
            				})

            			}else{
							self.fileImg.push(item);
						}


            		}
            	}
            },
            dataURLtoFile(dataurl, filename) {//将base64转换为文件
            	var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            	bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            	while(n--){
            		u8arr[n] = bstr.charCodeAt(n);
            	}
            	return new File([u8arr], filename, {type:mime});
            },
            onReadVideo1(event) {
				setTimeout(100)
				let self = this;
				let f = event.target.files[0];
				console.log(f)
				//短视频
				let item = {
					file:f
				}
				//let item = file;
				item.type="video";
				this.videoLength=1;
				console.log(item)
				if(item.file.size/1024/1024 >=15){
					Toast('单个视频最大支持15M，请重新选择')
					this.videoLength=0;
					return false;
				}else{
					self.fileImg.push(item);
				}

// 				let video = document.getElementById("video");
// 				var canvas = document.createElement("canvas");
// 				// canvas.width = video.videoWidth * scale;
// 				canvas.width =200;
// 				// canvas.height = video.videoHeight * scale;
// 				canvas.height = 200;
// 				canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
// 				console.log('canvas.toDataURL("image/png")');
// 				console.log(canvas.toDataURL("image/png"));
// 				item.content = f;
// 				var reader = new FileReader();
// 		        reader.onload = function () {
// 		            item.content = this.result;
// 					item.content2 = canvas.toDataURL("image/png");
// 					console.log(item)
// 					self.fileImg.push(item);
// 		        };
// 		        reader.readAsDataURL(f);

			},
            //删除附件
            delPicture(index){
				if(this.fileImg[index].type=='pic'){
				    this.picLength--;
				    this.fileImg.splice(index,1);
				}else if(this.fileImg[index].type=='video'){
				    this.videoLength=0;
				    this.fileImg.splice(index,1);
				}
            },
			//删除附件
			delOldPicture(id,index){
			    var self = this;
			    console.log(self.oldfileImg);
				if(self.oldfileImg[index].type==1){
					self.picLength--;
				}else{
					self.videoLength=0;
				}
			    self.oldfileImg.splice(index,1);
			    self.oldfileIds.splice(self.oldfileIds.indexOf(id),1);
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
            getDetail(){
                let self = this;
                this.showComments = false;
                let data = {
                    id:self.orderId,
                    userId:self.userId
                }
                this.axios({
                    url:'/api/v1.0/wodetail',
                    method:'post',
                    data:data
                }).then(function(res){
                    // console.log(res);
                    if(res.data.code==200){
                        self.starLevel = parseInt(res.data.data.starLevel);
                        self.title = res.data.data.title;
                        // self.description = res.data.data.description;
                        self.questionFiles = res.data.data.questionFiles;
                        self.answerFiles = res.data.data.answerFiles;
                        self.finishDesc = res.data.data.finishDesc;
                        if(res.data.data.comments.length>0){
                            self.workDetails.comments = res.data.data.comments;
                        }
                        self.supplyDesc = res.data.data.supplyDesc;

                    }
                })
            },
            //选择执行人
            selectPeople() {
                let self = this;
                self.$router.push({
                    query:{
                        userId:self.userId,
                        orderId:self.orderId
                    },
                    path:'/sendpeople'
                })
                //this.showExecutePeople = !this.showExecutePeople;
            },
            backFromsel(){
                this.showExecutePeople = false;
            },
            confirmExecutePeople(item) {
                this.executePeople = item.name;
                this.executor = item.id;
                this.sendOthers();
            },
            share(){
                let url = apiConfig.baseURL2+'/h5/mycopyOrder?orderId='+this.woId+'&share=WX';
                if(window.htoa){//安卓
                    window.htoa.wxShare("{'title':'"+this.workDetails.title+"','content':'"+this.workDetails.description+"','url':'"+url+"'}");
                }else if(window.webkit.messageHandlers){
                    window.webkit.messageHandlers.Workorder.postMessage({FunctionName:'Share',title:this.workDetails.title,content:this.workDetails.description,url:url});
                }
            },

            seeImg(index,type){
                // this.previewImg = url;
            	let data = [];
            	let imgList = [];
            	if(type=='q'){
            		//问题
            		imgList = this.workDetails.questionFiles;
            	}else if(type=='a'){
					//答复
            		imgList = this.workDetails.answerFiles;
            	}else if(type=='file'){
					//答复
            		imgList = this.fileImg;
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
            		}else if(item.type=='pic'){
            			data.push(item.content)
            			length++;
            		}
            	})
            	ImagePreview(data,cur)
            },
			seeImg2(index,type){
			    // this.previewImg = url;
				let data = [];
				let imgList = [];
				this.fileImg.forEach(item=>{
					if(item.type=='pic'){
						let it = item.content;
						imgList.push(it);
					}
				})
				this.oldfileImg.forEach(item=>{
					if(item.type=='1'){
						let it = item.url;
						imgList.push(it);
					}
				})

				console.log(imgList)
				if(type=='old'){
					//问题
					data = this.oldfileImg;
				}else if(type=='upload'){
					//上传
					data = this.fileImg;
				}
				let length = 0;
				let cur = 0;
				imgList.forEach((item,index2)=>{
					console.log(item)
					console.log(type)
					if(type=='old'){
						if(item==data[index].url){
							cur = length;
						}
						length++;
					}else if(type=='upload'){
						if(item==data[index].content){
							cur = length;
						}
						length++;
					}
				})
				ImagePreview(imgList,cur)
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
            //转交工单
            sendOthers(){
                let self = this;
                let data = {
                    id:self.orderId,
                    userId:self.userId,
                    toId:self.executor,
                    toName:self.executePeople,
                }
                self.axios({
                    url:'api/v1.0/wopassto',
                    method:'post',
                    data:data
                }).then(function (res) {
                    Toast('转交成功')
//                     self.$router.push({
//                         path:'/myexecute'
//                     })
					if(self.isPush){
						self.$route.push({
							path:'/',
							query:{
								userId:localStorage.getItem('userId'),
								menuOpen:'0'
							}
						})
					}else{
						self.$router.go(-1);
					}
                })
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
<style>
    /*.van-popup--right{*/
        /*width: 100%;*/
        /*height: 100%;*/
    /*}*/
</style>
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
        border:1px solid #ccc;
    }
    .operatePeople {
        /*border-top: 10px solid #f2f2f2;*/
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
        padding-bottom: 1.5rem;
        /*background: #fff;*/
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
        line-height:0.88rem;
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
        min-height: 80px;
        width: 100%;
        border: none;
        box-sizing: border-box;
    }

    /****上传****/
    .copyPeople {
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
    .workDescribe-inner{
        height: 2.48rem;
        padding: 0 0.12rem;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 0.1rem;
        /* width: calc(100% - 0.6rem); */

    }
    .workDescribe-inner textarea {
        display: inline-block;
        outline: none;
        border: none;
        width: 100%;
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        height: 2rem;
    }
    .workDescribe-inner span {
        position: absolute;
        right: 0.12rem;
        bottom: 0.08rem;
    }
    .gray {
        color: #999CAA;
    }
    .upload-list {
        width: 100%;
        justify-content:flex-start;
        flex-wrap: wrap;
    }
    .pic_cell.van-cell{
        padding: 10px 5vw 0 5vw;
    }
    .upload-list-item {
        position: relative;
        min-width: 25vw;
        max-width: 25vw;
        min-height: 25vw;
        max-height: 25vw;
        border: 1px solid #ccc;
        border-radius: 0.1rem;
        flex: 1;
        margin-bottom: 10px;
    }
    .upload-list-item:nth-child(3n+1){
        margin-right: 6vw;
    }
    .upload-list-item:nth-child(3n){
        margin-left: 6vw;
    }
    .upload-list-item > img {
        width: 25vw;
        height: 25vw;
    }
    .upload-list-item div {
        display: block;
        width: 0.8rem;
        height: 0.8rem;
        border: 1px dashed #333;
        margin: 0 auto;
        margin-top: 50%;
        transform: translateY(-50%);
    }
    .delPic{
        position: absolute;
        top: 5px;
        right: 5px;
        width: 16px;
        height: 16px;
        background: url(../../assets/images/delete_copy.png) 0 0 no-repeat;
        background-size: 100% 100%;
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
    .largeBtn {
        width: 4.8rem;
        margin: 0 auto;
    }
    .add{
        background: url(../../assets/images/addImg@2x.png) 0 0 no-repeat;
        background-size: 100% 100%;
        width: 17px;
        height: 17px;
        display: block;
        float: right;
    }
    .fileType{
        bottom: 0;
        width: 100%;
        background: #fff;
        margin: 0 auto;
        height: 170px;
    }
    .fileType li{
        line-height: 45px;
        text-align: center;
        font-size: 14px;
        color: #333333;
		position: relative;

    }
    .fileType li:hover{
        background: #EEF1F6;

    }
    .fileType li i{
        display: block;
        width: 85%;
        height: 1px;
        margin: 0 auto;
        background: #EEF1F6;
    }
    .btn-back{
        width: 100%;
        padding: 0 0.35rem;
        box-sizing: border-box;
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
   .van-popup--right{
       width:100%;
       height:100%;
    }
	.fileType input{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		opacity: 0;
		width: 100%;
	}
	.list_li_right p.work span{
		color: #608BF7;
	}
    .unFixed{
        position: static;
    }

    .refuseTip img{
        margin-left: 0.1rem;
        margin-right: 0.1rem;
    }
    .refuse_detail{
        font-size: 0.24rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153,156,170,1);
        text-align: left;
        padding: 0 0.5rem 0.2rem;
    }
    .refuseStyle{
        color: #373D46;
        height: 18px;
        line-height: 18px;
        padding: 6px 0 0 0;
    }

	.flex.input_cell.van-cell:after{
		border: none;
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
