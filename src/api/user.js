import request from '@/router/axios';
import {
  baseUrl
} from '@/config/env';

export const loginByUsername = (
    name,
    password,
    verificationCode,
    status = 0
  ) =>
  request({
    url: '/api/blade-auth/signIn',
    method: 'post',
    params: {
      name,
      password,
      verificationCode,
      status
    }
  });

export const getButtons = (postId) =>
  request({
    url: '/api/blade-system/menu/buttons',
    method: 'get',
    params: {
      postId
    }
  });

// 临时改 dept
export const getUserInfo = (postId) =>
  request({
    url: '/api/blade-system/dept/getUserInfo',
    method: 'get',
    params: {
      postId
    }
  });

export const refeshToken = () =>
  request({
    url: '/api/blade-system/user/refesh',
    method: 'post'
  });

export const getMenu = (postId) =>
  request({
    url: '/api/blade-system/menu/routes',
    method: 'get',
    params: {
      postId
    }
  });

export const logout = () =>
  request({
    url: '/api/blade-auth/signOut',
    method: 'get'
  });

export const getTopMenu = () =>
  request({
    url: baseUrl + '/user/getTopMenu',
    method: 'get'
  });

export const sendLogs = (list) =>
  request({
    url: baseUrl + '/user/logout',
    method: 'post',
    data: list
  });

export const verificationCode = (postId) =>
  request({
    url: '/api/blade-auth/getVerificationCode',
    method: 'get',
    params: {
      postId
    }
  });

// 修改密码
export const changepassword = (userId, oldpassWord, passWord) =>
  request({
    url: '/api/blade-user/user/update-password',
    method: 'post',
    params: {
      userId,
      oldpassWord,
      passWord
    }
  });

export const getUsersByDept = (deptId) =>
  request({
    url: '/api/blade-user/user/selectByDeptId',
    method: 'get',
    params: {
      deptId
    }
  });