<template>
    <div class="departCont">
        <Head :title="title" @back="backTo" :hasBorder="true" :sure="true" @sureReturn='sureReturn' v-if="isChecked!=-1"/>
        <Head :title="title" @back="backTo" :hasBorder="true" v-if="isChecked==-1"/>
        <main>
			<div class="depart-list" v-if='searchType=="dep"'>
			    <div class="list-item" v-for="(depart,index) in departList"  @click="selectDep(depart.id,depart.name)" >
					<van-cell :title="depart.name" is-link/>
			    </div>
				<div v-if="departList.length==0 && showTips" class="nodata">
				  <img src="../../assets/images/group3.png">
				  <p class="tips">没有找到目标哦～</p>
				</div>
			</div>
            <div class="depart-list" v-if='searchType=="per"'>
                <div class="list-item">
                    <p class="van-cell flex depart-one" v-for="(depart,index) in personList" @click="selectPer(depart.id,index)">
                        <span class="flexIn depart-user-name">
                            <img src="../../assets/images/head.png" alt="" class="headImg" v-if="!depart.avatar">
                            <img :src="depart.avatar" alt="" class="headImg" v-else>
						
                            {{depart.name}}
                        </span>
                        <span class="flexIn depart-user-title">工单接收人</span>
						<span class="flexIn checkTip" :class="[isChecked==index?'isCheckedTip':'']"></span>
                    </p>
                </div>
				<div v-if="personList.length==0 && showTips" class="nodata">
				  <img src="../../assets/images/group3.png">
				  <p class="tips">没有找到目标哦～</p>
				</div>
            </div>
        </main>
    </div>
</template>

<script>
    import Head from "@/components/head";
	import { Toast } from 'vant';
    export default {
        name: "select-execute-people",
		// props: ["workType","executor"],//工单类型id,执行人id
        components: {Head},
        data() {
            return {
                title:"选择执行人",
                searchValue:'',
				searchType:'dep',
                departList:[],//部门列表
				personList:[],//员工列表
				sureShow:false,//确认按钮的展示
				isChecked:-1,//选中的执行人
				departName:'',//选中的部门名称
				showTips:false,//
				workType:this.$route.query.workType,//工单类型id
				executor:this.$route.query.executor,//执行人id
            }
        },
		created() {
		this.getDepList();
		},
        methods: {
			//选择部门
			selectDep(id,name){
				this.searchType = 'per';
				this.departName = name;
				this.getPerList(id);
			},
			//选择执行人
			selectPer(id,index){
				if(this.isChecked==index){
					this.isChecked = -1;
				}else{
					this.isChecked=index;
				}
			},
			//点击确认
			sureReturn(){
				let execute = this.personList[this.isChecked];
				console.log(execute)
				localStorage.setItem('execute',JSON.stringify(execute));
				this.backTo();
			},
			backTo(){
				history.go(-1);
			},
            back(){ //弃用
				// this.departList = [];
				// this.personList = [];
				this.searchType = 'dep';
				this.searchValue = '';
				this.sureShow = false;
				this.isChecked = -1;
				this.departName = '';
				this.getDepList();
				this.$emit("back")
            },
			//获取部门列表
			getDepList(){
				var self = this;
				self.departList = [];
				let userId = localStorage.getItem('userId');
				let data={
					userId:parseInt(userId),
					type:self.workType
				}
				self.axios({
				    url:'/api/v1.0/selectexecutedepartment',
				    method:'post',
					data:data
				}).then(function (res) {
				    console.log(res);
					if(res.data.code=='200'){
						if (res.data.data && res.data.data.length>0) {
							self.departList = res.data.data;
						}
						if(self.departList.length==0){
							self.showTips = true;
						}
					}else{
						Toast(res.data.message);
					}
				})
			},
			//获取执行人列表
			getPerList(id){
				var self = this;
				self.personList = [];
				let userId = localStorage.getItem('userId');
				let data={
					userId:parseInt(userId),
					departmentId:id
				}
				console.log('self.executor',self.executor)
				self.axios({
				    url:'/api/v1.0/selectexecutor',
				    method:'post',
					data:data
				}).then(function (res){
				    console.log(res);
					if(res.data.code=='200'){
						if (res.data.data && res.data.data.length>0) {
							res.data.data.forEach((item,index)=>{
								console.log(parseInt(self.executor)+"===="+parseInt(item.id))
								if(parseInt(self.executor)==parseInt(item.id)){
									self.isChecked=index;
								}else{
									// self.isChecked=-1;
								}
								self.personList.push(item);
							})
						}
					}else{
						Toast(res.data.message);
					}
				})
			},
            onFocus(){

            }
        },
    }
</script>
<style>
	.van-search.search .van-cell{
		border-radius:4px;
		border:1px solid rgba(238,231,231,1);
	}
	.van-search.search>.van-cell>.van-cell__value>.van-field__body>.van-field__control{
		padding-left: 10px;
		border-left: 1px solid #EEF1F6;
	}
	.depart-list .van-cell{
		color: #3D3E43;
	}
</style>
<style scoped>
    .depart-list{
        position: relative;
        width: 100%;
        height: 100%;
		background: #fff;
    }
    .depart-list .van-cell{
		width: auto;
        padding:0.32rem  0;
		margin:  0 0.25rem;
        height:1.2rem;
        box-sizing: border-box;
		border-bottom: 1px solid #EEF1F6;
		align-items: center;
    }
	.depart-list .van-cell:not(:last-child)::after{
		border-bottom: none;
	}
    .list-item p{
        background:#fff;
        justify-content: space-between;
        font-size:0.3rem;
        margin:0;
    }

    .no-select{
        width:0.24rem;
        height:0.24rem;
        border-radius:0.12rem;
        border:1px solid #608BF7;
        display:inline-block;
        vertical-align: middle;
        margin-left:0.1rem;
    }
    .depart-title{
        font-size:0.32rem;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:#3D3E43;
    }
    .depart-one{
        font-size:0.3rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(61,62,67,1);
    }
    .checkTip{
        width: 0.24rem;
        height:0.24rem;
        display: inline-block;
        position: relative;
        right: 0.05rem;
        background: url('../../assets/images/radio_unselect@2x.png') no-repeat;
        background-size: cover;
    }
    .isCheckedTip{
        background: url('../../assets/images/radio_select@2x.png') no-repeat;
        background-size: cover;
    }
    .van-search{
        position: fixed;
        top: 54px;
        left: 0;
        width: 100%;
        z-index: 1;
        padding: 0.22rem 0.25rem;
    }
    .select-title{
        position: fixed;
        top: 2.1rem;
        left: 0;
        height:1.2rem;
        line-height: 0.76rem;
        width: 100%;
        z-index: 1;
    }
    main{
        width: 100%;
        height: 100%;
        /* padding-top: 54px; */
    }
	.mt16{
		margin-top: 1.06rem;
	}
    .departCont{
       overflow: hidden;
    }
    .headImg{
        width: 0.44rem;
        height: 0.44rem;
        border-radius:50%;
        vertical-align: middle;
        margin-right: 0.12rem;
    }
    .depart-name{
        font-size:0.32rem;
        font-family:PingFangSC-Regula   r;
        font-weight:400;
        color:rgba(96,139,247,1);
        margin-left:0.2rem;
    }
	.icon{
		width: 12px;
		height: 14px;
		margin-top: 5px;
		margin-right: 8px;
	}
	.depart-user-name{
		flex: 1;
	}
	.depart-user-title{
		color: #999CAA;
		font-size: 15px;
		padding-right: 8px;
	}
	.depart-list .van-cell:last-child{
		border-bottom: none;
	}
</style>
