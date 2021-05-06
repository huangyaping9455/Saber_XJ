import request from '@/router/axios';

export const selectOperational = (deptId) => {
    return request({
        url: '/api/blade-platform/platform/qiYeShouYe/selectOperational',
        method: 'get',
        params: {
            deptId
        }
    });
};
export const richengIndex = (date, deptId) => {
    return request({
        url: '/api/blade-platform/platform/richenganpai/richengIndex',
        method: 'get',
        params: {
            date,
            deptId
        }
    });
};