import mockType from './mock';
import ruleType from './rule';

// 不同的字段类型对应不同模拟类型
const getMockKey = (...mockDic) => {
  let dicData = [...mockDic];
  return {
    label: '模拟数据',
    prop: 'mockKey',
    type: 'select',
    span: 24,
    disabled: false,
    dicData,
    tip: '该字段在表单中的模拟数据类型',
    tipPlacement: 'left',
    rules: [
      {
        required: true,
        message: '请选择正确的模拟项',
        trigger: 'submit',
        regx: (value) => {
          return dicData.find((item) => item.value == value) !== undefined;
        },
        validator: (rule, value, callback) => {
          if (rule.regx && !rule.regx(value)) {
            callback(new Error(rule.message));
          } else {
            callback();
          }
        }
      }
    ]
  };
};
const mockOther = Object.values(mockType).filter((item) => item.value != 'dic');
const mockKeys = {
  datetime: getMockKey(mockType.datetime),
  dic: getMockKey(mockType.dic),
  number: getMockKey(mockType.number),
  other: getMockKey(...mockOther)
};

// 校验
const ruleDicData = Object.keys(ruleType).map((key) => ruleType[key]);
const ruleKey = {
  label: '校验规则',
  prop: 'ruleKey',
  type: 'select',
  span: 24,
  dicData: ruleDicData,
  tip: '该字段在表单中的校验规则',
  tipPlacement: 'left'
};

// 字典
const dicKey = {
  label: '字典参数',
  prop: 'dicKey',
  type: 'input',
  span: 24,
  tip: '调用字典接口需要传递的参数',
  tipPlacement: 'left',
  rules: [
    {
      required: true,
      message: '字典参数必填',
      trigger: 'submit'
    }
  ]
};

const placeholder = {
  label: '辅助提示',
  prop: 'placeholder',
  placeholder: '输入框灰色字就是辅助提示',
  type: 'input',
  span: 24,
  tip: '输入框灰色字就是辅助提示',
  tipPlacement: 'left'
};

const multiple = {
  label: '是否多选',
  prop: 'multiple',
  type: 'switch',
  span: 24,
  tip: '只在 select，tree 类型有效',
  tipPlacement: 'left'
};

// 不同的 type 类型对应不同的配置项
export default () => [
  {
    label: '输入框 - input',
    value: 'input',
    config: [
      mockKeys.other,
      ruleKey,
      placeholder,
      {
        label: '前置展示',
        prop: 'prepend',
        type: 'input',
        span: 24,
        prepend: '内容',
        tip: '如右边展示所示',
        tipPlacement: 'left'
      },
      {
        label: '后置展示',
        prop: 'append',
        type: 'input',
        span: 24,
        append: '内容',
        tip: '如右边展示所示',
        tipPlacement: 'left'
      }
    ]
  },
  {
    label: '文本框 - textarea',
    value: 'textarea',
    config: [mockKeys.other, ruleKey, placeholder]
  },
  {
    label: '密码框 - password',
    value: 'password',
    config: [mockKeys.other, ruleKey, placeholder]
  },
  {
    label: '数字框 - number',
    value: 'number',
    mock: 'number',
    config: [
      mockKeys.number,
      ruleKey,
      {
        label: '最大数值',
        prop: 'maxRows',
        type: 'number',
        span: 24,
        tip: '该字段的最大数',
        tipPlacement: 'left'
      },
      {
        label: '最小数值',
        prop: 'minRows',
        type: 'number',
        span: 24,
        tip: '该字段的最小数',
        tipPlacement: 'left'
      },
      {
        label: '数值精度',
        prop: 'precision',
        type: 'number',
        span: 24,
        tip: '改字段的的小数点有多少位',
        maxRows: 9,
        tipPlacement: 'left'
      }
    ]
  },
  {
    label: '选择框 - select',
    value: 'select',
    mock: 'dic',
    config: [dicKey, mockKeys.dic, placeholder, multiple]
  },
  {
    label: '树型框 - tree',
    value: 'tree',
    mock: 'dic',
    config: [dicKey, mockKeys.dic, placeholder, multiple]
  },
  {
    label: '单选框 - radio',
    value: 'radio',
    mock: 'dic',
    config: [dicKey, mockKeys.dic]
  },
  {
    label: '多选框 - checkbox',
    value: 'checkbox',
    mock: 'dic',
    config: [dicKey, mockKeys.dic]
  },
  {
    label: '开关框 - switch',
    value: 'switch',
    config: []
  },
  {
    label: '附件框 - upload',
    value: 'upload',
    config: [
      {
        label: '上传表名',
        prop: 'table',
        type: 'input',
        span: 24,
        tip: '上传附件的的表名称',
        tipPlacement: 'left',
        rules: [
          {
            required: true,
            message: '上传表名必填',
            trigger: 'submit'
          }
        ]
      },
      {
        label: '上传框类型',
        prop: 'listType',
        type: 'select',
        span: 24,
        dicData: [
          {
            label: '按钮',
            value: 'file'
          },
          {
            label: '照片缩略图',
            value: 'picture'
          },
          {
            label: '照片墙',
            value: 'picture-card'
          }
        ],
        rules: [
          {
            required: true,
            message: '上传框类型必填',
            trigger: 'submit'
          }
        ]
      },
      {
        label: '上传提示',
        prop: 'loadText',
        type: 'input',
        span: 24,
        tip: '上传附件中的提示信息',
        tipPlacement: 'left',
        rules: [
          {
            required: true,
            message: '上传提示必填',
            trigger: 'submit'
          }
        ]
      },

      {
        label: '上传个数限制',
        prop: 'limit',
        type: 'number',
        span: 24,
        tip: '最大上传个数',
        tipPlacement: 'left'
      },
      {
        label: '上传大小限制',
        prop: 'filesize',
        type: 'number',
        span: 24,
        tip: '文件大小限制，单位KB',
        tipPlacement: 'left'
      },
      {
        label: '压缩图片比例',
        prop: 'ratio',
        type: 'number',
        span: 24,
        tip: '压缩图片比例',
        tipPlacement: 'left',
        precision: 1,
        minRows: 0.1,
        maxRows: 1
      }
    ]
  },
  {
    label: '日期框 - date',
    value: 'date',
    config: [mockKeys.datetime, ruleKey, placeholder]
  },
  {
    label: '时间框 - time',
    value: 'time',
    config: [mockKeys.datetime, ruleKey, placeholder]
  },
  {
    label: '日期时间框 - datetiem',
    value: 'datetime',
    config: [mockKeys.datetime, ruleKey, placeholder]
  }
];
