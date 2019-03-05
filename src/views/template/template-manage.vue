<template>
    <div>
        <Head :title="title" @back="back"/>
        <main>
            <p class="template-title">已启用模版</p>
			<div class="list flex" v-if="!startinfo || startinfo.length==0">
				<div class="list-center flex">
					暂无已启用模板
				</div>
			</div>
            <div class="list flex" v-for="(item,index) in startinfo">
                <div class="list-left flex">
                    <!-- <img src="../../assets/images/finance_icon.png"/> -->
					<p v-if='index%5==0'><img src="../../assets/images/color1.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></p>
					<p v-if='index%5==1'><img src="../../assets/images/color2.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></p>
					<p v-if='index%5==2'><img src="../../assets/images/color3.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></p>
					<p v-if='index%5==3'><img src="../../assets/images/color4.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></p>
					<p v-if='index%5==4'><img src="../../assets/images/color5.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
                    <div class="list-memo flex">
                        <p>{{item.name}}</p>
                        <!-- <p>(系统默认)</p> -->
                    </div>
                </div>
                <div class="list-right">
                    <!-- <p class="active">停用</p> -->
					<van-switch
					  v-model="item.checked"
					  active-color="#07c160"
					  inactive-color="#f44"
                      size="20px"
                      @change="upstatus(item.id,item.checked,index)"
					/>
                </div>
            </div>
            <p class="template-title">已停用模版</p>
			<div class="list flex" v-if="!stopinfo || stopinfo.length==0">
				<div class="list-center flex">
					暂无停用模板
				</div>
			</div>
            <div class="list flex" v-for="(item,index) in stopinfo" >
                <div class="list-left flex">
                    <p v-if='index%5==0'><img src="../../assets/images/color1.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></p>
                    <p v-if='index%5==1'><img src="../../assets/images/color2.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></p>
                    <p v-if='index%5==2'><img src="../../assets/images/color3.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></p>
                    <p v-if='index%5==3'><img src="../../assets/images/color4.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></p>
                    <p v-if='index%5==4'><img src="../../assets/images/color5.png"/><img :src="item.url" class="img_icon" v-if="item.url"/></dt>
                    <div class="list-memo flex">
                        <p>{{item.name}}</p>
                        <!-- <p>(系统默认)</p> -->
                    </div>
                </div>
                <div class="list-right">
					<van-switch
					  v-model="item.checked"
					  active-color="#07c160"
					  inactive-color="#f44"
                      size="20px"
					  @change="upstatus(item.id,item.checked,index)"/>
                </div>
            </div>
            <p class="template-title">高级设置</p>
            <div class="edit flex">
                <img src="../../assets/images/edit_icon.png"/>
                <p @click="setWorker">设置工单模版</p>
            </div>
            <p class="memo">可根据业务需求设计个性化工单模板</p>
        </main>
    </div>
</template>

<script>
    import Head from "@/components/head";
	import {Toast} from "vant";
    export default {
        name: "template-manage",
        components: {Head},
        data() {
            return {
                title: "模版管理",
				startinfo:[],//启用的工单模版数据
				stopinfo:[],//工单模版停用的数据
            }
        },
        created() {
			this.getOrdertypes();
        },
        methods: {
            back() {
				this.$router.push({
					path:'/',
					query:{
						userId:localStorage.getItem('userId')
					}
				})
            	// history.go(-1);
            },
			upstatus(id,checked,index){
				let userId = localStorage.getItem('userId');
				var self = this;
				let status = 1;
				if(checked){
					status=2;
				}
				let data = {
					'id':parseInt(userId),
					'status':status,
					'typeid':parseInt(id),
				}
				self.axios({
				    url:'/api/v1.0/upstatus',
				    method:'post',
					data:data
				}).then(function (res) {
				    console.log(res);
					if(res.data.code=='200'){
 						self.getOrdertypes();
					}else{
						Toast(res.data.message);
						if(checked){
							self.stopinfo[index].checked = false;
						}else{
							self.startinfo[index].checked = true;

						}
					}
				})
			},
			getOrdertypes(){
				let userId = localStorage.getItem('userId');
			    var self = this;
				var data={
					'userId':parseInt(userId),
				}
			    self.axios({
			        url:'/api/v1.0/wotypelist',
			        method:'post',
					data:data
			    }).then(function (res) {
			        console.log(res);
					if(res.data.code=='200'){
						self.startinfo=[];
						self.stopinfo=[];
						if (res.data.data.playList) {
							res.data.data.playList.forEach(item=>{
								item.firstName = item.name.split("")[0];
								item.checked = true;
								self.startinfo.push(item)
							})
						}
						if (res.data.data.stopList) {
							res.data.data.stopList.forEach(item=>{
								item.firstName = item.name.split("")[0];
								item.checked = false;
								self.stopinfo.push(item)
							})
						}
					}
			    })
			},
			//高级设置
			setWorker(){
				this.$router.push({
					path:'TemplateNew'
				})
			}
        }
    }
