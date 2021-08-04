import {
  validator,
  isEmail,
  isMobile,
  isURL,
  validatenum,
  validatenumord,
  validatepsd
} from '@/util/validate';

export default {
  email: {
    label: '邮箱',
    value: 'email',
    message: '请输入有效的的邮箱',
    regx: isEmail,
    validator
  },
  url: {
    label: 'url 链接',
    value: 'url',
    message: '请输入有效的的url链接',
    regx: isURL,
    validator
  },
  phone: {
    label: '手机号码',
    value: 'phone',
    message: '请输入有效的手机号码',
    regx: isMobile,
    validator
  },
  // cardId: {
  //   label: '身份证号码',
  //   value: 'cardId',
  //   message: '请输入有效的身份证号码',
  //   regx: isEmail,
  //   validator
  // },
  // licencePlate: {
  //   label: '车牌号码',
  //   value: 'licencePlate',
  //   message: '请输入有效的车牌号码',
  //   regx: isEmail,
  //   validator
  // },
  integer: {
    label: '整数',
    value: 'integer',
    message: '必须为整数格式',
    regx: validatenum
  },
  decimals: {
    label: '小数',
    value: 'decimals',
    message: '必须为小数格式',
    regx: validatenumord,
    validator
  },
  password: {
    label: '密码',
    value: 'password',
    message: '强度不够 , 密码为字母和数字的组合 且不少于6位',
    regx: validatepsd,
    validator
  }
};