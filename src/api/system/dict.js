import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/dict/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};
// 字典接口
export const getAddressList = (current, size, type) => {
  return request({
    url: '/api/blade-system/dict/OtherTreeList',
    method: 'post',
    data: {
      current,
      size,
      type,
    },
  });
};
// 字典接口
export const getAdsChildrenList = (id) => {
  return request({
    url: '/api/blade-system/dict/RegionalismTreeList',
    method: 'post',
    params: {
      id
    },
  });
};
export const remove = (ids) => {
  return request({
    url: '/api/blade-system/dict/remove',
    method: 'post',
    params: {
      ids,
    },
  });
};

export const add = (row) => {
  return request({
    url: '/api/blade-system/dict/submit',
    method: 'post',
    data: row,
  });
};

export const update = (row) => {
  return request({
    url: '/api/blade-system/dict/submit',
    method: 'post',
    data: row,
  });
};


export const getDict = (id) => {
  return request({
    url: '/api/blade-system/dict/detail',
    method: 'get',
    params: {
      id,
    },
  });
};
export const getDictTree = (type) => {
  return request({
    url: '/api/blade-system/dict/tree',
    method: 'post',
    data: {
      type
    }
  });
};