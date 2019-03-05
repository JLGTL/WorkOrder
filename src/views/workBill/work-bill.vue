<template>
    <div>
		<div class="menu" v-if="showMenu"><Menu @close='closeMenu'/></div>
        <Head :title="title" @back="back" :hasBell="true" :bells='bells'/>
        <div class="banner">
            <img src="../../assets/images/workbill.png" v-if="!backurl"/>
			<img :src="backurl" v-if="backurl"/>
			<div class="content" v-if='name'>
				<p class="tip">让所有人看到你的努力</p>
				<p class="title">{{lastMouth}}月荣誉榜</p>
				<div class="top">
					<p class="img">
						<img :src="avatar" v-if="avatar"/>
						<img src="../../assets/images/head.png" v-if="!avatar"/>
						<span class="name">{{name}}</span>
					</p>
					<p class="dep">{{department}}</p>
					<p class="dep">完成工单{{num}}个 完成率{{proportion}}%</p>
				</div>
			</div>
        </div>
        <main class="bill-list flex">
            <div class="bill-list_item flexIn" v-for="(item,index) in items" @click="enterDetail(index)">
                <span class="item-title">
                    {{item.title}}
                </span>
                <span class="unRead" v-show="item.unread"></span>
                <span class="item-memo">
                    <i class="memo-num">{{item.num}}</i>{{item.memo}}
                </span>
            </div>
        </main>
        <Foot @addWorkBill='addWorkBill' @getReport='getReport' type='gd'></Foot>
    </div>
</template>
<script>
    import Head from "@/components/head";
    import Foot from "@/components/footer";
    import Menu from "@/components/menu";
    export default{
        components:{Head,Foot,Menu},
        data(){
            return{
                items:[
                    {title:"热门知识",num:'',memo:"个知识"},
                    {title:"我执行的",num:'',memo:"个工单",unread:false},
                    {title:"已创建的",num:'',memo:"个工单",unread:false},
                    {title:"抄送我的",num:'',memo:"个工单"}
                ],
                title:"工单",
				showMenu:false,
				bells:0,//未读消息数量
				backurl:'',//榜单背景
				num:0,//完成工单数量
				department:'',//完成冠军的部门
				name:'',//完成冠军的名称
				proportion:'',//完成工单的完成率
				lastMouth:0,//上个月
				avatar:'',
            }
        },
        mounted(){
			let userId = this.$route.query.userId;
			localStorage.setItem('userId',userId);
			if(this.$route.query.menuOpen && this.$route.query.menuOpen=='0'){
				this.showMenu = false;
			}else{
				//从其他页面进来 添加工单=》直接打开目录
				this.showMenu = true;

			}
            this.initCard();
            this.initList();
			this.lastMouth = new Date().getMonth();
			if(this.lastMouth==0){
				this.lastMouth=12;
			}
        },
        methods:{
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
			//提供给OA的设置token方法
			setToken(token){
				console("oa传入Token")
				console(token)
				localStorage.setItem("Authorization",token);
			},
			addWorkBill(){
				this.showMenu = true;
			},
			closeMenu(){
				this.showMenu = false;
			},
            enterDetail(index){
                if(index == 0){
                    this.$router.push({
                        path:'/recommendintel'
                    })
                }else if(index == 1){
                    this.$router.push({
                        path:'/myexecute'
                    })
                }else if(index == 2){
                    this.$router.push({
                        path:'/mycreate'
                    })
                }else if(index == 3){
                    this.$router.push({
                        path:'/mycopy'
                    })
                }
            },
            initCard(){
                var self = this;
                self.axios({
                    url:'/api/v1.0/gethonll',
                    method:'post'
                }).then(function (res) {
                    console.log(res);
                    console.log('====gethonll====');
					if(res.data.code=='200'){
						self.num = res.data.data.num;
						self.name = res.data.data.name;
						self.department = res.data.data.department;
						self.proportion = res.data.data.proportion;
						self.avatar = res.data.data.avatar;
						self.backurl = res.data.data.imgurl;
					}
                })
            },
            initList(){
                var self = this;
				let userId = this.$route.query.userId;
                var data={
                    'uid':userId,
                }
                self.axios({
                   url:'/api/v1.0/workorder',
                   method:'post',
                   data:data
                }).then(function(res){
                   console.log(res);
                   let data = res.data.data;
                   self.items[0].num = data.knowledges;
                   self.items[1].num = data.executors;
                   self.items[2].num = data.creators;
                   self.items[3].num = data.copypersons;
				   self.bells = data.comments;
                   if(data.executenum == 1){
                       self.items[1].unread = true;
                   }
                   if(data.createnum == 1){
                       self.items[2].unread = true;
                   }
               })
            },
			getReport(){
				//  return false;
				this.$router.push({
					path:'/ReportPeople'
				})
			}
        }
    }
