import axios from 'axios'

import { Loading } from 'element-ui';
// 创建的axios的实列 instance
const instance = axios.create({
    baseURL: '/api', // 基准地址  可直接配置路径,也可代理路径(以实际项目为准)
    timeout: 10000 // 超时时间
})
// 请求拦截
let loadingInstance // 声明变量接收logding
instance.interceptors.request.use((config) => {
    let token = localStorage.getItem('token') 
    config.headers.Authorization = token // 设置请求头
    config.data = JSON.stringify(config.data) // 数据转化
    config.headers = {
        'Content-Type' : 'application/json'
    }
    loadingInstance = Loading.service({ //设置logding配置 赋值
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });
    return config // 返回请求头
}, err => {
    return Promise.reject(err)
})

// 响应拦截
instance.interceptors.response.use((res) => {
    loadingInstance.close(); // 响应成功则关闭loading加载
    return res;
}, err => {
    setTimeout(() => {
        loadingInstance.close();  // 响应失败则关闭loading加载  
    }, 1000);
    // 响应失败返回失败信息
    return Promise.reject(err)
})

// function get(url, params = {}) {
//     return new Promise((resolve, reject) => {
//         axios.get(url, {
//                 params: params
//             })
//             .then(response => {
//                 resolve(response.data);
//             })
//             .catch(err => {
//                 reject(err)
//             })
//     })
// }
 
// function post(url, data = {}) {
//     return new Promise((resolve, reject) => {
//         axios.post(url, data)
//             .then(response => {
//                 resolve(response.data);
//             }, err => {
//                 reject(err)
//             })
//     })
// }

// 导出实例
export default instance
