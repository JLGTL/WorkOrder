<template>
	<div class="backGrey mainpage">
		<Head title='选择部门' :sure="showSure" @sureReturn='sureReturn' :hasBorder="true"  @back="back"/>
		<div class="backGrey mat54 searchBox">
			<form action="javascript:return true">
			<van-search placeholder="请输入部门名称" v-model="value" :clearable='true' @search="searchPerson"  :show-action='true' @focus="openStaffsBack" @cancel="closeStaffBack" id="myBox" class="search">
				<template slot="left-icon">
				    <img src="../../assets/images/search_icon.png" class="icon"/>
				</template>
			</van-search>
			</form>
		</div>

		<div class="group backWhite">
			<div class="scrollBack">
				<div class="scrollItem" v-if="scrollList.length>0">
					<span v-for="(li,index) in scrollList" v-if="index!=scrollList.length-1" @click="loadMore2(li.id,li.name)" class="flex">
						<span class='flexin'>{{li.name}}></span>
					</span>
					<span v-for="(li,index) in scrollList" class="notClick" v-if="index==scrollList.length-1">{{li.name}}</span>
				</div>
			</div>


			<!-- <div class="allscroll2" v-if="scrollList.length>0"> -->
			<div class="allscroll2">
				<div v-if="nodes.length==0 & showNoData" class="nodata">
				  <img src="../../assets/images/group3.png"/>
				  <p class="tips">没有找到目标哦～</p>
				</div>
				<ul class="glist glist2" v-if="nodes.length!=0">
					<li class="flex">
						<span :class="[allChecked?'flexIn selectperson selected':'flexIn selectperson']" @click="allChecked = !allChecked"></span>
						<span class="flexIn name">全选</span>
					</li>
				</ul>
				<ul class="glist" v-if="nodes.length>0">
					<li class="flex" v-for="(item,index) in nodes">
						<span :class="[selectDepIndex==index?'flexIn selectperson selected':'flexIn selectperson']" @click="selectDep(item.id,index)"></span>
						<span class="flexIn name">{{item.name}}</span>
						<span class="flexIn"><van-icon name="arrow"  @click="loadMore2(item.id,item.name,selectDepIndex==index)" /></span>
					</li>
				</ul>
			</div>
		</div>
		<div class="staffsBack" v-if="staffsBack">
			<van-list
			  v-model="loading"
			  :finished="finished"
			  finished-text="没有更多了"
			  @load="onLoad"
			  v-if="value && !noData"
			  :immediate-check="false"
			>
			  <van-cell v-for="(item,index) in list" @click="selectInlist(index)" :key="item.id">
				  <div slot='title' class="flex searchRes">
						<p class="flexIn searchLeft">
							<span class="flexIn name">{{item.name}}</span>
						</p>
						<p class="flexIn searchRight">
							<span :class="[selectDepIndexInList==index?'flexIn selectperson selected':'flexIn selectperson']"></span>
						</p>
						<!-- <p class="flexIn searchRight" v-if="item.node || item.positionName">
							<span class="flexIn dep" v-if="item.node.name">{{item.node.name}}</span>
							<span class="flexIn dep" v-if="item.positionName">{{item.positionName}}</span>
						</p> -->
				  </div>
			  </van-cell>
			</van-list>

			<div v-if="noData" class="nodata">
				<img src="../../assets/images/group3.png"/>
				<p class="tips">没有找到目标哦～</p>
			</div>

		</div>
	</div>
</template>

