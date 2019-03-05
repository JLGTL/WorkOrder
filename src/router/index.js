import Vue from 'vue';
import Router from 'vue-router';
// import charts from '@/view/charts'
// const News = () => import('../views/news');
// const Home = () => import('../views/index');
// import swiperDel from '@/views/demo/swiperDel'
// import echarts from '@/views/demo/echarts'
// import loadlist from '@/views/demo/list'
// import loadLists from '@/views/demo/loadList'
// import uploader from '@/views/demo/uploader'
// import dateTime from '@/views/demo/dateTime'

// import News from '../views/news';
// import Home from '../App';
// import WorkBill from '../views/workBill/work-bill';
// import RecommendIntel from '../views/recommend-intel';
// import CreateOperativebill from '../views/workBill/create-operativebill';
// import MyExecute from '../views/executeMy/my-execute';
// import TobeConfirm from '../views/executeMy/tobe-confirm';
// import InProcess from '../views/executeMy/in-process';
// import isDelayed from '../views/executeMy/is-delayed';
// import PendingAcceptance from '../views/executeMy/pending-acceptance';
//import IsCompleted from '../views/executeMy/is-completed';
// import SelectExecutePeople from '../views/executeMy/select-execute-people';
// import SelectExecutePeople2 from '../views/executeMy/select-execute-people2';
// import OperativeBillIt from '../views/workBill/operativebill-it';//运维工单IT
// import TemplateManage from '../views/template/template-manage';
// import HasExecuteWorkorder from '../views/workBill/has-execute-workorder';
// import NoWorkOrderDetail from '../views/workBill/no-workorder-detail';
// import Catalog from '../views/index';
// import ReportPeople from '../views/report/report-people';
// import Echart from '../views/demo/echarts';
// import SelectDepeartmentPeople from '../views/executeMy/select-depeartment-people';
// import SelectDepeartmentMultiples from '../views/executeMy/select-depeartment-multiples';
// <<<<<<< HEAD
// import RecommendIntelDetail from '../views/recommend-intel-detail';//知识详情
// import MyCreated from '../views/created/my-created';
// import TobeSend from '../views/created/tobe-send';
// import CreatedProcess from '../views/created/created-process';
// import CreatedPreacceptance from '../views/created/created-preacceptance';
// import CreatedCompleted from '../views/created/created-completed';
// import MyCopy2 from '../views/copyforMe/my-copy';
// import CopyTobesend from '../views/copyforMe/copy-tobesend';
// import CopyProcess from '../views/copyforMe/copy-process';
// import CopyPreacceptance from '../views/copyforMe/copy-preacceptance';
// import CopyCompleted from '../views/copyforMe/copy-completed';
// import SearchResult from '../views/workBill/search-MyCreated';
// =======
// import MyCreated from '../views/created/my-created';
// import TobeSend from '../views/created/tobe-send';
// import CreatedProcess from '../views/created/created-process';
// import CreatedPreacceptance from '../views/created/created-preacceptance';
// import CreatedCompleted from '../views/created/created-completed';
// import MyCopy2 from '../views/copyforMe/my-copy';
// import CopyTobesend from '../views/copyforMe/copy-tobesend';
// import CopyProcess from '../views/copyforMe/copy-process';
// import CopyPreacceptance from '../views/copyforMe/copy-preacceptance';
// import CopyCompleted from '../views/copyforMe/copy-completed';
// import SearchResult from '../views/workBill/search-result';
// >>>>>>> 2013bb2021a238d124b705949b77a0264c121717

Vue.use(Router);

