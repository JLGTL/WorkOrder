<template>
    <div :class="[hasBorder?'head headborder':'head']">
        <div class="flex head_wrap">
            <span class="back flexIn" @click="back" v-if="isBack">
                <van-icon name="arrow-left"/>
            </span>
            <span class="back flexIn" @click="back" v-if="!isBack">
                <van-icon name="cross"/>
            </span>
            <div class="rightb flexIn">
                <!-- 铃铛 -->
                <!-- <span class="bell" v-if="hasBell"> -->
                <span class="bell" @click="showInfo" v-if="hasBell">
                    <span class="pop" v-if="bells>0 && bells<=99">{{bells}}</span>
                    <span class="more_infor" v-if="bells>99">···</span>
                </span>
                <!-- 展开 -->
                <span :class="[showExportWrap?'zhankai':'zhankai zhankaiopen']" v-if="hasZankai"
                      @click="showExportWrap=!showExportWrap">
                    <ul class="export_list_wrap" v-if="showExportWrap">
                        <li @click="exportDetail('导出日程详情')">导出日程详情</li>
                        <li @click="exportDetail('导出提交详情')">导出提交详情</li>
                    </ul>
                </span>
                <!-- 分享 -->
                <span class="share" v-if="hasShare" @click="share"></span>
                <!-- 横向三个点 转交人-->
                <span class="more" v-if="hasMore" @click="showSendBtn" :class="[isTrans?'isTrans':'']">
                    <div v-if="sendPeopleBtn" @click = "selectPeople">
                        <span class="sendOrder">转交工单</span>
                        <span class="atopTip" ></span>
                        <span class="btopTip"></span>
                    </div>
                </span>
                <!-- 横向三个点 修改时间-->
                <span class="more" v-if="hasMoreTime" @click="showTimeBtn" :class="[isTrans?'isTrans':'']">
                    <div v-if="changeTimeBtn" @click = "selectTime">
                        <span class="sendOrder">任务周期</span>
                        <span class="atopTip" ></span>
                        <span class="btopTip"></span>
                    </div>
                </span>
                <!-- 垃圾桶 -->
                <span class="dustbin" v-if="hasDustbin" @click="deleteThis"></span>
                <!-- 职能组添加人员 -->
                <span class="addPerson" v-if="addPerson" @click="addNewPerson">添加</span>
                <!-- 职能组添加人员确定 -->
                <span class="addPersonSure" v-if="addPersontxt" @click="addPersonSure">完成</span>
				<!-- 职能组添加人员确定 -->
				<span class="addPersonSure" v-if="sure" @click="sureReturn">确认</span>
                <!-- 创建工单保存 -->
                <span class="addPersonSure" v-if="save" @click="saveBill">保存</span>
                <!-- 我执行的 筛选 -->
                <span class="search" v-if="filterShow" @click="filterOrder" ></span>
            </div>
        </div>
        <div class="title">{{title}}</div>
        <!--<van-popup v-model="showCalender" position="bottom" :overlay="true" @click-overlay="cancelSelect">-->
        <!--<van-datetime-picker-->
        <!--v-model="currentDate"-->
        <!--type="date"-->
        <!--@confirm="chooseDate"-->
        <!--@cancel="cancelSelect"-->
        <!--title="选择日期"-->
        <!--/>-->
        <!--</van-popup>-->
    </div>
</template>