</script>
<style scoped>
    .banner{
		position: relative;
        padding:0.2rem 0.25rem;
    }
    .banner img{
        height:3.5rem;
        width:100%;
        display:block;
        margin:0 auto;
        border-radius: 5px;
    }
	.banner .content{
		position: absolute;
		top:0.25rem;
		bottom: 0.25rem;
		left: 0.2rem;
		right: 0.2rem;
	}
    main{
        flex-direction:column;
        /*padding:0 0.25rem;*/
    }
     .bill-list{
         align-items: center;
     }
    .bill-list_item{
        box-sizing: border-box;
        width:100%;
        height:1.6rem;
        margin:0 auto;
        background:url("../../assets/images/workbill_back.png") no-repeat;
        background-size:cover;
        border-radius:0.1rem;
        /*margin-top:0.36rem;*/
        justify-content: space-between;
        position:relative;
    }
    .bill-list_item:nth-child(2){
        background:url("../../assets/images/myexecute@2x.png") no-repeat;
        background-size:cover;
    }
    .bill-list_item:nth-child(3){
        background:url("../../assets/images/mycreate@2x.png") no-repeat;
        background-size:cover;
    }
    .bill-list_item:nth-child(4){
        background:url("../../assets/images/sendme@2x.png") no-repeat;
        background-size:cover;
    }
    .item-title{
        margin-left:0.7rem;
        margin-top:0.58rem;
        color:#333;
        font-size:15px;
    }
    .item-memo{
        margin-right:0.7rem;
        font-size:15px;
        margin-top:0.48rem;
    }
    .item-memo .memo-num{
        line-height:0.5rem;
        margin-right:0.1rem;
        font-size:0.50rem;
        /* font-family:HiraKakuStdN-W8; */
        /* font-weight:normal; */
        color:#608BF7;
		font-weight: bolder;
    }
    .unRead{
        position: absolute;
        width: 0.1rem;
        height: 0.1rem;
        border-radius: 0.1rem;
        background: #FF0000;
        left: 2rem;
        top: 0.6rem;
    }
	.menu{
		position: fixed;
		top:0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 101;
		background: #fff;
	}
	.content .tip{
		font-size: 20px;
		color: #fff;
		text-align: left;
		margin: 5vw 0 0 5vw;
		opacity: 0;
	}
	.content .title{
		font-size: 8vw;
		font-family: FZHLK--GBK1-0;
		color: #CFE7FF;
		text-align: right;
		margin: 3vw 5vw 0 0;
	}
	.top{
		display: flex;
		flex-direction: column;
		color: #FFFFFF;
		padding-left: 45%;
		justify-content: flex-start;
		align-items: center;
		text-align: left;
	}
	.top .img{
		display: flex;
		width: 100%;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.top .img img{
		display: inline-flex;
		width: 7vw;
		height: 7vw;
		border-radius: 50%;
		margin: 0;
	}
	.top .img .name{
		font-size: 3.7vw;
		display: inline-flex;
		line-height: 7vw;
		margin-left: 1vw;
	}
	.top .dep{
		width: 100%;
		text-align: left;
		font-size: 3.7vw;
	}
</style>
