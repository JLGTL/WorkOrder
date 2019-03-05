const isPro = Object.is(process.env.NODE_ENV, 'production')
// 后台域名配置
var adminName =  'http://gongdan.huatu.com'//接口地址-正式
//var adminName =  'http://gongdan-test.huatu.com'//接口地址-测试
module.exports = {
   baseURL: adminName,
   baseURL2: adminName,
}

