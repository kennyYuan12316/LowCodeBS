// 开发环境接口配置
// JAVA Boot版本对应后端接口地址
// JAVA Cloud对应网关地址
const APIURl = process.env.NODE_ENV === 'development' ? 'http://localhost:58504' : 'http://192.168.1.15:8081'
//const APIURl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8066' : 'http://127.0.0.1:8066'
module.exports = {
  APIURl: APIURl,
  timeout: process.env.NODE_ENV === 'development' ? 1000000 : 1000000,
  WebSocketUrl: process.env.NODE_ENV === 'development' ? APIURl.replace('http', 'ws') + '/api/message/websocket' : process.env.VUE_APP_BASE_WSS,
  comUploadUrl: process.env.VUE_APP_BASE_API + '/api/file/Uploader',
  comUrl: process.env.VUE_APP_BASE_API,
  // 本地文件预览
  filePreviewServer: process.env.NODE_ENV === 'development' ? 'http://localhost:8012' : process.env.VUE_APP_BASE_API + '/FileServer',
  // 大屏应用前端路径
  dataV: process.env.NODE_ENV === 'development' ? 'http://localhost:8100/DataV' : process.env.VUE_APP_BASE_API + '/DataV',
  // 数据报表接口-java boot
  reportServer: process.env.NODE_ENV === 'development' ? 'http://localhost:9000' : process.env.VUE_APP_BASE_API + '/ReportServer',
  // 数据报表接口-java cloud
  // reportServer: process.env.NODE_ENV === 'development' ? 'http://localhost:30000' : process.env.VUE_APP_BASE_API,
  // 报表前端
  report: process.env.NODE_ENV === 'development' ? 'http://localhost:8200' : process.env.VUE_APP_BASE_API + '/Report'
}