<script>
    export default {
        props: {
            title: String,
            hasBell: Boolean,
			bells:Number,
            hasMore: Boolean,
            hasMoreTime: Boolean,
            hasZankai: Boolean,
            hasDustbin: Boolean,
            hasShare: Boolean,
            addPerson: Boolean,
            addPersontxt: Boolean,
			sure:Boolean,
            save: Boolean,
            filterShow: {
                type: Boolean,
                default: false,
            },
            isBack: {
                type: Boolean,
                default: true,
            },
            hasBorder: Boolean,
        },
        data () {
            return {
                showCalender: false,
                currentDate: new Date(),
                showExportWrap: false,
                exportText: '',
                sendPeopleBtn: false, // 转交按钮
                changeTimeBtn: false, // 时间按钮
                isTrans: false,
            }
        },
        methods: {
            back () {
                this.$emit('back')
            },
            showSendBtn(){
                this.sendPeopleBtn = !this.sendPeopleBtn;
                this.isTrans = !this.isTrans;
                //this.$emit('selectPeople')
            },
            showTimeBtn(){
                this.changeTimeBtn = !this.changeTimeBtn;
                this.isTrans = !this.isTrans;
            },
            selectPeople(){
                this.$emit('selectPeople');
            },
            selectTime(){
                this.$emit('selectTime');
            },
            share () {
                this.$emit('share')
            },
            deleteThis () {
                this.$emit('deleteThis')
            },
            addNewPerson () {
                this.$emit('addNewPerson');
            },
            addPersonSure () {
                this.$emit('addPersonSure');
            },
			sureReturn(){
			    this.$emit('sureReturn');
			},
            saveBill () {
                this.$emit('saveBill')
            },
            filterOrder () {
                this.$emit('filter');
            },
            showInfo () {
                this.$router.push({
                    path: '/news',
                    query: {
                        userId: this.$route.query.userId
                    }
                })
            },
            cancelSelect () {
                this.showCalender = false
                this.$emit('openMenu')
            },
            chooseDate (data) {
                this.showCalender = false
                this.$emit('openMenu')

                this.showExportWrap = false
                this.$router.push({
                    path: '/schedule/exportData',
                    query: {
                        userId: this.$route.query.userId,
                        nowCHooseTime: parseInt(data.getTime() / 1000),
                        exportText: this.exportText
                    }
                })
            },
            exportDetail (n) {
                this.showCalender = true
                this.exportText = n
                this.$emit('closeMenu')
            }
        }
    }
</script>

