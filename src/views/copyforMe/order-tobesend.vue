<template>
    <div class="create">
        <Head :title="title" @back="back" :save="false" :isBack="true" :hasBorder="true" @saveBill="saveBill('save')"/>
        <main>
            <span class="unClick"></span>
            <van-field placeholder="请填写标题" v-model="titleIn" label="标题" class="input_cell input_cell1" readonly>
                <template slot="left-icon">
                    <img src="../../assets/images/title_icon.png" class="titleIcon icon"/>
                </template>
            </van-field>
            <van-field label="重要程度" :value="level"  class="importantLevel input_cell">
                <template slot="left-icon">
                    <img src="../../assets/images/important_level_icon.png" class="levelIcon icon"/>
                </template>
            </van-field>
            <div class="time flex">
                <div >
                    <p class="time-label">开始时间</p>
                    <p class="time-date">{{startDate}}</p>
                    <p class="time-time">{{startTime}}</p>
                </div>
                <p></p>
                <div>
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
                        <p>{{description}}</p>
                    </div>
                </van-cell>
                <!-- <van-cell class="afternone flex input_cell"> -->
                <van-cell class="afternone flex input_cell">
                    <template slot="title">
                        <span class="custom-text">附件</span>
                        <!-- <i class="gray">最多添加6张照片，10M以内</i> -->
                    </template>
                    <template slot="icon">
                        <img src="../../assets/images/upload_icon.png" class="icon"/>
                    </template>
					<i class="add" style="display: none"></i>
                </van-cell>
                <van-cell class="pic_cell">
                    <ul class="upload-list flex input_cell">
                        <li class="gray" v-if="oldfileImg.length == 0">暂无附件</li>
                        <li class="upload-list-item" v-for="(item,index) in oldfileImg" v-else>
                            <img v-lazy="item.url" alt="" v-if="item.type=='1'" @click="seeImg(index,'q')"/>
                            <img src="../../assets/images/面授.png" alt="" v-if="item.type=='2'" @click="seeVideo(item.url)"/>
                        </li>
                    </ul>
                </van-cell>
            </div>
            <div class="operatePeople">
                <div class="copyPeople flex">
                    <img src="../../assets/images/dispatch_icon.png" class="icon"/>
                    <span class="">执行人</span>
                    <p class="dispathPeople flex gray" v-if="executePeople">{{executePeople}}</p>
					<p class="dispathPeople flex gray" v-else>无执行人</p>

                    <!--<van-icon name="arrow"/>-->
                </div>
                <div class="copyPeople copyPeople2 flex" @click="openCopyList">
                    <img src="../../assets/images/share_icon.png" class="icon"/>
                    <span class="">抄送人</span>
                    <p class="dispathPeople flex gray"><img src="../../assets/images/head.png"/>{{copyPeopleColums | getLength}}人</p>
                    <!--<van-icon name="arrow"/>-->
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
            <div class="btn-back submitBtn" style="display: none;">
                <van-button round type="infoRound" @click="saveBill('submit')" size="large">提交</van-button>
            </div>
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
                <li @click="confirmFiletype('0')" v-if="picLength<=9">
                    <van-uploader :after-read="onReadPic" :oversize='tips' accept="image/*" :max-size='fileSize'>
                        图片
                    </van-uploader>
                    <i></i>
                </li>
                <li @click="confirmFiletype1('0')" v-if="picLength>9">
                    图片
                    <i></i>
                </li>

                <!-- <li @click="confirmFiletype('1')">
                    <van-uploader :after-read="onReadVideo" :oversize='tips' accept="video/*" :max-size='fileSize' v-if="videoLength<1">
                        短视频
                    </van-uploader>
                    <p v-if="videoLength>1">短视频</p>
                    <i></i>
                </li>
                <li @click="confirmFiletype1('1')" v-if="videoLength>=1">
                    短视频
                    <i></i>
                </li> -->
				
				
				
                <!-- <li @click="confirmFiletype('2')">
                    <van-uploader :after-read="onReadPdf" :oversize='tips' accept=".pdf" :max-size="fileSize">
                       PDF
                    </van-uploader>
                </li> -->
            </ul>
        </van-popup>
        <!--选择附件类型END-->

		<!--日期选择-->
		<van-popup v-model="show1" position="bottom" :close-on-click-overlay="false">
		  <van-datetime-picker
		    v-model="currentDate"
		    type="datetime"
		    title="选择开始时间"
		    @confirm="sureStart"
		    @cancel="cancelStart"
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
			<video :src="previewVideo" controls="controls"></video>
		</div>
		<!--抄送人列表-->
		<van-popup v-model="ShowCopyList" position="bottom" :overlay="true">
			<div class="list-item2">
				<p class="van-cell flex depart-one" v-for="item in copyPeopleColums">
						<img v-lazy="item.avatar" alt="" class="headImg" v-if="item.avatar"/>
						<img src="../../assets/images/head.png"  class="headImg" v-if="!item.avatar"/>

					<span class="depart-user-name">{{item.name}}</span>
					<span class="depart-user-title" v-if="item.type==1">直属领导</span>
				</p>
			</div>
		</van-popup>
		<!--抄送人列表END-->
    </div>
</template>

