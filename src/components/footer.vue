<template>
    <footer class="flex">
        <div class="workbill" @click="getWork()">
            <img src="../assets/images/icon_bill@2x.png" class="img1" v-if="type!='gd'"/>
            <img src="../assets/images/workbill_icon.png" class="img2" v-if="type=='gd'"/>
            <p>工单</p>
        </div>
        <div class="add" @click="addWorkBill()">
            <img src="../assets/images/add_icon.png" />
        </div>
        <div class="report" @click="getReport()">
            <img src="../assets/images/icon_report@2x.png" class="img1" v-if="type!='bb'"/>
            <img src="../assets/images/report_icon.png" class="img2" v-if="type=='bb'"/>
            <p>报表</p>
        </div>
    </footer>
</template>

<script>
export default {
  name: 'foot',
  props:['type'],
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
	  addWorkBill(){
		  this.$emit("addWorkBill");
	  },
	  getReport(){
		  this.$emit("getReport")
	  },
	  getWork(){
			this.$emit("getWork")
	  }
  }
}
</script>

<style scoped>
    footer{
        justify-content: space-around;
        background:#fff;
        position:fixed;
        height:0.96rem;
        bottom:0;
        left:0;
        right:0;
        font-size:0.2rem;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(93,107,142,1);
    }
    footer .workbill,footer .report{
        text-align: center;
    }
    footer .workbill img {
        display:inline-block;
        margin-top:0.09rem;
        margin-bottom:0;
        width:0.29rem;
        height:0.4rem;
    }
	/* footer .workbill .img2 {
	    display: none;
	}
	footer .workbill .img1 {
		display:inline-block;
	}
	footer .workbill:hover .img1 {
	    display: none;
	}
	footer .workbill:hover .img2 {
		display:inline-block;
	} */
    footer .report img{
        display:inline-block;
        margin-top:0.13rem;
        margin-bottom:0.03rem;
        width:0.4rem;
        height:0.32rem;
    }
	/* footer .report .img2 {
	    display: none;
	}
	footer .report .img1 {
		display:inline-block;
	}
	footer .report:hover .img1 {
	    display: none;
	}
	footer .report:hover .img2 {
		display:inline-block;
	} */
    footer .add img{
        display:block;
        width:1.42rem;
        height:1.42rem;
        margin-top:-0.44rem;
    }
    footer div:last-child img{

    }
    footer p{
        margin:0;
    }
</style>
