import request from '@/router/axios';

export const getList = (data, current, size) => {
  return request({
    url: '/api/blade-platform/platform/notice/getNoticeAll',
    method: 'post',
    data: {
      ...data,
      current,
      size,
    },
  });
};

export const remove = (id, userId) => {
  return request({
    url: '/api/blade-platform/platform/notice/remove',
    method: 'post',
    params: {
      id,
      userId
    },
  });
};

export const add = (row) => {
  return request({
    url: '/api/blade-platform/platform/notice/submit',
    method: 'post',
    data: row,
  });
};

export const update = (row) => {
  return request({
    url: '/api/blade-platform/platform/notice/update',
    method: 'post',
    data: row,
  });
};

export const getNotice = (id) => {
  return request({
    url: '/api/blade-platform/platform/notice/detail',
    method: 'get',
    params: {
      id,
    },
  });
};