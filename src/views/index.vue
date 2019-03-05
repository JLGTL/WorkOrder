<template>
    <div>
        <Head :title="title" @back="back"/>
        <main>
            <div class="manage flex">
                <div class="manage-left flex">
                    <p class="day">23</p>
                    <div>
                        <p>星期五</p>
                        <p>11／2018</p>
                    </div>
                </div>
                <div class="manage-right">
                    <button>模块管理</button>
                </div>
            </div>
            <div class="box">
                <dl class="operation">
                    <dt><img src="../assets/images/operation_icon.png"/></dt>
                    <dd>运营工单</dd>
                </dl>
                <dl class="hr">
                    <dt><img src="../assets/images/HR_icon.png"/></dt>
                    <dd>人事工单</dd>
                </dl>
                <dl class="it">
                    <dt><img src="../assets/images/IT_icon.png"/></dt>
                    <dd>IT运维工单</dd>
                </dl>
                <!--</div>-->
                <!--<div class="box flex">-->
                <dl class="administration">
                    <dt><img src="../assets/images/administration_icon.png"/></dt>
                    <dd>行政工单</dd>
                </dl>
                <dl class="school">
                    <dt><img src="../assets/images/school_icon.png"/></dt>
                    <dd>分校工单</dd>
                </dl>
                <dl class="more">
                    <dt><img src="../assets/images/more_icon.png"/></dt>
                    <dd>更多</dd>
                </dl>
            </div>
            <div class="close">
                <img src="../assets/images/catelog_del_icon.png"/>
            </div>
        </main>
    </div>
</template>
<script>
import Head from '@/components/head'

export default {
    props: [],
    components: {
        Head
    },
    data () {
        return {
            title: '目录'

        }
    },
    methods: {
        back () {

        }
    }
}
</script>

<style scoped>
    main {
        background: #F3F6F9;
        height: 100%;
        width: 100%;
    }

    .manage {
        padding: 0.49rem 0.4rem;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
    }

    .manage .day {
        color: #608BF7;
        font-size: 32px;
        font-family: Hiragino Kaku Gothic StdN W8;
        margin-right: 0.1rem;
    }

    .manage-left {
        align-items: center;
    }

    .manage-left div {
        color: #666666;
        font-size: 12px;
        font-weight: bold;
    }

    .manage-right button {
        padding: 0 0.12rem;
        height: 0.6rem;
        color: #608BF7;
        font-size: 15px;
        border: 1px solid #608BF7;
        border-radius: 0.1rem;
        box-sizing: border-box;
        background: #F3F6F9;
    }

    .close {
        animation: close 0.6s 0.6s ease-in-out forwards;
        -webkit-animation: close 0.6s 0.6s ease-in-out forwards;
    }

    .close img {
        width: 2.02rem;
        height: 2.02rem;
    }

    .box {
        /*justify-content: space-around;*/
        /*margin-bottom:0.4rem;*/
        position: relative;
        margin: 0 0.15rem;
        height: 8.6rem;
    }

    .box dl {
        width: 1.4rem;
        height: 1.7rem;
    }

    .box img {
        width: 1.1rem;
        height: 1.1rem;
    }

    .box dd {
        margin: 0;
        margin-top: 0.2rem;
    }

    .close {
        position: fixed;
        left: 2.74rem;
    }

    .operation, .hr, .it, .administration, .more, .school {
        position: absolute;
        top: 6.2rem;
        left: 3.2rem;
        opacity: 0;
    }

    .operation {
        animation: operation 0.6s 1.2s ease-in-out forwards;
        -webkit-animation: operation 0.6s 1.2s ease-in-out forwards;
    }

    .hr {
        animation: hr 0.6s 1.2s ease-in-out forwards;
        -webkit-animation: hr 0.6s 1.2s ease-in-out forwards;
    }

    .it {
        animation: it 0.6s 1.2s ease-in-out forwards;
        -webkit-animation: it 0.6s 1.2s ease-in-out forwards;
    }

    .administration {
        animation: administration 0.6s 1.8s ease-in-out forwards;
        -webkit-animation: administration 0.6s 1.8s ease-in-out forwards;
    }

    .more {
        animation: more 0.6s 1.8s ease-in-out forwards;
        -webkit-animation: more 0.6s 1.8s ease-in-out forwards;
    }

    .school {
        animation: school 0.6s 1.8s ease-in-out forwards;
        -webkit-animation: school 0.6s 1.8s ease-in-out forwards;
    }

    @keyframes close {
        0% {
            opacity: 0;
            bottom: -3rem;
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            bottom: 0.59rem;
            opacity: 1;
            transform: rotate(-180deg);
        }
    }

    @keyframes operation {
        0% {
            opacity: 0;
            bottom: 0;
            left: 3.2rem;
        }
        100% {
            top: 0;
            left: 0.75rem;
            opacity: 1;
        }
    }

    @keyframes hr {
        0% {
            opacity: 0;
            bottom: 0;
            left: 3.2rem;
        }
        100% {
            top: 0;
            left: 2.9rem;
            opacity: 1;
        }
    }

    @keyframes it {
        0% {
            opacity: 0;
            bottom: 0;
            left: 3.2rem;
        }
        100% {
            top: 0;
            left: 5.05rem;
            opacity: 1;
        }
    }

    @keyframes administration {
        0% {
            opacity: 0;
            bottom: 0;
            left: 3.2rem;
        }
        100% {
            top: 2.19rem;
            left: 0.75rem;
            opacity: 1;
        }
    }

    @keyframes school {
        0% {
            opacity: 0;
            bottom: 0;
            left: 3.2rem;
        }
        100% {
            top: 2.19rem;
            left: 2.9rem;
            opacity: 1;
        }
    }

    @keyframes more {
        0% {
            opacity: 0;
            bottom: 0;
            left: 3.2rem;
        }
        100% {
            top: 2.19rem;
            left: 5.05rem;
            opacity: 1;
        }
    }

</style>
