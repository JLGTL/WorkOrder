<template>
    <div class="create">
        <Head :title="title" @back="back" :save="true" :isBack="false" :hasBorder="true" @saveBill="saveBill('save')"/>
        <main>
            <van-field placeholder="请填写标题" v-model="titleIn" label="标题" class="input_cell input_cell1">
                <template slot="left-icon">
                    <img src="../../assets/images/title_icon.png" class="titleIcon icon"/>
                </template>
            </van-field>
           <!-- <van-field label="重要程度" is-link :value="level" @click="pickLevel" class="importantLevel input_cell">
                <template slot="left-icon">
                    <img src="../../assets/images/important_level_icon.png" class="levelIcon icon"/>
                </template>
            </van-field> -->
			<van-cell :value="level" @click="pickLevel" is-link icon="location-o" class="importantLevel input_cell">
				<template slot="title">
					<span class="custom-text">重要程度</span>
				</template>
			</van-cell>
            <div class="time flex">
                <div @click="show1 = !show1">
                    <p class="time-label">开始时间</p>
                    <p class="time-date">{{startDate}}</p>
                    <p class="time-time">{{startTime}}</p>
                </div>
                <p></p>
                <div @click="show2 = !show2">
                    <p class="time-label">截止时间</p>
                    <p class="time-date" v-if="end">{{endDate}}</p>
                    <p class="time-time" v-if="end">{{endTime}}</p>
                </div>
            </div>
            <div class="work">
                <van-cell title="工单描述" class="afternone flex input_cell">
                    <template slot="icon">
                        <img src="../../assets/images/describe_icon.png" class="describeIcon"/>
                    </template>
                </van-cell>
                <van-cell>
                    <div class="workDescribe">
                        <div class="workDescribe-inner">
                            <textarea placeholder="请填写任务描述" v-model='description' maxlength='500'></textarea>
                            <span>{{inputNum}}/500</span>
                        </div>
                    </div>
                </van-cell>
                <!-- <van-cell class="afternone flex input_cell"> -->
                <van-cell class="afternone flex input_cell" @click="pickFiletype()">
                    <template slot="title">
                        <span class="custom-text">上传附件</span>
                        <!-- <i class="gray">最多添加6张照片，10M以内</i> -->
                    </template>
                    <template slot="icon">
                        <img src="../../assets/images/upload_icon.png" class="icon"/>
                    </template>
					<i class="add"></i>
                </van-cell>
               <van-cell class="pic_cell">
                    <ul class="upload-list flex input_cell">
                        <li class="upload-list-item" v-for="(item,index) in fileImg">
                            <img :src="item.content" alt="" v-if="item.type=='pic'" @click="seeImg(index,'upload')"/>
                            <img src="../../assets/images/面授.png" alt="" v-if="item.type=='video'" @click="seeVideo(item.content)"/>
							<i class="delPic" @click="delPicture(index)"></i>
                        </li>
                        <li class="upload-list-item" v-for="(item,index) in oldfileImg">
                            <img v-lazy="item.url" alt="" v-if="item.type=='1'" @click="seeImg(index,'old')"/>
                            <img src="../../assets/images/面授.png" alt="" v-if="item.type=='2'" @click="seeVideo(item.url)"/>
							<i class="delPic" @click="delOldPicture(item.id,index)"></i>
                        </li>
                    </ul>
                </van-cell>
            </div>
            <div class="operatePeople">
                <div class="copyPeople flex" @click="pickExecutePeople">
                    <img src="../../assets/images/dispatch_icon.png" class="icon"/>
                    <span class="">执行人</span>
                    <p class="dispathPeople flex gray" v-if="executePeople">{{executePeople}}</p>
                    <p class="dispathPeople flex gray" v-else>无执行人</p>
                    <van-icon name="arrow"/>
                </div>
                <div class="copyPeople flex noborder" @click="pickCopyPeople">
                    <img src="../../assets/images/share_icon.png" class="icon"/>
                    <span class="">抄送人</span>
                    <p class="dispathPeople flex gray"><img src="../../assets/images/head.png"/>{{copyPeopleColums | getLength}}人</p>
                    <van-icon name="arrow"/>
                </div>
            </div>
            <p class="billNotice gray">抄送人可以时刻监督任务进度，直属领导为必需抄送人</p>
            <div class="leaveWord" v-if="refuseReason">
                <h2 class="leaveWord-title flex">
                    <span class="refuseTip"><img src="../../assets/images/refusenote@2x.png" alt="">拒绝说明</span>
                </h2>
                <ul class="leaveWord-list">
                    <li class="leaveWord-list_li flex">
                        <div class="list_li_left">
                            <img src="../../assets/images/head.png" />
                        </div>
                        <div class="list_li_right flex">
                            <p><span class="name">{{executePeople}}</span></p>
                            <p><span class="date">{{refuseTime}}</span></p>
                        </div>
                    </li>
                    <p class="refuse_detail">{{returnDesc}}</p>
                </ul>
            </div>
            <!--<div class="btn-back submitBtn">-->
                <!--<van-button round type="infoRound" @click="saveBill('submit')" size="large">提交</van-button>-->
            <!--</div>-->
        </main>
        <van-popup v-model="showLevel" position="bottom" :overlay="true" >
            <van-picker
				show-toolbar
				title="重要程度"
			    :columns="levelColums"
				@confirm="confirmLevel"
                @cacncel="cancelLevel"
			/>
        </van-popup>
        <!--选择附件类型-->
        <van-popup v-model="showFiletype" position="bottom" :overlay="true" >
            <ul class="fileType">
                <li @click="confirmFiletype('0')" v-if="picLength<9">
                	<!-- <van-uploader :after-read="onReadPic" :oversize='tips' accept="image/*" :max-size='fileSize'>
                	   图片
                	</van-uploader> -->
                	图片
                	<input type="file" accept="image/*" :max-size='fileSize' @change="onReadPic1" ref='img'/>

                	<i></i>
                </li>
                <li @click="confirmFiletype1('0')" v-if="picLength>=9">
                	   图片
                	<i></i>
                </li>

                <!-- <li @click="confirmFiletype('1')" v-if="videoLength<1">
                	短视频
                	<input type="file" accept="video/*" :max-size='fileSize' @change="onReadVideo1($event)"/>
                	<i></i>
                </li>
                <li @click="confirmFiletype1('1')" v-if="videoLength>=1">
                	   短视频
                	<i></i>
                </li> -->
				
            </ul>
        </van-popup>
        <!--选择附件类型END-->

		<!--日期选择-->
		<van-popup v-model="show1" position="bottom" :close-on-click-overlay="false">
		  <van-datetime-picker
		    v-model="currentDate"
		    type="datetime"
			:min-date="minDate"
		    title="选择开始时间"
		    @confirm="sureStart"
		    @cancel="cancelStart"
			:formatter="formatter"
		  />
		</van-popup>

		<!--日期选择END-->
		<!--日期选择-->
		<van-popup v-model="show2" position="bottom" :close-on-click-overlay="false">
		  <van-datetime-picker
		    v-model="currentDate2"
		    type="datetime"
		    :min-date="currentDate"
		    title="选择截止时间"
		    @confirm="sureEnd"
		    @cancel="cancelEnd"
			:formatter="formatter"
		  />
		</van-popup>
		<!--日期选择END-->

		<!--执行人-->
		<van-popup v-model="showExecutePeople" position="right" :overlay="false">
			<sel-people @back='backFromsel(1)' :workType="workType" :executor='executor' @selectExecute='confirmExecutePeople'/>
		</van-popup>
		<!--执行人END-->

		<!--抄送人-->
		<van-popup v-model="showCopyPeople" position="right" :overlay="false">
			<many-people @back='backFromsel(2)' :selectlist='selectlist' :copyPeopleColums="copyPeopleColums" @confirmcopypeople='confirmCopyPeople'/>
		</van-popup>
		<!--抄送人END-->
		<div class="imgPreview" v-show="previewImg" @click="closePreview()"><img :src="previewImg" alt=""></div>
		<div class="imgPreview videoPreview" v-show="previewVideo">
			<Head title="视频播放" @back="closePreview2()"/>
			<video :src="previewVideo" controls="controls" id="video"></video>
		</div>
        <div class="btn-back submitBtn" id="submitBtn" :class="{'unFixed':unFixed}">
            <van-button round type="infoRound" @click="saveBill('submit')" size="large">提交</van-button>
        </div>
    </div>
