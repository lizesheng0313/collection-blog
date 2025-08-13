import axios from 'axios';
import { message } from 'ant-design-vue';

const service = axios.create({
    baseURL: '',
    timeout: 500000
});

service.interceptors.request.use(
    (config) => {
        console.log('拦截器被调用，当前URL:', config.url);
        return config;
    },
    (error) => {
        console.log('请求错误:', error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response) => {
        const res = response.data;
        
        // 如果后端直接返回了错误码
        if (res.code && res.code !== 200) {
            // 显示后端返回的错误信息
            message.error(res.message);
            // 仅拒绝Promise，不传递具体错误信息
            return Promise.reject();
        }
        
        // 正常返回数据
        return res;
    },
    (error) => {
        console.error('请求错误', error);
        
        // 处理HTTP错误
        if (error.response) {
            // 显示后端返回的错误信息
            const responseData = error.response.data;
            if (responseData && responseData.message) {
                message.error(responseData.message);
            }
        } else {
            // 网络错误
            message.error('网络请求失败');
        }
        
        // 仅拒绝Promise，不传递具体错误信息
        return Promise.reject();
    }
);

export default service;
