<template>
    <div>
		<Head :title="title" @back="back"/>
        <main>
            <div class="manage flex">
                <div class="manage-left flex">
                    <p class="day">{{day}}</p>
                    <div>
                        <p class="tr">{{week}}</p>
                        <p>{{month}}／{{year}}</p>
                    </div>
                </div>
                <div class="manage-right">
                    <button @click="toTemplatemanage">模块管理</button>
                </div>
				<p class="online">在线人数<span>{{person}}</span></p>
            </div>
            <p class="boxTitle">选择您的问题类型创建工单</p>
            <div class="shadowOpacityTop"><span></span></div>
            <div class="shadowOpacity"><span></span></div>
            <div class="box">


				<!-- <i class="backWhite"></i> -->
                <!-- <dl v-if='parseInt(index/3)<=2' :class="'operation operation_'+index%3+' line_'+parseInt(index/3)" :data-line="parseInt(index/3)" v-for="(item,index) in orderTypes">
                    <dt><img src="../assets/images/operation_icon.png"/></dt>
                    <dd>{{item.name}}</dd>
                </dl> -->
				<dl v-if='index>=0 && index==0' class='operation operation_0 defaultOpe' v-for="(item,index) in orderTypes" @click="selectType(item.id,item.name)">
				    <dt><img class="img_back" src="../assets/images/color1.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dd>{{item.name}}</dd>
				</dl>
				<dl v-if='index>0 && index==1' class='operation operation_1 defaultOpe' v-for="(item,index) in orderTypes" @click="selectType(item.id,item.name)">
				    <dt><img class="img_back" src="../assets/images/color2.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dd>{{item.name}}</dd>
				</dl>
				<dl v-if='index>1 && index==2' class='operation operation_2 defaultOpe' v-for="(item,index) in orderTypes" @click="selectType(item.id,item.name)">
				    <dt><img class="img_back" src="../assets/images/color3.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dd>{{item.name}}</dd>
				</dl>

				<dl v-if='index>2 && index==3' class='operation operation_3 defaultOpe' v-for="(item,index) in orderTypes" @click="selectType(item.id,item.name)">
				    <dt><img class="img_back" src="../assets/images/color4.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dd>{{item.name}}</dd>
				</dl>
				<dl v-if='index>3 && index==4' class='operation operation_4 defaultOpe' v-for="(item,index) in orderTypes" @click="selectType(item.id,item.name)">
				    <dt><img class="img_back" src="../assets/images/color5.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dd>{{item.name}}</dd>
				</dl>
				<dl v-if='index>4 && index==5' class='operation operation_5 defaultOpe' v-for="(item,index) in orderTypes" @click="selectType(item.id,item.name)">
				    <dt><img class="img_back" src="../assets/images/color1.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dd>{{item.name}}</dd>
				</dl>

				<dl v-if='index>5 && index==6' class='operation operation_6 defaultOpe' v-for="(item,index) in orderTypes" @click="selectType(item.id,item.name)">
				    <dt><img class="img_back" src="../assets/images/color2.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dd>{{item.name}}</dd>
				</dl>
				<dl v-if='index>6 && index==7' class='operation operation_7 defaultOpe' v-for="(item,index) in orderTypes" @click="selectType(item.id,item.name)">
				    <dt><img class="img_back" src="../assets/images/color3.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dd>{{item.name}}</dd>
				</dl>
				<dl v-if='index>7 && index==8' class='operation operation_8 defaultOpe' v-for="(item,index) in orderTypes" @click="selectType(item.id,item.name)">
				    <dt><img class="img_back" src="../assets/images/color4.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dd>{{item.name}}</dd>
				</dl>
				<dl v-if='index>8 && parseInt(index/3)==3' class="mtbox operation " v-for="(item,index) in orderTypes" @click="selectType(item.id,item.name)">
				    <dt v-if='index%5==0'><img class="img_back" src="../assets/images/color1.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dt v-if='index%5==1'><img class="img_back" src="../assets/images/color2.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dt v-if='index%5==2'><img class="img_back" src="../assets/images/color3.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dt v-if='index%5==3'><img class="img_back" src="../assets/images/color4.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dt v-if='index%5==4'><img class="img_back" src="../assets/images/color5.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dd>{{item.name}}</dd>
				</dl>
				<dl v-if='index>8 && parseInt(index/3)>3' class="operation " v-for="(item,index) in orderTypes" @click="selectType(item.id,item.name)">
				    <!-- <dt><img src="../assets/images/operation_icon.png"/></dt> -->
					<dt v-if='index%5==0'><img class="img_back" src="../assets/images/color1.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
					<dt v-if='index%5==1'><img class="img_back" src="../assets/images/color2.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
					<dt v-if='index%5==2'><img class="img_back" src="../assets/images/color3.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
					<dt v-if='index%5==3'><img class="img_back" src="../assets/images/color4.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
					<dt v-if='index%5==4'><img class="img_back" src="../assets/images/color5.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
				    <dd>{{item.name}}</dd>
				</dl>

            </div>
            <div class="close" @click="close">
                <img src="../assets/images/catelog_del_icon.png"/>
            </div>
        </main>
    </div>
