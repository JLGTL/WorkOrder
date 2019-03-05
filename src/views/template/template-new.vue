<template>
	<div class="back">
		<Head :title="title" @back="back"/>
		<div class="newWorker">
			<div class="newBtn" @click="addWorker"></div>
		</div>
	</div>
</template>

<script>
	import Head from "@/components/head";
	export default {
        name: "template-manage",
        components: {Head},
        data() {
            return {
                title: "模版管理",
            }
        },
        created() {
        },
        methods: {
			back() {
				history.go(-1);
			},
			addWorker(){
				this.$router.push({
					path:'/CreateOperativebill',
					query:{
						workType:11,
						workTypeName:'订制工单模版'
					}
				})
			}
		},
	}
</script>

<style scoped>
	.back{
		width: 100%;
		position: fixed;
		top: 0;
		bottom: 0;
		padding-top: 54px;
		box-sizing: border-box;
		background: #7EA2FC;
		overflow: hidden;
		overflow-y: scroll;
		z-index: 99;
	}
	.newWorker{
		background: url(../../assets/images/manage_group.png) 0 0 no-repeat;
		background-size: 100% 100%;
		width: 100vw;
		height: 160.8vw;
	}
	.newBtn{
		position: absolute;
		bottom: 0;
		left: 4.7vw;
		width: 90.6vw;
		height: 20.9vw;
		background: url(../../assets/images/newworkbill.png) 0 0 no-repeat;
		background-size: 100% 100%;
	}
</style>
