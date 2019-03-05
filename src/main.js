// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './api/axios.js'
import EXIF from 'exif-js'
// import store from './store'
import Vant from 'vant';
// import 'vant/lib/index.css';
import './assets/css/common.css';//公共样式
import './assets/css/common-new.css';//公共样式
import 'vant/lib/index.css';
import echarts from 'echarts'
// import 'jquery';
// import { CellSwipe,Loadmore } from 'mint-ui';
import { Loadmore } from 'mint-ui';
import "./utils/flexible";
// import ECharts from 'vue-echarts/components/ECharts.vue';
// Vue.component('v-chart', ECharts)
import { Lazyload } from 'vant';

Vue.use(Lazyload);
import 'mint-ui/lib/style.css'

Vue.use(Vant);
Vue.use(router);
// Vue.component(CellSwipe.name, CellSwipe);
Vue.component(Loadmore.name, Loadmore);

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.$echarts = echarts
Vue.prototype.EXIF = EXIF


//路由中带着userId 更新localStorage中的userId
router.beforeEach((to,from,next)=>{
		if(to.query.userId){
			localStorage.setItem('userId',to.query.userId);
			next()
		}else{
			next()

		}
})

window.setToken = function(params){
	console.log("oa传入Token main")
	console.log(params)
	localStorage.setItem('Authorization',params)
}
window.cancelUpload = function(){
	console.log("cancelUpload")
	console.log()
	localStorage.setItem('cancelUpload','1')
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  components: { App },
  template: '<App/>'
})
