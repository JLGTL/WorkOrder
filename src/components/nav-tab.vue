<template>
    <div class="tabCont">
        <div class="tab">
            <ul class="flex nav-tabs">
                <li v-for="(item,index) in tabLists" :key="index" :class="{active:defaultTab == index }">
                    <a @click="selectTab(index)">
                        <p class="tab-title" :class="{ 'tab-title': true, 'text-important': index == 0 && item.count > 0 }">{{item.text}}</p>
                        <p class="tab-num">{{item.count}}</p>
                    </a>
                </li>
            </ul>
        </div>
        <div class="content">
            <!--<div v-for="(item,index) in tabLists" v-if="defaultTab == index" :key="index" :id="index">-->
            <div v-for="(item,index) in tabLists" :key="index" :id="index" class="tabListCont">
                <slot :name="index" ></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'nav-tab',
        props: {
            tabLists: {
                type: Array,
                default: [],
            }
        },
        data () {
            return {
                active: '',
                defaultTab: 0,
            }
        },
        activated () {
			
        },
        methods: {
            back () {

            },
            selectTab (index) {
                this.defaultTab = index;
                console.log(index);
                this.$emit('getList',index+1);
            }
        },
    }
</script>

<style scoped>
    .tab {
        width: 100%;
        padding: 0.2rem 0;

    }
    .content{
        width: 100%;
        height:calc(100% - 83px);
        box-sizing: border-box;
    }
    p {
        margin: 0;
    }
    .content .tabListCont:nth-child(2){
        width:100%;
        height:100%;
        box-sizing: border-box;
        padding:0 0.25rem;
    }
    .nav-tabs {
        justify-content: space-around;
        font-size: 14px;
        background: #fff;
        overflow: hidden;
        width: 7rem;
        margin: 0 auto;
        border-radius: 0.1rem;
        height: 1.26rem;
    }

    .nav-tabs li a {
        display: block;
        width: 100%;
        padding: 0.23rem 0;
    }

    .nav-tabs li a .tab-title {
        color: #333;
    }

    .nav-tabs li a .tab-num {
        color: #999CAA;
    }
    .active{
        border-bottom:0.04rem solid #608BF7;
    }
    .active a .tab-title,.active a .tab-num{
        color: #608BF7 !important;
    }
    .text-important{
        position:relative;
    }
    .text-important:after{
        content:"";
        display:block;
        position:absolute;
        right:-5px;
        top:-2px;
        width:6px ;
        height:6px;
        border-radius:3px;
        background:#FF0000;
    }
    .tabCont{
        width:100%;
        height:100%;
        box-sizing: border-box;
    }
</style>
