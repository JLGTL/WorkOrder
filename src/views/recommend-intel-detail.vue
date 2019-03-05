<template>
    <div>
        <Head :title="titles" @back="back" :hasBorder="true"/>
        <div class="bg"></div>
        <main>
            <div class="quest">
                <p class="quest-title">{{title}}</p>
                <p class="quest-content">{{description}}</p>
                <p class="quest-img flex">
                    <img v-for="(item,index2) in questionFiles" :src="item.url"  @click="seeImg(index2,'q')" v-if="item.type==1"/>
                    <img v-for="(item,index2) in questionFiles" src="../assets/images/面授.png" v-if="item.type==2" @click="seeVideo(item.url)"/>
                    <!-- <img v-for="item in questionFiles" src="../assets/images/面授.png" @click="seeVideo('http://huatu-doufen.oss-cn-beijing.aliyuncs.com/wo/workordervideo1548814315975.mp4')"/> -->
                    <!-- <img v-for="item in questionFiles" src="../assets/images/面授.png" v-if="item.type==3" @click="seePdf(item.url)"/> -->
                </p>
            </div>
            <div class="response">
                <p class="response-star flex">
                    <span class="icon_star"><img src="../assets/images/icon_star@2x.png" alt=""></span>
                    <span>工作评星&ensp;:&ensp;</span>
                    <!-- <van-rate v-model="starLevel" :count="5" :size="12" disabled  disabled-color="#FFDA42"/> -->
					<span class="van-rate">
						<i v-for="it in starLevel" class="van-icon van-icon-star van-rate__item" data-index="2" style="color: rgb(255, 210, 30); font-size: 12px;"></i>
						<i v-for="it in (5-starLevel)" class="van-icon van-icon-star-o van-rate__item" data-index="2" style="color: rgb(199, 199, 199);; font-size: 12px;"></i>
					</span>
                </p>
                <p class="response-content flex">
                    <span>解决&ensp;：</span>
                    <span class="word">{{finishDesc}}</span>
                </p>
                <p class="quest-img flex">
					<img v-for="(item,index2) in answerFiles" :src="item.url"  @click="seeImg(index2,'a')" v-if="item.type==1"/>
					<img v-for="(item,index2) in answerFiles" src="../assets/images/面授.png" v-if="item.type==2" @click="seeVideo(item.url)"/>
					<!-- <img v-for="item in answerFiles" src="../assets/images/面授.png" v-if="item.type==3" @click="seePdf(item.url)"/> -->

                </p>
            </div>
            <div class="response" style="padding: 0 0 0.2rem 0;border-bottom: 0">
                <p class="response-content flex">
                    <span>补充&ensp;：</span>
                    <span class="word">{{supplyDesc}}</span>
                </p>
            </div>
        </main>
        <div class="leaveWord">
            <h2 class="leaveWord-title flex">
                <span>留言</span>
                <span class="leaveword-num"><i>{{comments.length}}</i>条动态<img src="../assets/images/leaveWord.png"  @click="setComments"/></span>
            </h2>
			<div class="nodata nodata-little" v-if="comments.length==0">
				<img src="../assets/images/group8.png">
				<p class="tips">暂时没有留言哦~</p>
			</div>
            <ul class="leaveWord-list">
                <li class="leaveWord-list_li flex" v-for="item in comments" @click="replayComment(item.userId,item.userName)">
                    <div class="list_li_left">
                        <img :src="item.avatar" v-if="item.avatar"/>
                        <img src="../assets/images/head.png" v-if="!item.avatar"/>
                    </div>
                    <div class="list_li_right flex">
                        <p>
							<span class="name">{{item.userName}}</span>
							<span class="date">{{item.createTime | formatCreateTime}}</span>
						</p>
                        <p class="work" v-if="!item.toId">{{item.content}}</p>
						<p class="work" v-if="item.toId">回复&ensp;<span>{{item.toName}}</span>&ensp;{{item.content}}</p>

                    </div>
                </li>
                <!-- <li class="leaveWord-list_li flex">
                    <div class="list_li_left">
                        <img src="../assets/images/head.png" />
                    </div>
                    <div class="list_li_right flex">
                        <p><span class="name">孙雷</span><span class="date">12月26日 8:00</span></p>
                        <p class="work">回复&ensp;<span>张总</span>&ensp;我也要参加会议</p>
                    </div>
                </li> -->
            </ul>
        </div>
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
    </div>