</template>
<script>
import Head from '@/components/head'
export default {
    props: [],
    components: {
        Head
    },
    data () {
        return {
            title: '目录',
			orderTypes:[],
			week:'',
			day:'',
			person:0,

        }
    },
	created() {
		this.setDate();
		this.getOrdertypes();
//		window.onscroll = function () {
//            console.log(document.body.scrollTop)
//        }
	},
    methods: {
        back(){//退出
        	this.logout();//工单退出
        	if(window.htoa){//安卓
        	  window.htoa.closePage();
        	}
			if(window.webkit.messageHandlers){
        	  window.webkit.messageHandlers.closePage.postMessage(null);
        	}
        },
        logout(){
        	var self = this;
        	var data={
        	    'userId':localStorage.getItem('userId'),
        		type:2,
        	}
        	self.axios({
        	    url:'/api/v1.0/wouserschange',
        	    method:'post',
        		data:data
        	}).then(function (res) {

        	})
        },
		toTemplatemanage(){
			this.$router.push({
				path:'templatemanage',
			})
		},
		setDate(){
			let a = new Array("日", "一", "二", "三", "四", "五", "六");
			let week = new Date().getDay();
			let year = new Date().getFullYear();
			let month = new Date().getMonth()+1;
			if(month<10){
				month = '0'+ month;
			}
			let day = new Date().getDate();
			if(day<10){
				day = '0'+ day;
			}
			this.week = "星期"+ a[week];
			this.day = day;
			this.year = year;
			this.month = month;
		},
		selectType(id,name){
			// alert(id)
			this.$router.push({
				path:'CreateOperativebill',
				query: {
				  workType:id,
				  workTypeName:name
				}
			})
		},
		getOrdertypes(){
		    var self = this;
			var data={
			    'userId':localStorage.getItem('userId'),
			}
		    self.axios({
		        url:'/api/v1.0/woindex',
		        method:'post',
				data:data
		    }).then(function (res) {
		        console.log(res);
				if(res.data.code=='200'){
					self.person = res.data.data.count_users;
					res.data.data.list.forEach(item=>{
						item.firstName = item.name.split("")[0];
						self.orderTypes.push(item)
					})


				}
		    })
		},
		close(){
			if(this.$route.query.menuOpen && this.$route.query.menuOpen=='1'){
				this.$router.push({
					path:'/',
					query:{
						userId:localStorage.getItem('userId')
					}
				})
			}
			this.$emit("close");
		}
    }
}
</script>

<style>
@import "../assets/fonts/font.css";