export default new Router({
    base: '/h5/', // 测试
    mode: 'history',//去掉#，
    routes: [
//         {
//             path: '/demo/swiperDel',
//             name: 'swiperDel',
//             component: swiperDel,
//             meta: {title: '滑动删除'}
//         },
//         {
//             path: '/demo/echarts',
//             name: 'echarts',
//             component: echarts,
//             meta: {title: '图表'}
//         },{
//             path:'/demo/list',
//             name:'list',
//             component:loadlist,
//             meta:{title:'列表'}
//         },{
//             path:'/demo/loadList',
//             name:'loadLists',
//             component:loadLists,
//             meta:{title:'加载刷新列表'}
//         },{
//             path:'/demo/uploader',
//             name:'uploader',
//             component:uploader,
//             meta:{title:'上传'}
//         },{
//             path:'/demo/dateTime',
//             name:'dateTime',
//             component:dateTime,
//             meta:{title:'时间选择'}
//         },
        {path: '/', name: "WorkBill", component:(resolve) => require(['@/views/workBill/work-bill'],resolve)},//工单
        {path: '/myexecute', name: "MyExecute", component:(resolve) => require(['@/views/executeMy/my-execute'],resolve)},//我执行的-列表
        {path: '/orderdetails', name: "OrderDetails", component:(resolve) => require(['@/views/executeMy/order-details'],resolve)},//我执行的-详情
        {path: '/sendpeople', name: "SendDepeartmentPeople", component:(resolve) => require(['@/views/executeMy/send-depeartment-people'],resolve)},//我执行的-详情
        {path: '/mycreate', name: "MyCreate", component:(resolve) => require(['@/views/created/my-create'],resolve)},//我创建的-列表
        {path: '/createdetails', name: "CreateDetails", component:(resolve) => require(['@/views/created/create-details'],resolve)},//我创建的-详情
        {path: '/createtobesend', name: "CreateTobesend", component:(resolve) => require(['@/views/created/create-tobesend'],resolve)},//我创建的-待派发

        // {path: '/', name: "Home", component: Home},//测试插件（忽略）
        // {path: '/charts',name: 'charts',component: charts},//图表示例
        {path: '/news', name: "News", component: (resolve) => require(['@/views/news'],resolve)},//消息
        {path: '/createoperativebill', name: "CreateOperativebill", component:(resolve) => require(['@/views/workBill/create-operativebill'],resolve),meta:{keepAlive: true}},//创建工单
        {path: '/selectStaffInCreate', name: "selectStaffInCreate", component:(resolve) => require(['@/views/workBill/select-depeartment-multiples'],resolve)},//创建工单-选择抄送人
        {path: '/selectExecuteInCreate', name: "selectExecuteInCreate", component:(resolve) => require(['@/views/workBill/select-depeartment-people'],resolve)},//创建工单-选择执行人
        // {path: '/tobeconfirm', name: "TobeConfirm", component: TobeConfirm},//我执行的-待确认
        // {path: '/inprocess', name: "InProcess", component: InProcess},//我执行的-进行中
        // {path: '/isdelayed', name: "isDelayed", component: isDelayed},//我执行的-进行中
        // {path: '/pendingacceptance', name: "PendingAcceptance", component: PendingAcceptance},//我执行的-待验收
        //{path: '/iscompleted', name: "IsCompleted", component: IsCompleted},//我执行的-已完成
        {path: '/recommendintel', name: "RecommendIntel", component: (resolve) => require(['@/views/recommend-intel'],resolve)},//推荐知识
        {path: '/recommendinteldetail', name: "RecommendIntelDetail", component:  (resolve) => require(['@/views/recommend-intel-detail'],resolve)},//推荐知识详情
        // {path: '/selectexecutepeople', name: "SelectExecutePeople", component: SelectExecutePeople},//选择执行人
        // {path: '/selectexecutepeople2', name: "SelectExecutePeople2", component: SelectExecutePeople2},//选择执行人
        // {path: '/operativebillit', name: "OperativeBillIt", component: OperativeBillIt},//运维工单IT
        {path: '/templatemanage', name: "TemplateManage", component:(resolve) => require(['@/views/template/template-manage'],resolve)},//模版管理
        {path: '/TemplateNew', name: "TemplateNew", component:(resolve) => require(['@/views/template/template-new'],resolve)},//模版管理-高级管理
        // {path: '/hasexecuteworkorder', name: "HasExecuteWorkorder", component: HasExecuteWorkorder},//模版管理  可能没用
        // {path: '/noworkorderdetail', name: "NoWorkOrderDetail", component: NoWorkOrderDetail},//未完成工单
        // {path: '/catalog', name: "Catalog", component:(resolve) => require(['@/views/index'],resolve)},//目录（原来的）
        {path: '/reportpeople', name: "ReportPeople", component:(resolve) => require(['@/views/report/report-people'],resolve)},//报表首页
        {path: '/reportdetail', name: "ReportDetail", component:(resolve) => require(['@/views/report/report-detail'],resolve)},//报表个人详情
        {path: '/selectDepInReport', name: "selectDepInReport", component:(resolve) => require(['@/views/report/select-depeartment-multiples'],resolve)},//报表-选择部门
        {path: '/selectStaInReport', name: "selectStaInReport", component:(resolve) => require(['@/views/report/select-staff'],resolve)},//报表-选择员工

        // {path: '/echart', name: "Echart", component: Echart},//目录
        // {path: '/selectdepeartmentpeople', name: 'SelectDepeartmentPeople', component: SelectDepeartmentPeople,meta:{title:'部门人员选择'}},//部门选择
        // {path: '/selectdepeartmentmultiples', name: 'SelectDepeartmentMultiples', component: SelectDepeartmentMultiples,meta:{title:'部门人员选择'}},//部门选择
        // {path: '/mycreated', name: 'MyCreated', component: MyCreated},//我创建的
// <<<<<<< HEAD
        // {path: '/tobesend', name: 'TobeSend', component: TobeSend},//已创建的-待派发
        // {path: '/createdprocess', name: 'CreatedProcess', component: CreatedProcess},//已创建的-进行中
        // {path: '/createdpreacceptance', name: 'CreatedPreacceptance', component: CreatedPreacceptance},//已创建的-进行中
        // {path: '/createdcompleted', name: 'CreatedCompleted', component: CreatedCompleted},//已创建的-进行中
        // {path: '/mycopy2', name: 'MyCopy2', component: MyCopy2},//抄送我的-列表页  不用了
// =======
//         {path: '/tobesend', name: 'TobeSend', component: TobeSend},//已创建的-待派发
//         {path: '/createdprocess', name: 'CreatedProcess', component: CreatedProcess},//已创建的-进行中
//         {path: '/createdpreacceptance', name: 'CreatedPreacceptance', component: CreatedPreacceptance},//已创建的-进行中
//         {path: '/createdcompleted', name: 'CreatedCompleted', component: CreatedCompleted},//已创建的-进行中
//         // {path: '/mycopy2', name: 'MyCopy2', component: MyCopy2},//抄送我的-列表页  不用了
// >>>>>>> 2013bb2021a238d124b705949b77a0264c121717
        {path: '/mycopy', name: 'MyCopy', component: (resolve) => require(['@/views/copyforMe/list'],resolve)},//抄送我的-列表页
        {path: '/mycopyOrder', name: 'mycopyOrder', component: (resolve) => require(['@/views/copyforMe/order-details'],resolve)},//抄送我的-详情页
        {path: '/mycopyOrderTosend', name: 'mycopyOrderTosend', component: (resolve) => require(['@/views/copyforMe/order-tobesend'],resolve)},//抄送我的-详情待派发页
        // {path: '/copytobesend', name: 'CopyTobesend', component: CopyTobesend},//抄送我的-待派发
        // {path: '/copyprocess', name: 'CopyProcess', component: CopyProcess},//抄送我的-进行中
        // {path: '/copypreacceptance', name: 'CopyPreacceptance', component: CopyPreacceptance},//抄送我的-待验收
        // {path: '/copycompleted', name: 'CopyCompleted', component: CopyCompleted},//抄送我的-已结束
        {path: '/searchresult', name: 'SearchResult', component: (resolve) => require(['@/views/workBill/search-result'],resolve)},//搜素结果
    ],
})