</template>

<script>
    import Head from "@/components/head";
	import { parseTime} from "@/utils/index";
	import comments from "@/components/comments";
	import { ImagePreview } from 'vant';
    export default {
        name: "recommend-intel-detail",
        components: {Head,comments},
        data() {
            return {
                titles:"详情",
                hasBorder:true,
                workStar:4,
                previewImg:'',
				previewVideo:'',
				starLevel:0,//工作星级
				title:'',//标题
				description:'',//描述
				questionFiles:[],//工单创建附件
				answerFiles:[],//工单解决附件
				finishDesc:'',//已解决工单 描述
				comments:[],//评论
				supplyDesc:'',//补充
				showComments: false,
				userId: this.$route.query.userId,//当前登录人id
				userName: "",//当前登录人姓名
				woId: this.$route.query.recommendId,//工单ID
				toId:'',//被回复的留言id
				toName:'',//被回复的留言者姓名
            }
        },
        created() {
			this.getDetail()
        },
		filters:{
			formatCreateTime(data){
				return parseTime(data,"{m}月{d}日 {h}:{i}");
			}
		},
        methods: {
            back(){
                history.go(-1);
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
					id:this.$route.query.recommendId,
					userId:localStorage.getItem('userId'),
					isGroom:1
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
							self.comments = res.data.data.comments;
							self.supplyDesc = res.data.data.supplyDesc;

					}
				})
			},
            seeImg(index,type){
                // this.previewImg = url;
            	let data = [];
            	let imgList = [];
            	if(type=='q'){
            		//问题
            		imgList = this.questionFiles;
            	}else{
            		imgList = this.answerFiles;
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
        },
    }
</script>

<style scoped>
    .bg{
        height:0.2rem;
        width:100%;
        background: #f6f7fb;
    }
    main{
        margin:0 0.26rem;
        border-radius:0.1rem;
        background:#fff;
        /*padding:0 0.08rem 0 0.12rem;*/
        padding:0 0.23rem;
        box-sizing: border-box;
		    width: auto;
    }
    .quest,.response,.leaveWord{
        padding:0.2rem 0 0.3rem;
        border-bottom:1px solid #f2f2f2;
    }
    .leaveWord{
        margin: 0.2rem 0.26rem;
        border-radius: 0.1rem;
        background: #fff;
        padding: 0.24rem 0.23rem 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;

    }
    .response{
        padding-bottom:0.52rem;
    }
    p{margin:0;text-align: left;}
    .quest-title{
        font-size:0.28rem;
        color:#333;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
    }
    .quest-content,.response-content{
        font-size:0.28rem;
        color:#999CAA;
        margin-top:0.1rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(153,156,170,1);
    }
    .quest-img{
        margin-top:0.28rem;
        justify-content: flex-start;
    }
    .quest-img img{
        width:1.88rem;
        height:1.88rem;
        margin-right:0.44rem;
        border-radius: 10px;
    }
    .response-content{
        margin-top:0.18rem;
    }
    .response-content span{
        font-size:0.28rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
		align-self: flex-start;
		min-width: 50px;
    }
    .response-content .word{
        flex:1;
        color:#999CAA;
		word-break: break-word;
    }
    .response-star{
        color:#999CAA;
        font-size:0.28rem;
        justify-content: flex-start;
    }
    .response-star .van-rate{
        margin-top:0.04rem;
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
    .work span{
        color:#4A88FB;
    }
    .icon_star img{
        width:0.3rem;
        height:0.3rem;
        display: inline-block;
        margin-right:0.1rem;
        position: relative;
        top: 0.02rem;
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
	}
</style>
