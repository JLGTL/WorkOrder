<template>
    <div>
        <Head v-if="!isShare" :title="workDetails.statusName" @back="back" :isBack="haveBack" :hasShare="true" :hasBorder="true" :hasMoreTime="hasTimeBtn" @share="share" @selectTime="selectTime"/>
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
                        <span class="sign_normal" v-if="workDetails.statusName == '待派发'">{{workDetails.statusName}}</span>
                        <span class="sign_normal" v-if="workDetails.statusName == '待确认'">{{workDetails.statusName}}</span>
                        <span class="sign_normal" v-if="workDetails.statusName == '待验收'">{{workDetails.statusName}}</span>
                        <span class="sign_important" v-if="workDetails.statusName == '处理中'">{{workDetails.statusName}}</span>
                        <span class="sign_delay" v-if="workDetails.statusName == '已延迟'">{{workDetails.statusName}}</span>
                        <span class="sign_invalid" v-if="workDetails.statusName == '已失效'">{{workDetails.statusName}}</span>
                    </p>
                    <p class="noborder order-status completedTip" v-if="workDetails.statusName == '已完成'"><img src="../../assets/images/completedimg@2x.png" alt=""></p>
                </div>
                <p class="single-order-period flex">
                    <img src="../../assets/images/clock_icon.png" class="clock_icon"/>
                    <span>任务周期&ensp;:&ensp;</span>
					<span v-if="workDetails.beginTime && workDetails.endTime">{{workDetails.beginTime | noSecond}}-{{workDetails.endTime | noSecond}}</span>
					<span v-if="!workDetails.beginTime || !workDetails.endTime">暂无任务周期</span>
                </p>
                <p class="single-order-create flex">
                  <span class="flex">
                      <img src="../../assets/images/executepeople_icon.png" class="executePeople_icon"/>
                      <span>创建人&ensp;:&ensp;</span><i v-if="workDetails.creatorInfo && workDetails.creatorInfo.name">&emsp;{{workDetails.creatorInfo.name}}&emsp;{{workDetails.creatorInfo.mobile}}</i></span>
                </p>
                <p class="single-order-create flex" v-if="workDetails.statusName == '已完成' && workDetails.useTimes ">
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
                                    <span v-for="(file,index2) in workDetails.questionFiles" v-if="file.type == 1"><img v-lazy="file.url" @click="seeImg(index2,'q')"/></span>
                                    <span v-for="(file,index2) in workDetails.questionFiles" v-if="file.type == 2"><img src="../../assets/images/面授.png" @click="seeVideo(file.url)"/></span>
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
                            <div class="work" v-if="workDetails.statusName == '处理中'" style="display: none">
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
                                            <textarea placeholder="请填写任务描述" v-model='description' maxlength='500'></textarea>
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
                                        <span v-for="(file,index) in workDetails.answerFiles" v-if="file.type == 1"><img  v-lazy="file.url" @click="seeImg(index,'a')"/></span>
										<span v-for="(file,index) in workDetails.answerFiles" v-if="file.type == 2"><img src="../../assets/images/面授.png" @click="seeVideo(file.url)"/></span>
                                    </p>
                                </van-cell>
                            </div>
                            <div class="leaveWord" v-if="unpassReason && workDetails.statusName == '处理中'">
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
                                <h2 class="leaveWord-title flex">
                                    <span>留言</span>
                                    <span class="leaveword-num"><i>{{workDetails.comments.length}}</i>条动态<img src="../../assets/images/leaveWord.png"  @click="setComments"/></span>
                                </h2>
                                <div class="nodata nodata-little" v-if="workDetails.comments.length==0">
                                    <img src="../../assets/images/group8.png">
                                    <p class="tips">暂时没有留言哦~</p>
                                </div>
                                <ul class="leaveWord-list">
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
                            <!--<div class="leaveWord">-->
                                <!--<h2 class="leaveWord-title flex">-->
                                    <!--<span>留言</span>-->
                                    <!--<span class="leaveword-num"><i>{{workDetails.comments.length}}</i>条动态<img src="../../assets/images/leaveWord.png"/></span>-->
                                <!--</h2>-->
                                <!--<ul class="leaveWord-list">-->
                                    <!--<li class="leaveWord-list_li flex" v-for="item in workDetails.comments" v-if="workDetails.comments">-->
                                        <!--<div class="list_li_left">-->
                                            <!--<img :src="item.avatar" />-->
                                        <!--</div>-->
                                        <!--<div class="list_li_right flex">-->
                                            <!--<p><span class="name">{{item.userName}}</span><span class="date">{{item.createTime | getdate}}</span></p>-->
                                            <!--<p class="work">{{item.woId}}</p>-->
                                        <!--</div>-->
                                    <!--</li>-->
                                <!--</ul>-->
                            <!--</div>-->
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
                                    <p v-if="item.createTime">{{item.createTime | getdate}}<span v-if="item.type == 2 && item.isMylog && workDetails.status!='1'&& workDetails.status!='5'" class="editLogs" @click="editLogs(item.id,item.description)">编辑</span></p>
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
            <div class="submitBtn" v-if="!submit && workDetails.status!='1' && workDetails.status!='5'">
                <van-button round type="infoRound" @click="setlog()" size="large">写跟进</van-button>
            </div>
            <div v-if="submit">
                <div v-if="workDetails.statusName == '待验收'">
                    <div class="btnGroup">
                        <van-button round type="infoRound" @click="accept()" class="">通过</van-button>
                        <van-button round type="infoRound" @click="unaccept()" class="">不通过</van-button>
                    </div>
                </div>
                <div style="display: none">
                    <div class="submitBtn">
                        <van-button round type="infoRound" @click="subAcceptance" size="large">提交验收</van-button>
                    </div>
                </div>
            </div>
        </main>
        <!--时间弹窗-->
        <van-dialog
            v-model="setTimes"
            show-cancel-button
            confirmButtonText='确定'
            :before-close="writeTimes"
        >
            <div class="dialog-title">任务周期</div>
            <div class="time flex">
                <!--<div @click="show1 = !show1">-->
                <div>
                    <p class="time-label">开始时间</p>
                    <p class="time-date" v-if="start">{{startDate}}</p>
                    <p class="time-time" v-if="start">{{startTime}}</p>
                </div>
                <p></p>
                <div @click="show2 = !show2">
                    <p class="time-label">截止时间</p>
                    <p class="time-date time-edit" v-if="end">{{endDate}}</p>
                    <p class="time-time time-edit" v-if="end">{{endTime}}</p>
                </div>
            </div>
        </van-dialog>
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
        <!--拒绝弹窗-->
        <van-dialog
            v-model="refuseShow"
            show-cancel-button
            confirmButtonText='确定'
            :before-close="refuseModal"
        >
            <div class="dialog-title">不通过说明</div>
            <div :class="isRefuse?'dialog-textarea isRefuse':'dialog-textarea'">
                <textarea placeholder="不通过内容不能为空" v-model="refuseReason" @input='isRefuse=false'></textarea>
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
        <!--评星弹框-->
        <van-dialog
            v-model="setStarShow"
            show-cancel-button
            confirmButtonText='确定'
            :before-close="setStarModal"
        >
            <div class="dialog-title">请评价后确认通过验收</div>
            <van-rate v-model="starVal" />
            <div>{{starState}}</div>
        </van-dialog>
        <!--选择附件类型-->
        <van-popup v-model="showFiletype" position="bottom" :overlay="true" >
            <ul class="fileType">
                <li @click="confirmFiletype('0')">
                    <van-uploader :after-read="onReadPic" :oversize='tips' accept="image/*" :max-size='fileSize' >
                        图片
                    </van-uploader>
                    <i></i>
                </li>
                <!-- <li @click="confirmFiletype('1')">
                    <van-uploader :after-read="onReadVideo" :oversize='tips' accept="video/*" :max-size='fileSize' >
                        短视频
                    </van-uploader>
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
        <div class="imgPreview" v-show="previewImg" @click="closePreview()"><img :src="previewImg" alt=""></div>
        <div class="imgPreview videoPreview" v-show="previewVideo">
            <Head title="视频播放" @back="closePreview2()"/>
            <video :src="previewVideo" controls="controls"></video>
        </div>
        <!--日期选择-->
        <van-popup v-model="show1" position="bottom" :close-on-click-overlay="false">
            <van-datetime-picker
                v-model="currentDate"
                type="datetime"
                :min-date="currentDate"
                title="选择开始时间"
                @confirm="sureStart"
                @cancel="cancelStart"
                :formatter="formatter"
            />
        </van-popup>

        <!--日期选择END-->
        <!--日期选择-->
        <van-popup v-model="show2" position="bottom" :close-on-click-overlay="false">
            <van-datetime-picker
                v-model="currentDate2"
                type="datetime"
                :min-date="minDate"
                title="选择截止时间"
                @confirm="sureEnd"
                @cancel="cancelEnd"
                :formatter="formatter"
            />
        </van-popup>
        <!--日期选择END-->
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
        name: 'createDetails',
        components: {Head,comments},
        data () {
            return {
                title: '',
                isShare:false,
                fileSize:1048576,//文件大小限制
                showFiletype:false,
                fileColums:['图片','短视频','PDF'],
                fileImg:[],
                pic:[],
                pdf:[],
                video:[],
                active: 0,
                submit: true,
                orderId : '',
                userId:'',
                workDetails:'',
                haveStep:false,//是否有跟进
                setlogs:false,
                isEmpty:false,//跟进
                reason:'', //跟进内容
                refuseShow:false,
                isRefuse:false,//待确认状态 拒绝
                refuseReason:'',//拒绝内容
                tabType:'',//状态来源
                isComplete:false, // 处理中状态 完成工单开关
                isShow:false,//完成开关下显示
                isOpen:false, //是否公开
                description:'',//提交结果说明
                showComments: false,
                userName: "",//当前登录人姓名
                woId: this.$route.query.orderId,//工单ID
                toId:'',//被回复的留言id
                toName:'',//被回复的留言者姓名
                setStarShow:false,
                starVal:0,//星值
                starState:'',//星值含义
                detailStar:0,//详情星值
                haveBack:true,
                previewImg:'',
                previewVideo:'',
                editlogs:false,
                isEditEmpty:false,//跟进编辑
                eidtMessage:'',//跟进编辑内容
                hasTimeBtn:false,//执行中、已延误状态的时间修改按钮
                setTimes:false,//时间选择按钮
                show1:false,//开始时间
                show2:false,//结束时间
                start:'',//开始时间 datetime
                end:'',//结束时间 datetime
                minDate:new Date(),//最小时间
                currentDate: new Date(), //时间选择
                currentDate2: new Date(), //时间选择2
                startDate:'',//时间选择按钮开始时间
                startTime:'',
                endDate:'',//时间选择按钮结束时间
                endTime:'',
				ShowCopyList:false,
                unpassReason:false,//是否有不通过说明
                unpassDesc:'',//不通过说明
                unpassTime:'',//不通过时间
                noBottom:false,//底部间距
				isPush:false,
				canSee:true,
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
            this.currentDate2 = new Date(new Date().getTime()+1000*60);//默认1分钟
            this.start = this.currentDate;
            this.end = this.currentDate2;
        },
        mounted(){
            this.initDetails();
            this.getDetail();
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
            active:function () {
                if(this.active == 0){
                    this.submit = true;
                    if(this.workDetails.statusName == '处理中' || this.workDetails.statusName == '已延迟' || this.workDetails.statusName == '待确认'){
                        this.noBottom = true;
                    }
                }else if(this.active == 1){
                    console.log(this.noBottom)
                    this.submit = false
                    this.editwoLogs();
                    this.haveStep = false;
                    this.noBottom = false;
                }
            },
            starVal:function (val) {
                if(val == 1){
                    this.starState = '不合格呀！'
                }else if(val == 2){
                    this.starState = '一般般'
                }else if(val == 3){
                    this.starState = '还好，再努力可能更好'
                }else if(val == 4){
                    this.starState = '完成的不错，赞！'
                }else if(val == 5){
                    this.starState = '完美'
                }
            }
        },
        computed:{
            inputNum(){//输入字数
                let num = 0;
                num = this.description.split('').length;
                return num;
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
            daySums(val){
                var days    = val / 1000 / 60 / 60 / 24;
                var daysRound   = Math.floor(days);
                var hours    = val/ 1000 / 60 / 60 - (24 * daysRound);
                var hoursRound   = Math.floor(hours);
                var minutes   = val / 1000 /60 - (24 * 60 * daysRound) - (60 * hoursRound);
                var minutesRound  = Math.floor(minutes);
                var seconds   = val / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
                if(daysRound==0)
                return daysRound+'天'+hoursRound+'时'+minutesRound+'分'+seconds+'秒'
            },
        },
        methods: {
			openCopyList(){
				this.ShowCopyList = true;
			},
            formatter(type, value) {
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
						self.canSee = true;
						self.$nextTick(function() {
						    self.title = res.data.data.statusName;
						    res.data.data.beginTimes = res.data.data.beginTime.split(' ')[0].replace(/-/g, '.');
						    res.data.data.endTimes = res.data.data.endTime.split(' ')[0].replace(/-/g, '.');
						    //self.$nextTick(function () {
						    self.workDetails = res.data.data;
						    if (self.workDetails.submitTime != null && self.workDetails.submitTime != '') {
						        self.workDetails.useTimes = self.getRemainderTime(self.workDetails.confirmTime, self.workDetails.submitTime);
						    }
						    self.detailStar = parseInt(res.data.data.starLevel);
						    self.haveStep = res.data.data.isRemind;
						    if (self.workDetails.statusName == '处理中' || self.workDetails.statusName == '已延迟') {
						        self.hasTimeBtn = true;
						    }
						    if (self.workDetails.logs) {
						        self.workDetails.logs.forEach((item) => {
						            if (item.userId == self.userId) {
						                item.isMylog = true
						            } else {
						                item.isMylog = false
						            }
						
						        })
						    }
						    //不通过说明
						    if(self.workDetails.isReturn == 1){
						        self.unpassReason = true;
						        self.unpassDesc = self.workDetails.unpassDesc;
						    }
						    self.unpassTime = self.workDetails.refuseTime;
						    //时间处理
						    let setTime = self.workDetails.beginTime;
						    let setYear = setTime.split(' ')[0].split('-');
						    let setMin = setTime.split(' ')[1].split(':');
						    self.minDate = new Date(setYear[0],setYear[1]-1,setYear[2],setMin[0],setMin[1]);
						    self.startDate = self.getDateYear(self.workDetails.beginTime);
						    self.startTime = self.getDateHour(self.workDetails.beginTime);
						    self.endDate = self.getDateYear(self.workDetails.endTime);
						    self.endTime = self.getDateHour(self.workDetails.endTime);
						    //设置底部距离
						    if((self.workDetails.statusName == '处理中' || self.workDetails.statusName == '已延迟' || self.workDetails.statusName == '待确认') && self.active == 0){
						        self.noBottom = true;
						    }
						    if(this.workDetails.statusName == '已失效' || self.workDetails.statusName == '已完成' ){
						        self.noBottom = true;
						    }
						})
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
                this.setStarShow = true;
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
            //拒绝
            unaccept(){
                this.refuseShow = true;
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
                            creator:self.userId,
//                            executorName:self.userName,
                            unpassDesc:self.refuseReason
                        };
                        this.axios({
                            url:'api/v1.0/wounpass',
                            method:'post',
                            data:data,
                        }).then(function(res){
                            if(res.data.code == 200){
                                Toast('提交成功');
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
            //评星
            setStarModal(action, done) {
                let self = this;
                if (action === 'confirm') {
                    if(self.starVal == 0){
                        Toast('请评星后再提交');
                        done();
                        return false;
                    }
                    let data = {
                        id:self.orderId,
                        creator:self.userId,
                        starLevel:self.starVal
                    };
                    this.axios({
                        url:'api/v1.0/wopass',
                        method:'post',
                        data:data,
                    }).then(function(res){
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
							done();
                        }
                    })
                } else {
                    self.starVal = 0;
                    self.starState = '';
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
                console.log(self.fileImg);
                self.fileImg.forEach(item=>{
                    if(item.type=='pic'){
                        pic.push(item.content);
                    }
// 					if(item.type=='pdf'){
// 						pdf.push(item.file);
// 					}
                    if(item.type=='video'){
                        video.push(item.file);
                    }
                })
                let data = {
                    id : self.orderId,
                    executor: self.userId,
                    finishDesc:self.description,
                    pic:JSON.stringify(pic),
                    // pdf:JSON.stringify(pdf),
                    video:JSON.stringify(video),
                    groom: self.isOpen,
                };
                console.log(data);
                self.axios({
                    url:'api/v1.0/wosubmit',
                    data:data,
                    method:'post'
                }).then(function(res){
                    console.log(res);
                    if(res.data.code == 200){
                        Toast('提交成功')
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

            },
            //选择文件类型
            pickFiletype() {
                this.showFiletype = !this.showFiletype;
            },
            confirmFiletype(type) {
            	this.showFiletype = !this.showFiletype;
            	if(window.htoa){//安卓
            		if(type=='1'){
            			window.htoa.setImageOrVideo("2");
            		}else{
            			window.htoa.setImageOrVideo("1");
            		}
            	}
            },
            cancelFiletype() {
                this.showFiletype = !this.showFiletype;
            },
            onReadPic(file) {
                console.log(file)
                //添加图片
                let item = file;
                item.type="pic";
                this.fileImg.push(item);
            },
            onReadVideo(file) {
                console.log(file)
                //短视频
                let item = file;
                item.type="video";
                this.fileImg.push(item);
            },
            onReadPdf(file) {
                console.log(file)
                //pdf
                let item = file;
                item.type="pdf";
                this.fileImg.push(item);
            },
            //删除附件
            delPicture(index){
                this.fileImg.splice(index,1);
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
                    console.log(res);
                    if(res.data.code==200){
                        self.starLevel = parseInt(res.data.data.starLevel);
                        self.title = res.data.data.title;
                        self.description = res.data.data.description;
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
            //选择时间
            selectTime(){
                this.setTimes = true;
            },
            //确认开始时间
            sureStart(date) {
                console.log("开始时间", date);
                this.show1 = !this.show1;
                // this.show2 = true;
                this.start = date;
                this.startDate = parseTime(date,"{y}年{m}月{d}日");
                this.startTime = parseTime(date,"{h}:{i}");
                if(this.start>this.end){
                    this.end = '';
                    this.endDate = '';
                    this.endTime = '';
                }
            },
            cancelStart() {
                this.show1 = false;
            },
            //确认结束时间
            sureEnd(date) {
                console.log("结束时间", date);
                this.show2 = !this.show2;
                this.end = date;
                this.endDate = parseTime(date,"{y}年{m}月{d}日");
                this.endTime = parseTime(date,"{h}:{i}:{s}");
            },
            cancelEnd() {
                this.show2 = false;
            },
            //时间显示
            getDateYear(data){
                let datayear = data.split(' ')[0].split('-');
                let year = datayear[0]+'年';
                let month = datayear[1]+'月';
                let day = datayear[2]+'日';
                return year+month+day;
            },
            getDateHour(data){
                let datamin = data.split(' ')[1].split(':');
                let hour = datamin[0]+':';
                let minute = datamin[1]+':';
                return hour+minute+'00';
            },
            //编辑时间
            writeTimes(action, done) {
                let self = this;
                if (action === 'confirm') {
                    let endTime = parseTime(self.end,'{y}-{m}-{d} {h}:{i}:{s}');//endTime jiezhi时间 datetime类型
                    let data = {
                        id:self.orderId,
                        userId:self.userId,
                        endTime:endTime
                    }
                    console.log(data);
                    self.axios({
                        url:'api/v1.0/editendtime',
                        method:'post',
                        data:data
                    }).then(function (res) {
                        if(res.data.code == 200){
                            Toast('编辑成功');
                            self.initDetails();
                            done();
                        }
                    })


                } else {
                    done();
                }
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
		line-height: 0.88rem;
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
        /* border-bottom: 1px solid #f2f2f2; */
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
        position: relative;
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
        border: 1px dashed #ccc;
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
	.list_li_right p.work span{
		color: #608BF7;
	}
    .time .time-edit{
        color: #608BF7;
    }
    /****时间选择statrt*****/
    .time {
        justify-content: space-between;
        background: #fff;
        align-items: center;
        padding: 10px 0;
    }
    .time div {
        width: 50%;
        padding: 0 0.1rem;
        text-align: left;
        font-size: 14px;
        align-self: flex-start;
    }

    .time > p {
        width: 1px;
        height: 1rem;
        background: #f2f2f2;
    }

    .time-label {
        color: #999CAA;
    }

    .time-date {
        color: #333;
    }

    /****时间选择end*****/
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
