import request from '@/router/axios';

export const getList = (data) => {
  return request({
    url: '/api/blade-platform/platform/fagui/list',
    method: 'post',
    data
  });
};

export const getConfig = (deptId) => {
  return request({
    url: '/api/blade-platform/platform/fagui/listMap',
    method: 'get',
    params: {
      deptId
    }
  });
};

export const insert = (data) => {
  return request({
    url: '/api/blade-platform/platform/fagui/insert',
    method: 'post',
    data
  });
};

export const update = (data) => {
  return request({
    url: '/api/blade-platform/platform/fagui/update',
    method: 'post',
    data
  });
};

export const remove = (id) => {
  return request({
    url: '/api/blade-platform/platform/fagui/del',
    method: 'post',
    params: {
      id
    }
  });
};