<script>
    import Head from "@/components/head";
    import selPeople from "@/components/select-depeartment-people";
    import manyPeople from "@/components/select-depeartment-multiples";
	import { parseTime} from "@/utils/index";
	import {Toast,ImagePreview} from "vant";
    // import "@/utils/lib/mobileSelect.js";
    // import "@/utils/lib/selectDate.js";
    // import "@/utils/lib/mobileSelect.css";

    export default {
        name: "create-operativebill",
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
				ShowCopyList:false,
            }
        },
		computed:{
			inputNum(){//输入字数
				let num = 0;
				if(this.description){
				    num = this.description.split('').length;
                }
				return num;
			}
		},
		filters:{
			getLength(data){
				return data.length;
			}
		},
        created() {
//			this.title = this.$route.query.workTypeName;
//			this.workType = this.$route.query.workType;
			this.currentDate2 = new Date(new Date().getTime()+1000*60);//默认1分钟
			//this.startDate = parseTime(this.currentDate,"{y}年{m}月{d}日");
			//this.startTime = parseTime(this.currentDate,"{h}:{i}");
			this.start = this.currentDate;
			//this.endDate = parseTime(this.currentDate2,"{y}年{m}月{d}日");
			//this.endTime = parseTime(this.currentDate2,"{h}:{i}");
			this.end = this.currentDate2;
            this.orderId = this.$route.query.orderId;
            this.userId = window.localStorage.getItem('userId');
			// this.getleader();
        },
        mounted(){
            this.initDetails();
        },
        methods: {
			openCopyList(){
				this.ShowCopyList = true;
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
                   // token:localStorage.getItem('Authorization')
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
						window.htoa.setImageOrVideo("2");
					}else{
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
                this.showExecutePeople = !this.showExecutePeople;
            },
            confirmExecutePeople(item) {
				console.log("====选中====")
				console.log(item)
				this.executePeople = item.name;
				this.executor = item.id;
            },
            //选择抄送人
            pickCopyPeople() {
                this.showCopyPeople = true;
            },
            confirmCopyPeople(data) {
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
			readPic(e){
				var file = e.target.files[0];
				console.log(file)

				this.pic.push(file);
				this.fileImg.push(file);
				return
				var reader = new FileReader()
				var self = this
				reader.readAsDataURL(file)
				reader.onload = function(e) {
					// that.avatar = this.result
					console.log(file)
					if (self.$refs.imgInput.files.length != 0) {
						var image = new FormData()
						image.append('file',file)
						console.log(image.get("file"))
						console.log(self.$refs)
						self.pic.push(file);

					}

				}

				// return false;
// 				var filePath = f;
// 				var reads = new FileReader();
// 				f = document.getElementById('uploadimg').files[0];
// 				var fs = f;
// 				reads.readAsDataURL(f);
//
// 				var wait = layer.load(0, {shade: [0.1,'#fff'] });
// 				reads.onload = function(e) {
// 				   var path = this.result;
// 				   var formData = new FormData();
// 				   formData.append('uploadfile',fs);
// 			},
			},
			onReadPic(file){
				console.log(file)
                //添加图片
				let item = file;
				item.type="pic";
                this.picLength++;
                this.fileImg.push(item);
            },
			onReadVideo(file) {
				console.log(file)
			    //短视频
				let item = file;
				item.type="video";
                this.videoLength=1;
                this.fileImg.push(item);
			},
			onReadPdf(file) {
			    //pdf
				let item = file;
				item.type="pdf";
				this.fileImg.push(item);
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
				let beginTime = parseTime(self.start,'{y}-{m}-{d} {h}:{i}:{s}');//beginTime 开始时间 datetime类型
				let endTime = parseTime(self.end,'{y}-{m}-{d} {h}:{i}:{s}');//endTime jiezhi时间 datetime类型
				let description = this.description;//description 描述信息
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
                   self.$nextTick(function () {
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
                    console.log(self.workDetails.endTime);
                    self.start = self.workDetails.beginTime;
                    self.end = self.workDetails.endTime;
                    //self.startDate = parseTime(self.workDetails.beginTime,"{y}年{m}月{d}日");
                    //self.startTime = parseTime(self.workDetails.beginTime,"{h}:{i}");
                    //self.endDate = parseTime(self.workDetails.endTime,"{y}年{m}月{d}日");
                    //self.endTime = parseTime(self.workDetails.endTime,"{h}:{i}");
                    self.startDate = self.getDateYear(self.workDetails.beginTime)
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
                            self.workDetails.questionFiles.type == 'pic'
                            self.picLength += 1;
                        }else if(item.type == 2){
                            self.workDetails.questionFiles.type == 'video'
                            self.videoLength += 1;
                        }
                    })
                    self.oldfileImg = self.workDetails.questionFiles;
                    console.log(self.oldfileImg);
                    if(self.workDetails.executorInfo != '' && self.workDetails.executorInfo != null){
                        self.executePeople = self.workDetails.executorInfo.name;
                        self.executor = self.workDetails.executor;
                    }
                    if(self.workDetails.wocopy.length>0){
                        self.copyPeopleColums = self.workDetails.wocopy;
                        self.workDetails.wocopy.forEach((item)=>{
                            self.selectlist+=item.copyperson+',';
                        })
                    }
                    if(self.workDetails.isReturn == 1){
                        self.refuseReason = true;
                        self.returnDesc = self.workDetails.returnDesc;
                    }
                    });
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
	.create .van-popup--right{
		width: 100%;
		height: 100%;
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
		position: relative;
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
        text-align: left;
        font-size: 14px;
		align-self: flex-start;
		padding: 0 0 0 0.8rem;
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
        justify-content: space-between;
        padding: 0.2rem 0.3rem;
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
		padding: 10px 5vw 5vw 5vw;
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
        bottom: 0.5rem;
        left: 0;
        box-sizing: border-box;
        z-index: 1;
    }
    .submitBtn button{
        height:0.88rem;
        border-radius: 0.1rem;
    }
</style>
