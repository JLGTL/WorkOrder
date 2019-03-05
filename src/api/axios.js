import axios from 'axios'
import {Indicator} from 'mint-ui'
import apiConfig from '../../config/api.config.js'
 axios.defaults.baseURL = apiConfig.baseURL;
 axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
let Indicatorinstance, loadCount = 0;
// http request 拦截器
axios.interceptors.request.use(
  config => {
    loadCount++
    Indicatorinstance = Indicator.open()
    return config;
  },
  err => {
    loadCount--
    if (!loadCount) {
      Indicator.close();
    }    //关闭加载前，记得重新定义实例
    return Promise.reject(err);
  });
// http response 拦截器
axios.interceptors.response.use(
  response => {
    loadCount--
    if (!loadCount) {
      Indicator.close();
    }
    return response;
  },
  error => {
    loadCount--
    if (!loadCount) {
      Indicator.close();
    }
  });
export default axios