</style>
<style scoped>
    main {
        /* background: #F3F6F9; */
        width: 100%;
        height: calc(100vh - 54px);
		margin-top: 54px;
		background:#fff url(../assets/images/Bitmap.png) 0 0 no-repeat;
		background-size: 100% 100%;
		background-color: transparent;
    }

    .manage {
        padding: 0.49rem 0.4rem;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        /*margin-bottom: 1.2rem;*/
		flex-wrap: wrap;
		z-index: 999;
		position: fixed;
		width: 100%;
		background: transparent;
    }

    .manage .day {
        color: #608BF7;
        font-size: 32px;
        font-family: Hiragino Kaku Gothic StdN W8;
		font-weight: 700;
        margin-right: 0.1rem;
    }
    .manage-left {
        align-items: center;
    }

    .manage-left div {
        color: #666666;
        font-size: 12px;
        font-weight: bold;
    }

    .manage-right button {
        padding: 0 0.12rem;
        height: 0.6rem;
        color: #608BF7;
        font-size: 15px;
        border: 1px solid #608BF7;
        border-radius: 0.1rem;
        box-sizing: border-box;
        background: #F3F6F9;
    }
	.tr{
		text-align: right;
	}
    .close {
        animation: close  0.4s ease-in-out forwards;
        -webkit-animation: close  0.4s ease-in-out forwards;
    }

    .close img {
        width:1.42rem;
        height: 1.42rem;
    }

	.box .mtbox{
		/*margin-top: 81vw;*/
	}
    .box {
        /*justify-content: space-around;*/
        /*margin-bottom:0.4rem;*/
        position: fixed;
        /*position: relative;*/
		/* bottom: 2.63rem; */
		/* bottom: calc(100vh - 1rem - 51px -1.42rem); */
		top: calc(50vh - 40vw + 27px);
		/*top: calc(50vh - 40vw);*/
		display: flex;
		display: -webkit-flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		padding: 0 9.5vw;
        /* margin: 0 0.15rem; */
        /*height: 81vw;*/
        height: 106vw;
		/*overflow: hidden;*/
		overflow-y: scroll;
		width: 100%;
        box-sizing: border-box;
        padding-bottom:1.8rem;
		padding-top:0.5rem;
		background: rgba(243, 246, 249,1);
    }
    .shadowOpacityTop{
        position: fixed;
        /*top: calc(50vh - 40vw + 22px);*/
        top: 42px;
		bottom:calc(100% - 50vh + 40vw - 44px);
        left:0;
        width: 100%;
        /*height:0.5rem;*/
		/*height: calc(40vw + 44px);*/
        z-index:99;
        /*padding: 0 9.5vw;*/
        box-sizing: border-box;
		background: -webkit-gradient(linear,left bottom, left top,from(rgba(243, 246, 249,0)),color-stop(6%, rgba(243, 246, 249,1)));
		/*background: -webkit-gradient(linear,left top, left bottom,from(rgba(255,255,255,0)),color-stop(69%, rgba(255,255,255,1)));*/
		z-index: 998;
	}
    .shadowOpacityTop span{
        opacity: 0.8;
        width: 100%;
        height: 100%;
        /*background: #fff;*/
        display: block;
        background: -webkit-gradient(linear,left bottom, left top,from(rgba(243, 246, 249,0)),color-stop(9%, rgba(243, 246, 249,1)));
		z-index: 998;
		/*background: -webkit-gradient(linear,left top, left bottom,from(rgba(255,255,255,0)),color-stop(25%, rgba(255,255,255,1)));*/
	}
	.shadowOpacity{
        position: fixed;
        /*top: calc(50vh + 39vw + 27px);*/
        /*top: calc(50vh + 39vw);*/
		top:calc(50vh + 41vw + 27px);
        bottom:0;
        left:0;
        width: 100%;
        /*height:180px;*/
        z-index:99;
        /*padding: 0 9.5vw;*/
        box-sizing: border-box;
        background: -webkit-gradient(linear,left top, left bottom,from(rgba(243, 246, 249,0)),color-stop(59%, rgba(243, 246, 249,1)));
    }
    .shadowOpacity span{
        opacity: 0.8;
        width: 100%;
        height: 100%;
        /*background: #fff;*/
        display: block;
        /*background: -webkit-linear-gradient(top,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 99%);*/
        /*background: -moz-linear-gradient(top,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 99%);*/
        /*background: -o-linear-gradient(top,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 99%);*/
        /*background: linear-gradient(top,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 99%);*/
        background: -webkit-gradient(linear,left top, left bottom,from(rgba(243, 246, 249,0)),color-stop(20%, rgba(243, 246, 249,1)));
    }
	.backWhite{
		position: fixed;
		bottom: 2.63rem;;
		left: 0;
		right: 0;
		height:27vw;
		z-index: 10;
		background: linear-gradient(rgba(243,246,249,0.3),rgba(243,246,249,0.7));
		box-shadow: 10px 10px rgba(243,246,249,0.7);
	}
    .box dl {
		display: inline-flex;
		display: -webkit-inline-flex;
		flex-direction: column;
		margin: 0;
        width: 27vw;
        height: 27vw;
    }

    .box .img_back {
        width: 14vw;
        height: 14vw;
    }
	.box .img_icon {
	    width: 6vw;
	    height: auto;
		position: absolute;
		top: 4vw;
		left: 50%;
		margin-left: -3vw;
	}
	.box dt{
		position: relative;
	}
	.box dt span {
	    position: absolute;
		width: 100%;
		height: 14vw;
		line-height: 14vw;
		color: #fff;
		font-size: 9vw;
		left: 0;
		font-family:FZHLK--GBK1-0;
		text-align: center;
	}

    .box dd {
        margin: 0;
		line-height: 6vw;
        /* margin-top: 0.2rem; */
    }

    .close {
        position: fixed;
        left: 50%;
		margin-left: -0.71rem;
        z-index: 999;
    }

    /* .operation, .hr, .it, .administration, .more, .school {
        position: absolute;
        top: 6.2rem;
        left: 3.2rem;
        opacity: 0;
    } */
	.box .operation{
		/*position: absolute;*/
		/*top: 81vw;*/
		/*left: 27vw;*/
		/*opacity: 0;*/
        flex-wrap: wrap;
	}
    /*.box .defaultOpe{*/
        /*position: absolute;*/
        /*!*top: 81vw;*!*/
        /*top: 86vw;*/
        /*left: 27vw;*/
        /*opacity: 0;*/
    /*}*/
    .operation_0 {
        animation: operation_0 0.4s ease-in-out forwards;
        -webkit-animation: operation_0 0.4s ease-in-out forwards;
    }
	.operation_1 {
	    animation: operation_1 0.4s ease-in-out forwards;
	    -webkit-animation: operation_1 0.4s ease-in-out forwards;
	}
	.operation_2 {
	    animation: operation_2 0.4s ease-in-out forwards;
	    -webkit-animation: operation_2 0.4s ease-in-out forwards;
	}
	.operation_3 {
	    animation: operation_3 0.4s ease-in-out forwards;
	    -webkit-animation: operation_3 0.4s ease-in-out forwards;
	}
	.operation_4 {
	    animation: operation_4 0.4s ease-in-out forwards;
	    -webkit-animation: operation_4 0.4s ease-in-out forwards;
	}
	.operation_5 {
	    animation: operation_5 0.4s ease-in-out forwards;
	    -webkit-animation: operation_5 0.4s ease-in-out forwards;
	}
	.operation_6 {
	    animation: operation_6 0.4s ease-in-out forwards;
	    -webkit-animation: operation_6 0.4s ease-in-out forwards;
	}
	.operation_7 {
	    animation: operation_7 0.4s ease-in-out forwards;
	    -webkit-animation: operation_7 0.4s ease-in-out forwards;
	}
	.operation_8 {
	    animation: operation_8 0.4s ease-in-out forwards;
	    -webkit-animation: operation_8 0.4s ease-in-out forwards;
	}

    @keyframes close {
        0% {
            opacity: 0;
            bottom: 0;
        }
        50% {
            transform: rotate(0);
        }
        100% {
            bottom: 0.59rem;
            opacity: 1;
            transform: rotate(-180deg);
        }
    }

    @keyframes operation_0 {
        0% {
            opacity: 0;
            bottom: 0;
            left: calc(50% - 13.5vw);
        }
        100% {
            top: 0;
            left: 0;
            opacity: 1;
        }
    }

    @keyframes operation_1 {
        0% {
            opacity: 0;
            bottom: 0;
            left: calc(50% - 13.5vw);
        }
        100% {
            top: 0;
            left: 27vw;
            opacity: 1;
        }
    }

    @keyframes operation_2 {
        0% {
            opacity: 0;
            bottom: 0;
            left: calc(50% - 13.5vw);
        }
        100% {
            top: 0;
            left: 54vw;;
            opacity: 1;
        }
    }

	@keyframes operation_3 {
	    0% {
	        opacity: 0;
	        bottom: 0;
	        left: calc(50% - 13.5vw);
	    }
	    100% {
	        top: 27vw;
	        left: 0;
	        opacity: 1;
	    }
	}

	@keyframes operation_4 {
	    0% {
	        opacity: 0;
	        bottom: 0;
	        left: calc(50% - 13.5vw);
	    }
	    100% {
	        top: 27vw;
	        left: 27vw;
	        opacity: 1;
	    }
	}

	@keyframes operation_5 {
	    0% {
	        opacity: 0;
	        bottom: 0;
	        left: calc(50% - 13.5vw);
	    }
	    100% {
	        top: 27vw;
	        left: 54vw;;
	        opacity: 1;
	    }
	}

	@keyframes operation_6 {
	    0% {
	        opacity: 0;
	        bottom: 0;
	        left: calc(50% - 13.5vw);
	    }
	    100% {
	        top: 54vw;
	        left: 0;
	        opacity: 1;
	    }
	}

	@keyframes operation_7 {
	    0% {
	        opacity: 0;
	        bottom: 0;
	        left: calc(50% - 13.5vw);
	    }
	    100% {
	        top: 54vw;
	        left: 27vw;
	        opacity: 1;
	    }
	}

	@keyframes operation_8 {
	    0% {
	        opacity: 0;
	        bottom: 0;
	        left: calc(50% - 13.5vw);
	    }
	    100% {
	        top: 54vw;
	        left: 54vw;;
	        opacity: 1;
	    }
	}
    @keyframes operation_9 {
	    0% {
	        opacity: 0;
	        bottom: 0;
	        left: calc(50% - 13.5vw);
	    }
	    100% {
	        top: 81vw;
	        left: 0vw;;
	        opacity: 1;
	    }
	}
    @keyframes operation_10 {
	    0% {
	        opacity: 0;
	        bottom: 0;
	        left: calc(50% - 13.5vw);
	    }
	    100% {
	        top: 81vw;
	        left: 27vw;;
	        opacity: 1;
	    }
	}
    @keyframes operation_11 {
	    0% {
	        opacity: 0;
	        bottom: 0;
	        left: calc(50% - 13.5vw);
	    }
	    100% {
	        top: 81vw;
	        left: 54vw;;
	        opacity: 1;
	    }
	}
    @keyframes administration {
        0% {
            opacity: 0;
            bottom: 0;
            left: 3.2rem;
        }
        100% {
            top: 2.19rem;
            left: 0.75rem;
            opacity: 1;
        }
    }

    @keyframes school {
        0% {
            opacity: 0;
            bottom: 0;
            left: 3.2rem;
        }
        100% {
            top: 2.19rem;
            left: 2.9rem;
            opacity: 1;
        }
    }

    @keyframes more {
        0% {
            opacity: 0;
            bottom: 0;
            left: 3.2rem;
        }
        100% {
            top: 2.19rem;
            left: 5.05rem;
            opacity: 1;
        }
    }
	.online{
		width: 100%;
		line-height: 0.3rem;
		font-size: 14px;
		color: #999;
		text-align: left;
		font-weight: 400;
	}
	.online span{
		color: #608BF7;
		padding-left: 13px;
	}
    .box .boxCont dl:nth-child(10), .box .boxCont dl:nth-child(11),.box .boxCont dl:nth-child(12){
        opacity: 0;
    }
    .box .boxCont dl:nth-child(10){
        animation: operation_9 0.4s ease-in-out forwards;
        -webkit-animation: operation_9 0.4s ease-in-out forwards;
    }
    .box .boxCont dl:nth-child(11){
        animation: operation_10 0.4s ease-in-out forwards;
        -webkit-animation: operation_10 0.4s ease-in-out forwards;
    }
    .box .boxCont dl:nth-child(12){
        animation: operation_11 0.4s ease-in-out forwards;
        -webkit-animation: operation_11 0.4s ease-in-out forwards;
    }
    .boxShadow{
        height:10px;
        width: 100%;
        opacity: 0.2;
        position: absolute;
        bottom:0;
        background: #fff;
    }
    .boxCont{
        position: relative;
        box-sizing: border-box;
        /*width: 100%;*/
        height:100%;
        /*opacity: 0;*/
    }
    .boxTitle{
        font-size: 0.25rem;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 0.69);
        line-height: 42px;
        /*position: relative;*/
        /* top: -1rem; */
        text-align: left;
        padding: 0 1.2rem;
        margin-bottom: 0.2rem;
		position: fixed;
		top: 173px;
		z-index: 999;
		background: transparent;
	}

	/* iphone X */
	@media only screen and (min-device-width: 375px)
	and (max-device-height: 812px)
	and (-webkit-device-pixel-ratio: 3) {
		.boxTitle{
			top:190px;
		}
	}


	/* iphone 6+, 6s+, 7+, 8+ */
	@media only screen and
	(min-device-width: 414px)
	and (max-device-height: 736px)
	and (-webkit-device-pixel-ratio: 3) {
		.boxTitle{
			top:173px;
		}
	}

	/* iphone 6, 7, 8 */
	@media only screen and
	(min-device-width: 375px)
	and (max-device-height: 667px)
	and (-webkit-device-pixel-ratio: 2) {
		.boxTitle{
			top:163px;
		}
	}

	/* 判断iphone5 *//* 横屏竖屏判断方法与ipad一样 */
	@media only screen and
	(min-device-width: 320px)
	and (max-device-height: 568px)
	and (-webkit-device-pixel-ratio: 2){
		.boxTitle{
			top:145px;
		}
	}

	/* style */

</style>
