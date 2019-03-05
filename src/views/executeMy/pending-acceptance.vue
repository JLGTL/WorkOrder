<template>
    <div>
        <Head :title="title" @back="back" :isBack="true" :hasShare="true" :hasBorder="true"/>
        <main>
            <div class="single-order">
                <div class="tag_normal" v-if="workDetails.importantType == 1">普通</div>
                <div class="tag_important" v-if="workDetails.importantType == 2">重要</div>
                <div class="tag_danger" v-if="workDetails.importantType == 3">紧急</div>
                <div class="single-order-title flex"><p>{{workDetails.title}}</p>
                    <p class="noborder order-status">{{workDetails.statusName}}</p></div>
                <p class="single-order-period flex">
                    <img src="../../assets/images/clock_icon.png" class="clock_icon"/>
                    <span>时间&ensp;:&ensp;</span>{{workDetails.beginTime}}-{{workDetails.endTime}}<span></span>
                </p>
                <p class="single-order-create flex">
                  <span class="flex">
                      <img src="../../assets/images/executepeople_icon.png" class="executePeople_icon"/>
                      <span>创建人</span><i v-if="workDetails.creatorInfo">&emsp;{{workDetails.creatorInfo.name}}&emsp;{{workDetails.creatorInfo.mobile}}</i></span>
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
                                    <span class="custom-text">上传附件</span>
                                </template>
                                <template slot="icon">
                                    <img src="../../assets/images/upload_icon.png" class="icon"/>
                                </template>
                                <!--<img src="../../assets/images/addImg@2x.png" class="icon addpicBtn"/>-->
                            </van-cell>
                            <van-cell style="padding-bottom: 0.5rem;">
                                <p class="gray" v-if="workDetails.questionFiles.length == 0">暂无附件</p>
                                <p class="quest-img flex" v-if="workDetails.questionFiles.length > 0">
                                    <span v-for="file in workDetails.questionFiles" v-if="file.type == 1"><img :src="file.url" /></span>
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
                                <div class="copyPeople flex">
                                    <img src="../../assets/images/share_icon.png" class="icon"/>
                                    <span class="">抄送人</span>
                                    <p class="dispathPeople flex gray"><img src="../../assets/images/head.png"/>{{workDetails.wocopy.length}}人</p>
                                </div>
                            </div>
                            <div class="work">
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
                                <van-cell style="padding-bottom: 0.5rem;">
                                    <p class="gray" v-if="workDetails.answerFiles.length == 0">暂无附件</p>
                                    <p class="quest-img flex" v-if="workDetails.answerFiles.length > 0">
                                        <span v-for="file in workDetails.answerFiles" v-if="file.type == 1"><img :src="file.url" /></span>
                                    </p>
                                </van-cell>
                            </div>
                            <div class="leaveWord">
                                <h2 class="leaveWord-title flex">
                                    <span>留言</span>
                                    <span class="leaveword-num"><i>{{workDetails.comments.length}}</i>条动态<img src="../../assets/images/leaveWord.png"/></span>
                                </h2>
                                <ul class="leaveWord-list">
                                    <li class="leaveWord-list_li flex" v-for="item in workDetails.comments" v-if="workDetails.comments">
                                        <div class="list_li_left">
                                            <img :src="item.avatar" />
                                        </div>
                                        <div class="list_li_right flex">
                                            <p><span class="name">{{item.userName}}</span><span class="date">{{item.createTime | getdate}}</span></p>
                                            <p class="work">{{item.woId}}</p>
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
                                    <p><img :src="item.avatar"/><span>{{itme.userName}}</span></p>
                                    <p>{{item.description}}</p>
                                    <p>{{item.createTime | getdate}}</p>
                                </div>
                                <div class="step-circle"></div>
                                <div class="step-line"></div>
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
            <div class="submitBtn" v-if="!submit">
                <van-button round type="infoRound" @click="followUp" size="large">写跟进</van-button>
            </div>
            <div class="btnGroup" v-if="submit">
                <van-button round type="infoRound" @click="followUp " class="">不通过</van-button>
                <van-button round type="infoRound" @click="followUp " class="">通过</van-button>
            </div>
        </main>
    </div>
</template>

<script>
    import Head from '@/components/head'

    export default {
        name: 'no-workorder-detail',
        components: {Head},
        data () {
            return {
                title: '待验收',
                active: 0,
                submit: true,
                orderId : '',
                userId:'',
                workDetails:'',
                haveStep:false,//是否有跟进
            }
        },
        created () {
            this.orderId = this.$route.query.orderId;
            this.userId = window.localStorage.getItem('userId');
            console.log(this.userId);
        },
        mounted(){
            this.initDetails();
        },
        watch:{
            active:function () {
                if(this.active == 0){
                    this.submit = true
                }else if(this.active == 1){
                    this.submit = false
                    var data = {
                        id:this.orderId,
                        userId:this.userId,
                    }
                    this.axios({
                        url:'/api/v1.0/seewologs',
                        method:'post',
                        data:data
                    }).then(function (res) {
                        console.log(res);
                    })
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
                var hour = val.split(' ')[1];
                return year+' '+hour;
            },
            /**
             * 格式化时间戳
             */
            getdate(dateTime) {
                var now = new Date(dateTime*1000),
                    y = now.getFullYear(),
                    m = now.getMonth() + 1,
                    d = now.getDate();
                console.log(now);
                var day = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
                console.log(day);
                var time = day.replace(/-/g, ".").split(' ')[0];
                return time;
            },
        },
        methods: {
            back () {
                this.$router.go(-1);
            },
            followUp () {

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
                    console.log(res);
                    res.data.data.beginTimes = res.data.data.beginTime.split(' ')[0].replace(/-/g,'.');
                    res.data.data.endTimes = res.data.data.endTime.split(' ')[0].replace(/-/g,'.');
                    //self.$nextTick(function () {
                    self.workDetails = res.data.data;
                    self.haveStep = res.data.data.isRemind;
                    //});
                })
            },
            /**
             * 格式化时间戳
             */
            getdate(dateTime) {
                var now = new Date(dateTime*1000),
                    y = now.getFullYear(),
                    m = now.getMonth() + 1,
                    d = now.getDate();
                console.log(now);
                var day = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
                console.log(day);
                var time = day.replace(/-/g, ".").split(' ')[0];
                return time;
            },
        }
    }
</script>
<style scoped>
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
        right: 1.2rem;
        top:0.2rem;
        width: 8px;
        height:8px;
        -webkit-border-radius:50%;
        -moz-border-radius:50%;
        border-radius:50%;
        background: #ff0000;
    }
</style>