<style scoped>
    .head {
        background: #fff;
        padding: 0 15px;
        position: fixed;
        width: 100%;
        top: 0;
        z-index: 100;
        box-sizing: border-box;
    }

    .head.headborder {
        box-shadow: 0px 1px 4px 0px rgba(227, 228, 232, 1);
        margin-bottom: 5px;
    }

    .head_wrap {
        align-items: center;
        height: 54px;
        justify-content: space-between;
    }

    .back {
        color: #4a88fb;
        width: 20px;
        font-size: 20px;
    }

    .title {
        color: #373D46;
        font-size: 18px;
        position: absolute;
        width: calc(100% - 30px);
        height: 54px;
        line-height: 54px;
        top: 0;
        /*zqq修改 不确定对不对*/
        width: calc(100% - 120px);
        height: 54px;
        line-height: 54px;
        top: 0;
        margin: 0 auto;
        left: 60px;
        /*zqq修改 不确定对不对END*/
    }

    .rightb {
        width: 50px;
        height: 30px;
        /* display: flex; */
        align-items: center;
        justify-content: flex-end;
    }

    /* 铃铛 */

    .rightb .bell {
        min-width: 20px;
        max-width: 20px;
        min-height: 20px;
        max-height: 20px;
        background: url("../assets/images/notice@2x.png") no-repeat 0 0;
        background-size: 100% 100%;
        position: relative;
        /* margin-right: 13px; */
    }

    .rightb .pop {
        height: 12px;
        min-width: 5px;
        line-height: 12px;
        color: #fff;
        font-size: 9px;
        position: absolute;
        top: -2px;
        left: 9px;
        padding: 0 3px;
        background: #ff0000;
        border-radius: 5.5px;
    }

    .rightb .more_infor {
        min-height: 11px;
        max-height: 11px;
        min-width: 17px;
        max-width: 17px;
        line-height: 11px;
        color: #fff;
        font-size: 9px;
        position: absolute;
        top: -2px;
        left: -8px;
        background: #ff0000;
        border-radius: 5.5px;
    }

    /* 三个点 */

    .rightb .more {
        min-width: 16px;
        max-width: 16px;
        min-height: 4px;
        max-height: 4px;
        background: url("../assets/images/unchange@2x.png") no-repeat 0 0;
        background-size: 100% 100%;
        position: relative;
        margin-left: 0.2rem;
        transition: all .3s ease-in-out;
    }

    /* 垃圾桶 */

    .dustbin {
        min-width: 14px;
        max-width: 14px;
        min-height: 16px;
        max-height: 16px;
        background: url("/static/img/delete@2x.png") no-repeat 0 0;
        background-size: 100% 100%;
        margin-left: 10px;
    }

    /* 分享 */

    .share {
        min-width: 16px;
        max-width: 16px;
        min-height: 16px;
        max-height: 16px;
        background: url("../assets/images/icon_share@2x.png") no-repeat 0 0;
        background-size: 100% 100%;
        margin-right: 0.1rem;
        /*display: none;*/
    }

    /* 展开 */

    .zhankai {
        min-width: 13px;
        max-width: 13px;
        min-height: 16.5px;
        max-height: 16.5px;
        background: url("/static/img/zhankai@2x.png") no-repeat 0 0;
        background-size: 100% 100%;
        position: relative;
        transition: all .3s ease-in-out;

    }

    .zhankai.zhankaiopen {
        min-width: 17.5px;
        max-width: 17.5px;
        min-height: 4.5px;
        max-height: 4.5px;
        background: url("/static/img/more@2x.png") no-repeat 0 0;
        background-size: 100% 100%;
        transition: all .3s ease-in-out;
    }


    .export_list_wrap {
        position: absolute;
        border-radius: 5px;
        width: 95px;
        height: 49.5px;
        border: 1px solid #dddddd;
        /* overflow: hidden; */
        right: -5px;
        top: 27px;
        background: #fff;
    }

    .export_list_wrap:before {
        content: "";
        position: absolute;
        top: -8px;
        right: 5px;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 8px solid #dddddd;
    }

    .export_list_wrap:after {
        content: "";
        position: absolute;
        top: -7px;
        right: 5px;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 8px solid #fff;
    }

    .export_list_wrap li {
        height: 25px;
        text-align: center;
        line-height: 25px;
        color: #999caa;
        border-bottom: 1px solid #f9f9f9;
        font-size: 12px;
    }

    .export_list_wrap li:last-child {
        border-bottom: none;
    }

    .addPerson,
    .addPersonSure {
        color: #608bf7;
        font-size: 14px;
    }
    .search{
        width:0.3rem;
        height:0.3rem;
        background: url("../assets/images/sandglass.png") no-repeat 0 0;
        background-size: 100% 100%;
    }
    .sendOrder{
        width:1.5rem;
        height:0.67rem;
        /*line-height:0.6rem;*/
        padding:0.15rem;
        position: absolute;
        right: 0;
        top:0.6rem;
        color: #608BF7;
        box-sizing: border-box;
        background:rgba(255,255,255,1);
        border-radius:0.1rem;
        border:1px solid rgba(221,221,221,1);
    }
    .btopTip{
        width:0;
        height:0;
        position: absolute;
        left: 0;
        top:0.54rem;
        border-right:5px solid transparent;
        border-left:5px solid transparent;
        border-bottom:5px solid #fff;
    }
    .atopTip{
        width:0;
        height:0;
        position: absolute;
        left: 0;
        top:0.52rem;
        border-right:5px solid transparent;
        border-left:5px solid transparent;
        border-bottom:5px solid rgba(221,221,221,1);
    }
    .rightb .isTrans{
        min-width: 16px;
        max-width: 16px;
        min-height: 16px;
        max-height: 16px;
        background: url("../assets/images/tochange@2x.png") no-repeat 0 0;
        background-size: 100% 100%;
        position: relative;
        margin-left: 0.2rem;
        transition: all .3s ease-in-out;
    }
</style>