</template>

<script>
    import Head from "@/components/head";
    import selPeople from "@/components/select-depeartment-people";
    import manyPeople from "@/components/select-depeartment-multiples";
	import { parseTime,fileResizetoFile} from "@/utils/index";
	import {Toast,ImagePreview} from "vant";
    // import "@/utils/lib/mobileSelect.js";
    // import "@/utils/lib/selectDate.js";
    // import "@/utils/lib/mobileSelect.css";

    export default {
        name: "createToBeSend",
        components: {Head,selPeople,manyPeople},
        data() {
            return {
                title: "工单",
				fileSize:1048576,//文件大小限制
				workType:0,//工单类型id
                orderType:'',//
                showLevel: false,
                levelColums: ['普通','重要','紧急'],
                level: '普通',
                describe: "",
                executePeople: "",//执行人姓名
                refuseTime: "",//执行人姓名
				executor:'',//执行人id
                copyPeople: "",//抄送人
				selectlist:'',//抄送人id 以逗号分割
                copyPeopleColums: [],//抄送人列表
                // executePeopleColums: [{id: 1, name: "张三"}],
                showCopyPeople: false,//选择抄送人
                showExecutePeople: false,//选择执行人
				minDate:new Date(),//最小时间
				show1:false,//开始时间
				show2:false,//结束时间
				currentDate: new Date(), //时间选择
				currentDate2: new Date(), //时间选择2
				startDate:'',//开始日期
				startTime:'',//开始时间
				endDate:'',//结束日期
				endTime:'',//结束时间
				start:'',//开始时间 datetime
				end:'',//结束时间 datetime
				showFiletype:false,
				fileColums:['图片','短视频','PDF'],
				fileImg:[],
                oldfileImg:[],
				pic:[],
				pdf:[],
				video:[],
				titleIn:'',//输入的标题
				description:'',//描述
				tip:'文件大小不能超过10MB',
                userId:'',
                orderId:'',
                refuseReason:false,
                returnDesc:'',
                videoLength:0,
                picLength:0,
                oldfileIds:[],//老图ids
				previewImg:'',//
				previewVideo:'',
                screenHeight: document.body.clientHeight,
                unFixed:false,//按钮不定位
            }
        },
		watch:{
			oldfileIds: {
		　　　　handler(newValue, oldValue) {
		　　　　　　for (let i = 0; i < newValue.length; i++) {
		　　　　　　　　if (oldValue[i] != newValue[i]) {
		　　　　　　　　　　console.log(newValue)
		　　　　　　　　}
		　　　　　　	}
		　　　　	},
	　　　　		deep: true
			},
            screenHeight (curVal,oldVal) {
			    this.Val = oldVal;
                if(curVal < oldVal){
                    this.unFixed = true;
                    //$("#submitBtn").css("position","static");
                }else{
                    this.unFixed = false;
                    //$("#submitBtn").css("position","fixed");
                }

            }
		},
		computed:{
			inputNum(){//输入字数
				let num = 0;
				if(this.description){
				    num = this.description.split('').length;
                }
				return num;
			},
			oldfileLength(){
				if(this.oldfileIds){
					return this.oldfileIds.length;
				}else{
					return 0;
				}
			}
		},
		filters:{
			getLength(data){
				return data.length;
			},

		},
        created() {
        },
		activated(){
			if(localStorage.getItem('copyPeopleColums') && JSON.parse(localStorage.getItem('copyPeopleColums')).length>0){
				this.copyPeopleColums = JSON.parse(localStorage.getItem('copyPeopleColums'));
				this.selectlist = '';
				this.copyPeopleColums.forEach((item,index)=>{
					if(index==this.copyPeopleColums.length-1){
						this.selectlist+=item.copyperson;
					}else{
						this.selectlist+=item.copyperson+',';
					}
				})
			}
			if(localStorage.getItem('execute')){
				let execute = JSON.parse(localStorage.getItem('execute'));
				console.log(execute)
				console.log('=========execute')
				this.executePeople = execute.name;
				this.executor = parseInt(execute.id);
			}
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
				if(from.name!='selectStaffInCreate' && from.name!='selectExecuteInCreate'){
					localStorage.removeItem('copyPeopleColums');
					localStorage.removeItem('execute')
					vm.currentDate2 = new Date(new Date().getTime()+1000*60);//默认1分钟
					vm.orderId = vm.$route.query.orderId;
					vm.userId = window.localStorage.getItem('userId');
					vm.workType = '';
					vm.showLevel = false;
					vm.level = '普通';
					vm.describe = '';
					vm.executePeople = '';
					vm.refuseTime = '';
					vm.executor = '';
					vm.copyPeople = '';
					vm.selectlist = '';
					vm.copyPeopleColums = [];
					vm.showCopyPeople =  false;//选择抄送人
					vm.showExecutePeople =  false;//选择执行人
					vm.minDate = new Date();//最小时间
					vm.show1 = false;//开始时间
					vm.show2 = false;//结束时间
					vm.startDate = '';//开始日期
					vm.startTime = '';//开始时间
					vm.endDate = '';//结束日期
					vm.endTime = '';//结束时间
					vm.start = '';//开始时间 datetime
					vm.end = '';//结束时间 datetime
					vm.showFiletype = false;
					vm.fileImg = [];
					vm.oldfileImg = [];
					vm.pic = [];
					vm.video = [];
					vm.titleIn = '';//输入的标题
					vm.description = '';//描述
					vm.refuseReason = false;
					vm.returnDesc = '';
					vm.videoLength = 0;
					vm.picLength = 0;
					vm.oldfileIds = [];//老图ids
					vm.previewImg = '';//
					vm.previewVideo = '';
					vm.initDetails();
				}
			})
		},
        mounted(){
            this.initDetails();
            var self = this;
            window.onresize = () => {
                return (() => {
                    window.screenHeight = document.body.clientHeight;
                    self.screenHeight = window.screenHeight
                })()
            }
        },
        methods: {
			formatter(type, value) {
				console.log(type)
				if (type === 'year') {
					return `${value}年`;
				} else if (type === 'month') {
					return `${value}月`
				}else if (type === 'day') {
					return `${value}日`
				}else if (type === 'hour') {
					return `${value}时`
				}else if (type === 'minute') {
					return `${value}分`
				}
				return value;
			},
            back() {
				history.go(-1);
            },
			tips(){
				Toast('文件大小不能超过10MB');
			},
			//获取当前登陆人的领导
			getleader(){
				let self = this;
				let data={
                    token:localStorage.getItem('Authorization')
                }
				self.axios({
				    url:'/api/v1.0/getleader',
				    method:'post',
					data:data
				}).then(function (res) {
				    console.log(res);
					if(res.data.code=='200'){
						if (res.data.data && res.data.data.length>0) {
							let item = {};
							item.type = 1;//1为直属领导
							item.name = res.data.data[0].name;//姓名
							item.copyperson = res.data.data[0].userId;//id
							item.avatar = res.data.data[0].avatar;//id
							self.copyPeopleColums.push(item);
							self.selectlist = item.copyperson+'';
						}
					}else{
						Toast(res.data.message);
					}
				})
			},
			//删除附件
            delPicture(index){
                if(this.fileImg[index].type=='pic'){
                    this.picLength--;
                    this.fileImg.splice(index,1);
                }else if(this.fileImg[index].type=='video'){
                    this.videoLength=0;
                    this.fileImg.splice(index,1);
                }
            },
            //删除附件
            delOldPicture(id,index){
                var self = this;
                console.log(self.oldfileImg);
				if(self.oldfileImg[index].type==1){
					self.picLength--;
				}else{
					self.videoLength=0;
				}
                self.oldfileImg.splice(index,1);
                self.oldfileIds.splice(self.oldfileIds.indexOf(id),1);
            },
			//选择执行人返回1 抄送人2
			backFromsel(type){
				if(type==1){
					this.showExecutePeople = false;
				}else if(type==2){
					this.showCopyPeople = false;
				}
			},
            //选择重要程度
            pickLevel() {
                this.showLevel = !this.showLevel;
            },
            changeLevel() {
                this.showLevel = false;
            },
            confirmLevel(t) {
				this.level = t;
				this.showLevel = !this.showLevel;
            },
            cancelLevel() {
				this.showLevel = !this.showLevel;
            },
			//选择文件类型
			pickFiletype() {
			    this.showFiletype = !this.showFiletype;
			},
			confirmFiletype(type) {
				this.showFiletype = !this.showFiletype;
				if(window.htoa){//安卓
					if(type=='1'){
						console.log('======选择录像========')
						if(localStorage.getItem('cancelUpload')=='1'){
							document.getElementById("video").value = '';
							localStorage.setItem('cancelUpload','0');
						}
						window.htoa.setImageOrVideo("2");
					}else{
						console.log('======选择拍照========')
						if(localStorage.getItem('cancelUpload')=='1'){
							document.getElementById("video").value = '';
							localStorage.setItem('cancelUpload','0');
						}
						window.htoa.setImageOrVideo("1");
					}
				}
			},
			cancelFiletype() {
				this.showFiletype = !this.showFiletype;
			},
            confirmFiletype1(type){
                if(type==0){
                    Toast('图片最多上传9张');
                    this.showFiletype = false;
                }
                if(type==1){
                    Toast('视频最多上传一个');
                    this.showFiletype = false;
                }
            },
            //确认开始时间
            sureStart(date) {
              console.log("开始时间", date);
              this.show1 = !this.show1;
              // this.show2 = true;
			  this.start = date;
              this.startDate = parseTime(date,"{y}年{m}月{d}日");
              this.startTime = parseTime(date,"{h}:{i}");
			  if(this.start>this.end){
				  this.end = '';
				  this.endDate = '';
				  this.endTime = '';
			  }
            },
            cancelStart() {
              this.show1 = false;
            },
            //确认结束时间
            sureEnd(date) {
              console.log("结束时间", date);
              this.show2 = !this.show2;
              this.end = date;
              this.endDate = parseTime(date,"{y}年{m}月{d}日");
              this.endTime = parseTime(date,"{h}:{i}");
            },
            cancelEnd() {
              this.show2 = false;
            },
            //选择执行人
            pickExecutePeople() {
                // this.showExecutePeople = !this.showExecutePeople;
				let self = this;
				this.$router.push({
					path:'selectExecuteInCreate',
					query:{
						workType:self.workType,
						executor:self.executor,
					}
				})
            },
            confirmExecutePeople(item) {//弃用
				console.log("====选中====")
				console.log(item)
				this.executePeople = item.name;
				this.executor = item.id;
            },
            //选择抄送人
            pickCopyPeople() {
                // this.showCopyPeople = true;
				console.log(this.copyPeopleColums)
				localStorage.setItem('copyPeopleColums',JSON.stringify(this.copyPeopleColums))
				localStorage.setItem('selectlist',JSON.stringify(this.selectlist))
				this.$router.push({
					path:'selectStaffInCreate',
				})
            },
            confirmCopyPeople(data) {//弃用
				console.log("====选中====")
				console.log(data)
				this.copyPeopleColums = data;
				this.selectlist = '';
				data.forEach((item,index)=>{
					if(index==data.length-1){
						this.selectlist+=item.copyperson;
					}else{
						this.selectlist+=item.copyperson+',';
					}
				})
            },
// 			onReadPic1(e) {
// 				let self = this;
// 				var files = e.target.files[0]
// 				let content = '';
// 				if (!e || !window.FileReader) return  // 看支持不支持FileReader
// 				let reader = new FileReader()
// 				reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
// 				reader.onloadend = function () {
// 				  content = this.result
// 				  //添加图片
// 					let item = {
// 						file:files,
// 						content:content
// 					}
// 					item.type="pic";
// 					self.picLength++;
// 					self.fileImg.push(item);
// 				}
// //
// 			},
			onReadPic1(e) {
				let self = this;
				let item = {};
				var files = e.target.files[0]
				let content = '';
				let canvas = document.createElement("canvas");
				if (!e || !window.FileReader) return  // 看支持不支持FileReader
				let reader = new FileReader()
				reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
				reader.onloadend = function () {
				  content = this.result
				  //添加图片
					let result = this.result;
					let img = new Image();
					img.src = result;
					var str = navigator.userAgent.toLowerCase();
					var ver =str.match(/cpu iphone os (.*?) like mac os/);
					let useCanvas = true;
					if(ver){
						let type = parseInt(ver[1].replace(/_/g,".").split('.')[0]);
						if(type<=10){
							useCanvas = false;
						}
					}else{
						useCanvas = false;
					}
			
					img.onload = function () {
						let Orientation;
						let ctx = canvas.getContext("2d");
						canvas.width = img.width;
						canvas.height = img.height;
						if(useCanvas){
							self.EXIF.getData(img, function(){
								console.log(self.EXIF.getAllTags(this))
								Orientation = self.EXIF.getTag(this, 'Orientation')
								// alert(self.EXIF.getTag(this, 'Orientation'))
								 //修复ios上传图片的时候 被旋转的问题
								  if(Orientation != "" && Orientation != 1 && Orientation){
									switch(Orientation){
									  case 6://需要顺时针（向左）90度旋转
									  console.log(666)
											canvas.width = img.height;
											canvas.height = img.width;
											ctx.rotate(Math.PI / 2);
											ctx.drawImage(img, 0, -img.height, img.width, img.height);
											break;
									  case 8://需要逆时针（向右）90度旋转
									  console.log(888)
			
											canvas.width = img.height;
											canvas.height = img.width;
											ctx.rotate(3 * Math.PI / 2);
											ctx.drawImage(img, -img.width, 0, img.width, img.height);
											break;
									  case 3://需要180度旋转
									  console.log(333)
			
											ctx.rotate(Math.PI);
											ctx.drawImage(img, -img.width, -img.height, img.width, img.height);
											break;
									}
									var dataurl=canvas.toDataURL('image/*',0.8);//canvase 转为base64
									var blob = self.dataURLtoFile(dataurl,files.name);//base64转为blog
									console.log(blob)
									item = {
										file:blob,
										content:dataurl
									}
									item.type="pic";
									self.picLength++;
									console.log(item.file.size)
									
								}else{
							  // ctx.drawImage(img, 0, 0, img.width, img.height);
									  item = {
										  file:files,
										  content:content
									  }
									  item.type="pic";
									  self.picLength++;
									  console.log(item.file.size)
									  
								}
							})
						}else{
							  // ctx.drawImage(img, 0, 0, img.width, img.height);
							  item = {
								  file:files,
								  content:content
							  }
							  item.type="pic";
							  self.picLength++;
							  console.log(item.file.size)
							  
						}
						let type = '';
						if(ver){
							type = parseInt(ver[1].replace(/_/g,".").split('.')[0]);
						}
						if(ver && type<=10){
							if(item.file.size/1024/1024 >=5){
								Toast('单张图片最大支持5M，请重新选择')
								self.picLength--;
								return false;
							}else{
								self.fileImg.push(item);
							}
						}else if(item.file.size/1024/1024 >=5){
							fileResizetoFile(item.file,0.3,function(res){//第二个参数范围是 0~1 用于调整图片质量
									//newfile.push(res);//这个newfile是我其他代码里定义的一个数组 把压缩的图片Blob一个个放进去\
									item.file = res;
									console.log(res)
									if(item.file.size/1024/1024 >=5){
										Toast('单张图片最大支持5M，请重新选择')
										self.picLength--;
										return false;
									}else{
										self.fileImg.push(item);
									}
							})
						}else{
							self.fileImg.push(item);
						}
			
					}
				}
			},
			dataURLtoFile(dataurl, filename) {//将base64转换为文件
				var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
				console.log(mime)

				while(n--){
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new File([u8arr], filename, {type:mime});
			},
			onReadVideo1(event) {
				setTimeout(100)
				console.log(this.videoSrc)
				let self = this;
				let f = event.target.files[0];
				console.log(f)
				console.log("========readVideo========")
				console.log(f.name)
				console.log(f.size)
				console.log(f.type)
				//短视频
				let item = {
					file:f
				}
				//let item = file;
				item.type="video";
				this.videoLength=1;
				console.log(item)
				if(item.file.size/1024/1024 >=15){
					Toast('单个视频最大支持15M，请重新选择')
					this.videoLength=0;
					return false;
				}else{
					self.fileImg.push(item);
				}
				
// 				let video = document.getElementById("video");
// 				var canvas = document.createElement("canvas");
// 				// canvas.width = video.videoWidth * scale;
// 				canvas.width =200;
// 				// canvas.height = video.videoHeight * scale;
// 				canvas.height = 200;
// 				canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
// 				console.log('canvas.toDataURL("image/png")');
// 				console.log(canvas.toDataURL("image/png"));
// 				item.content = f;
// 				var reader = new FileReader();
// 		        reader.onload = function () {
// 		            item.content = this.result;
// 					item.content2 = canvas.toDataURL("image/png");
// 					console.log(item)
// 					self.fileImg.push(item);
// 		        };
// 		        reader.readAsDataURL(f);

			},
			//保存or提交
			saveBill(types) {
				var self = this;
				let saveType = types;//saveType 保存类型
				let type = self.orderType;//type 工单类型
				let title = this.titleIn;//title 标题
				let importantType = 1;//importantType 重要程度 1:普通 2：重要 3：紧急
				if(self.level=='重要'){
					importantType = 2;
				}else if(self.level=='紧急'){
					importantType = 3;
				}else{
					importantType = 1;
				}
				let beginTime = self.start;//beginTime 开始时间 datetime类型
				let endTime = self.end;//endTime jiezhi时间 datetime类型
				if(typeof(self.start)=='object'){
					beginTime = parseTime(self.start,'{y}-{m}-{d} {h}:{i}:{s}')
				}
				if(typeof(self.end)=='object'){
					endTime = parseTime(self.end,'{y}-{m}-{d} {h}:{i}:{s}')
				}
				let description = this.description;//description 描述信息
                if(description == null){
                    description = '';
                }
                console.log(description);
				let executor = this.executor;//执行人id 如果saveType为2 必须
				let executorName = this.executePeople;//executorName 执行人姓名 如果saveType为2 必须
				let creator = localStorage.getItem('userId');//creator 创建人id（当前登录人id）
				let copyList = [];//copyList 抄送人列表 数组格式 ['type','name','copyperson'] type:是否为直属领导 1：是 0：否 name：抄送人名字 copyperson：抄送人id
				let pic = [];//数组格式 file文件form表单提交 图片
				// let pdf = [];//数组格式 file文件form表单提交 pdf
				let video = [];//数组格式 file文件form表单提交 shipin

                self.copyPeopleColums.forEach(item=>{
                    let copyer = {};
                    copyer.type = item.type;
                    copyer.name = item.name;
                    copyer.copyperson = item.copyperson;
                    copyList.push(copyer);
                })
                let forms = new FormData();
                self.fileImg.forEach(item=>{
                    if(item.type=='pic'){
                        console.log(item.file)
                        forms.append('pic[]',item.file);
                    }
                    if(item.type=='video'){
                        forms.append('video',item.file);
                    }
                })
                forms.append('fileIds',JSON.stringify(self.oldfileIds));
                forms.append('saveType',saveType)
                forms.append('type',type)
                forms.append('title',title)
                forms.append('importantType',importantType)
                forms.append('beginTime',beginTime)
                forms.append('endTime',endTime)
                forms.append('description',description)
                forms.append('executor',executor)

                forms.append('executorName',executorName)
                forms.append('creator',creator)
                forms.append('copyList',JSON.stringify(copyList))
                forms.append('id',self.orderId)
				if(saveType=='submit'){
					if(!title){
						Toast('请输入标题');
						return false;
					}else if(beginTime=='0-0-0 0:0:0'){
						Toast("请选择开始时间");
						return false;
					}else if(endTime=='0-0-0 0:0:0'){
						Toast("请选择截止时间");
						return false;
					}else if(new Date(beginTime) >= new Date(endTime)){
						Toast('截止时间不能早于开始时间');
						return false;
					}else if(!description){
						Toast('请输入工单描述');
						return false;
					}else if(!executor){
						Toast('请选择执行人');
						return false;
					}
				}
				self.axios({
				    url:'/api/v1.0/wodistribute',
				    method:'post',
					data:forms
				}).then(function (res) {
				    console.log(res);
					if(res.data.code=='200'){
						Toast(res.data.message);
						self.$router.go(-1);
//						self.$router.push({
//							path:'/',
//							query:{
//								userId:localStorage.getItem('userId')
//							}
//						})
					}else{
						Toast(res.data.message);
					}
				})

			},
			seeImg(index,type){
			    // this.previewImg = url;
				let data = [];
				let imgList = [];
				this.fileImg.forEach(item=>{
					if(item.type=='pic'){
						let it = item.content;
						imgList.push(it);
					}
				})
				this.oldfileImg.forEach(item=>{
					if(item.type=='1'){
						let it = item.url;
						imgList.push(it);
					}
				})

				console.log(imgList)
				if(type=='old'){
					//问题
					data = this.oldfileImg;
				}else if(type=='upload'){
					//上传
					data = this.fileImg;
				}
				let length = 0;
				let cur = 0;
				imgList.forEach((item,index2)=>{
					console.log(item)
					console.log(type)
					if(type=='old'){
						if(item==data[index].url){
							cur = length;
						}
						length++;
					}else if(type=='upload'){
						if(item==data[index].content){
							cur = length;
						}
						length++;
					}
				})
				ImagePreview(imgList,cur)
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
            //获取待派发详情
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
                    self.title = res.data.data.statusName;
//                    if(res.data.data.beginTime){
//                        res.data.data.beginTimes = res.data.data.beginTime.split(' ')[0].replace(/-/g,'.');
//                    }
//                    if(res.data.data.endTime){
//                        res.data.data.endTimes = res.data.data.endTime.split(' ')[0].replace(/-/g,'.');
//                    }
                   //self.$nextTick(function () {
                    self.workDetails = res.data.data;
                    self.detailStar = parseInt(res.data.data.starLevel);
                    self.haveStep = res.data.data.isRemind;
                    self.orderType = res.data.data.woType;
                    self.workType = res.data.data.workordertype.id;
                    self.titleIn = self.workDetails.title;
                    if(self.workDetails.importantType == 1){
                        self.level = '普通'
                    }else if(self.workDetails.importantType == 2){
                        self.level = '重要'
                    }else if(self.workDetails.importantType == 3){
                        self.level = '紧急'
                    }

                    self.start = self.workDetails.beginTime;
                    self.end = self.workDetails.endTime;
                    //self.startDate = parseTime(self.workDetails.beginTime,"{y}年{m}月{d}日");
                    //self.startTime = parseTime(self.workDetails.beginTime,"{h}:{i}");
                    //self.endDate = parseTime(self.workDetails.endTime,"{y}年{m}月{d}日");
                    //self.endTime = parseTime(self.workDetails.endTime,"{h}:{i}");
                    self.startDate = self.getDateYear(self.workDetails.beginTime);
                    self.startTime = self.getDateHour(self.workDetails.beginTime);
                    self.endDate = self.getDateYear(self.workDetails.endTime);
                    self.endTime = self.getDateHour(self.workDetails.endTime);
                    self.description = self.workDetails.description;
                    self.refuseTime = self.workDetails.refuseTime;
//                    self.workDetails.questionFiles.forEach((item)=>{
//                        self.fileImg.push(item.url);
//                    });
                    self.workDetails.questionFiles.forEach((item)=>{
                        self.oldfileIds.push(item.id);
                        if(item.type == 1){
                            self.workDetails.questionFiles.type = 'pic'
                            self.picLength += 1;
                        }else if(item.type == 2){
                            self.workDetails.questionFiles.type = 'video'
                            self.videoLength += 1;
                        }
                    })
                    self.oldfileImg = self.workDetails.questionFiles;
                    if(self.workDetails.executorInfo != '' && self.workDetails.executorInfo != null){
                        self.executePeople = self.workDetails.executorInfo.name;
                        self.executor = self.workDetails.executor;
                    }
                    if(self.workDetails.wocopy.length>0){
                        // self.copyPeopleColums = self.workDetails.wocopy;
                        self.workDetails.wocopy.forEach((item)=>{
							self.copyPeopleColums.unshift(item)
                            self.selectlist=item.copyperson+','+self.selectlist;
                        })
                    }
					console.log(self.copyPeopleColums)
                    if(self.workDetails.isReturn == 1){
                        self.refuseReason = true;
                        self.returnDesc = self.workDetails.returnDesc;
                    }
                   // });
                    console.log(self.startDate);
                    console.log(self.endDate);
                })
            },
            getDateYear(data){
                let datayear = data.split(' ')[0].split('-');
                let year = datayear[0]+'年';
                let month = datayear[1]+'月';
                let day = datayear[2]+'日';
                return year+month+day;
            },
            getDateHour(data){
                let datamin = data.split(' ')[1].split(':');
                let hour = datamin[0]+':';
                let minute = datamin[1]+':';
                return hour+minute+'00';
            },
            changePosition(){
                var currInputTop = 260;
                var currClientHeight = document.body.clientHeight;
                var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                //alert(currInputTop);
                if(isAndroid){
                    console.log('是否是Android：'+isAndroid);
                    setTimeout(function() {
                        document.getElementById('fullScreen').scrollTop = currInputTop - currClientHeight/2+80;
                    }, 300)

                    setTimeout(function() {
                        if(document.getElementById('fullScreen').scrollTop == 0){
                            document.getElementById('fullScreen').scrollTop = currInputTop - currClientHeight/2+80;
                        }
                    }, 500)
                }else if(isiOS){
                    console.log('是否是iOS：'+isiOS);
                }
            },
            unChange(){
                let oHeight = $(document).height();
                //$(window).resize(function(){ //ios软键盘弹出不会触发resize事件
                    if($(document).height() < oHeight){
                        $("#submitBtn").css("position","static");
                    }else{
                        $("#submitBtn").css("position","absolute"); //adsolute或fixed，看你布局
                    }
                //});

            }
        },
    }
