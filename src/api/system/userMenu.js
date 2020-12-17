import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/menu/listAB',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    },
  });
};
export const remove = ids => {
  return request({
    url: '/api/blade-system/menu/remove',
    method: 'post',
    params: {
      ids,
    },
  });
};

export const add = row => {
  return request({
    url: '/api/blade-system/menu/submitAB',
    method: 'post',
    data: row,
  });
};

export const update = row => {
  return request({
    url: '/api/blade-system/menu/submitAB',
    method: 'post',
    data: row,
  });
};

export const getMenu = id => {
  return request({
    url: '/api/blade-system/menu/detail',
    method: 'get',
    params: {
      id,
    },
  });
};