<script>
	import Head from "@/components/head";
	import { Toast,Dialog } from 'vant';
	export default {
		name: 'addPerson',
		components: {
			Head
		},
		data() {
			return {
				value:'',
				nodes:[],
				scrollList:[],
				list: [],
				loading: false,
				finished: false,
				page:1,
				staffsBack:false,
				noData:false,
				showStaffList:[],//已经选中的部门
				selectDepIndex:-1,//选中的部门index
				selectDepIndex1:-1,
				showNoData:false,
				pid:'',// (首次不用传)部门id
				allChecked:false,
				showSure:false,//确定按钮
				returnList:'',//返回给上一页的值
				parentName:'',
				parentId:'',
				curPid:'',//当前列表的父id
				selectDepIndexInList:-1,//搜索列表中选中的部门index
			}
		},
		created() {
			this.loadMore('','');
			window.addEventListener("touchmove",this.myTouchMove)  // 监听滑动事件
		},
		watch:{
// 			value:function () {
// 			  this.searchPerson();
// 			},
			selectDepIndex(newval,old){
				if(newval==-1){
					this.showStaffList = [];
					if(!this.allChecked){
						this.showSure = false;
					}
				}else{
					this.showSure = true;

				}
			},
			allChecked(newval,old){
				if (newval) {
					console.log("全选")
					this.nodes.forEach(item=>{
						let it = {};
						it.name = item.name;
						it.id = item.id;
						this.showStaffList.push(it)
					})
					this.selectDepIndex = -1;
					this.showSure = true;
				}else{
					if(this.selectDepIndex==-1){
						this.showSure = false;
					}else{
						console.log(222)
					}
				}
			}
		},
		methods:{
			openStaffsBack(){
				this.staffsBack = true;
				this.showSure = false;
				if(this.value==''){
					this.list = [];
				}
			},
			closeStaffBack(){
				this.staffsBack = false;
				this.list = [];
				this.value='';
			},
			// 滑动关闭键盘
			myTouchMove: function (evt){
				console.log(document.hasFocus)
				if(document.hasFocus){
				  const inputId = document.getElementById('myBox')  // 获取ID
				  inputId.blur()  // input失焦
				  // document.activeElement.blur();   //  关闭键盘
				}
			},
			//模糊搜索
			searchPerson(){
				this.loading = true;
				this.list = [];
				console.log(this.list);
				console.log(this.value)
				let self = this;
				if(this.value!=''){
					this.loading = true;
					self.finished = false;
					this.page=1;
					this.onLoad();
				}
			},
			selectInlist(index){
				this.selectDepIndexInList = index;
				this.showSure = true;
			},
			back(){
				history.go(-1);
			},
// 			closeBack(){
// 				if(this.value==''){
// 					this.staffsBack = false;
// 				}
// 			},
// 			openBack(){
// 				this.staffsBack = true;
// 				this.showSure = false;
// 			},
			//选择某个部门
			selectDep(id,index){
				this.selectDepIndex = index;
				this.allChecked = false;
				let it = {};
				it.name = this.nodes[index].name;
				it.id = this.nodes[index].id;
				this.showStaffList=[];
				this.showStaffList.push(it);

			},
			//加载分页
			onLoad(){
				let self = this;
				self.selectDepIndexInList = -1;
				self.allChecked = false;
				let data = {
					pid:self.curPid,
					uid:localStorage.getItem('userId'),
					search:self.value
				};
				if(this.value){
				    console.log(self.value);
					self.axios({
						url:'/api/v1.0/getdepartment',
						method:'post',
						data:data
					}).then(res => {
					  console.log(res)
					  // return false;

					  if (res.data.code == 200) {
						let newData = res.data.data.list;
						self.loading = false;
						self.list = newData;
// 						if(self.page == 1){
// 						 self.list = [];
// 						 console.log(res.data);
// 						 console.log('del=======')
// 					   }
						// console.log(self.list);
						// self.page ++;
						self.showSure = false;
						if (self.selectDepIndex!=-1){
						  self.list.forEach((item,index)=>{
							 if(item.id==self.selectDepIndex){
								 self.selectDepIndexInList = index;
								 self.showSure = true;
							 }
						  });
						}
						self.finished = true;
						if(self.list.length==0){
							self.noData = true;
						}else{
							self.noData = false;
						}
						console.log(self.list);
					  } else {
					  }
					})
				}
			},
			//选择人 点击右上角确定
			sureReturn(){
				this.returnList = '';
				let returnIdList = '';
				let isall = 0;
				localStorage.removeItem('depListAll')
				if(this.allChecked){//父节点
					let it = {};
					it.id = this.scrollList[this.scrollList.length-1].id;
					it.name = this.scrollList[this.scrollList.length-1].name;
					this.returnList= it;
					returnIdList=it.id;
					if(this.scrollList.length==1){
						isall = 1;
						localStorage.setItem('depListAll',isall)
					}
				}else if(!this.staffsBack){
					let it = {};
					it.id = this.nodes[this.selectDepIndex].id;
					if(it.id==''){
						it.id = this.pid;
					}
					it.name = this.nodes[this.selectDepIndex].name;
					this.returnList = it;
					returnIdList=it.id;
				}
				if(this.staffsBack && this.selectDepIndexInList!=-1){
					let it = {};
					this.returnList = [];
					returnIdList = '';
					it.id = this.list[this.selectDepIndexInList].id;
					it.name = this.list[this.selectDepIndexInList].name;
					this.returnList = it;
					returnIdList=it.id;
				}
				localStorage.setItem('depList',JSON.stringify(this.returnList));
				localStorage.setItem('depIdList',returnIdList);
				this.$router.push({
					path:'/reportpeople',
					query:{
						type:"dep",
					}
				})
			},
			//加载
			loadMore(id,name,type,isAllcheck){
				let self =this;
				self.curPid = id;
				let data2 = {
					pid:id,
					uid:localStorage.getItem('userId')
				};
				self.axios({
					url:'/api/v1.0/getdepartment',
					method:'post',
					data:data2
				}).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						self.nodes = [];
						let selectList = [];
						if(self.$route.query.selectType && self.$route.query.selectType!='dep'|| (!self.$route.query.selectType)){
							localStorage.removeItem('depList');
							localStorage.removeItem('showStaffList');
							localStorage.removeItem('showStaffIdList');
						}else{
							selectList = JSON.parse(localStorage.getItem('depList'));
							console.log('selectList')
						}
						if(id!=''){
							self.showStaffList = [];
							self.allChecked = false;
							self.selectDepIndex = -1;
						}
						console.log(selectList)
						if(res.data.data && res.data.data.list){
							res.data.data.list.forEach((item,index1)=>{
								// console.log(item.id+'===='+selectList.id)
								if(type!='noadd' && localStorage.getItem('depListAll')=='1'){
									self.selectDepIndex = -1;
									self.selectDepIndexInList = -1;
									self.allChecked = true;

								}else if(selectList && parseInt(item.id)==parseInt(selectList.id)){
									self.selectDepIndex = index1;
								}
								let it = {};
								it.name = item.name;
								it.id = item.id;
								self.nodes.push(it)
							})
							if(isAllcheck){
								self.selectDepIndexInList = -1;
								self.allChecked = true;
							}
						}
						let item = {
							name:name,
							id:id
						}

						let canAdd = true;
						self.scrollList.forEach(it=>{
							if(it.id == item.id){
								canAdd = false;
							}
						})
						if(canAdd){
							self.scrollList.push(item);
						}
						if(!id){
							self.parentName = res.data.data.name;
							self.parentId = res.data.data.id;
							item.name = res.data.data.name;
							self.scrollList[0].id=res.data.data.id;
						}
						if(self.nodes.length==0){
							self.showNoData = true;
						}
					} else {
						Toast(res.data.message);
					}
				})
			},
			onCancel(){
				this.staffsBack = false;
			},
			//点击导航栏 的加载
			loadMore2(id,name,isAllcheck){
				console.log('isAllcheck=====',isAllcheck)
				let newlist = this.scrollList;
				this.scrollList.forEach((li,index)=>{
					if(li.id==id){
						newlist = this.scrollList.slice(0,index+1)
					}
				})
				this.scrollList = newlist;
				this.loadMore(id,name,'noadd',isAllcheck);
			},
		}
	}
