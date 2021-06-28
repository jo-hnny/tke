import { changeForbiddentConfig } from '@/index.tke';
import { Method } from '@helper';
import Axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';

const instance = Axios.create({
  timeout: 10000
});

instance.interceptors.request.use(
  config => {
    Object.assign(config.headers, {
      'X-Remote-Extra-RequestID': uuidv4(),
      'Content-Type':
        config.method === 'patch' ? 'application/strategic-merge-patch+json' : config.headers['Content-Type']
    });
    return config;
  },
  error => {
    console.log('request error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  ({ data }) => {
    console.log('response data check:', data);

    return data;
  },
  error => {
    console.error('response error:', error);
    if (!error.response) {
      error.response = {
        data: {
          message: `系统内部服务错误（${error?.config?.heraders?.['X-Remote-Extra-RequestID'] || ''}）`
        }
      };
    }

    if (error.response.status === 401) {
      location.reload();
    }

    if (error.response.status === 403) {
      changeForbiddentConfig({
        isShow: true,
        message: error.response.data.message
      });
    }

    message.error(error?.response?.data?.message ?? '系统内部错误！');

    return Promise.reject(error);
  }
);

export default instance;
