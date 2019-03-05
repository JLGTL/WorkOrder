<template>
  <div>
    <div class="comments_wrap">
      <div class="has_choose_pic_wrap" v-if="this.hasChoosePic.length!=0">
        <div class="pic_item" v-for="(item,index) in this.hasChoosePic" :key="index">
          <img :src="item">
          <van-icon name="clear" @click="delePic(item,index)"/>
        </div>
      </div>

      <div class="input_pic_select_wrap">
        <!-- <input type="file" accept="image/*" multiple @change="onchangePic" capture="camera"> -->
        <!-- <van-uploader :after-read="onRead"  accept="image/*" >
          <van-icon name="photograph" />
        </van-uploader>-->
        <!-- <van-uploader :after-read="onRead" accept="image/*" multiple capture="camera">
          <van-icon name="photograph"/>
        </van-uploader>-->
        <!-- accept="image/png, image/jpeg" -->
        <!-- <van-icon name="photo" /> -->
        <input
          type="text"
          class="input_text"
          @blur="inputBlur"
          placeholder="请说点什么吧..."
          v-model="content"
        >
        <van-button type="info" size="small" @click="submitComment" :disabled="!showEdit">发送</van-button>
      </div>
    </div>
    <div class="mocks" @click="hideMocks"></div>
  </div>
</template>

<script>
export default {
  name: "comments",
  props: [ "woId","userName","toId","toName"],

  data() {
    return {
      hasChoosePic: [],
      content: "",
      submitPic: [],
      isDisabled: false
    };
  },
  computed: {
    showEdit() {
      if (this.submitPic.length > 0 || this.content != "") {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    delePic(item) {
      this.hasChoosePic = this.hasChoosePic.filter(item => item != item);
    },
    onRead(file) {
      console.log("file33333", file);
      this.hasChoosePic.push(file.content);
      this.submitPic.push(file);
      //this.submitPic = file;
      console.log("filefilefilefile", file);
    },
    submitComment() {
			let self = this;
			let userId = localStorage.getItem('userId');
			let obj  = {
			    woId: this.woId,
					userId:userId,
					userName:this.userName,
					toId:this.toId,
					toName:this.toName,
			    content: this.content
			  };
      this.axios({
          url:'/api/v1.0/wocomment',
          method:'post',
          data:obj
      }).then(res => {
        if (res.data.code == 200) {
          this.content = "";
          this.picture = [];
          self.$emit("closeCommentPanel");
        }
      });
    },
    inputBlur() {
      setTimeout(() => {
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
         window.scrollTo(0, Math.max(scrollHeight - 1, 0));
                },0)
    },
    hideMocks() {
      this.$emit("closeCommentPanel");
    },
    btnUploadFile(e, type) {
      //获取图片
      var files = e.target.files;
      var file = files[0];
      // 接受 jpeg, jpg, png 类型的图片
      if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) {
        return;
      }
      var reader = new FileReader();
      reader.onload = function() {
        var result = this.result; //图片base64字符串
        $("#showIMG").attr("src", result); //展示图片
      };
      reader.readAsDataURL(file); //Base64
    }
  }
};
</script>

<style lang="" scoped>
.mocks {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
	z-index: 102;
}

.van-icon-clear:before {
  background: #fff;
  overflow: hidden;
  border-radius: 50%;
}

.comments_wrap {
  width: 100%;
  height: 50px;
  /*position: fixed;*/
  position: absolute;
  background: #fff;
  z-index: 103;
  bottom: 0;
}

.has_choose_pic_wrap {
  display: flex;
  position: absolute;
  top: -57px;
  left: 20px;
  background: #fff;
  border-radius: 5px;
  padding: 3px 4px;
}

.has_choose_pic_wrap:before {
  content: "";
  border-top: 6px solid #fff;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  position: absolute;
  bottom: -5px;
  left: 5px;
}

.pic_item {
  width: 30px;
  height: 30px;
  position: relative;
  padding: 5px;
}

.pic_item img {
  width: 30px;
  height: 30px;
}

.pic_item .van-icon-clear {
  position: absolute;
  top: -3px;
  right: -3px;
}

.van-icon-photo {
  font-size: 16px;
  font-size: 30px;
  color: rgba(151, 151, 151, 0.25);
}

.input_pic_select_wrap {
  height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.input_pic_select_wrap {
  font-size: 14px;
}

.input_text {
  width: calc(100% - 120px);
  border-radius: 3px;
	height: 37px;
  padding: 4px;
	border: 1px solid #ccc;
  box-sizing: border-box;
}
.van-button--small {
  height: 37px;
}
</style>
