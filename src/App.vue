<template>
    <div id="app">
		<keep-alive :include="['create-bill','copyForMeList','myCreateList','myExecuteList','createToBeSend']">
			<router-view>
			</router-view>
		</keep-alive>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            return {}
        }
    }
</script>

<style>
    html,body,#app{
        width: 100%;
        max-width: 768px;
        margin: 0 auto;
        height: 100%;
        box-sizing: border-box;
    }
    html{
        overflow: hidden;
    }
    body{
        padding:0;
        margin:0;
        overflow: auto;
        background: #F6F7FB;
    }

    #app {
        font-family: PingFangSC-Regular;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        padding-top: 54px;
    }
    p {
        margin: 0;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    .van-search{
        background:#F6F7FB !important;
    }

    .van-cell {
        text-align: left;
    }
    .van-hairline--top-bottom:after{
        border:none;
    }

    a {
        color: #42b983;
    }

    .van-cell:not(:last-child)::after {
        right: 15px;
    }
    .van-tabs__line{
        background-color:#608BF7;
        height:0.02rem;
    }

</style>