</script>

<style scoped>
.title{
	justify-content: space-between;
	align-items: center;
	height: 60px;
	font-size: 16px;
	color: #3D3E43;
	padding-left: 20px;
	position: relative;
	padding-right: 13px;
}

.groupname{
	flex-grow: 1;
text-align: left;
}
.title .van-icon{
	color: #979797;
}
.backWhite{
	background: #fff;
}
.mart10{
	margin-top: 10px;
}
.backGrey{
	background: #F6F7FB;
}
.backGrey .van-search{
	background: #F6F7FB!important;
	padding: 0.22rem 0.25rem;

}
.backGrey .van-search .van-cell{
	border-color: #EEE7E7;
}
.van-popup{
	background: #F6F7FB;
}
.all{
	height: 40px;
	align-items: center;
	padding-left: 25px;
	font-size: 15px;
	color: #3D3E43;
}
.all .select{
	width:12px;
	height:12px;
	border:1px solid rgba(96,139,247,1);
	border-radius: 100%;
	margin-right: 12px;
}
.select.selected{
	background: rgba(96,139,247,1);
	border:2px solid #D3DDF9;
	width: 10px;
	height: 10px;
}
.glist{
	line-height: 60px;
	background: #fff;
}
.glist li:last-child{
	border: none;
}
.glist2 li:last-child{
	border-bottom: 1px solid #EEF1F6;
}
.glist li{
	border-bottom: 1px solid #EEF1F6;
	margin-left: 25px;
	margin-right: 12px;
	align-items: center;
	height: 60px;

}
.glist1 li{
	margin-left: 65px;
}
.glist li .avatar,.showStaff .avatar{
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin-right: 10px;
	box-shadow:0px 0px 6px 0px rgba(0,0,0,0.08);

}
.glist li .avatar.avatar2{
	width: 25px;
	height: 25px;
	border-radius: 50%;
	margin-right: 10px;
	box-shadow:none;

}
.glist li .name{
	font-size: 15px;
	color: #3D3E43;
	flex-grow: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	height: 60px;
	display: block;
	white-space: nowrap;
	text-align: left;
}
.glist li .select1{
	width:12px;
	height:12px;
	border:1px solid rgba(96,139,247,1);
	border-radius: 50%;
}
.glist li .select1.selected{
	background: rgba(96,139,247,1);
	border:2px solid #D3DDF9;
	width: 10px;
	height: 10px;
}
.bottombtn{
	position: fixed;
	bottom:48px;
	box-sizing: border-box;
	padding: 0 60px;
    width: 100%;
}
.mainpage{
	/* min-height: calc(100% - 54px); */
	/* min-height: 100%;
	max-height: 100%;
	overflow-y: scroll; */
	position: fixed;
	top: 0;
	bottom: 0;
	overflow-y:scroll ;
	width: 100%;
}
.cancel{
	position: fixed;
	color: #9E9EA1;
	font-size: 14px;
	left: 15px;
	top: 0;
	z-index: 100;
	line-height: 54px;
	background: #fff;
}
.scrollBack{
	width: 100%;
	overflow: hidden;
	overflow-x: scroll;
}
.scrollItem{
	font-size: 14px;
	border-bottom: 10px solid #F6F7FB;
	text-align: left;
	padding:0 18px;
	line-height: 45px;
	height: 45px;
	display: -webkit-box;
	overflow-x: scroll;
	-webkit-overflow-scrolling:touch;
	white-space: nowrap;

}
.scrollItem span{
	color: #4A88FB;
	height: 45px;
	white-space: nowrap;
	line-height: 45px;
	display: block;

}
.scrollItem span .van-icon{
	line-height: 45px;
}
.scrollItem span.notClick{
	color: #3D3E43;
	height: 45px;
	white-space: nowrap;
	line-height: 45px;
	display: block;
}
.selectperson{
	width:12px;
	height:12px;
	background: url(../../assets/images/radio_unselect@2x.png) 0 0 no-repeat;
	background-size: 100% 100%;
	/* border-radius: 100%; */
	margin-right: 12px;
}
.selectperson.selected{
	/* background: rgba(96,139,247,1);
	border:2px solid #D3DDF9; */
	/* width: 10px;
	height: 10px; */
	background: url(../../assets/images/radio_select@2x.png) 0 0 no-repeat;
	background-size: 100% 100%;
}
.staffsBack{
	position: fixed;
	background: #fff;
	width: 100%;
	top: 104px;
	bottom: 0;
	overflow-y:scroll;
}
.searchRes{
	height: 60px;
	justify-content: flex-start;
	align-items: center;
	margin: 0 15px;
}
.searchRes .img{
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin-right: 10px;
	box-shadow:0px 0px 6px 0px rgba(0,0,0,0.08);

}
.searchRes .name{
	font-size: 15px;
    color: #3D3E43;
	font-weight: 500;

}
.searchRes .dep{
	font-size: 13px;
    color: #3D3E43;

}
.searchRes .staffNo{
	font-size: 13px;
    color: #3D3E43;

}
.searchLeft{
	flex-direction: column;
	flex: 1;
	text-align: left;
}
.searchRight{
	flex-direction: column;
	/* flex: 1; */
}
.searchRight span{
	justify-content: flex-end;
}
.searchBox{
	position: fixed;
	top: 0;
	width: 100%;
}
.group{
	position: fixed;
	width: 100%;
	top: 104px;
	background: #fff;
}
.allscroll{
	position: fixed;
	width: 100%;
	top: 154px;
	bottom: 0;
	background: #FFFFFF;
	overflow-y: scroll;
}
.allscroll2{
	position: fixed;
	width: 100%;
	bottom: 0;
	overflow-y: scroll;
	top: 155px;
}
.allscroll .nodata{
	margin-top: 40px;
}
.icon{
	width: 12px;
	height: 14px;
	margin-top: 5px;
	margin-right: 8px;
}
.showStaff{
	position: relative;
	display: inline-flex;
	display: -webkit-inline-flex;
	justify-content: flex-start;
	align-items: center;
	margin-right: 5px;
	padding-left: 5px;
}
.showStaff img{
	width: 30px;
	height: 30px;
	border-radius: 100%;
}
.showStaff span{
	min-width: 60px;
}
.showStaff .remove{
	position: absolute;
	left: 4px;
	top: 8px;
	background: url(../../assets/images/delete.png) 0 0 no-repeat;
	background-size: 100% 100%;
	width: 10px;
	height: 10px;
}
.showStaffList{
	height: 60px;
	width: 100%;
	box-sizing: border-box;
	padding: 0 18px;
	font-size: 14px;
	border-bottom: 10px solid #F6F7FB;
	overflow: hidden;
	overflow-x: scroll;
}
.depart-list .van-cell:last-child{
	border-bottom: none;
}
</style>
