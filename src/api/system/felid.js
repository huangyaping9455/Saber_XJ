import request from '@/router/axios';

// 获取模板字段 list
export const getList = (url, deptId) => {
  return request({
    url: `/api${url}`,
    method: 'get',
    params: {
      deptId
    }
  });
};

export const remove = (url, id) => {
  return request({
    url: `/api${url}`,
    method: 'post',
    params: {
      id
    }
  });
};

export const insert = (url, deptId, filedConfig) => {
  return request({
    url: `/api${url}`,
    method: 'post',
    params: {
      biaodancanshu: filedConfig,
      deptId
    }
  });
};

export const update = (url, id, filedConfig) => {
  return request({
    url: `/api${url}`,
    method: 'post',
    params: {
      biaodancanshu: filedConfig,
      id
    }
  });
};
