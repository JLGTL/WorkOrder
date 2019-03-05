<template>
    <div>
        <Head :title="title" @back="back" :hasBorder="true"/>
        <div class="bg"></div>
        <main>
            <ul class="info-list">
                <li class="info-list_li" v-for="item in comments" @click="toDetail(item.woId)">
                    <div class="info-list_li_tp flex">
                        <div class="list_li_left">
                            <img src="../assets/images/head.png" v-if="!item.avatar"/>
                            <img :src="item.avatar" v-if="item.avatar"/>

                        </div>
                        <div class="list_li_right">
                            <p><span class="name">{{item.fromName}}</span><span class="date">{{item.createTime | formatCreateTime}}</span></p>
                            <p class="color-gray"><span>来源&ensp;:&ensp;</span><i>{{item.name}}</i>|<i>{{item.title}}</i></p>
                        </div>
                    </div>
                    <div class="info-list_li_btm">
                        <p >{{item.content}}</p>
                    </div>
                </li>
            </ul>
			<div class="nodata" v-if="comments.length==0">
				<img src="../assets/images/group9.png">
				<p class="tips">没有新的消息</p>
			</div>
        </main>
    </div>

</template>
<script>
    import Head from '@/components/head';
	import { parseTime} from "@/utils/index";
    export default {
        components: {Head},
        props: [],
        data () {
            return {
                title: '留言',
				comments:[],
            }
        },
		created() {
			this.getCommonts()
		},
		filters:{
			formatCreateTime(data){
				return parseTime(data,"{m}月{d}日 {h}:{i}");
			}
		},
        methods:{
            back(){
                this.$router.push({
                	path:'/',
                	query:{
                		userId:localStorage.getItem('userId'),
						menuOpen:'0'
                	}
                })
            },
			toDetail(id){
				var self = this;
				let userId = this.$route.query.userId;
				 var data={
				     userId:userId,
					 id:id
				 }
				 self.axios({
				    url:'/api/v1.0/getusertypeforwo',
				    method:'post',
				    data:data
				 }).then(function(res){
				    console.log(res);
				    if(res.data.code=='200'){
						// self.comments = res.data.data;
						if(res.data.data.isCreator=='1'){
							//创建人
							self.$router.push({
								path:'/createdetails',
								query:{
									orderId:id
								}
							})
						}else if(res.data.data.isExecutor=='1'){
							//执行人
							self.$router.push({
								path:'/orderdetails',
								query:{
									orderId:id
								}
							})
						}else if(res.data.data.isCopyperson=='1'){
							//抄送人
							self.$router.push({
								path:'/mycopyOrder',
								query:{
									orderId:id
								}
							})
						}
					}
				})
			},
			getCommonts(){
				var self = this;
				let userId = this.$route.query.userId;
				 var data={
				     userId:userId,
				 }
				 self.axios({
				    url:'/api/v1.0/showcomments',
				    method:'post',
				    data:data
				 }).then(function(res){
				    console.log(res);
				    if(res.data.code=='200'){
						self.comments = res.data.data;
					}
				})
			}
        }
    }
</script>

<style scoped>
    .bg {
        height: 0.2rem;
        width: 100%;
    }

    main {
        /*border-top:10px solid #f2f2f2;border-top:10px solid #f2f2f2;*/
        height: 100%;
        padding: 0 0.26rem;
        box-sizing: border-box;
    }

    .info-list {
        overflow: hidden;
        border-radius: 0.1rem;
        background: #fff;
        padding: 0 0.09rem;
        width: 100%;
        box-sizing: border-box;
    }
    .info-list .info-list_li{
        padding-bottom: 0.2rem;
        border-bottom:1px solid #DADCE5;
    }
    .info-list .info-list_li:last-child{
        border-bottom:none;
    }
     .info-list_li_tp{
        justify-content: space-between;
        position: relative;
    }
    .info-list .info-list_li  .info-list_li_btm{
        color:#3D3E43;
        font-size:14px;
        text-align:left;
        padding-left:0.14rem;
        margin-top:0.06rem;
        margin-bottom: 0.1rem;
    }
    .info-list .info-list_li:after {
        content: "";
        display: block;
        position: absolute;
        left: 0.51rem;
        right: 0.51rem;
        bottom: 0;
        height: 1px;
        background: #EEF1F6;
        z-index: 1;
    }

    .info-list .info-list_li:last-child:after {
        background: #fff;
    }

    .info-list .info-list_li .list_li_left img {
        width: 0.91rem;
        height: 0.91rem;
        margin: 0.22rem 0.14rem 0 0.1rem;
        display: inline-block;
        border-radius: 50%;
    }

    .info-list .info-list_li:first-child .list_li_left img {
        margin: 0.22rem 0.14rem  0 0.1rem;
    }

    .info-list .info-list_li .list_li_right {
        flex-grow: 1;
        justify-content: flex-start;
        flex-direction: column;
        line-height: 0.4rem;
        font-size: 14px;
        text-align: left;
    }

    .info-list .info-list_li .list_li_right p {
        margin: 0;
    }

    .info-list .info-list_li .list_li_right p:nth-child(1) {
        display: flex;
        justify-content: space-between;
    }

    .info-list .info-list_li .list_li_right p:nth-child(1) .name {
        color: #333;
        font-size: 0.3rem;
        margin-top: 0.3rem;
        font-weight:bold;
        line-height: 0.4rem;
    }

    .info-list .info-list_li .list_li_right p:nth-child(1) .date {
        color: #999CAA;
        margin-top: 0.28rem;
        font-size: 0.24rem;
        margin-right: 0.09rem;
        line-height: 0.23rem;
    }

    .info-list .info-list_li:first-child .list_li_right p:nth-child(1) .date {
        margin-top: 0.28rem;
    }

    .info-list .info-list_li .list_li_right p:nth-child(2) {
        color: #999CAA;
        font-size: 12px;
        margin-top: 0.05rem;
    }
    .info-list .info-list_li .list_li_right p:nth-child(3) {
        color: #373D46;
        font-size: 14px;
        margin-top: 5px;
    }

    .info-list .info-list_li .list_li_right p:nth-child(3) i:after {
        content: "|";
        display: inline-block;
        padding: 0 5px;
    }

    .info-list .info-list_li .list_li_right p:nth-child(3) i:last-child:after {
        content: "";
        display: inline-block;
        padding: 0;
    }
</style>