</script>

<style scoped>
    main{
        height:calc(100vh - 54px);
        background:#fff !important;
		overflow-y: scroll;
    }
    .template-title{
        background:#EEEFF4;
        width:100%;
        height:0.8rem;
        line-height:0.8rem;
        color:#999CAA;
        font-size:16px;
        padding-left:0.32rem;
        text-align:left;
    }
    p{
        margin:0;
    }
    .list{
        justify-content: space-between;
        align-items: center;
        padding:5px 0.15rem;
        margin:0 0.25rem;
        background:#fff;
        border-bottom:1px solid #EEF1F6;
		height: 60px;
		width: auto;
		box-sizing: border-box;
    }
    main .list:last-child{
        border:none;
    }
    .list-left{
        justify-content:flex-start;
		position: relative;
    }
	.list-left>p>span{
		position: absolute;
		width: 0.81rem;
		height: 0.81rem;
		line-height: 0.81rem;
		top: 0;
		left: 0;
		text-align: center;
		display: block;
		z-index: 2;
		color: #fff;
		font-size: 0.5rem;
	}
    .list-left img{
        width:0.81rem;
        height:0.81rem;
        margin-right:0.1rem;
    }
	.list-left img.img_icon {
	    width: 0.39rem;
	    height: auto;
		position: absolute;
		top: 0.22rem;
		left: 0.21rem;
		margin-right:0;

	}
    .list-memo{
        justify-content: center;
        flex-direction: column;
    }
    .list-left .list-memo p:last-child{
        font-size:14px;
        color:#999CAA;
    }
    .list-left .list-memo p:first-child{
        font-size:14px;
        color:#373D46;
    }

    .list-right p{
        width:1.6rem;
        height:0.6rem;
        border-radius:0.3rem;
        background:#EEEEEE;
        color:#999CAA;
        font-size:14px;
        line-height:0.6rem;
    }
    .list-right .active{
        color:#fff;
        background: -webkit-linear-gradient(left top, #8EB1FF , #91C8FF); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(bottom right, #8EB1FF, #91C8FF); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(bottom right, #8EB1FF, #91C8FF); /* Firefox 3.6 - 15 */
        background: linear-gradient(to bottom right, #8EB1FF , #91C8FF); /* 标准的语法 */
    }
    .edit{
        margin:0.7rem 0.75rem;
        height:0.8rem;
        width:6rem;
        background:#fff;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0  5px 5px #F3F7FF;
        border-radius:0.1rem;
    }
    .edit img{
        width:0.37rem;
        height:0.4rem;
        margin-right:0.15rem;
    }
    .memo{
        font-size:12px;
        color:#999CAA;
        text-align:center;
        margin-top:0.24rem;
    }
	.list-center{
		flex-grow: 1;
		justify-content: center;
		font-size: 14px;
	}
	.edit p{
		font-size: 14px;
	}
</style>
