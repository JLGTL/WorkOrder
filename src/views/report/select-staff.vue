<template>
	<div class="backGrey mainpage">
		<Head title='选择成员' :sure="showSure" @sureReturn='sureReturn' :hasBorder="true"  @back="back"/>
		<div class="backGrey mat54 searchBox">
			<form action="javascript:return true">
			<van-search placeholder="请输入姓名/工号/拼音" v-model="value"  @search="searchPerson" :show-action='true' @focus="openStaffsBack" @cancel="closeStaffBack" :clearable='true' id="myBox" class="search">
				<template slot="left-icon">
				    <img src="../../assets/images/search_icon.png" class="icon"/>
				</template>
			</van-search>
			</form>
		</div>
		
		<div class="group backWhite">
			<!-- <div class="showStaffList flex" v-if="showStaffList.length>0"> -->
			<div class="showStaffList flex" v-if="showStaffList.length>0">
				<div class="showStaff" v-for="(item,index) in showStaffList">
					<i class="remove" @click="removeStaff(index)"></i>
					<img class="flexIn avatar" :src="item.avatar" v-if="item.avatar"/>
					<img class="flexIn avatar" src="../../assets/images/head.png" v-if="!item.avatar"/>
					<span class="flexIn">{{item.name}}</span>
				</div>
			</div>
			
			<div class="scrollBack" v-if="scrollList.length>0">
				<div class="scrollItem">
					<span v-for="(li,index) in scrollList" v-if="index!=scrollList.length-1" @click="loadMore2(li.id,li.name)" class="flex">
						<span class='flexin'>{{li.name}}></span>
					</span>
					<span v-for="(li,index) in scrollList" v-if="index==scrollList.length-1" class="notClick">{{li.name}}</span>
				</div>
			</div>
			<div :class="[showStaffList.length>0?'allscroll2':'allscroll']" v-if="scrollList.length>0">
				<div v-if="nodes.length==0 && staffs.length==0 && showNoData" class="nodata">
				  <img src="../../assets/images/group3.png"/>
				  <p class="tips">没有找到目标哦～</p>
				</div>
				<ul class="glist glist2" v-if="nodes.length>0">
					<li class="flex" v-for="item in nodes" @click="loadMore(item.id,item.name)" >
						<span class="flexIn name">{{item.name}}</span>
						<span class="flexIn"><van-icon name="arrow" /></span>

					</li>
				</ul>

				<ul class="glist glist2 staffslist" v-if="staffs.length>0">
					<li class="flex" v-for="(item,index) in staffs" @click="selectPersonComplete(index)">
						<img class="flexIn avatar" src="../../assets/images/head.png" v-if="!item.avatar"/>
						<img class="flexIn avatar" :src="item.avatar" v-if="item.avatar"/>
						<span class="flexIn name">{{item.name}}</span>
						<!-- <span :class="[item.isChecked?'flexIn selectperson selected':'flexIn selectperson']" ></span> -->
						<span :class="[selectedPersonIndex==index?'flexIn selectperson selected':'flexIn selectperson']" ></span>
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
					  <img class="flexIn img" src="../../assets/images/head.png" v-if="!item.avatar"/>
					  <img class="flexIn img" :src="item.avatar" v-if="item.avatar"/>
						<p class="flexIn searchLeft">
							<span class="flexIn name">{{item.name}}</span>
							<span class="flexIn staffNo">{{item.staffNo}}</span>
						</p>
						<p class="flexIn searchRight" v-if="item.node || item.positionName">
							<span class="flexIn dep" v-if="item.node.name">{{item.node.name}}</span>
							<span class="flexIn dep" v-if="item.positionName">{{item.positionName}}</span>
						</p>
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
				staffs:[],
				scrollList:[],
				selectedPersonIndex:'-1',
				list: [],
				loading: false,
				finished: false,
				page:1,
				staffsBack:false,
				noData:false,
				showStaffList:[],//已经选中的员工列表
				copyPeopleColums:[],//抄送人列表
				selectlist:'',//抄送人id列表
				showNoData:false,
				showSure:false,//显示确认按钮
				parentName:'',//
				parentId:'',
				
			}
		},
		created() {
			window.addEventListener("touchmove",this.myTouchMove)  // 监听滑动事件
			let self = this;
			let data3 = {
				uid:localStorage.getItem('userId')
			}
			self.axios({
			    url:'/api/v1.0/getdepartment',
			    method:'post',
				data:data3
			}).then(res => {
				console.log(res)
				if (res.data.code == 200) {
					self.nodes = [];
					self.staffs = [];
					if(res.data.data){
						self.parentName = res.data.data.name;
						self.parentId = res.data.data.id;
						let data = {
								name:'',
								id:''
							}
						// self.scrollList.push(data);
						self.loadMore(self.parentId,self.parentName);

					}
				}
			})
			if(this.$route.query.selectType && this.$route.query.selectType!='staff'|| (!this.$route.query.selectType)){
				localStorage.removeItem('depList');
				localStorage.removeItem('depIdList');
				localStorage.removeItem('showStaffList');
				localStorage.removeItem('showStaffIdList');
			}else{
				this.getLocalData();
			}
		},
		watch:{
// 			value:function () {
// 			  this.searchPerson();
// 			},
			showStaffList:{
				handler(newValue, oldValue) {
		　　　　　	if (newValue.length>0) {
						this.showSure = true;
					} else{
						this.showSure = false;
					}
		　　　　},
	　　　　	deep: true
			},
		},
		methods:{
			//获取 本地存储的值
			getLocalData(){
				let list = JSON.parse(localStorage.getItem('showStaffList'));
				console.log('[=====已选中的员工=======]')
				console.log(list)
				if (list) {
					this.showStaffList.push(list);
				}
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
			openStaffsBack(){
				this.staffsBack = true;
				if(this.value==''){
					this.list = [];
				}
			},
			closeStaffBack(){
				this.staffsBack = false;
				this.list = [];
				this.value='';
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
			back(){
				this.$router.push({
					path:'/reportpeople',
				})
			},
			//加载分页
			onLoad(){
				let self = this;
				let data = {
					search:self.value,
					pageNum:self.page,
					pageSize:20,
					pid:this.parentId
				}
				if(this.value){
				    console.log(self.value);
					self.axios({
						url:'/api/v1.0/getmember',
						method:'post',
						data:data
					}).then(res => {
					  console.log(res)
					  if (res.data.code == 200) {
						let newData = res.data.data;
						self.loading = false;
						if(self.page == 1){
						 self.list = [];
						 console.log(res.data);
						 console.log('del=======')
					   }
						console.log(self.list);
						self.page ++;
						if (newData){
						  newData.forEach(item=>{
							self.list.push(item)
						  });
						  if (newData.length < 20) {
							self.finished = true;
						  }
						}else{
						  self.finished = true;
						}
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
			closeStaffsBack(){
				if(this.value==''){
					this.staffsBack = false;
				}
			},
			//选择人员 点击右上角确定
			sureReturn(){
				let data ='';
				let data2 = '';
				this.showStaffList.forEach(item=>{
					let staInList ={};
					staInList.name = item.name;
					staInList.copyperson = item.copyperson;
					staInList.avatar = item.avatar;
					data = staInList;
					data2 = staInList.copyperson;
				})
				console.log("======")
				console.log(data)
				localStorage.setItem('showStaffList',JSON.stringify(data))
				localStorage.setItem('showStaffIdList',JSON.stringify(data2))
				this.$router.push({
					path:'/reportpeople',
					query:{
						type:'staff'
					}
				})
			},
			//选择员工(搜索)
			selectInlist(index){
				this.selectDepIndexInList = -2;
				this.showStaffList = [];
				let staInList ={};
				staInList.name = this.list[index].name;
				staInList.copyperson = this.list[index].id;
				staInList.avatar = this.list[index].avatar;
				this.showStaffList.push(staInList);
				this.staffsBack = false;
				this.list=[];
				this.staffs.forEach((item,index2)=>{
					if(item.id==staInList.copyperson){
						this.selectedPersonIndex = index2;
					}
				})
				return false;
				//以下是多选
				let hasThisPerson = false;
				this.showStaffList.forEach(item=>{
					if(parseInt(this.list[index].id)==parseInt(item.copyperson)){
						hasThisPerson = true;
					}
				})
				if(!hasThisPerson){
					let staInList ={};
					staInList.name = this.list[index].name;
					staInList.copyperson = this.list[index].id;
					staInList.avatar = this.list[index].avatar;
					staInList.type = 0;
					this.showStaffList.push(staInList);
					
					this.staffs.forEach(item=>{
						if(parseInt(item.id)==parseInt(staInList.copyperson)){
							item.isChecked = true;
						}
					})
				}
				this.value='';
				this.staffsBack = false;
			},
			//选中员工
			selectPersonComplete(index){
				this.closeStaffBack();
				this.selectedPersonIndex = index;
				let item = {
					copyperson:this.staffs[index].id,
					name:this.staffs[index].name,
					avatar:this.staffs[index].avatar,
				}
				this.showStaffList=[];
				this.showStaffList.push(item);
				return false;
				//以下是多选逻辑
				this.staffs[index].isChecked = !this.staffs[index].isChecked;
				if(this.staffs[index].isChecked){
					//选中
					let item = {
						copyperson:this.staffs[index].id,
						name:this.staffs[index].name,
						avatar:this.staffs[index].avatar,
						
					}
					this.showStaffList.push(item);
				}else{
					this.showStaffList.forEach((staff,index2)=>{
						if(staff.copyperson==this.staffs[index].id){
							this.showStaffList.splice(index2,1)
						}
					})
				}
				console.log("====showStaffList====")
				console.log(this.showStaffList)
			},
			//删除选中员工
			removeStaff(index){
				console.log(index)
				this.selectedPersonIndex = -1;
				
				this.showStaffList=[];
				return false;
				//以下是多选逻辑
				this.staffs.forEach(sta=>{
					if(sta.id==this.showStaffList[index].copyperson){
						sta.isChecked = false;
					}
				})
				this.$nextTick(function(){
					this.showStaffList.splice(index,1);
				})
			},
			onCancel(){
				this.staffsBack = false;
			},
			//点击导航栏 的加载
			loadMore2(id,name){
				if(!id){
					this.showNoData = false;
					this.scrollList = [];
					this.loadMore()
				}else{
					this.selectedPersonIndex = '-1';
					console.log('self.scrollList')
					console.log(this.scrollList)
					let newlist = this.scrollList;
					this.scrollList.forEach((li,index)=>{
						if(li.id==id){
							newlist = this.scrollList.slice(0,index+1)
						}
					})
					this.scrollList = newlist;
					console.log(this.scrollList)
					this.loadMore(id,name,'noadd');
				}
			},
			//加载
			loadMore(id,name,type){
				let self =this;
// 				if(!id){
// 					
// 					let data3 = {
// 						uid:localStorage.getItem('userId')
// 					}
// 					self.axios({
// 					    url:'/api/v1.0/getdepartment',
// 					    method:'post',
// 						data:data3
// 					}).then(res => {
// 						console.log(res)
// 						if (res.data.code == 200) {
// 							self.nodes = [];
// 							self.staffs = [];
// 							if(res.data.data){
// 								self.nodes = res.data.data.list;
// 								let depName = res.data.data.name || '当前部门';
// 								let data = {
// 									name:'',
// 									id:''
// 								}
// 								if(!id){
// 									self.parentName = res.data.data.name;
// 									self.parentId = res.data.data.id;
// 									data.name = res.data.data.name;
// 								
// 								}
// 								this.scrollList.push(data);
// 							}
// 						}
// 					})
// 				}else{
					let data2 = {
						id:id
					};
					self.axios({
					    url:'/api/v1.0/getchilddepartments',
					    method:'post',
						data:data2
					}).then(res => {
						console.log(res)
						if (res.data.code == 200) {
							self.nodes = [];
							self.staffs = [];
							if(res.data.data.departments){
								self.nodes = res.data.data.departments;
							}
							if(res.data.data.users){
								res.data.data.users.forEach((item,index)=>{
									item.isChecked = false;
									self.showStaffList.forEach(sta=>{
										if(parseInt(item.id)==parseInt(sta.copyperson)){
											item.isChecked = true;
										}
									})
									self.staffs.push(item);
								})
							}
							if(self.staffs.length==0&&self.nodes.length==0){
								this.showNoData = true;
							}else{
								this.showNoData = false;
							}
							if(type=='noadd'){
							}else{
								let item = {
									name:name,
									id:id
								}
								self.scrollList.push(item);
							}
						} else {
							Toast(res.data.message);
						}
					})
				// }
			}
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
/* .staffslist li{
	margin-left: 12px;
} */
.glist li .avatar,.showStaff .avatar{
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin-right: 10px;
	box-shadow:0px 0px 6px 0px rgba(0,0,0,0.08);

}
.glist li .avatar.avatar2{
	width: 20px;
	height: 20px;
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
	flex: 1;
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
	background: #FFFFFF;
	overflow-y: scroll;
	top: 224px;
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
</style>