</script>
<style>
	.input_cell1.van-field .van-cell__title{
		max-width: 60px;
	}
	.importantLevel input{
	    text-align:right !important;
	    color:#608BF7;
	}
	.importantLevel .van-cell__value span{
		color:#608BF7;
	}
	.create .van-popup--right{
		width: 100%;
		height: 100%;
	}
    .importantLevel .van-icon-location-o:before {
        width: 13px;
        height: 17px;
        background: url(../../assets/images/important_level_icon.png) 0 0 no-repeat;
        background-size: 100% 100%;
        color: transparent;
        margin-top: 2px;

    }
</style>
<style scoped>
    main .largeBtn {
		height: 0.88rem;
		line-height: 0.88rem;
		border-radius: 5px;
		width: 100%;
		margin: 0.86rem auto;
		box-sizing: border-box;
    }
    main{
        padding-bottom: 1.5rem;
    }
    .importantLevel input{
        text-align:right !important;
        color:#608BF7;
    }
    .titleIcon{
        width:13px !important;
        height:17px !important;
    }
    .levelIcon{
        width:12px !important;
        height:16px !important;
    }
    .uploadIcon{

    }
    .time {
        justify-content: space-between;
        background: #fff;
        align-items: center;
		padding: 10px 0;
    }
    .time div {
        width: 50%;
        padding: 0 0 0 0.8rem;
        text-align: left;
        font-size: 14px;
		align-self: flex-start;
    }

    .time > p {
        min-width: 1px;
        height: 1rem;
        background: #f2f2f2;
    }

    .time-label {
        color: #999CAA;
    }

    .time-date {
        color: #333;
    }

    .work, .operatePeople {
        border-top: 10px solid #f2f2f2;
        background: #fff;
    }

    .work p {
        margin: 0;
    }
    .billNotice {
        margin: 0;
        font-size: 12px;
        text-align: left;
        padding: 0.1rem 0.2rem;
    }



    .copyPeople {
		margin: 0 15px;
        justify-content: space-between;
        padding: 0.2rem 0;
        background: #fff;
        align-items: center;
        color: #323233;
        font-size: 14px;
        border-bottom: 1px solid #f2f2f2;
    }
    .copyPeople > i {
        margin-right: 0.1rem;
    }

    .copyPeople p {
        flex: 1;
        text-align: right;
        margin: 0;
    }
    .workDescribe-inner{
        height: 2.48rem;
        padding: 0 0.12rem;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 0.1rem;
        /* width: calc(100% - 0.6rem); */
        position: relative;
    }
    .workDescribe-inner textarea {
        display: inline-block;
        outline: none;
        border: none;
        width: 100%;
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
		height: 2rem;
    }
    .workDescribe-inner span {
        position: absolute;
        right: 0.12rem;
        bottom: 0.08rem;
    }
    .gray {
        color: #999CAA;
    }
    .upload-list {
        width: 100%;
        justify-content:flex-start;
		flex-wrap: wrap;
    }
	.pic_cell.van-cell{
		padding: 10px 5vw 0 5vw;
	}
    .upload-list-item {
		position: relative;
        min-width: 25vw;
		max-width: 25vw;
		min-height: 25vw;
		max-height: 25vw;
        border: 1px solid #ccc;
        border-radius: 0.1rem;
		flex: 1;
		margin-bottom: 10px;
    }
	.upload-list-item:nth-child(3n+1){
		margin-right: 6vw;
	}
	.upload-list-item:nth-child(3n){
		margin-left: 6vw;
	}
    .upload-list-item > img {
        width: 25vw;
        height: 25vw;
    }
    .upload-list-item div {
        display: block;
        width: 0.8rem;
        height: 0.8rem;
        border: 1px solid #333;
        margin: 0 auto;
        margin-top: 50%;
        transform: translateY(-50%);
    }
	.delPic{
		position: absolute;
		top: 5px;
		right: 5px;
		width: 16px;
		height: 16px;
		background: url(../../assets/images/delete_copy.png) 0 0 no-repeat;
		background-size: 100% 100%;
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
    .largeBtn {
        width: 4.8rem;
        margin: 0 auto;
    }
	.add{
		background: url(../../assets/images/addImg@2x.png) 0 0 no-repeat;
		background-size: 100% 100%;
		width: 17px;
		height: 17px;
		display: block;
		float: right;
	}
	.fileType{
		bottom: 0;
		width: 100%;
		background: #fff;
		margin: 0 auto;
		height: 170px;
	}
	.fileType li{
		line-height: 45px;
		text-align: center;
		font-size: 14px;
		color: #333333;
		position: relative;
	}
	.fileType li:hover{
		background: #EEF1F6;

	}
	.fileType li i{
		display: block;
		width: 85%;
		height: 1px;
		margin: 0 auto;
		background: #EEF1F6;
	}
	.fileType input{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		opacity: 0;
		width: 100%;
	}
	.btn-back{
		width: 100%;
		padding: 0 0.35rem;
		box-sizing: border-box;
	}
	.upload{
		position: absolute;
		top:0;
		bottom: 1px;
		left: 0;
		right: 0;
		opacity: 0;
		width:100%;
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
    /***留言**************/
    .leaveWord{
        margin: 0 0 0.2rem;
        border-radius: 0.1rem;
        background: #fff;
        padding: 0.24rem 0.23rem 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        background: #fff;
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
    .copyNote{
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: left;
        padding-left: 0.25rem;
        color: #999CAA;
        font-size: 0.24rem;
    }
    .refuseTip img{
        margin-left:0.1rem;
        margin-right:0.1rem;
    }
    .refuse_detail{
        font-size:0.24rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(153,156,170,1);
        text-align: left;
        padding: 0 0.5rem 0.2rem;
    }
    /*************/
    .submitBtn,.btnGroup{
        width:100%;
        height:0.88rem;
        padding:0 0.35rem;
        position: fixed;
        /*position: absolute;*/
        bottom: 0.5rem;
        left: 0;
        box-sizing: border-box;
        z-index: 1;
    }
    .submitBtn button{
        height:0.88rem;
		line-height: 0.88rem;
        border-radius: 0.1rem;
    }
    .unFixed{
        position: static;
    }
</style>
